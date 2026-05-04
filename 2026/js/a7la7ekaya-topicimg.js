jQuery(document).ready(function($) {
    // الصورة الافتراضية 
    var defaultAvatar = 'https://2img.net/i.imgur.com/V4RclNb.png'; 

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

            // مفتاح الكاش 
            var cacheKey = 'a7la_v11_' + topicUrl;
            var cachedData = sessionStorage.getItem(cacheKey);

            if (cachedData) {
                // عرض من الكاش لتسريع المنتدى
                try {
                    var dataObj = JSON.parse(cachedData);
                    $avatarDiv.html('<img src="' + dataObj.avatar + '" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">');
                    $forumDiv.html('<i class="fa-solid fa-folder-open"></i> ' + dataObj.forum);
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

                        // 1. تحديد المشاركة الصحيحة بناءً على الـ ID الذي أرسلته لي
                        var targetPost = null;
                        if (postId) {
                            // البحث عن <article id="post-41">
                            targetPost = doc.querySelector('#post-' + postId) || doc.querySelector('.post--' + postId);
                        }

                        // إذا لم نجد رقم المشاركة، نأخذ أول مشاركة في الصفحة كبديل احتياطي
                        if (!targetPost) {
                            targetPost = doc.querySelector('article.v3-post-card, .post');
                        }

                        // 2. استخراج الصورة من داخل المشاركة المحددة (عبر الكلاس الذي أرسلته)
                        var avatarSrc = null;
                        if (targetPost) {
                            var avatarImg = targetPost.querySelector('.v3-avatar-container img');
                            if (avatarImg) {
                                avatarSrc = avatarImg.getAttribute('src');
                            }
                        }

                        // تنظيف الرابط
                        if (avatarSrc && avatarSrc.indexOf('//') === 0) {
                            avatarSrc = 'https:' + avatarSrc;
                        }
                        var finalAvatar = avatarSrc ? avatarSrc : defaultAvatar;

                        // 3. استخراج اسم القسم
                        var navLinks = doc.querySelectorAll('.breadcrumbs a.nav, .nav-breadcrumbs .crumb a, .nav a');
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