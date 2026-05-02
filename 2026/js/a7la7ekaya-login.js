$(document).ready(function() {
    // كاش لتقليل الطلبات وجعل التصفح أسرع
    var avatarCache = {};
    var forumCache = {};

    $('.a7la-hybrid-row').each(function() {
        var $row = $(this);
        var topicUrl = $row.find('.a7la-dynamic-forum').attr('data-url');
        var profileUrl = $row.find('.a7la-dynamic-avatar').attr('data-profile');

        // 1. جلب الصورة الرمزية للعضو
        if (profileUrl && profileUrl.indexOf('/u') !== -1) {
            if (avatarCache[profileUrl]) {
                $row.find('.a7la-dynamic-avatar').attr('src', avatarCache[profileUrl]);
            } else {
                $.get(profileUrl, function(data) {
                    var $data = $(data);
                    // البحث عن الصورة الرمزية باستخدام الكلاسات الافتراضية
                    var avatarSrc = $data.find('img[alt="avatar"], img[alt="الصورة الرمزية"], .avatar-default img').first().attr('src');
                    if (avatarSrc) {
                        avatarCache[profileUrl] = avatarSrc; // حفظ في الكاش
                        $row.find('.a7la-dynamic-avatar').attr('src', avatarSrc);
                    }
                });
            }
        }

        // 2. جلب اسم القسم
        if (topicUrl) {
            $.get(topicUrl, function(data) {
                var $topicHtml = $(data);
                // الوصول إلى النافبار داخل الموضوع
                var $navLinks = $topicHtml.find('.breadcrumbs a.nav');
                var $lastNav = $navLinks.last();
                
                if ($lastNav.length > 0) {
                    var forumName = $lastNav.text().trim();
                    var forumUrl = $lastNav.attr('href');
                    
                    // وضع اسم القسم
                    $row.find('.a7la-dynamic-forum').html('<i class="fa-solid fa-folder-open"></i> ' + forumName);

                    // 3. التوجه للقسم لجلب المشاهدات والردود
                    if (forumUrl) {
                        // استخراج رقم الموضوع لربطه بالقائمة
                        var topicIdMatch = topicUrl.match(/\/t(\d+)/);
                        if (topicIdMatch) {
                            if (forumCache[forumUrl]) {
                                extractStats(forumCache[forumUrl], topicIdMatch, $row);
                            } else {
                                $.get(forumUrl, function(forumData) {
                                    forumCache[forumUrl] = forumData; // حفظ القسم في الكاش
                                    extractStats(forumData, topicIdMatch, $row);
                                });
                            }
                        }
                    }
                } else {
                    $row.find('.a7la-dynamic-forum').html('<i class="fa-solid fa-folder-open"></i> بدون قسم');
                }
            });
        }
    });

    // دالة استخراج الإحصائيات الخاصة بالموضوع من داخل القسم
    function extractStats(forumData, topicIdMatch, $row) {
        var $forumHtml = $(forumData);
        var tIdString = '/t' + topicIdMatch[1] + '-'; // صيغة رابط الموضوع لضمان الدقة
        
        // البحث عن الموضوع المعين داخل القسم المجلوب
        var $topicLink = $forumHtml.find('.a7la-topic-title-area h3 a[href^="' + tIdString + '"]');
        
        if ($topicLink.length > 0) {
            var $topicRow = $topicLink.closest('.a7la-topic-row, .a7la-topic-rowa7la-topic-sticky');
            var $stats = $topicRow.find('.a7la-topic-stats .a7la-stat-box strong');
            
            if ($stats.length >= 2) {
                var replies = $stats.eq(0).text().trim();
                var views = $stats.eq(1).text().trim();
                
                // كتابة الردود والمشاهدات
                $row.find('.a7la-dynamic-stats .stat:eq(0) span').text(replies);
                $row.find('.a7la-dynamic-stats .stat:eq(1) span').text(views);
            }
        }
    }
    
    // مؤثرات الظهور عند التمرير (للقالب الكلاسيكي)
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    $(entry.target).removeClass('a7la-effect-hidden').addClass('a7la-effect-visible');
                }
            });
        }, { threshold: 0.1 });
        
        $('.a7la-effect-hidden').each(function() {
            observer.observe(this);
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