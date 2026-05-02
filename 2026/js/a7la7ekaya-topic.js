$(document).ready(function() {
        // 1. تحويل الصور المكسورة إلى أيقونات FontAwesome للمشاركات
        $('.v3-tools-right a').each(function() {
            var $img = $(this).find('img');
            if ($img.length > 0) {
                var imgClass = $img.attr('class') || '';
                var title = $img.attr('title') || '';
                var newIcon = '';
                if (imgClass.indexOf('i_icon_quote') !== -1) newIcon = '<i class="fa-solid fa-quote-right"></i>';
                else if (imgClass.indexOf('i_icon_edit') !== -1) newIcon = '<i class="fa-solid fa-pen-to-square"></i>';
                else if (imgClass.indexOf('i_icon_delete') !== -1) newIcon = '<i class="fa-solid fa-trash-can"></i>';
                else if (imgClass.indexOf('i_icon_ip') !== -1) newIcon = '<i class="fa-solid fa-globe"></i>'; 
                else if (imgClass.indexOf('i_icon_report') !== -1) newIcon = '<i class="fa-solid fa-flag"></i>';
                else if (imgClass.indexOf('multiquote') !== -1) newIcon = '<i class="fa-solid fa-reply-all"></i>';

                if (newIcon !== '') { $(this).html(newIcon); $(this).attr('title', title); }
            }
        });
        $('.v3-tools-right li').each(function() { if ($(this).html().trim() === '') { $(this).remove(); } });

        // 2. معالجة وتجميل أزرار المشرفين السفلية (topic-admin)
        $('.topic-admin a').each(function() {
            var href = $(this).attr('href') || '';
            var text = $(this).attr('title') || $(this).find('img').attr('alt') || '';
            var icon = '';

            if (href.indexOf('mode=delete') !== -1) { icon = '<i class="fa-solid fa-trash-can" style="color:#e74c3c;"></i>'; text = text || "حذف"; } 
            else if (href.indexOf('mode=trash') !== -1) { icon = '<i class="fa-solid fa-recycle" style="color:#27ae60;"></i>'; text = text || "سلة"; } 
            else if (href.indexOf('mode=move') !== -1) { icon = '<i class="fa-solid fa-truck-fast"></i>'; text = text || "نقل"; } 
            else if (href.indexOf('mode=lock') !== -1) { icon = '<i class="fa-solid fa-lock" style="color:#e67e22;"></i>'; text = text || "قفل"; } 
            else if (href.indexOf('mode=unlock') !== -1) { icon = '<i class="fa-solid fa-lock-open" style="color:#27ae60;"></i>'; text = text || "فتح"; } 
            else if (href.indexOf('mode=split') !== -1) { icon = '<i class="fa-solid fa-scissors"></i>'; text = text || "تقسيم"; } 
            else if (href.indexOf('/merge') !== -1) { icon = '<i class="fa-solid fa-code-merge"></i>'; text = text || "دمج"; }

            if (icon !== '') {
                $(this).html(icon + ' ' + text);
            }
        });
        // إزالة الفراغات المزعجة بين أزرار الإدارة الناتجة عن الكود الأصلي
        $('.topic-admin').contents().filter(function() { return this.nodeType === 3; }).remove();

        // 3. تنظيف أزرار اللايك
        $('.v3-tools-left button').each(function(){
            var icon = $(this).find('i')[0] ? $(this).find('i')[0].outerHTML : '';
            var count = $(this).text().replace(/[^0-9]/g, ''); 
            $(this).html(icon + (count ? ' <span>' + count + '</span>' : ''));
        });
        
        // 4. إصلاح روابط المراقبة والترقيم
        $('.v3-dash-box a[href*="unwatch"]').html('<i class="fa-solid fa-bell-slash"></i> إلغاء مراقبة الموضوع').css({'text-decoration':'none', 'color':'var(--text-dark)', 'font-weight':'bold'});
        $('.v3-dash-box a[href*="watch="]').html('<i class="fa-solid fa-bell"></i> مراقبة الموضوع').css({'text-decoration':'none', 'color':'var(--primary)', 'font-weight':'bold'});
        
        $('.v3-pagination-box a.mobile-hidden-imp').each(function() {
            var text = $(this).text();
            $(this).html('<i class="fa-solid fa-layer-group"></i> ' + text);
        });
    });

// تنظيف أسماء الأوسمة من النقطتين الرأسيتين لتصبح أجمل
        $('.v3-badge-label').each(function() {
            var text = $(this).text().replace(':', '').replace(':', '').trim();
            $(this).text(text);
        });

document.addEventListener('DOMContentLoaded', function() {
    // 1. تعريب الأزرار
    var sendBtn = document.querySelector('.quick-reply-send');
    var previewBtn = document.querySelector('.quick-reply-preview');
    
    if(sendBtn) { sendBtn.value = 'إرسال الرد'; }
    if(previewBtn) { previewBtn.value = 'معاينة الرد'; }

    // 2. نقل وترتيب زر رفع الصورة
    var uploadBtn = document.querySelector('.quick-reply-upload');
    var sideBtnsContainer = document.querySelector('.quick-reply-side-btns');
    
    if(uploadBtn && sideBtnsContainer) {
        // نقل الزر ليكون أول زر في القائمة الجانبية
        sideBtnsContainer.insertBefore(uploadBtn, sideBtnsContainer.firstChild);
        
        // التحقق من عدم إضافة النص مسبقاً لتجنب التكرار
        if(!uploadBtn.querySelector('.upload-text')) {
            uploadBtn.innerHTML += '<span class="upload-text" style="font-family:inherit;">رفع صورة</span>';
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const topics = document.querySelectorAll('.a7la-effect-hidden');
    
    // مراقب العناصر عند ظهورها (Scroll Animation) يعمل فقط للنمط الثابت
    if(topics.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('a7la-effect-visible');
                    }, Array.from(topics).indexOf(entry.target) * 100); 
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        topics.forEach((topic) => {
            observer.observe(topic);
        });
    }
});
