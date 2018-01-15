$(function () {
    var screenScroll = $('main.main').screenScroll({
        header: $('header.header'),
        footer: $('footer.footer'),
        headerFixed: true,
        footerFixed: false,
        responsive: {
            960: {
                headerFixed: false,
                footerFixed: false,
                screens: [
                    {
                        size: 50,
                        sections: [0, 1]
                    },
                    {
                        size: 50,
                        sections: [3, 4]
                    },
                    {
                        size: 50,
                        sections: [5, 6]
                    }
                ]
            }
        }

    });

    screenScroll.on('screenScroll.resize', function(e, data){
       console.log(data);
    });

    screenScroll.on('screenScroll.afterMove', function(e, data){
        console.log(data);
    });

    screenScroll.on('screenScroll.beforeMove', function(e, data){
        console.log(data);
    });

    screenScroll.trigger('screenScroll.next');

    screenScroll.trigger('screenScroll.prev');

    screenScroll.trigger('screenScroll.moveTo', 1);

    screenScroll.trigger('screenScroll.goTo', 1);

    screenScroll.trigger('screenScroll.moveToSection', 3);

    screenScroll.trigger('screenScroll.goToSection', 3);

    screenScroll.trigger('screenScroll.moveToSectionId', 'example');

    screenScroll.trigger('screenScroll.goToSectionId', 'example');


    $('.navigation').mobileNav();
});

(function ($) {
    $.fn.mobileNav = function () {
        var el = $(this);
        init();

        function init() {
            mainMenu();
            setMenuMode();
        }

        $('html').on('click', function () {
            menuClose();
        });

        function menuClose() {
            if (el.data('mode') == 'mobile' && el.hasClass('open')) {
                el.animate({
                    left: '-100%'
                }, 500);
                el.removeClass('open');
                el.addClass('close');
            }
        }

        function setMenuMode() {
            var w = $(document).width();
            var offset = 15;
            if ($('#one-page').length > 0)
                offset = 0;
            if (w < 795 - offset) {
                el.attr('data-mode', 'mobile');
                if (el.hasClass('open')) {
                    el.css('left', '-15px');
                } else {
                    el.css('left', '-100%');
                }

            } else {
                el.attr('data-mode', 'full');
                el.removeClass('open');
                el.removeClass('close');
                el.css('left', 0);
            }
        }

        function mainMenu() {
            $(window).resize(function () {
                setMenuMode();
            });
            $('*[data-event="menu"]').on('click', function (e) {
                openMenu();
                e.stopPropagation();
            });
            el.find('a').on('click', function(){
               menuClose();
            });
        }

        function openMenu() {
            if (el.data('mode') == 'mobile') {
                el.animate({
                    left: '-15px'
                }, 500);
                el.removeClass('close');
                el.addClass('open');
            }
        }
    };

})(jQuery);