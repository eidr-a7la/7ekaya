// استخدام Vanilla JS لضمان عمل الكود بشكل نقي بعيداً عن تعارضات المنتدى
document.addEventListener("DOMContentLoaded", function() {

    // 1. نظام المظهر (الداكن/الفاتح)
    try {
        var themeBtn = document.getElementById('a7la7ekaya-themeToggleBtn');
        if(themeBtn) {
            var themeIcon = themeBtn.querySelector('i');
            if(localStorage.getItem('theme') === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
                if(themeIcon) themeIcon.className = 'fa-solid fa-sun';
            }
            themeBtn.addEventListener('click', function() {
                if (document.body.getAttribute('data-theme') === 'dark') {
                    document.body.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light');
                    if(themeIcon) themeIcon.className = 'fa-solid fa-moon';
                } else {
                    document.body.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                    if(themeIcon) themeIcon.className = 'fa-solid fa-sun';
                }
            });
        }
    } catch(e) { console.log(e); }

    // 2. نافذة تسجيل الدخول
    try {
        var loginBtn = document.getElementById('a7la7ekaya-openLoginBtn');
        var loginModal = document.getElementById('a7la7ekaya-loginModal');
        var closeModalBtn = document.getElementById('a7la7ekaya-closeModalBtn');
        if(loginBtn && loginModal && closeModalBtn){
            loginBtn.addEventListener('click', function(e) { 
                e.preventDefault(); 
                loginModal.classList.add('a7la7ekaya-active'); 
            });
            closeModalBtn.addEventListener('click', function() { 
                loginModal.classList.remove('a7la7ekaya-active'); 
            });
            window.addEventListener('click', function(e) { 
                if(e.target === loginModal) { loginModal.classList.remove('a7la7ekaya-active'); }
            });
        }
    } catch(e) { console.log(e); }

    // 3. السلايدر
    try {
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
            setInterval(nextSlide, 5000);
            
            var nxtBtn = document.querySelector('.a7la7ekaya-next-btn');
            var prvBtn = document.querySelector('.a7la7ekaya-prev-btn');
            if(nxtBtn) nxtBtn.addEventListener('click', nextSlide);
            if(prvBtn) prvBtn.addEventListener('click', prevSlide);
        }
    } catch(e) { console.log(e); }

    // 4. الصعود للأعلى
    try {
        var backToTopBtn = document.getElementById("a7la7ekaya-backToTop");
        if(backToTopBtn) {
            window.addEventListener("scroll", function() { 
                if(window.scrollY > 300) backToTopBtn.classList.add("a7la7ekaya-show");
                else backToTopBtn.classList.remove("a7la7ekaya-show");
            });
            backToTopBtn.addEventListener('click', function() { 
                window.scrollTo({top: 0, behavior: 'smooth'}); 
            });
        }
    } catch(e) { console.log(e); }

    // 5. الألعاب النارية والصوت
    try {
        var takbeerBtn = document.getElementById('a7la7ekaya-takbeerBtn');
        var takbeerAudio = document.getElementById('a7la7ekaya-takbeerAudio');
        
        if(takbeerBtn && takbeerAudio) {
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
            window.addEventListener('resize', resizeCanvas); 
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

            function Particle(x, y, targetX, targetY) {
                this.x = x; this.y = y; this.vx = (Math.random() - 0.5) * 20; this.vy = (Math.random() * -15) - 5;  
                this.targetX = targetX; this.targetY = targetY; this.size = Math.random() * 1.5 + 1.2; 
                this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
                this.gravity = 0.3; this.drag = 0.96; 
            }
            Particle.prototype.update = function() {
                if (!textFormingState) {
                    this.vx *= this.drag; this.vy += this.gravity; this.x += this.vx; this.y += this.vy;
                    if (this.x < 0 || this.x > width) this.vx *= -1;
                } else {
                    this.x += (this.targetX - this.x) * 0.08; this.y += (this.targetY - this.y) * 0.08;
                }
            };
            Particle.prototype.draw = function() {
                ctx.fillStyle = this.color;
                if(textFormingState) { ctx.shadowBlur = 2; ctx.shadowColor = '#d4af37'; } else { ctx.shadowBlur = 0; }
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            };

            function shootBatch(targetList, originX, originY) {
                for(var i = 0; i < targetList.length; i++) particles.push(new Particle(originX, originY, targetList[i].x, targetList[i].y));
            }

            function animateCanvas() {
                ctx.clearRect(0, 0, width, height);
                for(var i=0; i<particles.length; i++){
                    particles[i].update(); particles[i].draw();
                }
                requestAnimationFrame(animateCanvas);
            }
            animateCanvas();

            var isPlaying = false, timers = [];
            function clearAllTimers() { timers.forEach(function(t) { clearTimeout(t); }); timers = []; }

            takbeerBtn.addEventListener('click', function() {
                if (isPlaying) {
                    takbeerAudio.pause(); takbeerBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                    clearAllTimers(); canvas.style.opacity = '0'; setTimeout(function() { particles = []; }, 1000);
                } else {
                    takbeerAudio.play(); takbeerBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
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
    } catch(e) { console.log(e); }

});