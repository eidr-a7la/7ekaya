$(document).ready(function() {

    // 1. نظام المظهر (الداكن/الفاتح)
    var themeBtn = $('#a7la7ekaya-themeToggleBtn');
    if(themeBtn.length) {
        var themeIcon = themeBtn.find('i');
        if(localStorage.getItem('theme') === 'dark') {
            $('body').attr('data-theme', 'dark');
            themeIcon.attr('class', 'fa-solid fa-sun');
        }
        themeBtn.on('click', function() {
            if ($('body').attr('data-theme') === 'dark') {
                $('body').removeAttr('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcon.attr('class', 'fa-solid fa-moon');
            } else {
                $('body').attr('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.attr('class', 'fa-solid fa-sun');
            }
        });
    }

    // 2. نافذة تسجيل الدخول
    var loginBtn = $('#a7la7ekaya-openLoginBtn');
    var loginModal = $('#a7la7ekaya-loginModal');
    var closeModalBtn = $('#a7la7ekaya-closeModalBtn');
    if(loginBtn.length && loginModal.length){
        loginBtn.on('click', function(e) { 
            e.preventDefault(); 
            loginModal.addClass('a7la7ekaya-active'); 
        });
        closeModalBtn.on('click', function() { 
            loginModal.removeClass('a7la7ekaya-active'); 
        });
        $(window).on('click', function(e) { 
            if($(e.target).is(loginModal)) { loginModal.removeClass('a7la7ekaya-active'); }
        });
    }

    // 3. السلايدر (تم ربطه بالأزرار برمجياً لتجنب أخطاء onclick)
    var slides = $('.a7la7ekaya-slide');
    if(slides.length > 0) {
        var currentSlide = 0;
        function showSlide(index) { 
            slides.removeClass('a7la7ekaya-active'); 
            $(slides[index]).addClass('a7la7ekaya-active'); 
        }
        window.nextSlide = function() { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); }
        window.prevSlide = function() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; showSlide(currentSlide); }
        setInterval(window.nextSlide, 5000);
        
        // ربط الأزرار بالسلايدر
        $('.a7la7ekaya-next-btn').on('click', window.nextSlide);
        $('.a7la7ekaya-prev-btn').on('click', window.prevSlide);
    }

    // 4. الصعود للأعلى
    var backToTopBtn = $("#a7la7ekaya-backToTop");
    if(backToTopBtn.length) {
        $(window).on("scroll", function() { 
            if($(window).scrollTop() > 300) backToTopBtn.addClass("a7la7ekaya-show");
            else backToTopBtn.removeClass("a7la7ekaya-show");
        });
        backToTopBtn.on('click', function() { 
            $('html, body').animate({scrollTop: 0}, 'smooth'); 
        });
    }

    // 5. الألعاب النارية والصوت
    var takbeerBtn = $('#a7la7ekaya-takbeerBtn');
    var takbeerAudio = document.getElementById('a7la7ekaya-takbeerAudio');
    
    if(takbeerBtn.length && takbeerAudio) {
        // إنشاء الكانفاس برمجياً
        var canvas = document.createElement('canvas');
        canvas.style.position = 'fixed'; canvas.style.top = '0'; canvas.style.left = '0';
        canvas.style.width = '100vw'; canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none'; canvas.style.zIndex = '9998'; 
        canvas.style.transition = 'opacity 2s ease-in-out'; 
        document.body.appendChild(canvas);
        var ctx = canvas.getContext('2d', { willReadFrequently: true });

        var width, height, particles = [], textTargets = [], textFormingState = false;

        function resizeCanvas() { 
            width = window.innerWidth; height = window.innerHeight; 
            canvas.width = width; canvas.height = height; 
        }
        $(window).on('resize', resizeCanvas); 
        resizeCanvas();

        function generateTextTargets() {
            textTargets = [];
            var tempCanvas = document.createElement('canvas'); tempCanvas.width = width; tempCanvas.height = height;
            var tCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
            var fontSize = width < 768 ? 60 : 100; 
            tCtx.font = "900 " + fontSize + "px 'Cairo', sans-serif"; tCtx.fillStyle = "white"; tCtx.textBaseline = "middle";
            var yPosition = height - 120; 
            if(width < 768) {
                tCtx.textAlign = "center"; tCtx.fillText("كل عام وأنتم بخير", width / 2, yPosition - 70); tCtx.fillText("عيد أضحى مبارك", width / 2, yPosition);
            } else {
                tCtx.textAlign = "right"; tCtx.fillText("كل عام وأنتم بخير", width - 50, yPosition); tCtx.textAlign = "left"; tCtx.fillText("عيد أضحى مبارك", 50, yPosition);
            }
            var imgData = tCtx.getImageData(0, 0, width, height).data; var gap = 3; 
            for(var y = 0; y < height; y += gap) {
                for(var x = 0; x < width; x += gap) {
                    if(imgData[(y * width + x) * 4 + 3] > 128) textTargets.push({x: x, y: y});
                }
            }
            textTargets.sort(function() { return Math.random() - 0.5; });
        }

        var particleColors = ['#d4af37', '#f1c40f', '#ffffff', '#27ae60'];

        class Particle {
            constructor(x, y, targetX, targetY) {
                this.x = x; this.y = y; this.vx = (Math.random() - 0.5) * 20; this.vy = (Math.random() * -15) - 5;  
                this.targetX = targetX; this.targetY = targetY; this.size = Math.random() * 1.5 + 1.2; 
                this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
                this.gravity = 0.3; this.drag = 0.96; 
            }
            update() {
                if (!textFormingState) {
                    this.vx *= this.drag; this.vy += this.gravity; this.x += this.vx; this.y += this.vy;
                    if (this.x < 0 || this.x > width) this.vx *= -1;
                } else {
                    this.x += (this.targetX - this.x) * 0.08; this.y += (this.targetY - this.y) * 0.08;
                }
            }
            draw() {
                ctx.fillStyle = this.color;
                if(textFormingState) { ctx.shadowBlur = 2; ctx.shadowColor = '#d4af37'; } else { ctx.shadowBlur = 0; }
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
        }

        function shootBatch(targetList, originX, originY) {
            for(var i = 0; i < targetList.length; i++) particles.push(new Particle(originX, originY, targetList[i].x, targetList[i].y));
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(function(p) { p.update(); p.draw(); });
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();

        var isPlaying = false, timers = [];
        function clearAllTimers() { timers.forEach(function(t) { clearTimeout(t); }); timers = []; }

        takbeerBtn.on('click', function() {
            if (isPlaying) {
                takbeerAudio.pause(); takbeerBtn.html('<i class="fa-solid fa-play"></i>');
                clearAllTimers(); canvas.style.opacity = '0'; setTimeout(function() { particles = []; }, 1000);
            } else {
                takbeerAudio.play(); takbeerBtn.html('<i class="fa-solid fa-pause"></i>');
                canvas.style.opacity = '1'; particles = []; textFormingState = false; clearAllTimers();
                document.fonts.ready.then(function() {
                    generateTextTargets();
                    var q = Math.floor(textTargets.length / 4);
                    shootBatch(textTargets.slice(0, q), width * 0.9, height * 0.1); 
                    shootBatch(textTargets.slice(q, q * 2), width * 0.1, height * 0.1);  
                    timers.push(setTimeout(function() {
                        shootBatch(textTargets.slice(q * 2, q * 3), width * 0.9, height * 0.1); 
                        shootBatch(textTargets.slice(q * 3), width * 0.1, height * 0.1);  
                    }, 2000));
                    timers.push(setTimeout(function() { textFormingState = true; }, 5000));
                    timers.push(setTimeout(function() { canvas.style.opacity = '0'; timers.push(setTimeout(function() { particles = []; }, 2000)); }, 14000));
                });
            }
            isPlaying = !isPlaying;
        });
    }
});