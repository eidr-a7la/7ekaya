    // 1. نظام المظهر الداكن/الفاتح
    const themeBtn = document.getElementById('a7la7ekaya-themeToggleBtn');
    const themeIcon = themeBtn.querySelector('i');
    if(localStorage.getItem('theme') === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fa-solid fa-sun';
    }
    themeBtn.addEventListener('click', () => {
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.className = 'fa-solid fa-moon';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.className = 'fa-solid fa-sun';
        }
    });

    // 2. نافذة تسجيل الدخول
    const loginBtn = document.getElementById('a7la7ekaya-openLoginBtn');
    if(loginBtn){
        const loginModal = document.getElementById('a7la7ekaya-loginModal');
        const closeBtn = document.getElementById('a7la7ekaya-closeModalBtn');
        loginBtn.onclick = () => loginModal.classList.add('a7la7ekaya-active');
        closeBtn.onclick = () => loginModal.classList.remove('a7la7ekaya-active');
        window.onclick = (e) => { if(e.target === loginModal) loginModal.classList.remove('a7la7ekaya-active'); };
    }

    // 3. السلايدر (يعمل فقط إذا كان موجوداً في الصفحة الحالية - الرئيسية)
    const slides = document.querySelectorAll('.a7la7ekaya-slide');
    if(slides.length > 0) {
        let currentSlide = 0;
        function showSlide(index) { slides.forEach(s => s.classList.remove('a7la7ekaya-active')); slides[index].classList.add('a7la7ekaya-active'); }
        window.nextSlide = function() { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); }
        window.prevSlide = function() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; showSlide(currentSlide); }
        setInterval(nextSlide, 5000);
    }

    // 4. زر الصعود للأعلى
    const backToTopBtn = document.getElementById("a7la7ekaya-backToTop");
    window.addEventListener("scroll", () => { 
        if(window.scrollY > 300) backToTopBtn.classList.add("a7la7ekaya-show");
        else backToTopBtn.classList.remove("a7la7ekaya-show");
    });
    backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

    // 5. نظام الألعاب النارية والصوتيات
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed'; canvas.style.top = '0'; canvas.style.left = '0';
    canvas.style.width = '100vw'; canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none'; canvas.style.zIndex = '9998'; 
    canvas.style.transition = 'opacity 2s ease-in-out'; 
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let width, height, particles = [], textTargets = [], textFormingState = false;

    function resizeCanvas() { width = window.innerWidth; height = window.innerHeight; canvas.width = width; canvas.height = height; }
    window.addEventListener('resize', resizeCanvas); resizeCanvas();

    function generateTextTargets() {
        textTargets = [];
        const tempCanvas = document.createElement('canvas'); tempCanvas.width = width; tempCanvas.height = height;
        const tCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
        let fontSize = width < 768 ? 60 : 100; 
        tCtx.font = `900 ${fontSize}px 'Cairo', sans-serif`; tCtx.fillStyle = "white"; tCtx.textBaseline = "middle";
        let yPosition = height - 120; 
        if(width < 768) {
            tCtx.textAlign = "center"; tCtx.fillText("كل عام وأنتم بخير", width / 2, yPosition - 70); tCtx.fillText("عيد أضحى مبارك", width / 2, yPosition);
        } else {
            tCtx.textAlign = "right"; tCtx.fillText("كل عام وأنتم بخير", width - 50, yPosition); tCtx.textAlign = "left"; tCtx.fillText("عيد أضحى مبارك", 50, yPosition);
        }
        const imgData = tCtx.getImageData(0, 0, width, height).data; const gap = 3; 
        for(let y = 0; y < height; y += gap) {
            for(let x = 0; x < width; x += gap) {
                if(imgData[(y * width + x) * 4 + 3] > 128) textTargets.push({x: x, y: y});
            }
        }
        textTargets.sort(() => Math.random() - 0.5);
    }

    const particleColors = ['#d4af37', '#f1c40f', '#ffffff', '#27ae60'];

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
        for(let i = 0; i < targetList.length; i++) particles.push(new Particle(originX, originY, targetList[i].x, targetList[i].y));
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    const takbeerBtn = document.getElementById('a7la7ekaya-takbeerBtn');
    const takbeerAudio = document.getElementById('a7la7ekaya-takbeerAudio');
    let isPlaying = false, timers = [];

    function clearAllTimers() { timers.forEach(t => clearTimeout(t)); timers = []; }

    takbeerBtn.onclick = () => {
        if (isPlaying) {
            takbeerAudio.pause(); takbeerBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            clearAllTimers(); canvas.style.opacity = '0'; setTimeout(() => { particles = []; }, 1000);
        } else {
            takbeerAudio.play(); takbeerBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            canvas.style.opacity = '1'; particles = []; textFormingState = false; clearAllTimers();
            document.fonts.ready.then(() => {
                generateTextTargets();
                const q = Math.floor(textTargets.length / 4);
                shootBatch(textTargets.slice(0, q), width * 0.9, height * 0.1); 
                shootBatch(textTargets.slice(q, q * 2), width * 0.1, height * 0.1);  
                timers.push(setTimeout(() => {
                    shootBatch(textTargets.slice(q * 2, q * 3), width * 0.9, height * 0.1); 
                    shootBatch(textTargets.slice(q * 3), width * 0.1, height * 0.1);  
                }, 2000));
                timers.push(setTimeout(() => { textFormingState = true; }, 5000));
                timers.push(setTimeout(() => { canvas.style.opacity = '0'; timers.push(setTimeout(() => { particles = []; }, 2000)); }, 14000));
            });
        }
        isPlaying = !isPlaying;
    };