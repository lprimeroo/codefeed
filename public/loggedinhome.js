$(document).on('scroll', function() {
     if ($(document).scrollTop() > 0) {
        $('.nav').addClass('nav--shrink');
     } else {
        $('.nav').removeClass('nav--shrink');
     }
});

