/* ========================================
   COSMIC PORTFOLIO - Authentication System
   Quản lý đăng nhập, đăng ký, phân quyền
   ======================================== */

(function () {
    'use strict';

    // ╔══════════════════════════════════════╗
    // ║     CONSTANTS & DEFAULT ADMIN        ║
    // ╚══════════════════════════════════════╝

    const AUTH_KEYS = {
        USERS: 'cosmic_users',
        SESSION: 'cosmic_session'
    };

    const ROLES = {
        ADMIN: 'admin',
        GUEST: 'guest'
    };

    // ╔══════════════════════════════════════╗
    // ║     SIMPLE HASH (for demo)           ║
    // ╚══════════════════════════════════════╝

    /**
     * Hash password đơn giản (dùng cho demo, 
     * production nên dùng bcrypt phía server)
     */
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
    }

    // ╔══════════════════════════════════════╗
    // ║     USER DATA MANAGEMENT             ║
    // ╚══════════════════════════════════════╝

    /** Lấy danh sách users từ localStorage */
    function getUsers() {
        try {
            const data = localStorage.getItem(AUTH_KEYS.USERS);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn('Lỗi đọc users:', e);
        }

        // Tạo tài khoản admin mặc định nếu chưa có
        const defaultUsers = [
            {
                id: 'user_admin',
                username: 'admin',
                email: 'admin@cosmicportfolio.dev',
                password: simpleHash('admin123'),
                role: ROLES.ADMIN,
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(defaultUsers));
        return defaultUsers;
    }

    /** Lưu danh sách users */
    function saveUsers(users) {
        try {
            localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
            // Sync to Firebase if available
            if (typeof CosmicSync !== 'undefined' && CosmicSync.isReady()) {
                CosmicSync.saveUsers(users);
            }
        } catch (e) {
            console.error('Lỗi lưu users:', e);
        }
    }

    // ╔══════════════════════════════════════╗
    // ║     AUTHENTICATION FUNCTIONS         ║
    // ╚══════════════════════════════════════╝

    /**
     * Đăng ký tài khoản mới
     * @returns {{ success: boolean, message: string }}
     */
    function register(username, email, password, confirmPassword) {
        // Validate
        if (!username || !email || !password || !confirmPassword) {
            return { success: false, message: 'Vui lòng điền đầy đủ thông tin!' };
        }

        if (username.length < 3) {
            return { success: false, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' };
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return { success: false, message: 'Email không hợp lệ!' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự!' };
        }

        if (password !== confirmPassword) {
            return { success: false, message: 'Mật khẩu xác nhận không khớp!' };
        }

        const users = getUsers();

        // Kiểm tra trùng username
        if (users.find(function (u) { return u.username.toLowerCase() === username.toLowerCase(); })) {
            return { success: false, message: 'Tên đăng nhập đã tồn tại!' };
        }

        // Kiểm tra trùng email
        if (users.find(function (u) { return u.email.toLowerCase() === email.toLowerCase(); })) {
            return { success: false, message: 'Email đã được sử dụng!' };
        }

        // Tạo user mới (role = guest)
        const newUser = {
            id: 'user_' + Date.now(),
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: simpleHash(password),
            role: ROLES.GUEST,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        return { success: true, message: 'Đăng ký thành công! Bạn có thể đăng nhập ngay.' };
    }

    /**
     * Đăng nhập
     * @returns {{ success: boolean, message: string, user?: object }}
     */
    function login(username, password) {
        if (!username || !password) {
            return { success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu!' };
        }

        const users = getUsers();
        const user = users.find(function (u) {
            return u.username.toLowerCase() === username.toLowerCase();
        });

        if (!user) {
            return { success: false, message: 'Tên đăng nhập không tồn tại!' };
        }

        if (user.password !== simpleHash(password)) {
            return { success: false, message: 'Mật khẩu không chính xác!' };
        }

        // Tạo session
        const session = {
            userId: user.id,
            username: user.username,
            role: user.role,
            loginAt: new Date().toISOString()
        };

        localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session));

        return {
            success: true,
            message: 'Đăng nhập thành công!',
            user: { id: user.id, username: user.username, role: user.role }
        };
    }

    /** Đăng xuất */
    function logout() {
        localStorage.removeItem(AUTH_KEYS.SESSION);
        window.location.href = 'login.html';
    }

    /** Lấy session hiện tại */
    function getSession() {
        try {
            const data = localStorage.getItem(AUTH_KEYS.SESSION);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    /** Kiểm tra đã đăng nhập chưa */
    function isLoggedIn() {
        return getSession() !== null;
    }

    /** Kiểm tra có phải admin không */
    function isAdmin() {
        const session = getSession();
        return session && session.role === ROLES.ADMIN;
    }

    /**
     * Bảo vệ trang - redirect về login nếu chưa đăng nhập
     * Gọi ở đầu mỗi trang cần xác thực
     */
    function requireAuth() {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    /**
     * Redirect về trang chính nếu đã đăng nhập
     * Gọi ở trang login
     */
    function redirectIfLoggedIn() {
        if (isLoggedIn()) {
            window.location.href = 'index.html';
            return true;
        }
        return false;
    }

    // ╔══════════════════════════════════════╗
    // ║     INIT DEFAULT ADMIN               ║
    // ╚══════════════════════════════════════╝

    // Đảm bảo tài khoản admin luôn tồn tại
    (function ensureAdmin() {
        const users = getUsers();
        const adminExists = users.find(function (u) {
            return u.username === 'admin' && u.role === ROLES.ADMIN;
        });

        if (!adminExists) {
            users.push({
                id: 'user_admin',
                username: 'admin',
                email: 'admin@cosmicportfolio.dev',
                password: simpleHash('admin123'),
                role: ROLES.ADMIN,
                createdAt: new Date().toISOString()
            });
            saveUsers(users);
        }
    })();

    // ╔══════════════════════════════════════╗
    // ║     USER PROFILE MANAGEMENT          ║
    // ╚══════════════════════════════════════╝

    /** Lấy thông tin đầy đủ của user đang đăng nhập */
    function getCurrentUser() {
        var session = getSession();
        if (!session) return null;

        var users = getUsers();
        var user = null;
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === session.userId) { user = users[i]; break; }
        }
        if (!user) return null;

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar || '',
            coverPhoto: user.coverPhoto || '',
            displayName: user.displayName || user.username,
            createdAt: user.createdAt
        };
    }

    /** Cập nhật hồ sơ user hiện tại (avatar, ảnh bìa) */
    function updateCurrentUserProfile(data) {
        var session = getSession();
        if (!session) return { success: false, message: 'Chưa đăng nhập!' };

        var users = getUsers();
        var idx = -1;
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === session.userId) { idx = i; break; }
        }
        if (idx === -1) return { success: false, message: 'Không tìm thấy tài khoản!' };

        if (data.avatar !== undefined) users[idx].avatar = data.avatar;
        if (data.coverPhoto !== undefined) users[idx].coverPhoto = data.coverPhoto;
        if (data.displayName !== undefined) users[idx].displayName = data.displayName;

        saveUsers(users);
        return { success: true, message: 'Cập nhật thành công!' };
    }

    // ╔══════════════════════════════════════╗
    // ║     EXPORT TO GLOBAL (window)        ║
    // ╚══════════════════════════════════════╝

    window.CosmicAuth = {
        register: register,
        login: login,
        logout: logout,
        getSession: getSession,
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        requireAuth: requireAuth,
        redirectIfLoggedIn: redirectIfLoggedIn,
        getCurrentUser: getCurrentUser,
        updateCurrentUserProfile: updateCurrentUserProfile,
        ROLES: ROLES
    };

})();
