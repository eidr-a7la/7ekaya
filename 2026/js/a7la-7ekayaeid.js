(function() {
        // تحديد موعد العيد (27 مايو 2026)
        var targetDate = new Date("2026-05-27T00:00:00");
        var now = new Date();
        var isEidTime = now >= targetDate;
        
        // الموسم الافتراضي بناءً على التاريخ
        var defaultSeason = isEidTime ? 'eid' : 'hajj';
        
        // تنظيف التخزين القديم لضمان عمل السكربت الجديد للجميع
        if (!localStorage.getItem('a7la_theme_fixed_v3')) {
            localStorage.removeItem('season');
            localStorage.removeItem('a7la_season');
            localStorage.removeItem('manual_override');
            localStorage.setItem('a7la_theme_fixed_v3', 'true');
        }

        // خداع ملف الجافاسكريبت الخارجي ليرى الموسم الافتراضي الذي نريده (الحج)
        var originalGetItem = localStorage.getItem;
        localStorage.getItem = function(key) {
            if ((key === 'season' || key === 'a7la_season') && !originalGetItem.call(localStorage, 'manual_override')) {
                return defaultSeason;
            }
            return originalGetItem.call(localStorage, key);
        };

        // تطبيق الاستايل فوراً لمنع الوميض
        if (defaultSeason === 'hajj' && !originalGetItem.call(localStorage, 'manual_override')) {
            document.documentElement.setAttribute('data-season', 'hajj');
        } else if (defaultSeason === 'eid' && !originalGetItem.call(localStorage, 'manual_override')) {
            document.documentElement.removeAttribute('data-season');
        }

        // مراقب قوي لمنع الملف الخارجي من إزالة استايل الحج أثناء التحميل
        var observer = new MutationObserver(function() {
            if (!originalGetItem.call(localStorage, 'manual_override')) {
                var current = document.documentElement.getAttribute('data-season');
                if (defaultSeason === 'hajj' && current !== 'hajj') {
                    document.documentElement.setAttribute('data-season', 'hajj');
                } else if (defaultSeason === 'eid' && current === 'hajj') {
                    document.documentElement.removeAttribute('data-season');
                }
            }
        });
        
        // بدء المراقبة الصارمة
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-season'] });

        // إيقاف المراقبة بعد اكتمال تحميل الصفحة وإعطاء الصلاحية لزر التبديل اليدوي
        document.addEventListener("DOMContentLoaded", function() {
            setTimeout(function() {
                observer.disconnect(); // إيقاف الفرض الإجباري ليعمل زر التبديل بحرية
                
                var toggleBtn = document.getElementById('a7la7ekaya-seasonToggleBtn');
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', function() {
                        // تسجيل أن المستخدم قام بتغيير المظهر يدوياً لاحترام رغبته
                        localStorage.setItem('manual_override', 'true');
                    });
                }
            }, 1000);
        });
    })();




document.addEventListener("DOMContentLoaded", function() {
    // تواريخ المناسبات (2026)
    const dhuAlHijjahStart = new Date("May 18, 2026 00:00:00").getTime();
    const dhuAlHijjahEndDay1 = dhuAlHijjahStart + (24 * 60 * 60 * 1000); // اليوم الأول
    
    const eidStart = new Date("May 27, 2026 00:00:00").getTime();
    const eidEndDay1 = eidStart + (24 * 60 * 60 * 1000); // اليوم الأول

    // عناصر الواجهة
    const titleEl = document.getElementById("eid-cd-title");
    const timerBox = document.getElementById("eid-cd-timer-box");
    const msgBox = document.getElementById("eid-cd-message");
    const audioBtn = document.getElementById("eid-audio-btn");
    const icon1 = document.getElementById("cd-icon");
    const icon2 = document.getElementById("cd-icon-2");
    
    const fwSound = document.getElementById("eid-fireworks-sound");
    fwSound.volume = 0.4;

    let isCelebrating = false;
    let fireworksAnimId;

    // تشغيل التحديث كل ثانية للعداد والتقاط الاستايل المختار
    setInterval(function() {
        const now = new Date().getTime();
        
        // التقاط الاستايل المختار (يتم قراءة السمة من استايلك الأصلي)
        const isHajjTheme = document.body.getAttribute('data-season') === 'hajj';

        let targetDate;
        let isFireworksDay = false;
        let showTimer = true;
        let messageHtml = "";

        if (isHajjTheme) {
            // === مسار استايل الحج ===
            icon1.className = "fa-solid fa-kaaba";
            icon2.className = "fa-solid fa-kaaba";

            if (now < dhuAlHijjahStart) {
                targetDate = dhuAlHijjahStart;
                titleEl.innerText = "باقي على شهر ذو الحجة 1447هـ";
            } else if (now >= dhuAlHijjahStart && now < dhuAlHijjahEndDay1) {
                targetDate = now; showTimer = false; isFireworksDay = true;
                titleEl.innerText = "مبارك شهر ذو الحجة!";
                messageHtml = "???? تقبل الله منا ومنكم صالح الأعمال، وبدأت الأيام العشر المباركات.";
            } else {
                targetDate = now; showTimer = false;
                titleEl.innerText = "نحن في العشر الأوائل من ذي الحجة";
                messageHtml = "أكثروا من التكبير والتهليل والتحميد ????";
            }
        } else {
            // === مسار استايل العيد ===
            icon1.className = "fa-solid fa-sheep";
            icon2.className = "fa-solid fa-moon";

            if (now < eidStart) {
                targetDate = eidStart;
                titleEl.innerText = "باقي على عيد الأضحى المبارك 1447هـ";
            } else if (now >= eidStart && now < eidEndDay1) {
                targetDate = now; showTimer = false; isFireworksDay = true;
                titleEl.innerText = "حل علينا العيد!";
                messageHtml = "???? كل عام وأنتم بخير! عيد أضحى مبارك أعاده الله علينا وعليكم باليمن والبركات ????";
            } else {
                targetDate = now; showTimer = false;
                titleEl.innerText = "انتهى العيد";
                messageHtml = "تقبل الله طاعتكم، وكل عام وأنتم بخير.";
            }
        }

        // تحديث الأرقام أو إظهار الرسالة
        if (showTimer) {
            timerBox.style.display = "flex";
            msgBox.style.display = "none";

            const distance = targetDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("eid-cd-days").innerText = days;
            document.getElementById("eid-cd-hours").innerText = hours < 10 ? "0" + hours : hours;
            document.getElementById("eid-cd-minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
            document.getElementById("eid-cd-seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
        } else {
            timerBox.style.display = "none";
            msgBox.style.display = "block";
            msgBox.innerHTML = messageHtml;
        }

        // تشغيل أو إيقاف الاحتفال والألعاب النارية
        if (isFireworksDay && !isCelebrating) {
            startCelebration();
        } else if (!isFireworksDay && isCelebrating) {
            stopCelebration();
        }

    }, 1000);

    // === دوال الاحتفال (صوت + ألعاب نارية) ===
    function startCelebration() {
        isCelebrating = true;
        const canvas = document.getElementById('eid-fireworks-canvas');
        canvas.style.display = "block"; audioBtn.style.display = "flex";
        initFireworks(canvas);
        
        fwSound.play().then(() => { audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>'; })
        .catch(() => { audioBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'; });
    }

    function stopCelebration() {
        isCelebrating = false;
        document.getElementById('eid-fireworks-canvas').style.display = "none";
        audioBtn.style.display = "none";
        fwSound.pause(); fwSound.currentTime = 0;
        if(fireworksAnimId) cancelAnimationFrame(fireworksAnimId);
    }

    audioBtn.addEventListener('click', function() {
        if (fwSound.paused) {
            fwSound.play(); audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        } else {
            fwSound.pause(); audioBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        }
    });

    // === محرك الألعاب النارية ===
    function initFireworks(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        let particles = [];
        
        function Particle(x, y, color) {
            this.x = x; this.y = y;
            this.vx = (Math.random() - 0.5) * 8; this.vy = (Math.random() - 0.5) * 8;
            this.alpha = 1; this.color = color;
            this.draw = function() {
                ctx.globalAlpha = this.alpha; ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color; ctx.fill();
            };
            this.update = function() {
                this.x += this.vx; this.y += this.vy;
                this.vy += 0.05; this.alpha -= 0.01;
            };
        }
        const colors = ['#d4af37', '#f1c40f', '#e74c3c', '#2ecc71', '#3498db'];

        function animate() {
            if(!isCelebrating) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (Math.random() < 0.05) {
                const x = Math.random() * canvas.width; const y = Math.random() * canvas.height * 0.5;
                const color = colors[Math.floor(Math.random() * colors.length)];
                for (let i = 0; i < 40; i++) particles.push(new Particle(x, y, color));
            }
            particles.forEach((p, index) => {
                p.update(); p.draw();
                if (p.alpha <= 0) particles.splice(index, 1);
            });
            fireworksAnimId = requestAnimationFrame(animate);
        }
        animate();
        window.addEventListener('resize', function() {
            if(canvas.parentElement) { canvas.width = canvas.parentElement.clientWidth; canvas.height = canvas.parentElement.clientHeight; }
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
        /* ----- برمجة نافذة تسجيل الدخول ----- */
        const loginBtn = document.getElementById('eidr-trigger-login');
        const loginModal = document.getElementById('eidr-login-modal');
        const closeLogin = document.getElementById('eidr-close-login');

        if (loginBtn && loginModal) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                loginModal.classList.add('active');
            });
            
            closeLogin.addEventListener('click', function() {
                loginModal.classList.remove('active');
            });

            loginModal.addEventListener('click', function(e) {
                if (e.target === loginModal) {
                    loginModal.classList.remove('active');
                }
            });
        }

        /* ----- برمجة نافذة تأكيد تسجيل الخروج ----- */
        const logoutBtns = document.querySelectorAll('.eidr-trigger-logout');
        const logoutModal = document.getElementById('eidr-logout-modal');
        const confirmLogoutBtn = document.getElementById('eidr-confirm-logout');
        const cancelLogoutBtn = document.getElementById('eidr-cancel-logout');

        if (logoutBtns.length > 0 && logoutModal) {
            logoutBtns.forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault(); // إيقاف التحويل المباشر
                    let logoutUrl = this.getAttribute('href'); 
                    confirmLogoutBtn.setAttribute('href', logoutUrl); // نقل رابط الخروج لزر التأكيد
                    logoutModal.classList.add('active'); // إظهار النافذة
                });
            });

            cancelLogoutBtn.addEventListener('click', function() {
                logoutModal.classList.remove('active');
            });

            logoutModal.addEventListener('click', function(e) {
                if (e.target === logoutModal) {
                    logoutModal.classList.remove('active');
                }
            });
        }
    });