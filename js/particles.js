/* ========================================
   COSMIC PORTFOLIO - Particle Effects
   Canvas-based: Star field + Mouse trail
   ======================================== */

(function () {
    'use strict';

    // ===== STARFIELD (Nền sao vũ trụ) =====
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let stars = [];
    let shootingStars = [];
    let mouseX = 0, mouseY = 0;
    let animFrameId;

    // Số lượng sao dựa trên kích thước màn hình
    function getStarCount() {
        const area = width * height;
        return Math.min(Math.floor(area / 3500), 350);
    }

    // Tạo 1 ngôi sao
    function createStar() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.8 + 0.3,
            opacity: Math.random() * 0.7 + 0.2,
            twinkleSpeed: Math.random() * 0.015 + 0.005,
            twinkleOffset: Math.random() * Math.PI * 2,
            driftX: (Math.random() - 0.5) * 0.04,
            driftY: (Math.random() - 0.5) * 0.02,
        };
    }

    // Tạo sao băng
    function createShootingStar() {
        const side = Math.random();
        return {
            x: side > 0.5 ? Math.random() * width : -50,
            y: Math.random() * height * 0.5,
            length: Math.random() * 80 + 40,
            speed: Math.random() * 6 + 4,
            angle: Math.PI / 6 + Math.random() * 0.3,
            opacity: 1,
            decay: Math.random() * 0.015 + 0.008,
            size: Math.random() * 1.2 + 0.5,
        };
    }

    // Khởi tạo kích thước canvas
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    // Khởi tạo sao
    function initStars() {
        stars = [];
        const count = getStarCount();
        for (let i = 0; i < count; i++) {
            stars.push(createStar());
        }
    }

    // Vẽ tinh vân mờ
    function drawNebula(time) {
        // Tinh vân tím
        const nebulaGrad1 = ctx.createRadialGradient(
            width * 0.7 + Math.sin(time * 0.0002) * 50,
            height * 0.3 + Math.cos(time * 0.0003) * 30,
            0,
            width * 0.7,
            height * 0.3,
            width * 0.4
        );
        nebulaGrad1.addColorStop(0, 'rgba(124, 58, 237, 0.025)');
        nebulaGrad1.addColorStop(0.5, 'rgba(124, 58, 237, 0.008)');
        nebulaGrad1.addColorStop(1, 'transparent');
        ctx.fillStyle = nebulaGrad1;
        ctx.fillRect(0, 0, width, height);

        // Tinh vân xanh
        const nebulaGrad2 = ctx.createRadialGradient(
            width * 0.2 + Math.cos(time * 0.00015) * 40,
            height * 0.7 + Math.sin(time * 0.00025) * 25,
            0,
            width * 0.2,
            height * 0.7,
            width * 0.35
        );
        nebulaGrad2.addColorStop(0, 'rgba(59, 130, 246, 0.02)');
        nebulaGrad2.addColorStop(0.5, 'rgba(6, 182, 212, 0.008)');
        nebulaGrad2.addColorStop(1, 'transparent');
        ctx.fillStyle = nebulaGrad2;
        ctx.fillRect(0, 0, width, height);
    }

    // Vẽ sao
    function drawStars(time) {
        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            
            // Nhấp nháy
            const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
            const alpha = s.opacity * (0.6 + twinkle * 0.4);
            
            // Di chuyển nhẹ
            s.x += s.driftX;
            s.y += s.driftY;

            // Parallax khi di chuột
            const parallaxX = (mouseX - width / 2) * 0.0003 * s.size;
            const parallaxY = (mouseY - height / 2) * 0.0003 * s.size;

            const drawX = s.x + parallaxX;
            const drawY = s.y + parallaxY;

            // Giữ sao trong phạm vi
            if (s.x > width + 10) s.x = -10;
            if (s.x < -10) s.x = width + 10;
            if (s.y > height + 10) s.y = -10;
            if (s.y < -10) s.y = height + 10;

            // Vẽ sao
            ctx.beginPath();
            ctx.arc(drawX, drawY, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 220, 255, ${alpha})`;
            ctx.fill();

            // Glow cho sao lớn
            if (s.size > 1.2) {
                ctx.beginPath();
                ctx.arc(drawX, drawY, s.size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180, 170, 255, ${alpha * 0.15})`;
                ctx.fill();
            }
        }
    }

    // Vẽ sao băng
    function drawShootingStars() {
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const ss = shootingStars[i];
            
            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.opacity -= ss.decay;

            if (ss.opacity <= 0 || ss.x > width + 100 || ss.y > height + 100) {
                shootingStars.splice(i, 1);
                continue;
            }

            const tailX = ss.x - Math.cos(ss.angle) * ss.length;
            const tailY = ss.y - Math.sin(ss.angle) * ss.length;

            const grad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
            grad.addColorStop(0.3, `rgba(180, 160, 255, ${ss.opacity * 0.5})`);
            grad.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(tailX, tailY);
            ctx.strokeStyle = grad;
            ctx.lineWidth = ss.size;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Điểm sáng đầu sao băng
            ctx.beginPath();
            ctx.arc(ss.x, ss.y, ss.size + 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity * 0.8})`;
            ctx.fill();
        }
    }

    // Vòng lặp animation chính
    function animate(time) {
        ctx.clearRect(0, 0, width, height);

        drawNebula(time);
        drawStars(time);
        drawShootingStars();

        // Sao băng ngẫu nhiên
        if (Math.random() < 0.003) {
            shootingStars.push(createShootingStar());
        }

        animFrameId = requestAnimationFrame(animate);
    }

    // ===== MOUSE TRAIL (Vệt chuột vũ trụ) =====
    const trailParticles = [];
    const MAX_TRAIL = 25;

    function createTrailParticle(x, y) {
        const colors = [
            'rgba(124, 58, 237, 0.7)',
            'rgba(99, 102, 241, 0.6)',
            'rgba(59, 130, 246, 0.5)',
            'rgba(6, 182, 212, 0.5)',
            'rgba(168, 85, 247, 0.6)',
        ];
        return {
            x: x,
            y: y,
            size: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            life: 1,
            decay: Math.random() * 0.03 + 0.02,
        };
    }

    function updateTrail() {
        for (let i = trailParticles.length - 1; i >= 0; i--) {
            const p = trailParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            p.size *= 0.98;

            if (p.life <= 0 || p.size < 0.1) {
                trailParticles.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.life * 0.5})`);
            ctx.fill();
        }
    }

    // Gắn vào vòng lặp animation chính (ghi đè)
    function animateWithTrail(time) {
        ctx.clearRect(0, 0, width, height);

        drawNebula(time);
        drawStars(time);
        drawShootingStars();
        updateTrail();

        if (Math.random() < 0.003) {
            shootingStars.push(createShootingStar());
        }

        animFrameId = requestAnimationFrame(animateWithTrail);
    }

    // ===== EVENT LISTENERS =====
    let lastTrailTime = 0;

    window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Cursor glow
        const cursorGlow = document.getElementById('cursor-glow');
        if (cursorGlow) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.classList.add('active');
        }

        // Mouse trail - giới hạn tốc độ tạo particle
        const now = Date.now();
        if (now - lastTrailTime > 30 && trailParticles.length < MAX_TRAIL) {
            trailParticles.push(createTrailParticle(e.clientX, e.clientY));
            lastTrailTime = now;
        }
    });

    window.addEventListener('mouseleave', function () {
        const cursorGlow = document.getElementById('cursor-glow');
        if (cursorGlow) cursorGlow.classList.remove('active');
    });

    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            resizeCanvas();
            initStars();
        }, 200);
    });

    // ===== KHỞI CHẠY =====
    resizeCanvas();
    initStars();
    animateWithTrail(0);

})();
