$(document).ready(function() {

    // ====================================================================
    // [1] نظام المواسم (الحج / العيد) الأساسي والإجباري
    // ====================================================================
    var arafahDate = new Date('2024-06-15T00:00:00'); 
    var today = new Date();
    
    // الحج هو الأساسي قبل يوم عرفة
    var defaultSeason = (today < arafahDate) ? 'hajj' : 'eid';
    var savedSeason = localStorage.getItem('forum_season');
    var currentSeason = savedSeason ? savedSeason : defaultSeason;
    
    $('body').attr('data-season', currentSeason);

    var seasonBtn = $('#a7la7ekaya-seasonToggleBtn');
    if(seasonBtn.length) {
        var seasonIcon = seasonBtn.find('i');
        if(currentSeason === 'hajj') { 
            seasonIcon.attr('class', 'fa-solid fa-sheep'); 
            seasonBtn.attr('title', 'الانتقال لموسم العيد'); 
        } else { 
            seasonIcon.attr('class', 'fa-solid fa-kaaba'); 
            seasonBtn.attr('title', 'الانتقال لموسم الحج'); 
        }

        seasonBtn.on('click', function(e) {
            e.preventDefault();
            if ($('body').attr('data-season') === 'hajj') {
                localStorage.setItem('forum_season', 'eid');
            } else {
                localStorage.setItem('forum_season', 'hajj');
            }
            location.reload(); 
        });
    }

    // ====================================================================
    // [2] القوائم المنسدلة وبيانات العضو
    // ====================================================================
    $('.a7la7ekaya-toggle-btn').click(function(e) {
        e.preventDefault(); e.stopPropagation();
        var menu = $(this).next('.a7la7ekaya-dropdown-menu');
        if(menu.length === 0) menu = $(this).siblings('.a7la7ekaya-dropdown-menu');
        $('.a7la7ekaya-dropdown-menu').not(menu).removeClass('show');
        menu.toggleClass('show');
    });
    
    $(document).click(function() { 
        $('.a7la7ekaya-dropdown-menu').removeClass('show'); 
        $('#notif-menu').addClass('hidden').removeClass('show'); 
    });
    $('.a7la7ekaya-dropdown-menu').click(function(e) { e.stopPropagation(); });

    $('#header-notif').on('click', function(e) {
        e.preventDefault(); e.stopPropagation();
        $('.a7la7ekaya-dropdown-menu').removeClass('show');
        var notifMenu = $('#notif-menu');
        if(notifMenu.hasClass('hidden')) {
            notifMenu.removeClass('hidden').addClass('show');
        } else {
            notifMenu.addClass('hidden').removeClass('show');
        }
    });
    $('#notif-menu').click(function(e) { e.stopPropagation(); });

    if (typeof _userdata !== "undefined" && _userdata.session_logged_in == 1) {
        function checkServerNotifications() {
            $.ajax({
                url: '/profile?mode=editprofile&page_profil=notifications',
                type: 'GET',
                success: function(data) {
                    var $doc = $(data);
                    var unreadNotifs = $doc.find('#notif_list li.unread').length;
                    var $badge = $('#flx-badge-count');
                    if (unreadNotifs > 0) { $badge.text(unreadNotifs).addClass('active'); } 
                    else { $badge.removeClass('active'); }
                }
            });
        }
        checkServerNotifications();
        setInterval(checkServerNotifications, 30000); 

        var pmCacheKey = 'a7la_pm_' + _userdata.user_id;
        var cachedPm = sessionStorage.getItem(pmCacheKey);
        function updatePmUI(count) {
            var $pmCount = $('#a7la-pm-count');
            var $pmLink = $('#a7la-pm-link');
            if(count > 0) { $pmCount.text(count).show(); $pmLink.css('color', '#e74c3c'); } 
            else { $pmCount.hide(); $pmLink.css('color', ''); }
        }
        if(cachedPm !== null) { updatePmUI(parseInt(cachedPm)); } 
        else {
            $.ajax({
                url: '/privmsg?folder=inbox',
                type: 'GET',
                success: function(data) {
                    var unreadCount = (data.match(/pm_unread\.png/g) || []).length;
                    sessionStorage.setItem(pmCacheKey, unreadCount);
                    updatePmUI(unreadCount);
                }
            });
        }

        $('#a7la-profile-link').attr('href', '/u' + _userdata.user_id);
        if (_userdata.username) $('#a7la-card-name').text(_userdata.username);

        if (_userdata.avatar && _userdata.avatar !== "") {
            var avatarSrc = "";
            if (_userdata.avatar.indexOf('<img') !== -1) {
                var match = _userdata.avatar.match(/src=["'](.*?)["']/);
                if (match && match[1]) avatarSrc = match[1];
            } else { avatarSrc = _userdata.avatar; }
            if(avatarSrc) {
                var imgHtml = '<img src="' + avatarSrc + '" alt="User">';
                $('#a7la-user-trigger').html(imgHtml); $('#a7la-card-avatar').html(imgHtml);
            }
        }

        var rankCacheKey = 'a7la_rank_' + _userdata.user_id;
        var cachedRank = sessionStorage.getItem(rankCacheKey);
        if (cachedRank) { $('#a7la-card-rank').html(cachedRank); } 
        else {
            $.ajax({
                url: '/u' + _userdata.user_id,
                type: 'GET',
                success: function(data) {
                    var $doc = $(data);
                    var $rankBox = $doc.find('.mod-login-rank');
                    if($rankBox.length > 0) {
                        var rankHtml = $rankBox.html().replace(/<br\s*[\/]?>/gi, ' ').replace('الرتبة:', '').trim();
                        sessionStorage.setItem(rankCacheKey, rankHtml);
                        $('#a7la-card-rank').html(rankHtml);
                    } else { $('#a7la-card-rank').html('عضو'); }
                }
            });
        }
    }

    // ====================================================================
    // [3] أكواد المظهر، التسجيل، السلايدر والصعود 
    // ====================================================================
    var themeBtn = $('#a7la7ekaya-themeToggleBtn');
    if(themeBtn.length) {
        var themeIcon = themeBtn.find('i');
        if(localStorage.getItem('theme') === 'dark') { $('body').attr('data-theme', 'dark'); themeIcon.attr('class', 'fa-solid fa-sun'); }
        themeBtn.on('click', function() {
            if ($('body').attr('data-theme') === 'dark') {
                $('body').removeAttr('data-theme'); localStorage.setItem('theme', 'light'); themeIcon.attr('class', 'fa-solid fa-moon');
            } else {
                $('body').attr('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); themeIcon.attr('class', 'fa-solid fa-sun');
            }
        });
    }

    // -- تم حل مشكلة نافذة الدخول هنا --
    // البحث عن الزر بناءً على احتوائه على كلمة login في الرابط لتفادي نقص الـ ID
    var loginBtn = $('.a7la7ekaya-header-actions a[href*="login"]');
    var loginModal = $('#a7la7ekaya-loginModal');
    var closeModalBtn = $('#a7la7ekaya-closeModalBtn');
    
    if(loginBtn.length && loginModal.length){
        loginBtn.on('click', function(e) { 
            e.preventDefault(); // منع التحويل للصفحة الافتراضية
            loginModal.addClass('a7la7ekaya-active'); // إظهار النافذة
        });
        closeModalBtn.on('click', function() { loginModal.removeClass('a7la7ekaya-active'); });
        $(window).on('click', function(e) { if($(e.target).is(loginModal)) { loginModal.removeClass('a7la7ekaya-active'); } });
    }

    var slides = $('.a7la7ekaya-slide');
    if(slides.length > 0) {
        var currentSlide = 0;
        function showSlide(index) { slides.removeClass('a7la7ekaya-active'); $(slides[index]).addClass('a7la7ekaya-active'); }
        window.nextSlide = function() { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); }
        window.prevSlide = function() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; showSlide(currentSlide); }
        setInterval(window.nextSlide, 5000);
        $('.a7la7ekaya-next-btn').on('click', window.nextSlide); $('.a7la7ekaya-prev-btn').on('click', window.prevSlide);
    }

    var backToTopBtn = $("#a7la7ekaya-backToTop");
    if(backToTopBtn.length) {
        $(window).on("scroll", function() { if($(window).scrollTop() > 300) backToTopBtn.addClass("a7la7ekaya-show"); else backToTopBtn.removeClass("a7la7ekaya-show"); });
        backToTopBtn.on('click', function() { $('html, body').animate({scrollTop: 0}, 'smooth'); });
    }

    // ====================================================================
    // [4] الألعاب النارية، الخروف، والطواف
    // ====================================================================
    var takbeerBtn = $('#a7la7ekaya-takbeerBtn');
    var takbeerAudio = document.getElementById('a7la7ekaya-takbeerAudio');
    var talbiyahAudio = document.getElementById('hajj-talbiyah-audio');
    
    const volumeSlider = document.getElementById('forum-audio-slider');
    const smartVolumeBox = document.getElementById('smart-volume-wrapper');
    const peekingSheep = document.getElementById('peeking-pro');
    const runningScene = document.getElementById('running-pro-scene');
    const butcherAction = document.getElementById('butcher-action-layer');
    const sheepAction = document.getElementById('sheep-action-layer');
    let isAnimationActive = false;
    let p1Timeout, p2Timeout, p3Timeout, cycleTimeout, attack1, attack2, fall1, fall2;

    function stopAndHideEverything() {
        isAnimationActive = false;
        clearTimeout(p1Timeout); clearTimeout(p2Timeout); clearTimeout(p3Timeout); clearTimeout(cycleTimeout); clearTimeout(attack1); clearTimeout(attack2); clearTimeout(fall1); clearTimeout(fall2);
        if(peekingSheep) peekingSheep.style.left = '-150px';
        if(runningScene) { runningScene.style.transition = 'none'; runningScene.style.left = '-350px'; runningScene.classList.remove('flipped-scene'); }
        if(sheepAction) sheepAction.classList.remove('execute-headbutt');
        if(butcherAction) butcherAction.classList.remove('execute-fall');
    }

    function triggerSmash() {
        if(!isAnimationActive) return;
        sheepAction.classList.remove('execute-headbutt'); butcherAction.classList.remove('execute-fall');
        void sheepAction.offsetWidth; sheepAction.classList.add('execute-headbutt');
        fall1 = setTimeout(() => { if(isAnimationActive) butcherAction.classList.add('execute-fall') }, 120);
    }

    function startChaseSequence() {
        if(!isAnimationActive) return;
        runningScene.style.transition = 'none'; runningScene.classList.remove('flipped-scene'); runningScene.style.left = '-350px';
        p1Timeout = setTimeout(() => { if(!isAnimationActive) return; runningScene.style.transition = 'left 12s linear'; runningScene.style.left = '110vw'; }, 100);
        p2Timeout = setTimeout(() => {
            if(!isAnimationActive) return;
            runningScene.style.transition = 'none'; runningScene.classList.add('flipped-scene'); runningScene.style.left = '110vw';
            p3Timeout = setTimeout(() => {
                if(!isAnimationActive) return;
                runningScene.style.transition = 'left 12s linear'; runningScene.style.left = '-350px';
                attack1 = setTimeout(triggerSmash, 3000); attack2 = setTimeout(triggerSmash, 8000);
            }, 100);
        }, 13000);
        cycleTimeout = setTimeout(() => { if(isAnimationActive) startChaseSequence() }, 26000);
    }

    if(takbeerBtn.length) {
        
        var canvas = document.createElement('canvas');
        canvas.style.position = 'fixed'; canvas.style.top = '0'; canvas.style.left = '0';
        canvas.style.width = '100vw'; canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none'; canvas.style.zIndex = '9998'; 
        canvas.style.transition = 'opacity 2s ease-in-out'; 
        document.body.appendChild(canvas);
        var ctx = canvas.getContext('2d', { willReadFrequently: true });
        var width, height, particles = [], textTargets = [], textFormingState = false;

        function resizeCanvas() { width = window.innerWidth; height = window.innerHeight; canvas.width = width; canvas.height = height; }
        $(window).on('resize', resizeCanvas); resizeCanvas();

        function generateTextTargets() {
            textTargets = []; var tempCanvas = document.createElement('canvas'); tempCanvas.width = width; tempCanvas.height = height;
            var tCtx = tempCanvas.getContext('2d', { willReadFrequently: true }); var fontSize = width < 768 ? 60 : 100; 
            tCtx.font = "900 " + fontSize + "px 'Cairo', sans-serif"; tCtx.fillStyle = "white"; tCtx.textBaseline = "middle";
            var yPosition = height - 120; 
            if(width < 768) { tCtx.textAlign = "center"; tCtx.fillText("كل عام وأنتم بخير", width / 2, yPosition - 70); tCtx.fillText("عيد أضحى مبارك", width / 2, yPosition); } 
            else { tCtx.textAlign = "right"; tCtx.fillText("كل عام وأنتم بخير", width - 50, yPosition); tCtx.textAlign = "left"; tCtx.fillText("عيد أضحى مبارك", 50, yPosition); }
            var imgData = tCtx.getImageData(0, 0, width, height).data; var gap = 3; 
            for(var y = 0; y < height; y += gap) { for(var x = 0; x < width; x += gap) { if(imgData[(y * width + x) * 4 + 3] > 128) textTargets.push({x: x, y: y}); } }
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
                if (!textFormingState) { this.vx *= this.drag; this.vy += this.gravity; this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > width) this.vx *= -1; } 
                else { this.x += (this.targetX - this.x) * 0.08; this.y += (this.targetY - this.y) * 0.08; }
            }
            draw() { ctx.fillStyle = this.color; if(textFormingState) { ctx.shadowBlur = 2; ctx.shadowColor = '#d4af37'; } else { ctx.shadowBlur = 0; } ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
        }
        function shootBatch(targetList, originX, originY) { for(var i = 0; i < targetList.length; i++) particles.push(new Particle(originX, originY, targetList[i].x, targetList[i].y)); }
        function animateCanvas() { ctx.clearRect(0, 0, width, height); particles.forEach(function(p) { p.update(); p.draw(); }); requestAnimationFrame(animateCanvas); }
        animateCanvas();

        $('body').append('<div id="tawaf-container"><canvas id="tawafCanvas"></canvas></div>');
        var tawafContainer = $('#tawaf-container');
        var tawafCanvas = document.getElementById('tawafCanvas');
        var tawafCtx = tawafCanvas ? tawafCanvas.getContext('2d') : null;
        var tawafAnimationId;
        
        function startTawafAnimation() {
            if(!tawafCtx) return; tawafCanvas.width = 120; tawafCanvas.height = 120; var centerX = 60, centerY = 60; var pilgrims = [];
            for (var i = 0; i < 80; i++) { pilgrims.push({ angle: Math.random() * Math.PI * 2, radius: 25 + Math.random() * 30, speed: 0.01 + Math.random() * 0.015, size: 1 + Math.random() * 1.5 }); }
            function drawTawaf() {
                tawafCtx.clearRect(0, 0, 120, 120);
                tawafCtx.beginPath(); tawafCtx.arc(centerX, centerY, 55, 0, Math.PI * 2); tawafCtx.fillStyle = "rgba(255, 255, 255, 0.03)"; tawafCtx.fill();
                tawafCtx.save(); tawafCtx.translate(centerX, centerY); tawafCtx.rotate(-Math.PI / 4);
                tawafCtx.fillStyle = "#111"; tawafCtx.shadowColor = "rgba(0,0,0,0.8)"; tawafCtx.shadowBlur = 10; tawafCtx.fillRect(-12, -12, 24, 24);
                tawafCtx.shadowBlur = 0; tawafCtx.strokeStyle = "#d4af37"; tawafCtx.lineWidth = 2; tawafCtx.strokeRect(-11, -11, 22, 22); tawafCtx.restore();
                tawafCtx.fillStyle = "#ffffff";
                for (var i = 0; i < pilgrims.length; i++) { var p = pilgrims[i]; p.angle -= p.speed; var x = centerX + Math.cos(p.angle) * p.radius; var y = centerY + Math.sin(p.angle) * p.radius; tawafCtx.beginPath(); tawafCtx.arc(x, y, p.size, 0, Math.PI * 2); tawafCtx.fill(); }
                tawafAnimationId = requestAnimationFrame(drawTawaf);
            } drawTawaf();
        }
        function stopTawafAnimation() { if(tawafAnimationId) cancelAnimationFrame(tawafAnimationId); if(tawafCtx) tawafCtx.clearRect(0, 0, 120, 120); }

        var isPlaying = false, timers = [];
        function clearAllTimers() { timers.forEach(function(t) { clearTimeout(t); }); timers = []; }

        takbeerBtn.on('click', function(e) {
            e.preventDefault();
            var activeSeason = $('body').attr('data-season');

            if (isPlaying) {
                if(takbeerAudio) { takbeerAudio.pause(); takbeerAudio.currentTime = 0; }
                if(talbiyahAudio) { talbiyahAudio.pause(); talbiyahAudio.currentTime = 0; }
                takbeerBtn.html('<i class="fa-solid fa-play"></i>');
                
                clearAllTimers(); canvas.style.opacity = '0'; setTimeout(function() { particles = []; }, 1000);
                if(smartVolumeBox) smartVolumeBox.style.display = 'none';
                stopAndHideEverything();

                tawafContainer.removeClass('show-tawaf'); setTimeout(stopTawafAnimation, 1000);
            } else {
                takbeerBtn.html('<i class="fa-solid fa-pause"></i>');
                
                if (activeSeason === 'hajj') {
                    if(talbiyahAudio) { talbiyahAudio.currentTime = 0; talbiyahAudio.play(); }
                    tawafContainer.addClass('show-tawaf'); startTawafAnimation();
                } else {
                    if(takbeerAudio) { takbeerAudio.currentTime = 0; takbeerAudio.play(); }
                    
                    canvas.style.opacity = '1'; particles = []; textFormingState = false; clearAllTimers();
                    document.fonts.ready.then(function() {
                        generateTextTargets(); var q = Math.floor(textTargets.length / 4);
                        shootBatch(textTargets.slice(0, q), width * 0.9, height * 0.1); shootBatch(textTargets.slice(q, q * 2), width * 0.1, height * 0.1);  
                        timers.push(setTimeout(function() { shootBatch(textTargets.slice(q * 2, q * 3), width * 0.9, height * 0.1); shootBatch(textTargets.slice(q * 3), width * 0.1, height * 0.1); }, 2000));
                        timers.push(setTimeout(function() { textFormingState = true; }, 5000));
                        timers.push(setTimeout(function() { canvas.style.opacity = '0'; timers.push(setTimeout(function() { particles = []; }, 2000)); }, 14000));
                    });

                    if(smartVolumeBox) smartVolumeBox.style.display = 'flex';
                    if(!isAnimationActive && peekingSheep) {
                        isAnimationActive = true; peekingSheep.style.left = '-30px';
                        setTimeout(() => { peekingSheep.style.left = '-150px' }, 2500);
                        setTimeout(() => { if(isAnimationActive) startChaseSequence() }, 3000);
                    }
                }
            }
            isPlaying = !isPlaying;
        });

        if(volumeSlider && takbeerAudio) {
            volumeSlider.value = takbeerAudio.volume;
            volumeSlider.addEventListener('input', function() {
                if(takbeerAudio) takbeerAudio.volume = this.value;
                if(talbiyahAudio) talbiyahAudio.volume = this.value;
            });
        }
    }
});

// ====================================================================
// [5] أعياد الميلاد والسلايدر
// ====================================================================
document.addEventListener("DOMContentLoaded", function() {
    var bdayBox = document.getElementById("a7la-birthday-container");
    var bdayContent = document.getElementById("a7la-birthday-content");
    var onlineBox = document.getElementById("a7la-online-container");
    if (bdayBox && bdayContent) {
        var hasBirthdays = bdayContent.getElementsByTagName("a").length > 0;
        if (!hasBirthdays) {
            bdayBox.style.display = "none"; 
            if(onlineBox) { onlineBox.style.flex = "100%"; }
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    var slides = document.querySelectorAll('.a7la7ekaya-slide');
    if(slides.length > 0) {
        var currentSlide = 0;
        function showSlide(index) { 
            for(var i = 0; i < slides.length; i++){ slides[i].classList.remove('a7la7ekaya-active'); }
            slides[index].classList.add('a7la7ekaya-active'); 
        }
        function nextSlide() { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); }
        function prevSlide() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; showSlide(currentSlide); }
        var slideInterval = setInterval(nextSlide, 5000);
        
        var nxtBtn = document.querySelector('.a7la7ekaya-next-btn');
        var prvBtn = document.querySelector('.a7la7ekaya-prev-btn');
        
        if(nxtBtn) {
            nxtBtn.addEventListener('click', function(e) { e.preventDefault(); nextSlide(); clearInterval(slideInterval); slideInterval = setInterval(nextSlide, 5000); });
        }
        if(prvBtn) {
            prvBtn.addEventListener('click', function(e) { e.preventDefault(); prevSlide(); clearInterval(slideInterval); slideInterval = setInterval(nextSlide, 5000); });
        }
    }
});