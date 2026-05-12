$(document).ready(function() {
    /* 1. سكربت ذكي لجلب عدد الردود بصرياً في رأس الموضوع */
    var commentsCount = $('.a7la7ekaya-comment-item').length;
    // إضافة قيمة افتراضية 0 في حال لم يكن هناك ردود
    $('.replies-num').text(commentsCount || '0');

    /* 2. سكربت AJAX لجلب عدد المشاهدات من القسم تلقائياً */
    var currentTopicPath = window.location.pathname;
    // استخراج رقم الموضوع بدقة
    var topicIdMatch = currentTopicPath.match(/^\/t(\d+)/); 

    if (topicIdMatch) {
        var topicId = topicIdMatch[1]; 
        
        // جلب رابط القسم: أضمن طريقة في "أحلى منتدى" هي البحث عن آخر رابط يبدأ بـ /f (لأن روابط الأقسام تبدأ بـ f)
        var forumCategoryUrl = $('.a7la7ekaya-breadcrumb a[href^="/f"]').last().attr('href');
        
        // كود احتياطي في حال لم يكن كلاس مسار التنقل صحيحاً
        if (!forumCategoryUrl) {
            forumCategoryUrl = $('a[href^="/f"]').last().attr('href');
        }

        if (forumCategoryUrl) {
            // عمل طلب خلفي (AJAX) لصفحة القسم
            $.ajax({
                url: forumCategoryUrl,
                type: 'GET',
                success: function(data) {
                    // [خطوة هامة جداً للسرعة] إزالة الصور والسكربتات من الرد لمنع المتصفح من تحميلها في الخلفية
                    var cleanHTML = data.replace(/<img[^>]*>|<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                    var tempDom = $('<output>').html(cleanHTML);
                    
                    // البحث عن الموضوع: نستخدم *= (يحتوي على) مع إضافة شرطة (-) لضمان عدم الخلط بين المواضيع (مثال: t1 و t10)
                    var targetTopic = tempDom.find('a.a7la7ekaya2026-topic-title[href*="/t' + topicId + '-"]').closest('.a7la7ekaya2026-topic-card');

                    if (targetTopic.length > 0) {
                        // استخراج النص الذي يحتوي على عدد المشاهدات
                        var viewsString = targetTopic.find('.a7la7ekaya2026-metric[title="مشاهدة"]').text();
                        var viewsCount = viewsString.replace(/[^0-9]/g, ''); // تنظيف النص وإبقاء الأرقام فقط

                        if (viewsCount !== '') {
                            $('.views-num').text(viewsCount);
                        } else {
                            $('.views-num').text('0');
                        }
                    } else {
                        // إذا كان الموضوع في صفحة ثانية من القسم ولم يظهر في الصفحة الأولى
                        $('.views-num').text('-');
                    }
                },
                error: function() {
                    $('.views-num').text('خطأ');
                }
            });
        } else {
            $('.views-num').text('-');
        }
    }
});

// ================= نظام النوافذ المنبثقة (دخول + تسجيل) =================
document.addEventListener("DOMContentLoaded", function() {
    // جلب الأزرار من الهيدر
    const loginBtn = document.getElementById('a7la7ekaya-openLoginBtn');
    const registerBtn = document.getElementById('a7la7ekaya-openRegisterBtn');

    // جلب النوافذ (Modals)
    const loginModal = document.getElementById('a7la7ekaya-loginModal');
    const registerModal = document.getElementById('a7la7ekaya-registerModal');

    // جلب أزرار الإغلاق
    const closeLoginBtn = document.getElementById('a7la7ekaya-closeModalBtn');
    const closeRegisterBtn = document.getElementById('a7la7ekaya-closeRegisterBtn');

    // جلب روابط التبديل داخل النوافذ
    const switchToRegister = document.getElementById('a7la7ekaya-switchToRegister');
    const switchToLogin = document.getElementById('a7la7ekaya-switchToLogin');

    // 1. وظائف فتح النوافذ
    if(loginBtn) loginBtn.onclick = () => loginModal.classList.add('a7la7ekaya-active');
    if(registerBtn) registerBtn.onclick = () => registerModal.classList.add('a7la7ekaya-active');

    // 2. وظائف إغلاق النوافذ
    if(closeLoginBtn) closeLoginBtn.onclick = () => loginModal.classList.remove('a7la7ekaya-active');
    if(closeRegisterBtn) closeRegisterBtn.onclick = () => registerModal.classList.remove('a7la7ekaya-active');

    // 3. التنقل من نافذة الدخول إلى نافذة التسجيل
    if(switchToRegister) {
        switchToRegister.onclick = () => {
            loginModal.classList.remove('a7la7ekaya-active');
            registerModal.classList.add('a7la7ekaya-active');
        };
    }

    // 4. التنقل من نافذة التسجيل إلى نافذة الدخول
    if(switchToLogin) {
        switchToLogin.onclick = () => {
            registerModal.classList.remove('a7la7ekaya-active');
            loginModal.classList.add('a7la7ekaya-active');
        };
    }

    // 5. إغلاق النوافذ عند النقر خارجها (على الخلفية السوداء)
    window.addEventListener('click', (e) => {
        if(e.target === loginModal) loginModal.classList.remove('a7la7ekaya-active');
        if(e.target === registerModal) registerModal.classList.remove('a7la7ekaya-active');
    });
});

$(document).ready(function() {
  $('.a7la7ekaya-topic-content img, .v3-post-text img').each(function() {
    var $img = $(this);
    
    $img.on('load', function() {
      // التحقق لمنع تكرار الكود على نفس الصورة
      if ($img.parent().hasClass('a7la7ekayaimgt-wrapper')) return;

      var originalSrc = $img.attr('src');
      var originalWidth = this.naturalWidth;
      
      // تطبيق الكود فقط إذا كانت الصورة أكبر من 450 بكسل
      if (originalWidth > 450) {
        $img.css({ width: '450px', height: 'auto' });
        
        // إحاطة الصورة بـ Wrapper الجديد
        $img.wrap('<div class="a7la7ekayaimgt-wrapper"></div>');
        var $wrapper = $img.parent();
        
        // أيقونات SVG احترافية
        var expandIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`;
        var linkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>`;

        // تصميم شريط الأدوات الجديد
        var toolbar = $(`
          <div class="a7la7ekayaimgt-toolbar">
            <div class="a7la7ekayaimgt-btn preview">
              ${linkIcon} <span>معاينة الصورة كاملة</span>
            </div>
            <div class="a7la7ekayaimgt-btn toggle-size">
              ${expandIcon} <span class="toggle-text">تكبير الصورة</span>
            </div>
          </div>
        `);
        
        // إضافة الشريط أسفل الصورة للحصول على مظهر "البطاقة"
        $wrapper.append(toolbar);
        
        // برمجة زر التكبير والتصغير مع تأثير الحركة
        toolbar.find('.toggle-size').on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          var $this = $(this).find('.toggle-text');
          if ($img.hasClass('a7la7ekayaimgt-expanded')) {
            $img.removeClass('a7la7ekayaimgt-expanded').css({ width: '450px' });
            $this.text('تكبير الصورة');
          } else {
            // استخدام max-width: 100% في الـ CSS يضمن عدم خروجها عن الشاشة حتى لو كان حجمها الأصلي ضخم
            $img.addClass('a7la7ekayaimgt-expanded').css({ width: originalWidth + 'px' });
            $this.text('تصغير الصورة');
          }
        });
        
        // برمجة زر المعاينة
        toolbar.find('.preview').on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          window.open(originalSrc, '_blank');
        });
      }
    });
    
    // تشغيل الحدث إذا كانت الصورة محملة مسبقاً (Cached)
    if ($img[0].complete) {
      $img.trigger('load');
    }
  });
});


// --- الجزء الثاني: الخاص بصناديق الأكواد (المعدل) ---
document.addEventListener("DOMContentLoaded", function() {
    const codeBoxes = document.querySelectorAll('.codebox');

    codeBoxes.forEach((box, index) => {
        const codeElement = box.querySelector('code');
        if (!codeElement) return;

        let rawCode = codeElement.innerText.trim();

        // دالة ذكية للتعرف على نوع الكود (تتجاهل وسوم HTML إذا كانت داخل جافاسكربت)
        const detectCodeType = (code) => {
            // 1. إذا كان يبدأ بتعليقات HTML أو وسوم أساسية أو سكريبت مباشر
            if (/^(<!--|<!DOCTYPE|<html|<head|<body|<div|<table|<script|<style)/i.test(code)) {
                return { name: 'HTML', ext: 'html', mime: 'text/html' };
            }
            // 2. إذا كان يحتوي على دوال ومتغيرات جافاسكربت أو jQuery (مثل الكود الخاص بك)
            if (/(function\s*\(|var\s+|let\s+|const\s+|\$\(|document\.|window\.|console\.log)/i.test(code)) {
                return { name: 'JavaScript', ext: 'js', mime: 'text/javascript' };
            }
            // 3. إذا كان يحتوي على خصائص CSS
            if (/(margin|padding|color|background-color|font-size|border)\s*:/i.test(code) && /\{[\s\S]*\}/.test(code) && !/<\/?[a-z][\s\S]*>/i.test(code)) {
                return { name: 'CSS', ext: 'css', mime: 'text/css' };
            }
            // 4. فحص احتياطي للـ HTML
            if (/<\/?[a-z][\s\S]*>/i.test(code)) {
                return { name: 'HTML', ext: 'html', mime: 'text/html' };
            }
            // 5. روابط
            if (/^(http:\/\/|https:\/\/|www\.)/i.test(code)) {
                return { name: 'روابط', ext: 'txt', mime: 'text/plain' };
            }
            return { name: 'نص عام', ext: 'txt', mime: 'text/plain' };
        };

        const codeType = detectCodeType(rawCode);

        // إنشاء شريط الأدوات وتنسيقه ليظهر يمين ويسار
        const toolbar = document.createElement('div');
        toolbar.className = 'codebox-toolbar';
        toolbar.style.display = 'flex';
        toolbar.style.justifyContent = 'space-between';
        toolbar.style.alignItems = 'center';
        toolbar.style.marginBottom = '10px';
        toolbar.style.paddingBottom = '5px';
        toolbar.style.borderBottom = '1px dashed #ccc';

        // إضافة اسم اللغة
        const langLabel = document.createElement('span');
        langLabel.className = 'codebox-lang';
        langLabel.style.fontWeight = 'bold';
        langLabel.style.color = '#27ae60';
        langLabel.innerHTML = `نوع &nbsp;الكود: <span style="text-transform: uppercase;">${codeType.name}</span>`;

        // حاوية الأزرار
        const btnContainer = document.createElement('div');
        btnContainer.className = 'codebox-buttons';

        // تنسيق الأزرار المشترك
        const btnStyle = "cursor:pointer; margin-right:5px; padding:3px 8px; border:1px solid #ddd; background:#f9f9f9; border-radius:3px; font-family:tahoma; font-size:12px;";

        // 1. زر التحديد (باستخدام أيقونات FontAwesome لنسخة ModernBB)
        const selectBtn = document.createElement('button');
        selectBtn.style.cssText = btnStyle;
        selectBtn.innerHTML = '<i class="fa fa-check-square"></i> تحديد الكل';
        selectBtn.onclick = function() {
            const range = document.createRange();
            range.selectNodeContents(codeElement);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        };

        // 2. زر النسخ
        const copyBtn = document.createElement('button');
        copyBtn.style.cssText = btnStyle;
        copyBtn.innerHTML = '<i class="fa fa-copy"></i> نسخ';
        copyBtn.onclick = function() {
            navigator.clipboard.writeText(rawCode).then(() => {
                copyBtn.innerHTML = '<i class="fa fa-check" style="color:green;"></i> تم &nbsp;النسخ!';
                setTimeout(() => { copyBtn.innerHTML = '<i class="fa fa-copy"></i> نسخ'; }, 2000);
            }).catch(err => {
                const textArea = document.createElement("textarea");
                textArea.value = rawCode;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("Copy");
                textArea.remove();
                copyBtn.innerHTML = '<i class="fa fa-check" style="color:green;"></i> تم &nbsp;النسخ!';
                setTimeout(() => { copyBtn.innerHTML = '<i class="fa fa-copy"></i> نسخ'; }, 2000);
            });
        };

        // 3. زر التحميل
        const downloadBtn = document.createElement('button');
        downloadBtn.style.cssText = btnStyle;
        downloadBtn.innerHTML = `<i class="fa fa-download"></i> تحميل (${codeType.ext.toUpperCase()})`;
        downloadBtn.onclick = function() {
            const blob = new Blob([rawCode], { type: codeType.mime });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `code_${index + 1}.${codeType.ext}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        // ترتيب العناصر (الأزرار على اليسار، نوع الكود على اليمين)
        btnContainer.appendChild(downloadBtn);
        btnContainer.appendChild(copyBtn);
        btnContainer.appendChild(selectBtn);
        
        toolbar.appendChild(langLabel);
        toolbar.appendChild(btnContainer);

        box.insertBefore(toolbar, box.firstChild);
    });
});


jQuery(document).ready(function($) {
    // الصورة الافتراضية 
    var defaultAvatar = 'https://i33.servimg.com/u/f33/19/52/81/36/v4rcln11.png'; 

    $('.a7la-hybrid-row').each(function() {
        var $row = $(this);
        // نأخذ رابط الموضوع من href الخاص بالسطر نفسه لأنه يحتوي على رقم المشاركة (#)
        var topicUrl = $row.attr('href') || $row.find('.a7la-dynamic-forum').attr('data-url');
        var $avatarDiv = $row.find('.a7la-dynamic-avatar');
        var $forumDiv = $row.find('.a7la-dynamic-forum');

        if (topicUrl) {
            // --- استخراج رقم المشاركة (ID) من الرابط ---
            var postId = null;
            var hashIndex = topicUrl.indexOf('#');
            if (hashIndex !== -1) {
                var hashString = topicUrl.substring(hashIndex + 1);
                var match = hashString.match(/\d+/); // استخراج الأرقام فقط (مثل 48)
                if (match) {
                    postId = match[0];
                }
            }

            // مفتاح الكاش (تم تغييره لتحديث الذاكرة وإزالة أي أخطاء سابقة)
            var cacheKey = 'a7la_v16_' + topicUrl;
            var cachedData = sessionStorage.getItem(cacheKey);

            if (cachedData) {
                // عرض من الكاش لتسريع المنتدى
                try {
                    var dataObj = JSON.parse(cachedData);
                    // تأكد إضافي لضمان عدم استدعاء بيانات فارغة
                    if(dataObj && dataObj.avatar) {
                        $avatarDiv.html('<img src="' + dataObj.avatar + '" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">');
                        $forumDiv.html('<i class="fa-solid fa-folder-open"></i> ' + dataObj.forum);
                    }
                } catch(e) {}
            } else {
                // الدخول للموضوع لسحب البيانات
                $.ajax({
                    url: topicUrl,
                    type: 'GET',
                    dataType: 'text', // أمان تام لمنع تعطل الصفحة
                    success: function(data) {
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(data, "text/html");

                        // 1. تحديد المشاركة الصحيحة (دعم كلاسات القالب القديم + القالب الجديد)
                        var targetPost = null;
                        if (postId) {
                            targetPost = doc.querySelector('#post-' + postId) || 
                                         doc.querySelector('.post--' + postId) || 
                                         doc.querySelector('#p' + postId); // القالب الجديد
                        }

                        // إذا لم نجد رقم المشاركة، نأخذ أول مشاركة في الصفحة كبديل احتياطي
                        if (!targetPost) {
                            targetPost = doc.querySelector('article.a7la7ekaya-post-container aside.a7la7ekaya-post-author') || 
                                         doc.querySelector('.a7la7ekaya-main-post') || // الموضوع - القالب الجديد
                                         doc.querySelector('.a7la7ekaya-comment-item') || // التعليق - القالب الجديد
                                         doc.querySelector('.v3-post-card'); // القالب العادي
                        }

                        // 2. استخراج الصورة (دعم كلاسات القالب القديم + القالب الجديد)
                        var avatarSrc = null;
                        if (targetPost) {
                            var avatarImg = targetPost.querySelector('.a7la7ekaya-author-avatar-large img, .v3-avatar-container img, .a7la-avatar-wrapper img, .a7la-comment-avatar-wrap img');
                            if (avatarImg) {
                                avatarSrc = avatarImg.getAttribute('src');
                            }
                        }

                        // تنظيف الرابط
                        if (avatarSrc && avatarSrc.indexOf('//') === 0) {
                            avatarSrc = 'https:' + avatarSrc;
                        }
                        var finalAvatar = avatarSrc ? avatarSrc : defaultAvatar;

                        // 3. استخراج اسم القسم (دعم كلاسات القالب القديم + القالب الجديد)
                        var navLinks = doc.querySelectorAll('.breadcrumbs a.nav, .nav-breadcrumbs .crumb a, .nav a, .a7la7ekaya-breadcrumb a');
                        var forumName = "بدون قسم";
                        if (navLinks.length > 0) {
                            forumName = navLinks[navLinks.length - 1].textContent.trim();
                        }

                        // عرض البيانات في القالب
                        $avatarDiv.html('<img src="' + finalAvatar + '" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">');
                        $forumDiv.html('<i class="fa-solid fa-folder-open"></i> ' + forumName);

                        // حفظ البيانات لتسريعها المرة القادمة
                        sessionStorage.setItem(cacheKey, JSON.stringify({
                            avatar: finalAvatar,
                            forum: forumName
                        }));
                    },
                    error: function() {
                        $avatarDiv.html('<img src="' + defaultAvatar + '" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">');
                    }
                });
            }
        } else {
            $avatarDiv.html('<img src="' + defaultAvatar + '" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">');
        }
    });

    // تأثيرات الظهور
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




$(document).ready(function() {
    // كاش لتقليل الطلبات وجعل التصفح أسرع
    var avatarCache = {};
    var forumCache = {};
    var defaultAvatar = 'https://i33.servimg.com/u/f33/19/52/81/36/v4rcln11.png'; 

    /* ==============================================================
       1. أداة آخر المواضيع (جلب الصور + القسم + الإحصائيات)
       ============================================================== */
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
                    var avatarSrc = $data.find('img[alt="avatar"], img[alt="الصورة الرمزية"], .avatar-default img').first().attr('src');
                    if (avatarSrc) {
                        avatarCache[profileUrl] = avatarSrc; 
                        $row.find('.a7la-dynamic-avatar').attr('src', avatarSrc);
                    }
                });
            }
        }

        // 2. جلب اسم القسم
        if (topicUrl) {
            $.get(topicUrl, function(data) {
                var $topicHtml = $(data);
                
                // --- التحديث هنا: دعم مسار القالب الجديد والقديم معاً ---
                var $navLinks = $topicHtml.find('.a7la7ekaya-breadcrumb a, .breadcrumbs a.nav, .nav-breadcrumbs .crumb a, .nav a');
                
                // استبعاد الرابط الأول (الرئيسية) وأخذ آخر رابط يمثل القسم
                var $lastNav = $navLinks.not('[href="/"]').last(); 
                
                if ($lastNav.length > 0) {
                    var forumName = $lastNav.text().trim();
                    var forumUrl = $lastNav.attr('href');
                    
                    // وضع اسم القسم
                    $row.find('.a7la-dynamic-forum').html('<i class="fa-solid fa-folder-open"></i> ' + forumName);

                    // 3. التوجه للقسم لجلب المشاهدات والردود
                    if (forumUrl) {
                        var topicIdMatch = topicUrl.match(/\/t(\d+)/);
                        if (topicIdMatch) {
                            if (forumCache[forumUrl]) {
                                extractStats(forumCache[forumUrl], topicIdMatch, $row);
                            } else {
                                $.get(forumUrl, function(forumData) {
                                    forumCache[forumUrl] = forumData; 
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

    /* ==============================================================
       دالة استخراج الإحصائيات (تدعم الاستايل الجديد + القديم)
       ============================================================== */
    function extractStats(forumData, topicIdMatch, $row) {
        var $forumHtml = $(forumData);
        var tIdString = '/t' + topicIdMatch[1] + '-'; // صيغة رابط الموضوع الأساسية
        var tIdStringAlt = '/t' + topicIdMatch[1] + 'p'; // صيغة أخرى محتملة
        
        // البحث عن رابط الموضوع داخل القسم المجلوب
        var $topicLink = $forumHtml.find('a[href^="' + tIdString + '"], a[href^="' + tIdStringAlt + '"]');
        
        if ($topicLink.length > 0) {
            // البحث عن الصندوق الحاوي للموضوع (سواء بطاقة التدوينات الجديدة أو السطر القديم)
            var $topicContainer = $topicLink.closest('.a7la7ekaya2026-topic-card, .a7la-topic-row, .a7la-topic-rowa7la-topic-sticky');
            
            var replies = "-";
            var views = "-";

            // أ- استخراج الإحصائيات من تصميم التدوينات "الجديد"
            if ($topicContainer.find('.a7la7ekaya2026-topic-metrics').length > 0) {
                var viewsText = $topicContainer.find('.a7la7ekaya2026-metric[title="مشاهدة"]').text();
                var repliesText = $topicContainer.find('.a7la7ekaya2026-metric[title="تعاليق"]').text();
                
                // تنظيف النصوص للإبقاء على الأرقام فقط
                if(repliesText) replies = repliesText.replace(/[^0-9]/g, '');
                if(viewsText) views = viewsText.replace(/[^0-9]/g, '');
            } 
            // ب- استخراج الإحصائيات من التصميم "القديم"
            else {
                var $stats = $topicContainer.find('.a7la-topic-stats .a7la-stat-box strong');
                if ($stats.length >= 2) {
                    replies = $stats.eq(0).text().trim();
                    views = $stats.eq(1).text().trim();
                }
            }
            
            // كتابة الردود والمشاهدات في القالب
            if (replies !== "") $row.find('.a7la-dynamic-stats .stat:eq(0) span').text(replies);
            if (views !== "") $row.find('.a7la-dynamic-stats .stat:eq(1) span').text(views);
        }
    }

    /* ==============================================================
       2. إضافة صور الأعضاء بجانب الاسم في الأقسام/التدوينات
       ============================================================== */
    $('.a7la7ekaya2026-topic-card').each(function() {
        var $card = $(this);
        var $authorLink = $card.find('.a7la7ekaya2026-topic-author a[href^="/u"]');
        
        if ($authorLink.length > 0) {
            var profileUrl = $authorLink.attr('href');
            
            if ($card.find('.a7la-grid-dynamic-avatar').length === 0) {
                $authorLink.before('<img class="a7la-grid-dynamic-avatar" data-user="'+profileUrl+'" src="'+defaultAvatar+'" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-left: 6px; border: 1px solid var(--gold); box-shadow: 0 0 5px rgba(0,0,0,0.1);">');
            }

            var $avatarImg = $card.find('.a7la-grid-dynamic-avatar');

            if (avatarCache[profileUrl]) {
                $avatarImg.attr('src', avatarCache[profileUrl]);
            } else {
                $.get(profileUrl, function(data) {
                    var $data = $(data);
                    var avatarSrc = $data.find('img[alt="avatar"], img[alt="الصورة الرمزية"], .avatar-default img').first().attr('src');
                    if (avatarSrc) {
                        avatarCache[profileUrl] = avatarSrc; 
                        $('.a7la-grid-dynamic-avatar[data-user="'+profileUrl+'"]').attr('src', avatarSrc);
                    }
                });
            }
        }
    });

    // مؤثرات الظهور عند التمرير
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

/* ==============================================================
   3. نوافذ تسجيل الدخول والخروج
   ============================================================== */
document.addEventListener("DOMContentLoaded", function() {
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

    const logoutBtns = document.querySelectorAll('.eidr-trigger-logout');
    const logoutModal = document.getElementById('eidr-logout-modal');
    const confirmLogoutBtn = document.getElementById('eidr-confirm-logout');
    const cancelLogoutBtn = document.getElementById('eidr-cancel-logout');

    if (logoutBtns.length > 0 && logoutModal) {
        logoutBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); 
                let logoutUrl = this.getAttribute('href'); 
                confirmLogoutBtn.setAttribute('href', logoutUrl); 
                logoutModal.classList.add('active'); 
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


$(document).ready(function() {
    // 1. حساب عدد المواضيع التقريبي من خلال الترقيم
    var totalTopics = 0;
    var paginationText = $('.mobile-hidden-imp').text(); // تبحث عن كلمة "صفحة 1 من أصل 7"
    var totalPagesMatch = paginationText.match(/من اصل (\d+)/) || paginationText.match(/of (\d+)/);
    
    if (totalPagesMatch && totalPagesMatch[1]) {
        var pages = parseInt(totalPagesMatch[1]);
        totalTopics = pages * $('.a7la7ekaya-topic-card').length; // ضرب عدد الصفحات في عدد مواضيع الصفحة الواحدة
    } else {
        totalTopics = $('.a7la7ekaya-topic-card').length; // إذا كانت صفحة واحدة
    }
    
    // 2. حساب عدد المشاهدات والتعليقات الظاهرة في هذه الصفحة
    var totalViews = 0;
    var totalReplies = 0;
    
    // هذه الأكواد تبحث عن الأرقام التي تظهر بجانب أيقونات العين (المشاهدات) وأيقونة الرد (التعليقات)
    $('.a7la7ekaya-topic-metrics').each(function() {
        var viewText = $(this).find('.fa-eye').parent().text().replace(/[^0-9]/g, '');
        var replyText = $(this).find('.fa-reply').parent().text().replace(/[^0-9]/g, '');
        
        if(viewText) totalViews += parseInt(viewText);
        if(replyText) totalReplies += parseInt(replyText);
    });

    // تنسيق الأرقام الكبيرة (مثال: 1200 تصبح 1.2K)
    function formatNumber(num) {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    }

    // طباعة الأرقام في البانر
    if(totalTopics > 0) $('#live-topics').text(formatNumber(totalTopics));
    if(totalReplies > 0) $('#live-replies').text(formatNumber(totalReplies));
    if(totalViews > 0) $('#live-views').text(formatNumber(totalViews));
});

$(document).ready(function() {
    var totalTopics = 0;
    var paginationText = $('.mobile-hidden-imp').text();
    var totalPagesMatch = paginationText.match(/من اصل (\d+)/) || paginationText.match(/of (\d+)/);
    
    if (totalPagesMatch && totalPagesMatch[1]) {
        var pages = parseInt(totalPagesMatch[1]);
        totalTopics = pages * $('.a7la7ekaya2026-topic-card').length; 
    } else {
        totalTopics = $('.a7la7ekaya2026-topic-card').length; 
    }
    
    var totalViews = 0;
    var totalReplies = 0;
    
    $('.a7la7ekaya2026-topic-metrics').each(function() {
        var viewText = $(this).find('.fa-eye').parent().text().replace(/[^0-9]/g, '');
        var replyText = $(this).find('.fa-reply').parent().text().replace(/[^0-9]/g, '');
        
        if(viewText) totalViews += parseInt(viewText);
        if(replyText) totalReplies += parseInt(replyText);
    });

    function formatNumber(num) {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    }

    if(totalTopics > 0) $('#a7la7ekaya2026-live-topics').text(formatNumber(totalTopics));
    if(totalReplies > 0) $('#a7la7ekaya2026-live-replies').text(formatNumber(totalReplies));
    if(totalViews > 0) $('#a7la7ekaya2026-live-views').text(formatNumber(totalViews));
});

