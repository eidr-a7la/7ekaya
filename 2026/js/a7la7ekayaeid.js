$(document).ready(function() {

    // =========================================
    // نظام مواسم الحج والعيد (تلقائي ويدوي)
    // =========================================
    
    // 1. تحديد تاريخ يوم عرفة (قم بتحديثه كل عام)
    // مثال: 15 يونيو 2024
    var arafahDate = new Date('2024-06-15T00:00:00'); 
    var today = new Date();
    
    // 2. التحقق من الموسم الحالي
    var currentSeason = localStorage.getItem('forum_season');
    if (!currentSeason) {
        // إذا لم يختر العضو يدوياً، نعتمد على التاريخ
        // إذا كان اليوم قبل يوم عرفة = حج، غير ذلك = عيد
        currentSeason = (today < arafahDate) ? 'hajj' : 'eid';
    }
    
    // تطبيق الموسم على البودي
    $('body').attr('data-season', currentSeason);

    // 3. زر التبديل اليدوي من الهيدر
    var seasonBtn = $('#a7la7ekaya-seasonToggleBtn');
    if(seasonBtn.length) {
        var seasonIcon = seasonBtn.find('i');
        // ضبط شكل الأيقونة حسب الموسم الحالي
        if(currentSeason === 'hajj') { seasonIcon.attr('class', 'fa-solid fa-sheep'); seasonBtn.attr('title', 'الانتقال لموسم العيد'); }
        else { seasonIcon.attr('class', 'fa-solid fa-kaaba'); seasonBtn.attr('title', 'الانتقال لموسم الحج'); }

        seasonBtn.on('click', function() {
            if ($('body').attr('data-season') === 'hajj') {
                $('body').attr('data-season', 'eid');
                localStorage.setItem('forum_season', 'eid');
                seasonIcon.attr('class', 'fa-solid fa-kaaba');
                seasonBtn.attr('title', 'الانتقال لموسم الحج');
            } else {
                $('body').attr('data-season', 'hajj');
                localStorage.setItem('forum_season', 'hajj');
                seasonIcon.attr('class', 'fa-solid fa-sheep');
                seasonBtn.attr('title', 'الانتقال لموسم العيد');
            }
            // إعادة تحميل الصفحة لتطبيق التغييرات الصوتية بوضوح
            location.reload();
        });
    }

    // =========================================
    // أنيميشن الطواف والصوتيات
    // =========================================
    var takbeerBtn = $('#a7la7ekaya-takbeerBtn');
    var takbeerAudio = document.getElementById('a7la7ekaya-takbeerAudio');
    var talbiyahAudio = document.getElementById('hajj-talbiyah-audio');
    
    // إنشاء حاوية الطواف
    $('body').append('<div id="tawaf-container"><canvas id="tawafCanvas"></canvas></div>');
    var tawafContainer = $('#tawaf-container');
    var tawafCanvas = document.getElementById('tawafCanvas');
    var tCtx = tawafCanvas ? tawafCanvas.getContext('2d') : null;
    
    var tawafAnimationId;
    var isAudioPlaying = false;

    // دالة رسم الطواف بتقنية الكانفاس
    function startTawafAnimation() {
        if(!tCtx) return;
        tawafCanvas.width = 120; tawafCanvas.height = 120;
        var centerX = 60, centerY = 60;
        var pilgrims = [];
        
        // توليد الحجاج (نقاط بيضاء)
        for (var i = 0; i < 80; i++) {
            pilgrims.push({
                angle: Math.random() * Math.PI * 2,
                radius: 25 + Math.random() * 30, // المسافة عن الكعبة
                speed: 0.01 + Math.random() * 0.015, // سرعة الطواف (عكس عقارب الساعة)
                size: 1 + Math.random() * 1.5
            });
        }

        function drawTawaf() {
            tCtx.clearRect(0, 0, 120, 120);
            
            // رسم صحن المطاف (خلفية خفيفة)
            tCtx.beginPath();
            tCtx.arc(centerX, centerY, 55, 0, Math.PI * 2);
            tCtx.fillStyle = "rgba(255, 255, 255, 0.03)";
            tCtx.fill();

            // رسم الكعبة المشرفة (مربع أسود بحزام ذهبي من الأعلى)
            tCtx.save();
            tCtx.translate(centerX, centerY);
            tCtx.rotate(-Math.PI / 4); // إمالة بسيطة لإعطاء منظور 3D
            
            // جسد الكعبة
            tCtx.fillStyle = "#111";
            tCtx.shadowColor = "rgba(0,0,0,0.8)"; tCtx.shadowBlur = 10;
            tCtx.fillRect(-12, -12, 24, 24);
            
            // الحزام الذهبي
            tCtx.shadowBlur = 0;
            tCtx.strokeStyle = "#d4af37";
            tCtx.lineWidth = 2;
            tCtx.strokeRect(-11, -11, 22, 22);
            tCtx.restore();

            // تحريك ورسم الحجاج
            tCtx.fillStyle = "#ffffff";
            for (var i = 0; i < pilgrims.length; i++) {
                var p = pilgrims[i];
                p.angle -= p.speed; // حركة عكس عقارب الساعة
                var x = centerX + Math.cos(p.angle) * p.radius;
                var y = centerY + Math.sin(p.angle) * p.radius;
                
                tCtx.beginPath();
                tCtx.arc(x, y, p.size, 0, Math.PI * 2);
                tCtx.fill();
            }
            tawafAnimationId = requestAnimationFrame(drawTawaf);
        }
        drawTawaf();
    }

    function stopTawafAnimation() {
        if(tawafAnimationId) cancelAnimationFrame(tawafAnimationId);
        if(tCtx) tCtx.clearRect(0, 0, 120, 120);
    }

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

        // تشغيل الصوت والأنيميشن بناءً على الموسم الحالي
    if(takbeerBtn.length) {
        takbeerBtn.on('click', function(e) {
            e.preventDefault();
            var activeSeason = $('body').attr('data-season');

            if (isAudioPlaying) {
                // إيقاف كل شيء
                if(takbeerAudio) takbeerAudio.pause();
                if(talbiyahAudio) talbiyahAudio.pause();
                takbeerBtn.html('<i class="fa-solid fa-play"></i>');
                
                // إيقاف أنيميشن العيد (الألعاب النارية) إن وجد
                clearAllTimers(); 
                if(canvas) { canvas.style.opacity = '0'; setTimeout(function() { particles = []; }, 1000); }
                
                // إيقاف أنيميشن الحج (الطواف)
                tawafContainer.removeClass('show-tawaf');
                setTimeout(stopTawafAnimation, 1000);

            } else {
                // تشغيل حسب الموسم
                takbeerBtn.html('<i class="fa-solid fa-pause"></i>');
                
                if (activeSeason === 'hajj') {
                    // --- موسم الحج ---
                    if(talbiyahAudio) {
                        talbiyahAudio.currentTime = 0;
                        talbiyahAudio.play();
                    }
                    tawafContainer.addClass('show-tawaf');
                    startTawafAnimation();
                } else {
                    // --- موسم العيد ---
                    if(takbeerAudio) {
                        takbeerAudio.currentTime = 0;
                        takbeerAudio.play();
                    }
                    // تشغيل ألعاب العيد النارية (الكود القديم الخاص بك)
                    if(canvas) {
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
                }
            }
            isAudioPlaying = !isAudioPlaying;
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
                var bdayBox = document.getElementById("a7la-birthday-container");
                var bdayContent = document.getElementById("a7la-birthday-content");
                var onlineBox = document.getElementById("a7la-online-container");
                
                if (bdayBox && bdayContent) {
                    // التحقق من وجود روابظ <a> (والتي تمثل أسماء الأعضاء أصحاب أعياد الميلاد)
                    var hasBirthdays = bdayContent.getElementsByTagName("a").length > 0;
                    
                    // إذا لم يوجد أي عضو يحتفل بعيد ميلاده
                    if (!hasBirthdays) {
                        bdayBox.style.display = "none"; // إخفاء صندوق الميلاد
                        if(onlineBox) {
                            onlineBox.style.flex = "100%"; // تمديد صندوق المتواجدين لملء العرض بالكامل
                        }
                    }
                }
            });

document.addEventListener("DOMContentLoaded", function() {
            var slides = document.querySelectorAll('.a7la7ekaya-slide');
            if(slides.length > 0) {
                var currentSlide = 0;
                
                function showSlide(index) { 
                    for(var i = 0; i < slides.length; i++){
                        slides[i].classList.remove('a7la7ekaya-active');
                    }
                    slides[index].classList.add('a7la7ekaya-active'); 
                }
                
                function nextSlide() { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); }
                function prevSlide() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; showSlide(currentSlide); }
                
                // التقليب التلقائي كل 5 ثواني
                var slideInterval = setInterval(nextSlide, 5000);
                
                var nxtBtn = document.querySelector('.a7la7ekaya-next-btn');
                var prvBtn = document.querySelector('.a7la7ekaya-prev-btn');
                
                if(nxtBtn) {
                    nxtBtn.addEventListener('click', function(e) {
                        e.preventDefault(); // منع قفز الصفحة (#)
                        nextSlide();
                        // إعادة ضبط المؤقت حتى لا يقلب تلقائياً فجأة أثناء ضغطك
                        clearInterval(slideInterval);
                        slideInterval = setInterval(nextSlide, 5000);
                    });
                }
                
                if(prvBtn) {
                    prvBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        prevSlide();
                        clearInterval(slideInterval);
                        slideInterval = setInterval(nextSlide, 5000);
                    });
                }
            }
        });
