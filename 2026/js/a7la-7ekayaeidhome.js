jQuery(document).ready(function($) {
    // عند الضغط على زر الأقسام الفرعية
    $('.a7la-sub-trigger').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // منع انتقال الضغطة للشاشة
        
        var $wrapper = $(this).closest('.a7la-sub-dropdown-wrapper');
        var $card = $(this).closest('.a7la7ekaya-forum-card'); // استهداف البطاقة الرئيسية
        
        // إغلاق أي قوائم أخرى مفتوحة في بطاقات أخرى
        $('.a7la-sub-dropdown-wrapper').not($wrapper).removeClass('is-active');
        $('.a7la7ekaya-forum-card').not($card).removeClass('has-active-dropdown');
        
        // فتح أو إغلاق القائمة الحالية ورفع بطاقتها
        $wrapper.toggleClass('is-active');
        $card.toggleClass('has-active-dropdown');
    });

    // إغلاق القائمة عند الضغط في أي مكان فارغ في الشاشة
    $(document).on('click', function() {
        $('.a7la-sub-dropdown-wrapper').removeClass('is-active');
        $('.a7la7ekaya-forum-card').removeClass('has-active-dropdown'); // إرجاع البطاقة لمكانها
    });

    // منع الإغلاق عند الضغط بداخل القائمة نفسها
    $('.a7la-sub-menu').on('click', function(e) {
        e.stopPropagation();
    });
});
