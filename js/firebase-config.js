/* ========================================
   COSMIC PORTFOLIO - Firebase Configuration
   Kết nối Firebase Realtime Database
   ======================================== */

(function () {
    'use strict';

    var firebaseConfig = {
        apiKey: "AIzaSyCqSTbWvFmBEANdTwI9poSmneQZx0wtGhU",
        authDomain: "website-6ad86.firebaseapp.com",
        databaseURL: "https://website-6ad86-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "website-6ad86",
        storageBucket: "website-6ad86.firebasestorage.app",
        messagingSenderId: "51127654882",
        appId: "1:51127654882:web:45ced4e8f390ccedc681bb",
        measurementId: "G-YKW4YFE5LM"
    };

    // Initialize Firebase (compat SDK)
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        window.cosmicDB = firebase.database();
        console.log('🔥 Firebase đã kết nối thành công!');
    } else {
        console.warn('⚠️ Firebase SDK chưa được tải. Chế độ offline.');
    }

})();
