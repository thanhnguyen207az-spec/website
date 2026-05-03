/* ========================================
   COSMIC PORTFOLIO - Main Application
   Toàn bộ logic: Dữ liệu, UI, Admin, Form
   ======================================== */

(function () {
    'use strict';

    // ╔══════════════════════════════════════╗
    // ║     UTILITY: DEBOUNCE               ║
    // ╚══════════════════════════════════════╝
    function debounce(fn, delay) {
        var timer;
        return function () {
            var ctx = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
        };
    }

    // ╔══════════════════════════════════════╗
    // ║     KIỂM TRA ĐĂNG NHẬP              ║
    // ╚══════════════════════════════════════╝

    // Redirect về login nếu chưa đăng nhập
    if (typeof CosmicAuth !== 'undefined' && !CosmicAuth.requireAuth()) {
        return;
    }

    // ╔══════════════════════════════════════╗
    // ║     DỮ LIỆU MẶC ĐỊNH (DEFAULTS)     ║
    // ╚══════════════════════════════════════╝

    const DEFAULT_PROFILE = {
        name: "Nguyễn Vũ Trụ",
        profileImage: "",
        bio: "Full-Stack Developer & Creative Designer với đam mê khám phá công nghệ và tạo ra những trải nghiệm số tuyệt vời. Luôn tìm kiếm giải pháp sáng tạo cho mọi thử thách.",
        skills: ["Web Development", "UI/UX Design", "React.js", "Node.js", "Python", "Graphic Design"],
        socialLinks: {
            facebook: "https://facebook.com",
            zalo: "https://zalo.me",
            telegram: "https://t.me"
        },
        contactEmail: "hello@cosmicportfolio.dev",
        phone: "+84 912 345 678",
        customNote: "Tôi tin rằng công nghệ không chỉ là công cụ, mà là phương tiện để biến những ước mơ thành hiện thực. Mỗi dòng code đều chứa đựng một câu chuyện.",
        codingTitle: "Lập Trình",
        codingDesc: "Phát triển web hiện đại với các công nghệ tiên tiến nhất",
        designTitle: "Thiết Kế",
        designDesc: "Sáng tạo giao diện đẹp mắt, trải nghiệm người dùng tuyệt vời",
        creativeTitle: "Sáng Tạo",
        creativeDesc: "Biến ý tưởng thành hiện thực với giải pháp đột phá"
    };

    const DEFAULT_PRODUCTS = [
        {
            id: "p1",
            image: "https://picsum.photos/seed/cosmic-web-course/400/300",
            name: "Khóa Học Lập Trình Web Full-Stack",
            description: "Khóa học toàn diện từ cơ bản đến nâng cao, bao gồm HTML, CSS, JavaScript, React, Node.js và database. Phù hợp cho người mới bắt đầu và muốn trở thành lập trình viên chuyên nghiệp.",
            warranty: "Truy cập trọn đời",
            price: "1.500.000đ",
            status: "Còn hàng"
        },
        {
            id: "p2",
            image: "https://picsum.photos/seed/cosmic-template/400/300",
            name: "Template Website Premium",
            description: "Bộ template website cao cấp với thiết kế hiện đại, responsive hoàn hảo. Tích hợp sẵn dark mode, animation và tối ưu SEO. Giúp bạn nhanh chóng có một website chuyên nghiệp.",
            warranty: "Hỗ trợ 6 tháng",
            price: "800.000đ",
            status: "Còn hàng"
        },
        {
            id: "p3",
            image: "https://picsum.photos/seed/cosmic-ebook/400/300",
            name: "Ebook Thiết Kế UI/UX Từ A-Z",
            description: "Cuốn sách điện tử hướng dẫn chi tiết về thiết kế giao diện và trải nghiệm người dùng. Từ lý thuyết cơ bản đến case study thực tế, giúp bạn nâng cao kỹ năng thiết kế.",
            warranty: "Cập nhật miễn phí",
            price: "350.000đ",
            status: "Còn hàng"
        },
        {
            id: "p4",
            image: "https://picsum.photos/seed/cosmic-plugin/400/300",
            name: "Plugin WordPress Pro",
            description: "Plugin WordPress mạnh mẽ giúp tối ưu hiệu suất, bảo mật và SEO cho website của bạn. Dễ dàng cài đặt, giao diện quản trị trực quan và tương thích với hầu hết theme.",
            warranty: "Bảo hành 12 tháng",
            price: "600.000đ",
            status: "Còn hàng"
        },
        {
            id: "p5",
            image: "https://picsum.photos/seed/cosmic-hosting/400/300",
            name: "Gói Hosting VPS Cao Cấp",
            description: "Hosting VPS hiệu suất cao với SSD NVMe, CPU chuyên dụng và băng thông không giới hạn. Uptime 99.99%, hỗ trợ kỹ thuật 24/7 giúp website luôn hoạt động mượt mà.",
            warranty: "Hoàn tiền 30 ngày",
            price: "250.000đ/tháng",
            status: "Còn hàng"
        },
        {
            id: "p6",
            image: "https://picsum.photos/seed/cosmic-logo/400/300",
            name: "Dịch Vụ Thiết Kế Logo",
            description: "Thiết kế logo chuyên nghiệp, độc quyền cho thương hiệu của bạn. Bao gồm 3 concept, chỉnh sửa không giới hạn và bộ file đa định dạng (AI, PNG, SVG, PDF).",
            warranty: "Chỉnh sửa miễn phí 3 lần",
            price: "2.000.000đ",
            status: "Hết hàng"
        }
    ];

    // ╔══════════════════════════════════════╗
    // ║     QUẢN LÝ DỮ LIỆU (localStorage)  ║
    // ╚══════════════════════════════════════╝

    /**
     * Lấy dữ liệu hồ sơ từ localStorage
     * Nếu chưa có, trả về dữ liệu mặc định
     */
    function getProfile() {
        try {
            const data = localStorage.getItem('cosmic_profile');
            if (!data) return { ...DEFAULT_PROFILE };
            var profile = { ...DEFAULT_PROFILE, ...JSON.parse(data) };
            // Auto-migrate: xóa instagram/github cũ, thêm zalo nếu chưa có
            if (profile.socialLinks) {
                if (!profile.socialLinks.zalo) {
                    profile.socialLinks.zalo = profile.socialLinks.instagram || '';
                }
                delete profile.socialLinks.instagram;
                delete profile.socialLinks.github;
                saveProfile(profile);
            }
            return profile;
        } catch (e) {
            console.warn('Lỗi đọc profile:', e);
            return { ...DEFAULT_PROFILE };
        }
    }

    /** Lưu hồ sơ vào localStorage + Firebase */
    function saveProfile(profile) {
        try {
            localStorage.setItem('cosmic_profile', JSON.stringify(profile));
            // Sync to Firebase
            if (typeof CosmicSync !== 'undefined' && CosmicSync.isReady()) {
                CosmicSync.saveProfile(profile);
            }
        } catch (e) {
            console.error('Lỗi lưu profile:', e);
        }
    }

    /**
     * Lấy danh sách sản phẩm từ localStorage
     * Nếu chưa có, trả về danh sách mặc định
     */
    function getProducts() {
        try {
            const data = localStorage.getItem('cosmic_products');
            return data ? JSON.parse(data) : [...DEFAULT_PRODUCTS];
        } catch (e) {
            console.warn('Lỗi đọc products:', e);
            return [...DEFAULT_PRODUCTS];
        }
    }

    /** Lưu danh sách sản phẩm vào localStorage + Firebase */
    function saveProducts(products) {
        try {
            localStorage.setItem('cosmic_products', JSON.stringify(products));
            // Sync to Firebase
            if (typeof CosmicSync !== 'undefined' && CosmicSync.isReady()) {
                CosmicSync.saveProducts(products);
            }
        } catch (e) {
            console.error('Lỗi lưu products:', e);
        }
    }

    /** Tạo ID duy nhất cho sản phẩm */
    function generateId() {
        return 'p' + Date.now() + Math.random().toString(36).substr(2, 5);
    }

    // ╔══════════════════════════════════════╗
    // ║        RENDER UI (Vẽ giao diện)      ║
    // ╚══════════════════════════════════════╝

    /** Render thông tin hồ sơ lên trang */
    function renderProfile() {
        const profile = getProfile();

        // Avatar
        const avatarImg = document.getElementById('profile-avatar');
        const avatarFallback = document.getElementById('avatar-fallback');
        if (profile.profileImage) {
            avatarImg.src = profile.profileImage;
            avatarImg.style.display = 'block';
            avatarFallback.classList.add('hidden');
            avatarImg.onerror = function () {
                avatarImg.style.display = 'none';
                avatarFallback.classList.remove('hidden');
            };
        } else {
            avatarImg.style.display = 'none';
            avatarFallback.classList.remove('hidden');
        }

        // Tên
        document.getElementById('profile-name').textContent = profile.name || 'Chưa có tên';

        // Tiểu sử
        document.getElementById('profile-bio').textContent = profile.bio || 'Chưa có tiểu sử';

        // Kỹ năng
        const skillsEl = document.getElementById('profile-skills');
        skillsEl.innerHTML = '';
        if (profile.skills && profile.skills.length > 0) {
            profile.skills.forEach(function (skill) {
                const tag = document.createElement('span');
                tag.className = 'skill-tag';
                tag.textContent = skill;
                skillsEl.appendChild(tag);
            });
        }

        // Mạng xã hội
        const socialEl = document.getElementById('profile-social');
        socialEl.innerHTML = '';
        const socialIcons = {
            facebook: 'fab fa-facebook-f',
            zalo: '__zalo_svg__',
            telegram: 'fab fa-telegram-plane'
        };
        if (profile.socialLinks) {
            Object.keys(socialIcons).forEach(function (key) {
                if (profile.socialLinks[key]) {
                    const link = document.createElement('a');
                    link.href = profile.socialLinks[key];
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.className = 'social-link';
                    link.setAttribute('aria-label', key);
                    if (key === 'zalo') {
                        link.innerHTML = '<svg viewBox="0 0 48 48" width="18" height="18" fill="currentColor"><path d="M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0zm11.04 31.96c-.56 1.04-2.1 1.92-3.28 2.18-.8.18-1.84.32-5.36-1.14-4.48-1.88-7.36-6.44-7.58-6.74-.22-.3-1.78-2.38-1.78-4.54s1.12-3.22 1.52-3.66c.4-.44.88-.56 1.16-.56h.84c.27 0 .63-.1.98.75.36.87 1.24 3.02 1.34 3.24.1.22.18.48.04.76-.14.28-.2.46-.42.7-.2.24-.44.54-.62.72-.22.2-.44.44-.19.86.25.42 1.12 1.86 2.42 3.02 1.66 1.48 3.06 1.94 3.5 2.16.44.22.7.18.96-.1.26-.3 1.1-1.28 1.4-1.72.3-.44.58-.36.98-.22.4.14 2.52 1.19 2.96 1.41.44.22.72.32.84.5.1.18.1 1.04-.46 2.08z"/></svg>';
                    } else {
                        link.innerHTML = '<i class="' + socialIcons[key] + '"></i>';
                    }
                    socialEl.appendChild(link);
                }
            });
        }

        // Email & SĐT
        const emailSpan = document.querySelector('#profile-email span');
        const phoneSpan = document.querySelector('#profile-phone span');
        if (emailSpan) emailSpan.textContent = profile.contactEmail || '-';
        if (phoneSpan) phoneSpan.textContent = profile.phone || '-';

        // Ghi chú
        const noteEl = document.getElementById('profile-note');
        const noteP = noteEl.querySelector('p');
        if (profile.customNote) {
            noteP.textContent = profile.customNote;
            noteEl.style.display = '';
        } else {
            noteEl.style.display = 'none';
        }

        // Detail cards (Lập Trình, Thiết Kế, Sáng Tạo)
        var codingTitle = document.getElementById('detail-coding-title');
        var codingDesc = document.getElementById('detail-coding-desc');
        var designTitle = document.getElementById('detail-design-title');
        var designDesc = document.getElementById('detail-design-desc');
        var creativeTitle = document.getElementById('detail-creative-title');
        var creativeDesc = document.getElementById('detail-creative-desc');
        if (codingTitle && profile.codingTitle) codingTitle.textContent = profile.codingTitle;
        if (codingDesc && profile.codingDesc) codingDesc.textContent = profile.codingDesc;
        if (designTitle && profile.designTitle) designTitle.textContent = profile.designTitle;
        if (designDesc && profile.designDesc) designDesc.textContent = profile.designDesc;
        if (creativeTitle && profile.creativeTitle) creativeTitle.textContent = profile.creativeTitle;
        if (creativeDesc && profile.creativeDesc) creativeDesc.textContent = profile.creativeDesc;

        // Contact info section
        const contactEmailEl = document.getElementById('contact-info-email');
        const contactPhoneEl = document.getElementById('contact-info-phone');
        if (contactEmailEl) contactEmailEl.textContent = profile.contactEmail || '-';
        if (contactPhoneEl) contactPhoneEl.textContent = profile.phone || '-';

        // Contact social links
        renderSocialLinks('contact-social', profile.socialLinks, socialIcons);

        // Footer social
        renderSocialLinks('footer-social', profile.socialLinks, socialIcons);
    }

    /** Render social links vào container */
    function renderSocialLinks(containerId, links, icons) {
        const container = document.getElementById(containerId);
        if (!container || !links) return;
        container.innerHTML = '';
        Object.keys(icons).forEach(function (key) {
            if (links[key]) {
                const link = document.createElement('a');
                link.href = links[key];
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.className = 'social-link';
                link.setAttribute('aria-label', key);
                if (key === 'zalo') {
                    link.innerHTML = '<svg viewBox="0 0 48 48" width="18" height="18" fill="currentColor"><path d="M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0zm11.04 31.96c-.56 1.04-2.1 1.92-3.28 2.18-.8.18-1.84.32-5.36-1.14-4.48-1.88-7.36-6.44-7.58-6.74-.22-.3-1.78-2.38-1.78-4.54s1.12-3.22 1.52-3.66c.4-.44.88-.56 1.16-.56h.84c.27 0 .63-.1.98.75.36.87 1.24 3.02 1.34 3.24.1.22.18.48.04.76-.14.28-.2.46-.42.7-.2.24-.44.54-.62.72-.22.2-.44.44-.19.86.25.42 1.12 1.86 2.42 3.02 1.66 1.48 3.06 1.94 3.5 2.16.44.22.7.18.96-.1.26-.3 1.1-1.28 1.4-1.72.3-.44.58-.36.98-.22.4.14 2.52 1.19 2.96 1.41.44.22.72.32.84.5.1.18.1 1.04-.46 2.08z"/></svg>';
                } else {
                    link.innerHTML = '<i class="' + icons[key] + '"></i>';
                }
                container.appendChild(link);
            }
        });
    }

    /** Render sản phẩm nhóm theo danh mục */
    function renderProducts() {
        var products = getProducts();
        var categories = getCategories();
        var grid = document.getElementById('products-grid');
        var noProducts = document.getElementById('no-products');
        var filterNav = document.getElementById('category-filter-nav');

        if (!grid) return;
        grid.innerHTML = '';

        if (products.length === 0) {
            grid.style.display = 'none';
            if (noProducts) noProducts.style.display = 'block';
            if (filterNav) filterNav.innerHTML = '';
            return;
        }

        grid.style.display = '';
        if (noProducts) noProducts.style.display = 'none';

        // Group products by categoryId
        var grouped = {};
        var orderedCatIds = [];
        categories.forEach(function (cat) { grouped[cat.id] = []; orderedCatIds.push(cat.id); });
        products.forEach(function (p) {
            var cid = p.categoryId || '__none__';
            if (!grouped[cid]) { grouped[cid] = []; if (!orderedCatIds.includes(cid)) orderedCatIds.push(cid); }
            grouped[cid].push(p);
        });

        var activeCatIds = orderedCatIds.filter(function (cid) { return grouped[cid] && grouped[cid].length > 0; });

        // Render category filter nav
        if (filterNav) {
            filterNav.innerHTML = '';
            activeCatIds.forEach(function (cid, idx) {
                var cat = categories.find(function (c) { return c.id === cid; });
                var catName = cat ? cat.name : 'Khác';
                var catImg = cat ? cat.image : '';
                var count = (grouped[cid] || []).length;

                var btn = document.createElement('button');
                btn.className = 'cat-filter-btn' + (idx === 0 ? ' active' : '');
                btn.setAttribute('data-cat-id', cid);
                var imgHtml = catImg ? '<img src="' + escapeHtml(catImg) + '" onerror="this.style.display=\'none\'">' : '<i class="fas fa-layer-group"></i>';
                btn.innerHTML = imgHtml + '<span>' + escapeHtml(catName) + '</span><span class="cat-count">' + count + '</span>';
                btn.addEventListener('click', function () {
                    var sec = document.getElementById('category-' + cid);
                    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    filterNav.querySelectorAll('.cat-filter-btn').forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                });
                filterNav.appendChild(btn);
            });
        }

        // Render each category section
        activeCatIds.forEach(function (cid) {
            var cat = categories.find(function (c) { return c.id === cid; });
            var catName = cat ? cat.name : 'Khác';
            var catImg = cat ? cat.image : '';
            var prods = grouped[cid];

            var section = document.createElement('div');
            section.className = 'category-section';
            section.id = 'category-' + cid;

            var header = document.createElement('div');
            header.className = 'category-section-header';
            var iconHtml = catImg
                ? '<img class="cat-header-img" src="' + escapeHtml(catImg) + '" onerror="this.style.display=\'none\'">'
                : '<div class="cat-header-icon"><i class="fas fa-layer-group"></i></div>';
            header.innerHTML = iconHtml + '<h3>' + escapeHtml(catName) + '</h3><span class="cat-product-count">' + prods.length + ' sản phẩm</span>';
            section.appendChild(header);

            var catGrid = document.createElement('div');
            catGrid.className = 'category-products-grid';

            prods.forEach(function (product, index) {
                var card = document.createElement('div');
                card.className = 'product-card reveal';
                card.style.animationDelay = (index * 0.06) + 's';
                card.setAttribute('data-product-id', product.id);

                card.innerHTML =
                    '<div class="product-info-left">' +
                        '<h4 class="product-name">' + escapeHtml(product.name) + '</h4>' +
                        '<p class="product-desc">' + escapeHtml(product.description) + '</p>' +
                    '</div>' +
                    '<div class="product-actions-right">' +
                        '<span class="product-price">' + escapeHtml(product.price) + '</span>' +
                        '<button class="product-cart-btn" data-action="quick-add-cart" data-id="' + product.id + '"><i class="fas fa-cart-plus"></i> THÊM VÀO GIỎ</button>' +
                        '<button class="product-buy-now-btn" data-action="buy-now" data-id="' + product.id + '">LIÊN HỆ MUA</button>' +
                    '</div>';

                card.addEventListener('click', function (e) {
                    if (e.target.closest('[data-action="quick-add-cart"]') || e.target.closest('[data-action="buy-now"]')) return;
                    openProductModal(product.id);
                });

                catGrid.appendChild(card);
            });


            section.appendChild(catGrid);
            grid.appendChild(section);
        });

        initScrollReveal();
        initCategoryScrollSpy();
    }

    /** Render admin product list */
    function renderAdminProducts() {
        const products = getProducts();
        const list = document.getElementById('admin-products-list');
        list.innerHTML = '';

        if (products.length === 0) {
            list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem 0;">Chưa có sản phẩm nào</p>';
            return;
        }

        products.forEach(function (product) {
            const item = document.createElement('div');
            item.className = 'admin-product-item';

            let thumbHtml;
            if (product.image) {
                thumbHtml = '<img src="' + escapeHtml(product.image) + '" alt="" class="admin-product-thumb" onerror="this.style.background=\'var(--bg-tertiary)\';this.src=\'\'">';
            } else {
                thumbHtml = '<div class="admin-product-thumb" style="display:flex;align-items:center;justify-content:center;color:var(--text-muted)"><i class="fas fa-image"></i></div>';
            }

            item.innerHTML =
                thumbHtml +
                '<div class="admin-product-info">' +
                    '<h5>' + escapeHtml(product.name) + '</h5>' +
                    '<span>' + escapeHtml(product.price) + ' · ' + escapeHtml(product.status) + '</span>' +
                '</div>' +
                '<div class="admin-product-actions">' +
                    '<button class="edit-btn" data-action="edit" data-id="' + product.id + '" title="Sửa"><i class="fas fa-pen"></i></button>' +
                    '<button class="delete-btn" data-action="delete" data-id="' + product.id + '" title="Xóa"><i class="fas fa-trash"></i></button>' +
                '</div>';

            list.appendChild(item);
        });
    }

    // ╔══════════════════════════════════════╗
    // ║        LOADING SCREEN                ║
    // ╚══════════════════════════════════════╝

    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;
        if (document.documentElement.classList.contains('embed-only')) {
            loadingScreen.classList.add('hidden');
            document.body.classList.remove('loading');
            return;
        }
        document.body.classList.add('loading');

        setTimeout(function () {
            loadingScreen.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 1800);
    }

    /** Tab mới chỉ hiển thị một section (?embed=share-tut|about|products) */
    function applyEmbedMode() {
        var params = new URLSearchParams(window.location.search);
        var embed = params.get('embed');
        var allowed = { 'share-tut': true, 'about': true, 'products': true };
        if (!embed || !allowed[embed]) return;

        document.documentElement.classList.add('embed-only');
        document.documentElement.setAttribute('data-embed', embed);

        var titles = {
            'share-tut': 'Share Tut Free',
            'about': 'Giới thiệu',
            'products': 'Sản phẩm'
        };
        if (titles[embed]) {
            document.title = titles[embed] + ' · Cosmic Portfolio';
        }
    }

    /** Trang embed: bật ngay .reveal trong section để không bị kẹt opacity:0 */
    function revealEmbedSectionContent() {
        if (!document.documentElement.classList.contains('embed-only')) return;
        var embed = document.documentElement.getAttribute('data-embed');
        if (!embed) return;
        var sec = document.getElementById(embed);
        if (!sec) return;
        sec.querySelectorAll('.reveal').forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    // ╔══════════════════════════════════════╗
    // ║        NAVIGATION                    ║
    // ╚══════════════════════════════════════╝

    function initNavigation() {
        const header = document.getElementById('header');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const sidebarLinks = document.querySelectorAll('.sidebar-link');

        function openSidebar() {
            sidebarToggle.classList.add('active');
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        }

        function closeSidebar() {
            sidebarToggle.classList.remove('active');
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }

        // Toggle sidebar
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function () {
                if (sidebar.classList.contains('active')) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            });
        }

        // Close on overlay click
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeSidebar);
        }

        // Sidebar link click: chỉ prevent default nếu là anchor (#), còn URL bình thường thì cho navigate
        sidebarLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = link.getAttribute('href') || '';
                closeSidebar();
                // Nếu là anchor link (#hero) thì scroll mượt
                if (href.charAt(0) === '#') {
                    e.preventDefault();
                    var target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                // Nếu là URL (index.html, index.html?embed=...) thì cho navigate bình thường
            });
        });

        // Sidebar logout
        var sidebarLogout = document.getElementById('sidebar-logout');
        if (sidebarLogout) {
            sidebarLogout.addEventListener('click', function () {
                closeSidebar();
                if (typeof CosmicAuth !== 'undefined') {
                    cosmicConfirm(currentLang === 'en' ? 'Are you sure you want to sign out?' : 'Bạn có chắc muốn đăng xuất?').then(function (yes) {
                        if (yes) CosmicAuth.logout();
                    });
                }
            });
        }

        // Search functionality
        var searchInput = document.getElementById('nav-search-input');
        if (searchInput) {
            searchInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    var query = this.value.trim().toLowerCase();
                    if (!query) return;
                    // Scroll to products section
                    var productsSection = document.getElementById('products');
                    if (productsSection) {
                        productsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    // Filter products
                    filterProducts(query);
                    // Close mobile search overlay
                    var navSearch = document.getElementById('nav-search');
                    if (navSearch) navSearch.classList.remove('active');
                }
            });
        }

        // Mobile search toggle
        var searchToggle = document.getElementById('nav-search-toggle');
        var searchClose = document.getElementById('nav-search-close');
        var navSearchEl = document.getElementById('nav-search');
        if (searchToggle && navSearchEl) {
            searchToggle.addEventListener('click', function () {
                navSearchEl.classList.add('active');
                var inp = document.getElementById('nav-search-input');
                if (inp) inp.focus();
            });
        }
        if (searchClose && navSearchEl) {
            searchClose.addEventListener('click', function () {
                navSearchEl.classList.remove('active');
            });
        }
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navSearchEl) {
                navSearchEl.classList.remove('active');
            }
        });

        // Scroll -> header style
        function onScroll() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            updateActiveNav();
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /** Filter products by search query */
    function filterProducts(query) {
        var cards = document.querySelectorAll('#products-grid .product-card');
        var found = 0;
        cards.forEach(function (card) {
            var name = card.querySelector('.product-name');
            var text = name ? name.textContent.toLowerCase() : '';
            if (!query || text.indexOf(query) !== -1) {
                card.style.display = '';
                found++;
            } else {
                card.style.display = 'none';
            }
        });
        if (query && found === 0) {
            showToast('Không tìm thấy sản phẩm "' + query + '"', 'warning');
        }
    }

    /** Update sidebar active link on scroll */
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        let current = 'hero';

        sections.forEach(function (section) {
            if (window.getComputedStyle(section).display === 'none') return;
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.id;
            }
        });

        sidebarLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }

    // ╔══════════════════════════════════════╗
    // ║        SCROLL REVEAL (Hiện khi cuộn) ║
    // ╚══════════════════════════════════════╝

    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal:not(.revealed)');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            reveals.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: hiện tất cả
            reveals.forEach(function (el) {
                el.classList.add('revealed');
            });
        }
    }

    // ╔══════════════════════════════════════╗
    // ║        BACK TO TOP                   ║
    // ╚══════════════════════════════════════╝

    function initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ╔══════════════════════════════════════╗
    // ║        ADMIN PANEL                   ║
    // ╚══════════════════════════════════════╝

    function initAdminPanel() {
        const adminBtn = document.getElementById('admin-btn');
        const adminPanel = document.getElementById('admin-panel');
        const adminOverlay = document.getElementById('admin-overlay');
        const adminClose = document.getElementById('admin-close');
        const tabs = document.querySelectorAll('.admin-tab');

        // Mở/đóng admin panel
        function openAdmin() {
            adminPanel.classList.add('active');
            adminOverlay.classList.add('active');
            loadAdminProfileForm();
            renderAdminProducts();
        }

        function closeAdmin() {
            adminPanel.classList.remove('active');
            adminOverlay.classList.remove('active');
        }

        adminBtn.addEventListener('click', function () {
            // Kiểm tra quyền admin
            if (typeof CosmicAuth !== 'undefined' && !CosmicAuth.isAdmin()) {
                showToast('⛔ Bạn không có quyền truy cập bảng quản trị!', 'warning');
                return;
            }
            openAdmin();
        });
        adminClose.addEventListener('click', closeAdmin);
        adminOverlay.addEventListener('click', closeAdmin);

        // Phím ESC đóng admin
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeAdmin();
                closeAllModals();
            }
        });

        // Tabs
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                const targetId = this.getAttribute('data-tab');

                tabs.forEach(function (t) { t.classList.remove('active'); });
                document.querySelectorAll('.admin-tab-content').forEach(function (c) { c.classList.remove('active'); });

                this.classList.add('active');
                document.getElementById(targetId).classList.add('active');
            });
        });

        // Profile form submit
        document.getElementById('profile-form').addEventListener('submit', function (e) {
            e.preventDefault();
            saveProfileFromForm();
        });

        // Add product button
        document.getElementById('add-product-btn').addEventListener('click', function () {
            openProductFormModal(null);
        });

        // Product form submit
        document.getElementById('product-form').addEventListener('submit', function (e) {
            e.preventDefault();
            saveProductFromForm();
        });

        // Admin product list actions (delegation)
        document.getElementById('admin-products-list').addEventListener('click', function (e) {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');

            if (action === 'edit') {
                openProductFormModal(id);
            } else if (action === 'delete') {
                cosmicConfirm('Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.').then(function (yes) {
                    if (yes) deleteProduct(id);
                });
            }
        });
    }

    /** Điền dữ liệu profile vào admin form */
    function loadAdminProfileForm() {
        const profile = getProfile();
        document.getElementById('admin-name').value = profile.name || '';
        document.getElementById('admin-avatar').value = profile.profileImage || '';
        document.getElementById('admin-bio').value = profile.bio || '';
        document.getElementById('admin-skills').value = (profile.skills || []).join(', ');
        document.getElementById('admin-email').value = profile.contactEmail || '';
        document.getElementById('admin-phone').value = profile.phone || '';
        document.getElementById('admin-facebook').value = (profile.socialLinks && profile.socialLinks.facebook) || '';
        document.getElementById('admin-zalo').value = (profile.socialLinks && profile.socialLinks.zalo) || '';
        document.getElementById('admin-telegram').value = (profile.socialLinks && profile.socialLinks.telegram) || '';
        document.getElementById('admin-note').value = profile.customNote || '';

        // Detail cards (Lập Trình, Thiết Kế, Sáng Tạo)
        document.getElementById('admin-coding-title').value = profile.codingTitle || '';
        document.getElementById('admin-coding-desc').value = profile.codingDesc || '';
        document.getElementById('admin-design-title').value = profile.designTitle || '';
        document.getElementById('admin-design-desc').value = profile.designDesc || '';
        document.getElementById('admin-creative-title').value = profile.creativeTitle || '';
        document.getElementById('admin-creative-desc').value = profile.creativeDesc || '';
    }

    /** Lưu profile từ admin form */
    function saveProfileFromForm() {
        const skillsRaw = document.getElementById('admin-skills').value;
        const skills = skillsRaw.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });

        const profile = {
            name: document.getElementById('admin-name').value.trim(),
            profileImage: document.getElementById('admin-avatar').value.trim(),
            bio: document.getElementById('admin-bio').value.trim(),
            skills: skills,
            socialLinks: {
                facebook: document.getElementById('admin-facebook').value.trim(),
                zalo: document.getElementById('admin-zalo').value.trim(),
                telegram: document.getElementById('admin-telegram').value.trim()
            },
            contactEmail: document.getElementById('admin-email').value.trim(),
            phone: document.getElementById('admin-phone').value.trim(),
            customNote: document.getElementById('admin-note').value.trim(),
            codingTitle: document.getElementById('admin-coding-title').value.trim(),
            codingDesc: document.getElementById('admin-coding-desc').value.trim(),
            designTitle: document.getElementById('admin-design-title').value.trim(),
            designDesc: document.getElementById('admin-design-desc').value.trim(),
            creativeTitle: document.getElementById('admin-creative-title').value.trim(),
            creativeDesc: document.getElementById('admin-creative-desc').value.trim()
        };

        saveProfile(profile);
        renderProfile();

        // Hiển thị thông báo
        showToast('✅ Hồ sơ đã được lưu thành công!');
    }

    // ╔══════════════════════════════════════╗
    // ║        PRODUCT CRUD                  ║
    // ╚══════════════════════════════════════╝

    /** Mở form thêm/sửa sản phẩm */
    function openProductFormModal(productId) {
        const modal = document.getElementById('product-form-modal');
        const title = document.getElementById('product-form-title');
        const form = document.getElementById('product-form');
        var nameEl = document.getElementById('product-image-name');

        form.reset();
        document.getElementById('product-edit-id').value = '';
        document.getElementById('product-image').value = '';
        if (nameEl) nameEl.textContent = 'Chưa chọn ảnh';

        // Populate category dropdown
        populateCategoryDropdown();

        if (productId) {
            title.textContent = 'Chỉnh Sửa Sản Phẩm';
            const products = getProducts();
            const product = products.find(function (p) { return p.id === productId; });
            if (product) {
                document.getElementById('product-edit-id').value = product.id;
                document.getElementById('product-image').value = product.image || '';
                document.getElementById('product-name-input').value = product.name || '';
                document.getElementById('product-desc-input').value = product.description || '';
                document.getElementById('product-warranty-input').value = product.warranty || '';
                document.getElementById('product-price-input').value = product.price || '';
                document.getElementById('product-status-input').value = product.status || 'Còn hàng';
                if (nameEl) nameEl.textContent = product.image ? 'Đã có ảnh' : 'Chưa chọn ảnh';
                // Set category
                populateCategoryDropdown(product.categoryId || '');
            }
        } else {
            title.textContent = 'Thêm Sản Phẩm Mới';
        }

        modal.classList.add('active');
    }

    /** Lưu sản phẩm từ form */
    function saveProductFromForm() {
        const editId = document.getElementById('product-edit-id').value;
        const products = getProducts();
        var catSel = document.getElementById('product-category-input');
        var catId = catSel ? catSel.value : '';
        var catErr = document.getElementById('product-category-error');

        if (catErr) catErr.textContent = '';

        const productData = {
            id: editId || generateId(),
            image: document.getElementById('product-image').value.trim(),
            name: document.getElementById('product-name-input').value.trim(),
            description: document.getElementById('product-desc-input').value.trim(),
            warranty: document.getElementById('product-warranty-input').value.trim(),
            price: document.getElementById('product-price-input').value.trim(),
            status: document.getElementById('product-status-input').value,
            categoryId: catId
        };

        // Validate cơ bản
        if (!productData.name || !productData.price) {
            showToast('⚠️ Vui lòng nhập tên và giá sản phẩm!', 'warning');
            return;
        }

        if (editId) {
            // Cập nhật
            const index = products.findIndex(function (p) { return p.id === editId; });
            if (index !== -1) {
                products[index] = productData;
            }
        } else {
            // Thêm mới
            products.push(productData);
        }

        saveProducts(products);
        renderProducts();
        renderAdminProducts();
        closeAllModals();
        showToast(editId ? '✅ Sản phẩm đã được cập nhật!' : '✅ Sản phẩm mới đã được thêm!');
    }

    /** Custom cosmic confirm dialog - trả về Promise */
    function cosmicConfirm(message) {
        return new Promise(function (resolve) {
            var overlay = document.getElementById('cosmic-confirm');
            var msgEl = document.getElementById('cosmic-confirm-msg');
            var btnYes = document.getElementById('cosmic-confirm-yes');
            var btnNo = document.getElementById('cosmic-confirm-no');

            msgEl.textContent = message || 'Bạn có chắc muốn xóa?';
            overlay.classList.remove('closing');
            overlay.classList.add('active');

            function cleanup() {
                btnYes.removeEventListener('click', onYes);
                btnNo.removeEventListener('click', onNo);
                overlay.removeEventListener('click', onOverlay);
            }

            function closeDialog(result) {
                cleanup();
                overlay.classList.add('closing');
                setTimeout(function () {
                    overlay.classList.remove('active', 'closing');
                    resolve(result);
                }, 350);
            }

            function onYes() { closeDialog(true); }
            function onNo() { closeDialog(false); }
            function onOverlay(e) {
                if (e.target === overlay) closeDialog(false);
            }

            btnYes.addEventListener('click', onYes);
            btnNo.addEventListener('click', onNo);
            overlay.addEventListener('click', onOverlay);
        });
    }

    /** Xóa sản phẩm */
    function deleteProduct(productId) {
        let products = getProducts();
        products = products.filter(function (p) { return p.id !== productId; });
        saveProducts(products);
        renderProducts();
        renderAdminProducts();
        showToast('🗑️ Sản phẩm đã được xóa!');
    }

    // ╔══════════════════════════════════════╗
    // ║        PRODUCT DETAIL MODAL          ║
    // ╚══════════════════════════════════════╝

    function openProductModal(productId) {
        const products = getProducts();
        const product = products.find(function (p) { return p.id === productId; });
        if (!product) return;

        const modal = document.getElementById('product-modal');
        const imgEl = document.getElementById('modal-image');

        // Set image
        if (product.image) {
            imgEl.src = product.image;
            imgEl.style.display = 'block';
        } else {
            imgEl.src = '';
            imgEl.style.display = 'none';
        }

        document.getElementById('modal-name').textContent = product.name;
        document.getElementById('modal-desc').textContent = product.description;

        // Warranty
        const warrantyEl = document.getElementById('modal-warranty');
        if (product.warranty) {
            warrantyEl.querySelector('span').textContent = product.warranty;
            warrantyEl.style.display = '';
        } else {
            warrantyEl.style.display = 'none';
        }

        // Status
        const statusEl = document.getElementById('modal-status');
        const isInStock = product.status === 'Còn hàng';
        const statusClass = isInStock ? 'in-stock' : 'out-of-stock';
        statusEl.className = 'modal-badge status-badge ' + statusClass;
        statusEl.textContent = product.status;

        // Price
        document.getElementById('modal-price').textContent = product.price;

        // Buy button
        const buyBtn = document.getElementById('modal-buy-btn');
        buyBtn.onclick = function (e) {
            e.preventDefault();
            closeAllModals();
            // Nếu đang ở chế độ embed, chuyển về trang chính có #contact
            if (document.documentElement.classList.contains('embed-only')) {
                window.location.href = 'index.html#contact';
                return;
            }
            // Cuộn đến phần liên hệ
            setTimeout(function () {
                var contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        };

        // Disable buy/cart buttons if out of stock
        if (!isInStock) {
            buyBtn.classList.add('disabled');
        } else {
            buyBtn.classList.remove('disabled');
        }

        // ── Quantity Selector ──
        var qtyValue = document.getElementById('modal-qty-value');
        var qtyMinus = document.getElementById('modal-qty-minus');
        var qtyPlus = document.getElementById('modal-qty-plus');
        var currentQty = 1;
        qtyValue.textContent = currentQty;

        // Clean up old listeners by cloning
        var newMinus = qtyMinus.cloneNode(true);
        var newPlus = qtyPlus.cloneNode(true);
        qtyMinus.parentNode.replaceChild(newMinus, qtyMinus);
        qtyPlus.parentNode.replaceChild(newPlus, qtyPlus);

        newMinus.addEventListener('click', function () {
            if (currentQty > 1) {
                currentQty--;
                qtyValue.textContent = currentQty;
            }
        });

        newPlus.addEventListener('click', function () {
            if (currentQty < 99) {
                currentQty++;
                qtyValue.textContent = currentQty;
            }
        });

        // ── Add to Cart Button ──
        var addCartBtn = document.getElementById('modal-add-cart-btn');
        var cartSpan = addCartBtn.querySelector('span');
        var cartIcon = addCartBtn.querySelector('i');

        // Reset button state
        addCartBtn.classList.remove('cart-added', 'disabled');
        cartSpan.textContent = currentLang === 'en' ? 'Add to cart' : 'Thêm vào giỏ hàng';
        cartIcon.className = 'fas fa-cart-plus';

        if (!isInStock) {
            addCartBtn.classList.add('disabled');
            cartSpan.textContent = currentLang === 'en' ? 'Out of stock' : 'Hết hàng';
            cartIcon.className = 'fas fa-times-circle';
        }

        // Clone to remove old event listeners
        var newCartBtn = addCartBtn.cloneNode(true);
        addCartBtn.parentNode.replaceChild(newCartBtn, addCartBtn);

        if (isInStock) {
            newCartBtn.addEventListener('click', function () {
                var qty = parseInt(qtyValue.textContent) || 1;
                addToCart(product, qty);

                // Fly animation
                flyToCartAnimation(newCartBtn);

                // Success state
                var btnSpan = newCartBtn.querySelector('span');
                var btnIcon = newCartBtn.querySelector('i');
                newCartBtn.classList.add('cart-added');
                btnIcon.className = 'fas fa-check';
                btnSpan.textContent = currentLang === 'en'
                    ? 'Added (' + qty + ')'
                    : 'Đã thêm (' + qty + ')';

                // Show toast
                showToast(currentLang === 'en'
                    ? '✅ Added ' + qty + 'x "' + product.name + '" to cart!'
                    : '✅ Đã thêm ' + qty + 'x "' + product.name + '" vào giỏ hàng!');

                // Reset after 2s
                setTimeout(function () {
                    newCartBtn.classList.remove('cart-added');
                    btnIcon.className = 'fas fa-cart-plus';
                    btnSpan.textContent = currentLang === 'en' ? 'Add to cart' : 'Thêm vào giỏ hàng';
                }, 2000);
            });
        }

        modal.classList.add('active');
    }

    // Product grid click delegation (cho nút "Chi tiết" + Quick Add Cart + Buy Now)
    function initProductActions() {
        document.getElementById('products-grid').addEventListener('click', function (e) {
            var viewBtn = e.target.closest('[data-action="view-product"]');
            if (viewBtn) {
                e.stopPropagation();
                openProductModal(viewBtn.getAttribute('data-id'));
                return;
            }

            // Quick Add to Cart
            var cartBtn = e.target.closest('[data-action="quick-add-cart"]');
            if (cartBtn) {
                e.stopPropagation();
                var productId = cartBtn.getAttribute('data-id');
                var products = getProducts();
                var product = products.find(function (p) { return p.id === productId; });
                if (product) {
                    addToCart(product, 1);
                    flyToCartAnimation(cartBtn);
                    // Visual feedback
                    var origHtml = cartBtn.innerHTML;
                    cartBtn.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
                    cartBtn.classList.add('added');
                    setTimeout(function () {
                        cartBtn.innerHTML = origHtml;
                        cartBtn.classList.remove('added');
                    }, 1500);
                    showToast('✅ Đã thêm "' + product.name + '" vào giỏ hàng!');
                }
                return;
            }

            // Buy Now - go to contact
            var buyBtn = e.target.closest('[data-action="buy-now"]');
            if (buyBtn) {
                e.stopPropagation();
                if (document.documentElement.classList.contains('embed-only')) {
                    window.location.href = 'index.html#contact';
                    return;
                }
                var contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
                return;
            }
        });

        // Product image file upload
        var productImageFile = document.getElementById('product-image-file');
        if (productImageFile) {
            productImageFile.addEventListener('change', function (e) {
                var file = e.target.files[0];
                if (!file) return;
                if (file.size > 4 * 1024 * 1024) {
                    showToast('⚠️ Ảnh quá lớn! Tối đa 4MB.', 'warning');
                    return;
                }
                var nameEl = document.getElementById('product-image-name');
                if (nameEl) nameEl.textContent = file.name;
                var reader = new FileReader();
                reader.onload = function (ev) {
                    document.getElementById('product-image').value = ev.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    }

    // ╔══════════════════════════════════════╗
    // ║        MODAL MANAGEMENT              ║
    // ╚══════════════════════════════════════╝

    function initModals() {
        // Close buttons
        document.querySelectorAll('.modal-close').forEach(function (btn) {
            btn.addEventListener('click', function () {
                this.closest('.modal').classList.remove('active');
            });
        });

        // Click overlay to close
        document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
            overlay.addEventListener('click', function () {
                this.closest('.modal').classList.remove('active');
            });
        });
    }

    function closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(function (modal) {
            modal.classList.remove('active');
        });
    }

    // ╔══════════════════════════════════════╗
    // ║        CONTACT FORM                  ║
    // ╚══════════════════════════════════════╝

    function initContactForm() {
        const form = document.getElementById('contact-form');
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');
        const submitBtn = document.getElementById('contact-submit-btn');
        const successDiv = document.getElementById('form-success');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearFormErrors();

            let isValid = true;

            // Validate tên
            if (!nameInput.value.trim()) {
                showFormError('name-error', 'Vui lòng nhập họ và tên');
                nameInput.closest('.form-group').classList.add('error');
                isValid = false;
            }

            // Validate email
            if (!emailInput.value.trim()) {
                showFormError('email-error', 'Vui lòng nhập email');
                emailInput.closest('.form-group').classList.add('error');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showFormError('email-error', 'Email không hợp lệ');
                emailInput.closest('.form-group').classList.add('error');
                isValid = false;
            }

            // Validate tin nhắn
            if (!messageInput.value.trim()) {
                showFormError('message-error', 'Vui lòng nhập nội dung tin nhắn');
                messageInput.closest('.form-group').classList.add('error');
                isValid = false;
            }

            if (isValid) {
                // Giả lập gửi form
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';

                setTimeout(function () {
                    // Lưu tin nhắn vào localStorage
                    const messages = JSON.parse(localStorage.getItem('cosmic_messages') || '[]');
                    messages.push({
                        name: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        message: messageInput.value.trim(),
                        date: new Date().toISOString()
                    });
                    localStorage.setItem('cosmic_messages', JSON.stringify(messages));

                    form.reset();
                    successDiv.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi Tin Nhắn';

                    setTimeout(function () {
                        successDiv.style.display = 'none';
                    }, 5000);
                }, 1500);
            }
        });

        // Xóa lỗi khi nhập
        [nameInput, emailInput, messageInput].forEach(function (input) {
            input.addEventListener('input', function () {
                this.closest('.form-group').classList.remove('error');
                var errorId = this.id.replace('contact-', '') + '-error';
                var errorEl = document.getElementById(errorId);
                if (errorEl) errorEl.textContent = '';
            });
        });
    }

    function showFormError(id, message) {
        var el = document.getElementById(id);
        if (el) el.textContent = message;
    }

    function clearFormErrors() {
        document.querySelectorAll('.form-error').forEach(function (el) { el.textContent = ''; });
        document.querySelectorAll('.form-group.error').forEach(function (el) { el.classList.remove('error'); });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ╔══════════════════════════════════════╗
    // ║        TOAST NOTIFICATION             ║
    // ╚══════════════════════════════════════╝

    function showToast(message, type) {
        // Xóa toast cũ nếu có
        var old = document.querySelector('.toast-notification');
        if (old) old.remove();

        var toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;

        // Style inline cho toast
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            padding: '0.9rem 1.8rem',
            background: type === 'warning' ? 'rgba(245, 158, 11, 0.9)' : 'rgba(16, 185, 129, 0.9)',
            color: 'white',
            borderRadius: '12px',
            fontFamily: 'var(--font-primary)',
            fontSize: '0.9rem',
            fontWeight: '600',
            zIndex: '9999',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            opacity: '0',
            transition: 'all 0.4s ease'
        });

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(function () {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Auto remove
        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(function () { toast.remove(); }, 400);
        }, 3000);
    }

    // ╔══════════════════════════════════════╗
    // ║        HELPER FUNCTIONS              ║
    // ╚══════════════════════════════════════╝

    /** Escape HTML để tránh XSS */
    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ╔══════════════════════════════════════╗
    // ║        SMOOTH SCROLL (Links)         ║
    // ╚══════════════════════════════════════╝

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var targetId = this.getAttribute('href');
                var target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ╔══════════════════════════════════════╗
    // ║     INTERNATIONALIZATION (i18n)      ║
    // ╚══════════════════════════════════════╝

    var currentLang = localStorage.getItem('cosmic_lang') || 'vi';

    var translations = {
        vi: {
            'welcome.online': 'HỆ THỐNG TRỰC TUYẾN',
            'welcome.back': 'CHÀO MỪNG ĐẾN VỚI',
            'stats.products': 'Tổng sản phẩm',
            'stats.level': 'Cấp bậc tài khoản',
            'dropdown.profile': 'Xem hồ sơ',
            'dropdown.settings': 'Cài đặt',
            'dropdown.logout': 'Đăng xuất',
            'profile.changeCover': 'Đổi ảnh bìa',
            'profile.joinDate': 'Ngày tham gia:',
            'profile.status': 'Trạng thái:',
            'profile.active': 'Hoạt động',
            'profile.avatarUrl': 'Ảnh đại diện',
            'profile.coverUrl': 'Ảnh bìa',
            'profile.uploadAvatar': 'Chọn ảnh đại diện',
            'profile.uploadCover': 'Chọn ảnh bìa',
            'share.empty': 'Hiện chưa có mục nào',
            'share.coming': 'Nội dung sẽ được cập nhật sớm',
            'about.tag': '👨‍🚀 Về Tôi',
            'about.desc': 'Khám phá hồ sơ cá nhân và câu chuyện của tôi',
            'about.coding': 'Lập Trình',
            'about.codingDesc': 'Phát triển web hiện đại với các công nghệ tiên tiến nhất',
            'about.design': 'Thiết Kế',
            'about.designDesc': 'Sáng tạo giao diện đẹp mắt, trải nghiệm người dùng tuyệt vời',
            'about.creative': 'Sáng Tạo',
            'about.creativeDesc': 'Biến ý tưởng thành hiện thực với giải pháp đột phá',
            'products.tag': '🛸 Cửa Hàng',
            'products.desc': 'Khám phá các sản phẩm và dịch vụ chất lượng cao',
            'contact.tag': '📡 Liên Hệ',
            'contact.desc': 'Gửi tin nhắn hoặc liên hệ qua các kênh bên dưới',
            'contact.name': 'Họ và tên *',
            'contact.namePh': 'Nhập họ và tên của bạn...',
            'contact.emailPh': 'Nhập địa chỉ email...',
            'contact.message': 'Nội dung tin nhắn *',
            'contact.msgPh': 'Nhập nội dung tin nhắn của bạn...',
            'contact.send': 'Gửi Tin Nhắn',
            'contact.success': 'Tin nhắn đã được gửi thành công! Cảm ơn bạn đã liên hệ.',
            'contact.phone': 'Điện thoại',
            'contact.social': 'Mạng xã hội',
            'footer.copy': '© 2026 StorePremium. Tất cả quyền được bảo lưu.',
            'settings.title': 'Cài đặt tài khoản',
            'settings.changePassword': 'Đổi mật khẩu',
            'settings.currentPw': 'Mật khẩu hiện tại',
            'settings.newPw': 'Mật khẩu mới',
            'settings.confirmPw': 'Xác nhận mật khẩu mới',
            'settings.savePw': 'Lưu mật khẩu',
            'product.addToCart': 'Thêm vào giỏ hàng',
            'cart.title': 'Giỏ Hàng',
            'cart.empty': 'Giỏ hàng trống',
            'cart.emptyDesc': 'Hãy thêm sản phẩm yêu thích vào giỏ hàng',
            'cart.totalItems': 'Tổng sản phẩm:',
            'cart.contact': 'Liên hệ để đặt hàng',
            'cart.contactBtn': 'Liên Hệ Đặt Hàng',
            'cart.clear': 'Xóa Toàn Bộ'
        },
        en: {
            'welcome.online': 'SYSTEM ONLINE',
            'welcome.back': 'WELCOME TO',
            'stats.products': 'Total products',
            'stats.level': 'Account level',
            'dropdown.profile': 'View profile',
            'dropdown.settings': 'Settings',
            'dropdown.logout': 'Sign out',
            'profile.changeCover': 'Change cover',
            'profile.joinDate': 'Joined:',
            'profile.status': 'Status:',
            'profile.active': 'Active',
            'profile.avatarUrl': 'Avatar',
            'profile.coverUrl': 'Cover photo',
            'profile.uploadAvatar': 'Choose avatar',
            'profile.uploadCover': 'Choose cover',
            'share.empty': 'No content yet',
            'share.coming': 'Content will be updated soon',
            'about.tag': '👨‍🚀 About Me',
            'about.desc': 'Discover my profile and story',
            'about.coding': 'Development',
            'about.codingDesc': 'Modern web development with cutting-edge technologies',
            'about.design': 'Design',
            'about.designDesc': 'Creating beautiful interfaces with amazing user experience',
            'about.creative': 'Creative',
            'about.creativeDesc': 'Turning ideas into reality with breakthrough solutions',
            'products.tag': '🛸 Store',
            'products.desc': 'Explore high-quality products and services',
            'contact.tag': '📡 Contact',
            'contact.desc': 'Send a message or reach out via channels below',
            'contact.name': 'Full name *',
            'contact.namePh': 'Enter your full name...',
            'contact.emailPh': 'Enter your email address...',
            'contact.message': 'Message content *',
            'contact.msgPh': 'Enter your message...',
            'contact.send': 'Send Message',
            'contact.success': 'Message sent successfully! Thank you for reaching out.',
            'contact.phone': 'Phone',
            'contact.social': 'Social media',
            'footer.copy': '© 2026 StorePremium. All rights reserved.',
            'settings.title': 'Account Settings',
            'settings.changePassword': 'Change Password',
            'settings.currentPw': 'Current password',
            'settings.newPw': 'New password',
            'settings.confirmPw': 'Confirm new password',
            'settings.savePw': 'Save Password',
            'product.addToCart': 'Add to cart',
            'cart.title': 'Shopping Cart',
            'cart.empty': 'Your cart is empty',
            'cart.emptyDesc': 'Add your favorite products to the cart',
            'cart.totalItems': 'Total items:',
            'cart.contact': 'Contact us to place your order',
            'cart.contactBtn': 'Contact to Order',
            'cart.clear': 'Clear All'
        }
    };

    // i18n HTML translations (innerHTML for elements with spans inside)
    var translationsHtml = {
        vi: {
            'about.title': 'Giới Thiệu <span class="text-gradient">Bản Thân</span>',
            'products.title': 'Sản Phẩm <span class="text-gradient">Nổi Bật</span>',
            'contact.title': 'Liên Hệ <span class="text-gradient">Với Tôi</span>'
        },
        en: {
            'about.title': 'About <span class="text-gradient">Me</span>',
            'products.title': 'Featured <span class="text-gradient">Products</span>',
            'contact.title': 'Contact <span class="text-gradient">With Me</span>'
        }
    };

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('cosmic_lang', lang);
        var dict = translations[lang] || translations['vi'];
        var dictHtml = translationsHtml[lang] || translationsHtml['vi'];

        // Text content
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        // HTML content (for sections with inner spans)
        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-html');
            if (dictHtml[key]) {
                el.innerHTML = dictHtml[key];
            }
        });

        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) {
                el.placeholder = dict[key];
            }
        });
    }

    function initLanguageSwitcher() {
        var switcher = document.getElementById('lang-switcher');
        if (!switcher) return;

        var btns = switcher.querySelectorAll('.lang-btn');
        btns.forEach(function (btn) {
            if (btn.getAttribute('data-lang') === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
            btn.addEventListener('click', function () {
                btns.forEach(function (b) { b.classList.remove('active'); });
                this.classList.add('active');
                applyLanguage(this.getAttribute('data-lang'));
            });
        });

        // Apply saved language on load
        if (currentLang !== 'vi') {
            applyLanguage(currentLang);
        }
    }

    // ╔══════════════════════════════════════╗
    // ║     CART (Giỏ hàng)                  ║
    // ╚══════════════════════════════════════╝

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('cosmic_cart') || '[]');
        } catch (e) { return []; }
    }

    function saveCart(cart) {
        try {
            localStorage.setItem('cosmic_cart', JSON.stringify(cart));
        } catch (e) { console.error('Lỗi lưu giỏ hàng:', e); }
    }

    function getCartCount() {
        var cart = getCart();
        var total = 0;
        cart.forEach(function (item) { total += item.qty || 1; });
        return total;
    }

    function updateCartBadge() {
        var badge = document.getElementById('cart-badge');
        if (!badge) return;
        var count = getCartCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? '' : 'none';

        // Animate badge on update
        if (count > 0) {
            badge.classList.remove('badge-pulse');
            void badge.offsetWidth; // force reflow
            badge.classList.add('badge-pulse');
        }
    }

    function addToCart(product, qty) {
        if (!product || !product.id) return;
        qty = qty || 1;
        var cart = getCart();

        // Check if product already in cart
        var existing = null;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id === product.id) {
                existing = cart[i];
                break;
            }
        }

        if (existing) {
            existing.qty = (existing.qty || 1) + qty;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || '',
                qty: qty
            });
        }

        saveCart(cart);
        updateCartBadge();
    }

    function removeFromCart(productId) {
        var cart = getCart();
        cart = cart.filter(function (item) { return item.id !== productId; });
        saveCart(cart);
        updateCartBadge();
    }

    /** Tạo hiệu ứng bay vào giỏ hàng */
    function flyToCartAnimation(btnEl) {
        var rect = btnEl.getBoundingClientRect();
        var cartEl = document.getElementById('cart-btn');
        if (!cartEl) return;
        var cartRect = cartEl.getBoundingClientRect();

        var flyIcon = document.createElement('i');
        flyIcon.className = 'fas fa-shopping-cart cart-fly-icon';
        flyIcon.style.left = rect.left + rect.width / 2 + 'px';
        flyIcon.style.top = rect.top + rect.height / 2 + 'px';

        // Calculate the translation needed
        var dx = cartRect.left + cartRect.width / 2 - (rect.left + rect.width / 2);
        var dy = cartRect.top + cartRect.height / 2 - (rect.top + rect.height / 2);

        flyIcon.style.setProperty('--fly-dx', dx + 'px');
        flyIcon.style.setProperty('--fly-dy', dy + 'px');

        document.body.appendChild(flyIcon);

        // Use custom animation with computed target
        flyIcon.animate([
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'translate(' + (dx * 0.5) + 'px, ' + (dy * 0.3) + 'px) scale(0.7)', opacity: 0.8, offset: 0.4 },
            { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(0.2)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });

        setTimeout(function () { flyIcon.remove(); }, 650);
    }

    function initCart() {
        updateCartBadge();

        var cartBtn = document.getElementById('cart-btn');
        var drawerOverlay = document.getElementById('cart-drawer-overlay');
        var drawer = document.getElementById('cart-drawer');
        var drawerClose = document.getElementById('cart-drawer-close');
        var drawerBody = document.getElementById('cart-drawer-body');
        var drawerEmpty = document.getElementById('cart-drawer-empty');
        var drawerFooter = document.getElementById('cart-drawer-footer');
        var drawerCount = document.getElementById('cart-drawer-count');
        var summaryCount = document.getElementById('cart-summary-count');
        var clearBtn = document.getElementById('cart-clear-btn');
        var contactBtn = document.getElementById('cart-contact-btn');

        function openCartDrawer() {
            drawerOverlay.classList.add('active');
            drawer.classList.add('active');
            document.body.style.overflow = 'hidden';
            renderCartDrawer();
        }

        function closeCartDrawer() {
            drawerOverlay.classList.remove('active');
            drawer.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Open drawer on cart button click
        if (cartBtn) {
            cartBtn.addEventListener('click', function () {
                openCartDrawer();
            });
        }

        // Close drawer
        if (drawerClose) {
            drawerClose.addEventListener('click', closeCartDrawer);
        }
        if (drawerOverlay) {
            drawerOverlay.addEventListener('click', closeCartDrawer);
        }

        // Close on ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
                closeCartDrawer();
            }
        });

        // Clear all cart
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                var cart = getCart();
                if (cart.length === 0) return;
                cosmicConfirm(currentLang === 'en'
                    ? 'Remove all items from cart?'
                    : 'Xóa toàn bộ sản phẩm trong giỏ hàng?'
                ).then(function (yes) {
                    if (yes) {
                        saveCart([]);
                        updateCartBadge();
                        renderCartDrawer();
                        showToast(currentLang === 'en'
                            ? '🗑️ Cart cleared!'
                            : '🗑️ Đã xóa toàn bộ giỏ hàng!');
                    }
                });
            });
        }

        // Contact button - go to contact section
        if (contactBtn) {
            contactBtn.addEventListener('click', function () {
                closeCartDrawer();
                if (document.documentElement.classList.contains('embed-only')) {
                    window.location.href = 'index.html#contact';
                    return;
                }
                setTimeout(function () {
                    var contactSection = document.getElementById('contact');
                    if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 350);
            });
        }

        /** Render all cart items inside the drawer */
        function renderCartDrawer() {
            var cart = getCart();
            var totalItems = 0;
            cart.forEach(function (item) { totalItems += item.qty || 1; });

            // Update counts
            if (drawerCount) drawerCount.textContent = totalItems;
            if (summaryCount) summaryCount.textContent = totalItems;

            if (cart.length === 0) {
                // Show empty state
                drawerBody.style.display = 'none';
                drawerEmpty.style.display = '';
                drawerFooter.style.display = 'none';
                return;
            }

            // Show items
            drawerBody.style.display = '';
            drawerEmpty.style.display = 'none';
            drawerFooter.style.display = '';

            drawerBody.innerHTML = '';
            cart.forEach(function (item, idx) {
                var el = document.createElement('div');
                el.className = 'cart-item';
                el.style.animationDelay = (idx * 0.05) + 's';
                el.setAttribute('data-cart-id', item.id);

                var imgHtml = item.image
                    ? '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '" class="cart-item-img" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
                      + '<div class="cart-item-img-fallback" style="display:none"><i class="fas fa-image"></i></div>'
                    : '<div class="cart-item-img-fallback"><i class="fas fa-image"></i></div>';

                el.innerHTML =
                    imgHtml +
                    '<div class="cart-item-info">' +
                        '<div class="cart-item-name" title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</div>' +
                        '<div class="cart-item-price">' + escapeHtml(item.price) + '</div>' +
                        '<div class="cart-item-controls">' +
                            '<div class="cart-item-qty">' +
                                '<button type="button" class="cart-item-qty-btn" data-action="cart-qty-minus" data-id="' + item.id + '" aria-label="Giảm">' +
                                    '<i class="fas fa-minus"></i>' +
                                '</button>' +
                                '<span class="cart-item-qty-value">' + (item.qty || 1) + '</span>' +
                                '<button type="button" class="cart-item-qty-btn" data-action="cart-qty-plus" data-id="' + item.id + '" aria-label="Tăng">' +
                                    '<i class="fas fa-plus"></i>' +
                                '</button>' +
                            '</div>' +
                            '<button type="button" class="cart-item-remove" data-action="cart-remove" data-id="' + item.id + '" title="' + (currentLang === 'en' ? 'Remove' : 'Xóa') + '">' +
                                '<i class="fas fa-trash-alt"></i>' +
                            '</button>' +
                        '</div>' +
                    '</div>';

                drawerBody.appendChild(el);
            });
        }

        // Event delegation for cart drawer body actions
        if (drawerBody) {
            drawerBody.addEventListener('click', function (e) {
                var btn = e.target.closest('[data-action]');
                if (!btn) return;

                var action = btn.getAttribute('data-action');
                var id = btn.getAttribute('data-id');
                var cart = getCart();

                if (action === 'cart-qty-minus') {
                    for (var i = 0; i < cart.length; i++) {
                        if (cart[i].id === id) {
                            if ((cart[i].qty || 1) > 1) {
                                cart[i].qty--;
                            } else {
                                // Remove if qty goes to 0
                                var itemEl = btn.closest('.cart-item');
                                if (itemEl) {
                                    itemEl.classList.add('removing');
                                    setTimeout(function () {
                                        var c = getCart().filter(function (ci) { return ci.id !== id; });
                                        saveCart(c);
                                        updateCartBadge();
                                        renderCartDrawer();
                                    }, 350);
                                    return;
                                }
                            }
                            break;
                        }
                    }
                    saveCart(cart);
                    updateCartBadge();
                    renderCartDrawer();

                } else if (action === 'cart-qty-plus') {
                    for (var j = 0; j < cart.length; j++) {
                        if (cart[j].id === id) {
                            cart[j].qty = Math.min((cart[j].qty || 1) + 1, 99);
                            break;
                        }
                    }
                    saveCart(cart);
                    updateCartBadge();
                    renderCartDrawer();

                } else if (action === 'cart-remove') {
                    var cartItem = btn.closest('.cart-item');
                    if (cartItem) {
                        cartItem.classList.add('removing');
                        setTimeout(function () {
                            removeFromCart(id);
                            renderCartDrawer();
                        }, 350);
                    }
                }
            });
        }

        // Make renderCartDrawer accessible for external calls (e.g., after adding to cart)
        window._renderCartDrawer = renderCartDrawer;
    }

    // ╔══════════════════════════════════════╗
    // ║     USER AVATAR HELPERS             ║
    // ╚══════════════════════════════════════╝

    /** Update all avatar UI elements across the page */
    function refreshAllAvatars() {
        if (typeof CosmicAuth === 'undefined') return;
        var user = CosmicAuth.getCurrentUser();
        if (!user) return;

        var avatarUrl = user.avatar;

        // Nav avatar
        var navImg = document.getElementById('nav-avatar-img');
        var navFallback = document.getElementById('nav-avatar-fallback');
        if (navImg) {
            if (avatarUrl) {
                navImg.src = avatarUrl;
                navImg.classList.add('has-avatar');
                if (navFallback) navFallback.classList.add('hidden');
                navImg.onerror = function () {
                    navImg.classList.remove('has-avatar');
                    if (navFallback) navFallback.classList.remove('hidden');
                };
            } else {
                navImg.classList.remove('has-avatar');
                if (navFallback) navFallback.classList.remove('hidden');
            }
        }

        // Dropdown avatar
        var ddImg = document.getElementById('dropdown-avatar-img');
        var ddFallback = document.getElementById('dropdown-avatar-fallback');
        if (ddImg) {
            if (avatarUrl) {
                ddImg.src = avatarUrl;
                ddImg.classList.add('has-avatar');
                if (ddFallback) ddFallback.classList.add('hidden');
                ddImg.onerror = function () {
                    ddImg.classList.remove('has-avatar');
                    if (ddFallback) ddFallback.classList.remove('hidden');
                };
            } else {
                ddImg.classList.remove('has-avatar');
                if (ddFallback) ddFallback.classList.remove('hidden');
            }
        }

        // Profile modal avatar
        var pmImg = document.getElementById('pm-avatar-img');
        var pmFallback = document.getElementById('pm-avatar-fallback');
        if (pmImg) {
            if (avatarUrl) {
                pmImg.src = avatarUrl;
                pmImg.classList.add('has-avatar');
                if (pmFallback) pmFallback.classList.add('hidden');
                pmImg.onerror = function () {
                    pmImg.classList.remove('has-avatar');
                    if (pmFallback) pmFallback.classList.remove('hidden');
                };
            } else {
                pmImg.classList.remove('has-avatar');
                if (pmFallback) pmFallback.classList.remove('hidden');
            }
        }

        // Profile modal cover
        var coverImg = document.getElementById('pm-cover-img');
        var coverFallback = document.getElementById('pm-cover-fallback');
        var coverUrl = user.coverPhoto;
        if (coverImg) {
            if (coverUrl) {
                coverImg.src = coverUrl;
                coverImg.classList.add('has-cover');
                if (coverFallback) coverFallback.classList.add('hidden');
                coverImg.onerror = function () {
                    coverImg.classList.remove('has-cover');
                    if (coverFallback) coverFallback.classList.remove('hidden');
                };
            } else {
                coverImg.classList.remove('has-cover');
                if (coverFallback) coverFallback.classList.remove('hidden');
            }
        }
    }

    // ╔══════════════════════════════════════╗
    // ║     PROFILE DROPDOWN & MODAL        ║
    // ╚══════════════════════════════════════╝

    function initProfileDropdown() {
        var avatarBtn = document.getElementById('nav-avatar-btn');
        var dropdown = document.getElementById('user-dropdown');
        if (!avatarBtn || !dropdown) return;

        avatarBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        document.addEventListener('click', function (e) {
            if (!dropdown.contains(e.target) && !avatarBtn.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // View profile link
        var viewProfileLink = document.getElementById('view-profile-link');
        if (viewProfileLink) {
            viewProfileLink.addEventListener('click', function () {
                dropdown.classList.remove('active');
                openProfileModal();
            });
        }

        // View settings link
        var viewSettingsLink = document.getElementById('view-settings-link');
        if (viewSettingsLink) {
            viewSettingsLink.addEventListener('click', function () {
                dropdown.classList.remove('active');
                openSettingsModal();
            });
        }

        // Logout
        var logoutBtn = document.getElementById('dropdown-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                dropdown.classList.remove('active');
                cosmicConfirm(currentLang === 'en' ? 'Are you sure you want to sign out?' : 'Bạn có chắc muốn đăng xuất?').then(function (yes) {
                    if (yes) CosmicAuth.logout();
                });
            });
        }
    }

    function openProfileModal() {
        var overlay = document.getElementById('profile-modal-overlay');
        if (!overlay) return;

        var user = CosmicAuth.getCurrentUser();
        if (!user) return;

        // Fill user info
        var usernameEl = document.getElementById('pm-username');
        var emailEl = document.getElementById('pm-email');
        var roleBadge = document.getElementById('pm-role-badge');
        var joinDate = document.getElementById('pm-join-date');

        if (usernameEl) usernameEl.textContent = user.displayName || user.username;
        if (emailEl) emailEl.textContent = user.email;
        if (roleBadge) {
            roleBadge.textContent = user.role === CosmicAuth.ROLES.ADMIN ? 'ADMIN' : 'MEMBER';
            roleBadge.className = 'pm-role-badge ' + (user.role === CosmicAuth.ROLES.ADMIN ? 'admin' : 'guest');
        }
        if (joinDate && user.createdAt) {
            var d = new Date(user.createdAt);
            joinDate.textContent = d.toLocaleDateString('vi-VN');
        }

        refreshAllAvatars();
        overlay.classList.add('active');
    }

    function closeProfileModal() {
        var overlay = document.getElementById('profile-modal-overlay');
        if (overlay) overlay.classList.remove('active');
    }

    function initProfileModal() {
        // Close button
        var closeBtn = document.getElementById('profile-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeProfileModal);
        }

        // Close on overlay click
        var overlay = document.getElementById('profile-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) closeProfileModal();
            });
        }

        // ESC to close
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
                closeProfileModal();
            }
        });

        // ---- Avatar file upload ----
        var avatarFileInput = document.getElementById('avatar-file-upload');
        if (avatarFileInput) {
            avatarFileInput.addEventListener('change', function (e) {
                var file = e.target.files[0];
                if (!file) return;
                if (file.size > 2 * 1024 * 1024) {
                    showToast('⚠️ Ảnh quá lớn! Tối đa 2MB.', 'warning');
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (ev) {
                    var dataUrl = ev.target.result;
                    CosmicAuth.updateCurrentUserProfile({ avatar: dataUrl });
                    refreshAllAvatars();
                    showToast('✅ Đã cập nhật ảnh đại diện!');
                };
                reader.readAsDataURL(file);
            });
        }

        // ---- Cover file upload ----
        var coverFileInput = document.getElementById('cover-file-upload');
        if (coverFileInput) {
            coverFileInput.addEventListener('change', function (e) {
                var file = e.target.files[0];
                if (!file) return;
                if (file.size > 4 * 1024 * 1024) {
                    showToast('⚠️ Ảnh quá lớn! Tối đa 4MB.', 'warning');
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (ev) {
                    var dataUrl = ev.target.result;
                    CosmicAuth.updateCurrentUserProfile({ coverPhoto: dataUrl });
                    refreshAllAvatars();
                    showToast('✅ Đã cập nhật ảnh bìa!');
                };
                reader.readAsDataURL(file);
            });
        }
    }

    // ╔══════════════════════════════════════╗
    // ║     SETTINGS MODAL                  ║
    // ╚══════════════════════════════════════╝

    function openSettingsModal() {
        var overlay = document.getElementById('settings-modal-overlay');
        if (overlay) overlay.classList.add('active');
    }

    function closeSettingsModal() {
        var overlay = document.getElementById('settings-modal-overlay');
        if (overlay) overlay.classList.remove('active');
        // Clear inputs
        var cur = document.getElementById('current-password');
        var newPw = document.getElementById('new-password');
        var conf = document.getElementById('confirm-password');
        if (cur) cur.value = '';
        if (newPw) newPw.value = '';
        if (conf) conf.value = '';
    }

    function initSettingsModal() {
        // Close button
        var closeBtn = document.getElementById('settings-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeSettingsModal);
        }

        // Close on overlay click
        var overlay = document.getElementById('settings-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) closeSettingsModal();
            });
        }

        // ESC to close
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
                closeSettingsModal();
            }
        });

        // Save password
        var saveBtn = document.getElementById('save-password-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function () {
                var currentPw = document.getElementById('current-password').value;
                var newPw = document.getElementById('new-password').value;
                var confirmPw = document.getElementById('confirm-password').value;

                if (!currentPw || !newPw || !confirmPw) {
                    showToast(currentLang === 'en' ? '⚠️ Please fill in all fields!' : '⚠️ Vui lòng điền đầy đủ các trường!', 'warning');
                    return;
                }

                if (newPw.length < 6) {
                    showToast(currentLang === 'en' ? '⚠️ New password must be at least 6 characters!' : '⚠️ Mật khẩu mới phải có ít nhất 6 ký tự!', 'warning');
                    return;
                }

                if (newPw !== confirmPw) {
                    showToast(currentLang === 'en' ? '⚠️ Passwords do not match!' : '⚠️ Mật khẩu xác nhận không khớp!', 'warning');
                    return;
                }

                // Verify current password and update
                if (typeof CosmicAuth !== 'undefined') {
                    var session = CosmicAuth.getSession();
                    if (!session) return;

                    var users = JSON.parse(localStorage.getItem('cosmic_users') || '[]');
                    var userIndex = -1;
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].username === session.username) {
                            userIndex = i;
                            break;
                        }
                    }

                    if (userIndex === -1) {
                        showToast('⚠️ Lỗi: Không tìm thấy user!', 'warning');
                        return;
                    }

                    // Simple password check (in production, use hashing)
                    if (users[userIndex].password !== currentPw) {
                        showToast(currentLang === 'en' ? '⚠️ Current password is incorrect!' : '⚠️ Mật khẩu hiện tại không đúng!', 'warning');
                        return;
                    }

                    // Update password
                    users[userIndex].password = newPw;
                    localStorage.setItem('cosmic_users', JSON.stringify(users));
                    showToast(currentLang === 'en' ? '✅ Password changed successfully!' : '✅ Đổi mật khẩu thành công!');
                    closeSettingsModal();
                }
            });
        }
    }

    // ╔══════════════════════════════════════╗
    // ║     AUTH UI (Welcome + Nav Tools)    ║
    // ╚══════════════════════════════════════╝

    function initAuthUI() {
        if (typeof CosmicAuth === 'undefined') return;

        var session = CosmicAuth.getSession();
        if (!session) return;

        var user = CosmicAuth.getCurrentUser();

        // ---- Welcome Section ----
        var welcomeUsername = document.getElementById('welcome-username');
        if (welcomeUsername) {
            welcomeUsername.textContent = 'StorePremium';
        }

        // ---- Welcome Stats ----
        var statProducts = document.getElementById('stat-products');
        if (statProducts) {
            var products = getProducts();
            statProducts.textContent = products.length;
        }

        var statRole = document.getElementById('stat-role');
        if (statRole) {
            statRole.textContent = session.role === CosmicAuth.ROLES.ADMIN ? 'ADMIN' : 'MEMBER';
        }

        // ---- Dropdown User Info ----
        var ddUsername = document.getElementById('dropdown-username');
        if (ddUsername) {
            ddUsername.textContent = user ? (user.displayName || user.username) : session.username;
        }

        var ddRoleBadge = document.getElementById('dropdown-role-badge');
        if (ddRoleBadge) {
            if (session.role === CosmicAuth.ROLES.ADMIN) {
                ddRoleBadge.textContent = 'Admin';
                ddRoleBadge.classList.add('admin');
            } else {
                ddRoleBadge.textContent = 'Member';
                ddRoleBadge.classList.add('guest');
            }
        }

        // ---- Admin Button ----
        var adminBtn = document.getElementById('admin-btn');
        if (adminBtn) {
            adminBtn.style.display = CosmicAuth.isAdmin() ? '' : 'none';
        }

        // ---- Refresh Avatars ----
        refreshAllAvatars();
    }

    // ╔══════════════════════════════════════╗
    // ║     SHARE TUT FREE SYSTEM           ║
    // ╚══════════════════════════════════════╝

    function getTuts() {
        try { return JSON.parse(localStorage.getItem('cosmic_tuts') || '[]'); }
        catch (e) { return []; }
    }

    function saveTuts(tuts) {
        localStorage.setItem('cosmic_tuts', JSON.stringify(tuts));
        // Sync to Firebase
        if (typeof CosmicSync !== 'undefined' && CosmicSync.isReady()) {
            CosmicSync.saveTuts(tuts);
        }
    }

    function renderShareTutSection() {
        var tuts = getTuts();
        var emptyEl = document.querySelector('.share-tut-empty');
        var container = document.querySelector('.share-tut .container');
        if (!container) return;

        var existingGrid = document.getElementById('tuts-display-grid');
        if (existingGrid) existingGrid.remove();

        if (tuts.length === 0) {
            if (emptyEl) emptyEl.style.display = '';
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';

        var grid = document.createElement('div');
        grid.id = 'tuts-display-grid';
        grid.className = 'products-grid share-tut-grid';

        tuts.forEach(function (tut) {
            var card = document.createElement('div');
            card.className = 'product-card tut-card-click reveal revealed';
            card.setAttribute('data-tut-id', tut.id);
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', 'Xem ghi chú: ' + (tut.title || ''));

            var linkHtml = tut.link
                ? '<a href="' + escapeHtml(tut.link) + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-full tut-card-external-link"><i class="fas fa-external-link-alt"></i> Mở link tut</a>'
                : '';

            card.innerHTML =
                '<div class="product-info tut-card-inner">' +
                    '<div class="tut-card-badge-row"><i class="fas fa-share-alt"></i> <span>FREE TUT</span></div>' +
                    '<h3 class="product-name">' + escapeHtml(tut.title) + '</h3>' +
                    '<p class="tut-card-hint">Nhấn để xem ghi chú</p>' +
                    linkHtml +
                '</div>';
            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    function renderAdminTuts() {
        var tuts = getTuts();
        var list = document.getElementById('admin-tuts-list');
        if (!list) return;
        list.innerHTML = '';

        if (tuts.length === 0) {
            list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem 0;">Chưa có tut nào</p>';
            return;
        }

        tuts.forEach(function (tut) {
            var item = document.createElement('div');
            item.className = 'admin-product-item';

            var thumbHtml = '<div class="admin-product-thumb" style="display:flex;align-items:center;justify-content:center;color:var(--text-muted)"><i class="fas fa-share-alt"></i></div>';

            item.innerHTML = thumbHtml +
                '<div class="admin-product-info">' +
                    '<h5>' + escapeHtml(tut.title) + '</h5>' +
                    '<span>FREE</span>' +
                '</div>' +
                '<div class="admin-product-actions">' +
                    '<button class="edit-btn" data-action="edit-tut" data-id="' + tut.id + '" title="Sửa"><i class="fas fa-pen"></i></button>' +
                    '<button class="delete-btn" data-action="delete-tut" data-id="' + tut.id + '" title="Xóa"><i class="fas fa-trash"></i></button>' +
                '</div>';
            list.appendChild(item);
        });

        // Event delegation for edit/delete
        list.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-action]');
            if (!btn) return;
            var action = btn.getAttribute('data-action');
            var id = btn.getAttribute('data-id');

            if (action === 'edit-tut') {
                editTut(id);
            } else if (action === 'delete-tut') {
                cosmicConfirm('Bạn có chắc muốn xóa tut này? Hành động này không thể hoàn tác.').then(function (yes) {
                    if (yes) deleteTut(id);
                });
            }
        });
    }

    function editTut(id) {
        var tuts = getTuts();
        var tut = null;
        for (var i = 0; i < tuts.length; i++) {
            if (tuts[i].id === id) { tut = tuts[i]; break; }
        }
        if (!tut) return;

        document.getElementById('tut-edit-id').value = tut.id;
        document.getElementById('tut-title-input').value = tut.title;
        document.getElementById('tut-desc-input').value = tut.notes || '';
        document.getElementById('tut-link-input').value = tut.link || '';
        document.getElementById('tut-form-title').textContent = 'Sửa Tut';

        var tutModal = document.getElementById('tut-form-modal');
        if (tutModal) tutModal.classList.add('active');
    }

    function deleteTut(id) {
        var tuts = getTuts().filter(function (t) { return t.id !== id; });
        saveTuts(tuts);
        renderAdminTuts();
        renderShareTutSection();
        showToast('✅ Đã xóa tut!');
    }

    function closeTutNotesModal() {
        var modal = document.getElementById('tut-notes-modal');
        if (modal) modal.classList.remove('active');
    }

    function openTutNotesModal(tutId) {
        var tuts = getTuts();
        var tut = null;
        for (var i = 0; i < tuts.length; i++) {
            if (tuts[i].id === tutId) {
                tut = tuts[i];
                break;
            }
        }
        if (!tut) return;

        var modal = document.getElementById('tut-notes-modal');
        var titleEl = document.getElementById('tut-notes-title');
        var bodyEl = document.getElementById('tut-notes-body');
        var linkWrap = document.getElementById('tut-notes-link-wrap');
        if (!modal || !titleEl || !bodyEl) return;

        titleEl.textContent = tut.title || 'Ghi chú';
        var notesText = (tut.notes && String(tut.notes).trim()) ? String(tut.notes).trim() : '';
        bodyEl.textContent = notesText;
        bodyEl.classList.toggle('is-empty', !notesText);

        if (linkWrap) {
            linkWrap.innerHTML = '';
            if (tut.link) {
                var a = document.createElement('a');
                a.href = tut.link;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = 'btn btn-primary btn-full';
                a.innerHTML = '<i class="fas fa-external-link-alt"></i> Mở link tut';
                linkWrap.appendChild(a);
            }
        }

        modal.classList.add('active');
    }

    function initTutNotesModal() {
        var shareSection = document.getElementById('share-tut');
        if (shareSection) {
            shareSection.addEventListener('click', function (e) {
                if (e.target.closest('.tut-card-external-link')) return;
                var card = e.target.closest('.tut-card-click');
                if (!card) return;
                var id = card.getAttribute('data-tut-id');
                if (id) openTutNotesModal(id);
            });
            shareSection.addEventListener('keydown', function (e) {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                var card = e.target.closest('.tut-card-click');
                if (!card || !shareSection.contains(card)) return;
                e.preventDefault();
                var id = card.getAttribute('data-tut-id');
                if (id) openTutNotesModal(id);
            });
        }

        var modal = document.getElementById('tut-notes-modal');
        if (modal) {
            var closeBtn = document.getElementById('tut-notes-modal-close');
            var overlay = modal.querySelector('.modal-overlay');
            if (closeBtn) closeBtn.addEventListener('click', closeTutNotesModal);
            if (overlay) overlay.addEventListener('click', closeTutNotesModal);
        }
    }

    function initTutSystem() {
        renderShareTutSection();

        // Add tut button
        var addBtn = document.getElementById('add-tut-btn');
        if (addBtn) {
            addBtn.addEventListener('click', function () {
                document.getElementById('tut-edit-id').value = '';
                document.getElementById('tut-form').reset();
                document.getElementById('tut-form-title').textContent = 'Thêm Tut Mới';
                var tutModal = document.getElementById('tut-form-modal');
                if (tutModal) tutModal.classList.add('active');
            });
        }

        // Tut form submit
        var tutForm = document.getElementById('tut-form');
        if (tutForm) {
            tutForm.addEventListener('submit', function (e) {
                e.preventDefault();
                var editId = document.getElementById('tut-edit-id').value;
                var title = document.getElementById('tut-title-input').value.trim();
                var notes = document.getElementById('tut-desc-input').value.trim();
                var link = document.getElementById('tut-link-input').value.trim();

                if (!title) {
                    showToast('⚠️ Vui lòng nhập tiêu đề!', 'warning');
                    return;
                }

                var tuts = getTuts();
                if (editId) {
                    for (var i = 0; i < tuts.length; i++) {
                        if (tuts[i].id === editId) {
                            tuts[i].title = title;
                            tuts[i].notes = notes;
                            tuts[i].link = link;
                            break;
                        }
                    }
                    showToast('✅ Đã cập nhật tut!');
                } else {
                    tuts.push({
                        id: 'tut_' + Date.now(),
                        title: title,
                        notes: notes,
                        link: link,
                        createdAt: new Date().toISOString()
                    });
                    showToast('✅ Đã thêm tut mới!');
                }

                saveTuts(tuts);
                renderAdminTuts();
                renderShareTutSection();

                var tutModal = document.getElementById('tut-form-modal');
                if (tutModal) tutModal.classList.remove('active');
                tutForm.reset();
            });
        }

        // Close tut modal
        var tutModal = document.getElementById('tut-form-modal');
        if (tutModal) {
            var closeBtn = tutModal.querySelector('.modal-close');
            var overlay = tutModal.querySelector('.modal-overlay');
            if (closeBtn) closeBtn.addEventListener('click', function () { tutModal.classList.remove('active'); });
            if (overlay) overlay.addEventListener('click', function () { tutModal.classList.remove('active'); });
        }

        initTutNotesModal();
    }

    // ╔══════════════════════════════════════╗
    // ║     CATEGORY SYSTEM                  ║
    // ╚══════════════════════════════════════╝

    function getCategories() {
        try {
            var data = localStorage.getItem('cosmic_categories');
            return data ? JSON.parse(data) : [];
        } catch (e) { return []; }
    }

    function saveCategories(cats) {
        try {
            localStorage.setItem('cosmic_categories', JSON.stringify(cats));
            // Sync to Firebase
            if (typeof CosmicSync !== 'undefined' && CosmicSync.isReady()) {
                CosmicSync.saveCategories(cats);
            }
        } catch (e) {
            console.error('Lỗi lưu categories:', e);
        }
    }

    function generateCategoryId() {
        return 'cat' + Date.now() + Math.random().toString(36).substr(2, 4);
    }

    function populateCategoryDropdown(selectedId) {
        var sel = document.getElementById('product-category-input');
        if (!sel) return;
        var cats = getCategories();
        sel.innerHTML = '<option value="">-- Chọn danh mục --</option>';
        cats.forEach(function (cat) {
            var opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = cat.name;
            if (selectedId && cat.id === selectedId) opt.selected = true;
            sel.appendChild(opt);
        });
    }

    function renderAdminCategories() {
        var cats = getCategories();
        var products = getProducts();
        var list = document.getElementById('admin-categories-list');
        if (!list) return;
        list.innerHTML = '';

        if (cats.length === 0) {
            list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem 0;">Chưa có danh mục nào</p>';
            return;
        }

        cats.forEach(function (cat) {
            var count = products.filter(function (p) { return p.categoryId === cat.id; }).length;
            var item = document.createElement('div');
            item.className = 'admin-category-item';

            var thumbHtml = cat.image
                ? '<img src="' + escapeHtml(cat.image) + '" class="admin-category-thumb" onerror="this.style.display=\'none\'">'
                : '<div class="admin-category-thumb" style="display:flex;align-items:center;justify-content:center"><i class="fas fa-layer-group"></i></div>';

            item.innerHTML = thumbHtml +
                '<div class="admin-category-info"><h5>' + escapeHtml(cat.name) + '</h5><span>' + count + ' sản phẩm</span></div>' +
                '<div class="admin-product-actions">' +
                    '<button class="delete-btn" data-catid="' + cat.id + '" title="Xóa"><i class="fas fa-trash"></i></button>' +
                '</div>';

            item.querySelector('[data-catid]').addEventListener('click', function () {
                var prodCount = products.filter(function (p) { return p.categoryId === cat.id; }).length;
                var msg = prodCount > 0
                    ? 'Danh mục "' + cat.name + '" có ' + prodCount + ' sản phẩm. Xóa sẽ gỡ nhóm khỏi các sản phẩm đó. Tiếp tục?'
                    : 'Xóa danh mục "' + cat.name + '"?';
                cosmicConfirm(msg).then(function (yes) {
                    if (!yes) return;
                    if (prodCount > 0) {
                        var prods2 = getProducts();
                        prods2.forEach(function (p) { if (p.categoryId === cat.id) p.categoryId = ''; });
                        saveProducts(prods2);
                    }
                    saveCategories(getCategories().filter(function (c) { return c.id !== cat.id; }));
                    renderAdminCategories();
                    renderProducts();
                    showToast('🗑️ Đã xóa danh mục!');
                });
            });

            list.appendChild(item);
        });
    }

    function initCategoryScrollSpy() {
        var filterNav = document.getElementById('category-filter-nav');
        if (!filterNav || !filterNav.children.length) return;
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                var sections = document.querySelectorAll('.category-section');
                var scrollY = window.scrollY + 200;
                var currentId = null;
                sections.forEach(function (sec) {
                    if (sec.offsetTop <= scrollY) currentId = sec.id.replace('category-', '');
                });
                if (currentId) {
                    filterNav.querySelectorAll('.cat-filter-btn').forEach(function (btn) {
                        btn.classList.toggle('active', btn.getAttribute('data-cat-id') === currentId);
                    });
                }
                ticking = false;
            });
        }, { passive: true });
    }

    function initCategorySystem() {
        var catForm = document.getElementById('category-form');
        var catImageFile = document.getElementById('category-image-file');
        var catImageHidden = document.getElementById('category-image');
        var catImageName = document.getElementById('category-image-name');
        var catNameError = document.getElementById('category-name-error');

        if (catImageFile) {
            catImageFile.addEventListener('change', function () {
                var file = catImageFile.files[0];
                if (!file) return;
                if (file.size > 2 * 1024 * 1024) { showToast('⚠️ Ảnh quá lớn (tối đa 2MB)', 'warning'); return; }
                var reader = new FileReader();
                reader.onload = function (e) {
                    catImageHidden.value = e.target.result;
                    catImageName.textContent = file.name;
                };
                reader.readAsDataURL(file);
            });
        }

        if (catForm) {
            catForm.addEventListener('submit', function (e) {
                e.preventDefault();
                var nameInput = document.getElementById('category-name-input');
                var name = nameInput.value.trim();
                if (catNameError) catNameError.textContent = '';
                if (!name) { if (catNameError) catNameError.textContent = 'Vui lòng nhập tên danh mục'; return; }

                var cats = getCategories();
                if (cats.some(function (c) { return c.name.toLowerCase() === name.toLowerCase(); })) {
                    if (catNameError) catNameError.textContent = 'Tên danh mục đã tồn tại!';
                    return;
                }

                cats.push({ id: generateCategoryId(), name: name, image: (catImageHidden && catImageHidden.value) || '', createdAt: new Date().toISOString() });
                saveCategories(cats);
                catForm.reset();
                if (catImageHidden) catImageHidden.value = '';
                if (catImageName) catImageName.textContent = 'Chưa chọn ảnh';
                renderAdminCategories();
                populateCategoryDropdown();
                renderProducts();
                showToast('✅ Đã tạo danh mục "' + name + '"!');
            });
        }

        renderAdminCategories();
        populateCategoryDropdown();
    }

    // ╔══════════════════════════════════════╗
    // ║        KHỞI CHẠY ỨNG DỤNG           ║
    // ╚══════════════════════════════════════╝

    function init() {
        applyEmbedMode();
        hideLoadingScreen();
        initAuthUI();
        renderProfile();
        initCategorySystem();
        renderProducts();
        initNavigation();
        initScrollReveal();
        revealEmbedSectionContent();
        initBackToTop();
        initAdminPanel();
        initProductActions();
        initModals();
        initContactForm();
        initSmoothScroll();
        initLanguageSwitcher();
        initCart();
        initProfileDropdown();
        initProfileModal();
        initSettingsModal();
        initTutSystem();
        renderAdminTuts();

        // ── Initialize Firebase Sync ──
        if (typeof CosmicSync !== 'undefined') {
            CosmicSync.init({
                profile: function () {
                    renderProfile();
                },
                products: function () {
                    renderProducts();
                    renderAdminProducts();
                    // Update stat count
                    var statProducts = document.getElementById('stat-products');
                    if (statProducts) statProducts.textContent = getProducts().length;
                },
                categories: function () {
                    renderAdminCategories();
                    populateCategoryDropdown();
                    renderProducts();
                },
                tuts: function () {
                    renderShareTutSection();
                    renderAdminTuts();
                },
                users: function () {
                    // Users updated remotely — refresh auth UI
                    initAuthUI();
                }
            });
        }

        console.log('🌌 Cosmic Portfolio đã khởi chạy thành công!');
    }

    // Chờ DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
