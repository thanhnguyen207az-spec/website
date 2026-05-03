/* ========================================
   COSMIC PORTFOLIO - Data Sync Module
   Đồng bộ dữ liệu qua Firebase Realtime DB
   ======================================== */

(function () {
    'use strict';

    // Data paths in Firebase
    var PATHS = {
        profile: 'cosmic/profile',
        products: 'cosmic/products',
        categories: 'cosmic/categories',
        tuts: 'cosmic/tuts',
        users: 'cosmic/users'
    };

    // localStorage keys (must match existing keys)
    var LOCAL_KEYS = {
        profile: 'cosmic_profile',
        products: 'cosmic_products',
        categories: 'cosmic_categories',
        tuts: 'cosmic_tuts',
        users: 'cosmic_users'
    };

    // Registered callbacks for when remote data changes
    var _callbacks = {};

    // Flag to prevent re-render loops during local saves
    var _localSaveInProgress = {};

    // Track if initial sync is done for each path
    var _initialSyncDone = {};

    /**
     * Check if Firebase is available
     */
    function isFirebaseReady() {
        return typeof window.cosmicDB !== 'undefined' && window.cosmicDB !== null;
    }

    /**
     * Get a Firebase database reference
     */
    function getRef(path) {
        if (!isFirebaseReady()) return null;
        return window.cosmicDB.ref(path);
    }

    /**
     * Read local data for a given key
     */
    function getLocalData(key, fallback) {
        try {
            var data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    /**
     * Save data to localStorage
     */
    function setLocalData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Lỗi lưu localStorage:', e);
        }
    }

    /**
     * Initialize a real-time listener for a data path.
     * On first load: if Firebase is empty, upload local data.
     * Then continuously listen for remote changes.
     */
    function initListener(name) {
        var ref = getRef(PATHS[name]);
        if (!ref) return;

        var localKey = LOCAL_KEYS[name];
        var fallback = (name === 'profile') ? null : [];

        ref.on('value', function (snapshot) {
            var remoteData = snapshot.val();

            if (remoteData === null && !_initialSyncDone[name]) {
                // Firebase is empty — push local data up (first-time sync)
                _initialSyncDone[name] = true;
                var localData = getLocalData(localKey, fallback);
                if (localData !== null && (Array.isArray(localData) ? localData.length > 0 : Object.keys(localData).length > 0)) {
                    ref.set(localData).then(function () {
                        console.log('📤 Đã upload ' + name + ' lên Firebase');
                    });
                }
                return;
            }

            _initialSyncDone[name] = true;

            // Skip if this was triggered by our own local save
            if (_localSaveInProgress[name]) {
                _localSaveInProgress[name] = false;
                return;
            }

            // Handle array data stored as object (Firebase converts arrays with gaps to objects)
            if (remoteData !== null && !Array.isArray(remoteData) && name !== 'profile') {
                // Convert Firebase object back to array
                var arr = [];
                Object.keys(remoteData).forEach(function (key) {
                    arr.push(remoteData[key]);
                });
                remoteData = arr;
            }

            // Update localStorage with remote data
            if (remoteData !== null) {
                setLocalData(localKey, remoteData);
            }

            // Notify registered callback (re-render UI)
            if (_callbacks[name]) {
                _callbacks[name](remoteData);
            }
        }, function (error) {
            console.error('❌ Lỗi lắng nghe ' + name + ':', error);
        });
    }

    /**
     * Save data to Firebase (and localStorage)
     */
    function saveToFirebase(name, data) {
        // Always save to localStorage first (offline fallback)
        setLocalData(LOCAL_KEYS[name], data);

        var ref = getRef(PATHS[name]);
        if (!ref) return;

        // Set flag to skip the listener callback for this save
        _localSaveInProgress[name] = true;

        ref.set(data).then(function () {
            // Success — data is in the cloud
        }).catch(function (error) {
            console.error('❌ Lỗi lưu ' + name + ' lên Firebase:', error);
            _localSaveInProgress[name] = false;
        });
    }

    // ╔══════════════════════════════════════╗
    // ║     PUBLIC SAVE FUNCTIONS            ║
    // ╚══════════════════════════════════════╝

    function saveProfile(profile) {
        saveToFirebase('profile', profile);
    }

    function saveProducts(products) {
        saveToFirebase('products', products);
    }

    function saveCategories(categories) {
        saveToFirebase('categories', categories);
    }

    function saveTuts(tuts) {
        saveToFirebase('tuts', tuts);
    }

    function saveUsers(users) {
        saveToFirebase('users', users);
    }

    // ╔══════════════════════════════════════╗
    // ║     CONNECTION STATUS                ║
    // ╚══════════════════════════════════════╝

    function initConnectionMonitor() {
        if (!isFirebaseReady()) {
            updateSyncIndicator('offline');
            return;
        }

        var connRef = window.cosmicDB.ref('.info/connected');
        connRef.on('value', function (snapshot) {
            if (snapshot.val() === true) {
                updateSyncIndicator('online');
            } else {
                updateSyncIndicator('offline');
            }
        });
    }

    function updateSyncIndicator(status) {
        var indicator = document.getElementById('sync-status');
        if (!indicator) return;

        var dot = indicator.querySelector('.sync-dot');
        var text = indicator.querySelector('.sync-text');
        if (!dot || !text) return;

        indicator.className = 'sync-status sync-' + status;

        if (status === 'online') {
            text.textContent = 'Đã đồng bộ';
        } else if (status === 'offline') {
            text.textContent = 'Ngoại tuyến';
        }
    }

    // ╔══════════════════════════════════════╗
    // ║     INITIALIZATION                   ║
    // ╚══════════════════════════════════════╝

    /**
     * Initialize the sync system.
     * @param {Object} callbacks - Map of data name to re-render functions
     *   { profile: fn, products: fn, categories: fn, tuts: fn, users: fn }
     */
    function init(callbacks) {
        if (!isFirebaseReady()) {
            console.warn('⚠️ Firebase không khả dụng — chạy ở chế độ offline');
            updateSyncIndicator('offline');
            return;
        }

        _callbacks = callbacks || {};

        // Set up real-time listeners for all synced data
        initListener('profile');
        initListener('products');
        initListener('categories');
        initListener('tuts');
        initListener('users');

        // Monitor connection status
        initConnectionMonitor();

        console.log('🔄 Hệ thống đồng bộ đã khởi tạo!');
    }

    // ╔══════════════════════════════════════╗
    // ║     EXPORT                           ║
    // ╚══════════════════════════════════════╝

    window.CosmicSync = {
        init: init,
        saveProfile: saveProfile,
        saveProducts: saveProducts,
        saveCategories: saveCategories,
        saveTuts: saveTuts,
        saveUsers: saveUsers,
        isReady: isFirebaseReady
    };

})();
