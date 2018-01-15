/**
 * screenScroll v1.0.0
 * Copyright 2018 Roman Yeromenko
 * http://romenko.com.ua
 * @version 1.0.0
 * @author Roman Yeromenko
 * @license The MIT License (MIT)
 */

(function ($) {

    var defaults = {
        header: false,
        footer: false,
        startScreen: 0,
        scrollTimeOut: 800,
        headerFixed: false,
        footerFixed: false,
        responsive: null,
    };

    $.fn.screenScroll = function (options) {
        var settings = $.extend({}, defaults, options);
        var el = $(this);
        var tmpHeaderFixed, tmpFooterFixed;
        var allSections = $(this).children('section');
        var options = {
            windowHeight: 0,
            windowWidth: 0,
            headerHeight: 0,
            footerHeight: 0,
            screenCount: 0,
            headerFixed: (settings.headerFixed != undefined) ? settings.headerFixed : defaults.headerFixed,
            footerFixed: (settings.footerFixed != undefined) ? settings.footerFixed : defaults.footerFixed,
            responsiveKey: null,
            responsiveStructure: null,
            /**
             * Get the width and height window, header, footer value
             * @returns {Object} Options object
             */
            getValues: function () {
                this.windowHeight = $(window).height();
                this.windowWidth = $(window).width();
                this.headerHeight = (settings.header) ? settings.header.outerHeight() : 0;
                this.footerHeight = (settings.footer) ? settings.footer.outerHeight() : 0;
                return this;
            },
            /**
             * Get responsive key for the current responsive option
             * @returns {null|number}
             */
            getResponsiveKey: function () {
                this.getValues();
                if (settings.responsive != null) {
                    var windowWidth = this.windowWidth;
                    var responsiveKey = null;
                    $.each(settings.responsive, function (key, value) {
                        if (windowWidth > key) {
                            responsiveKey = key;
                        }
                    });
                    this.responsiveKey = responsiveKey;
                }
                return this.responsiveKey;
            },
            /**
             * Get the current responsive options
             * @returns {Object}
             */
            getResponsiveOptions: function () {
                if (this.getResponsiveKey() != null) {
                    var responsiveOptions = settings.responsive[this.responsiveKey];
                    responsiveOptions.headerFixed = (responsiveOptions.headerFixed != undefined) ? responsiveOptions.headerFixed : this.headerFixed;
                    responsiveOptions.footerFixed = (responsiveOptions.footerFixed != undefined) ? responsiveOptions.footerFixed : this.footerFixed;
                    return responsiveOptions;
                } else {
                    var responsiveOptions = {};
                    responsiveOptions.headerFixed = this.headerFixed;
                    responsiveOptions.footerFixed = this.footerFixed;
                    return responsiveOptions
                }
            },
            /**
             * Create responsive documents structure and set it to options.responsiveStructure.
             * The structure has numbers of all screens and contains the number of sections that
             * were used for the current + previous screens.
             * @returns {Object}
             */
            createResponsiveStructure: function () {
                if (settings.responsive != null) {
                    var structure = {};
                    var sectionCount = allSections.length;
                    $.each(settings.responsive, function (index, responsiveOption) {
                        if (responsiveOption.screens != undefined) {
                            var responsive = [];
                            var responsiveCount = 0;
                            $.each(responsiveOption.screens, function (indexScreen, screen) {
                                var section = screen.sections.sort();
                                responsiveCount += section.length;
                            });
                            responsiveCount = responsiveOption.screens.length + (sectionCount - responsiveCount);
                            var sectionStart = 0;
                            for (var i = 0; i < responsiveCount; i++) {
                                var inSection = false;
                                $.each(responsiveOption.screens, function (indexScreen, screen) {
                                    var section = screen.sections.sort();
                                    if (section.indexOf(sectionStart) != -1) {
                                        inSection = true;
                                        if (responsive[i] == undefined) {
                                            responsive[i] = section.length;
                                            sectionStart += section.length;
                                        }
                                    }
                                });
                                if (!inSection) {
                                    responsive[i] = 1;
                                    sectionStart += 1;
                                }
                                if (i != 0) {
                                    responsive[i] += responsive[i - 1];
                                }
                            }
                            structure[index] = responsive;
                        }
                    });
                    return this.responsiveStructure = structure;
                }
            },
            /**
             * Convert screen number from window with old responsive options to new.
             * @param index - The old screen number
             * @param oldResponsiveKey - The old responsive options key
             * @param newResponsiveKey - The current responsive options key
             * @returns {number} - The new screen number
             */
            convertCurrentIndex: function (index, oldResponsiveKey, newResponsiveKey) {
                defaultStructure = [];
                for (var i = 0; i < allSections.length; i++) {
                    defaultStructure.push(i + 1);
                }

                var oldResponsiveStructure = (this.responsiveStructure[oldResponsiveKey]) ? this.responsiveStructure[oldResponsiveKey] : defaultStructure;
                var newResponsiveStructure = (this.responsiveStructure[newResponsiveKey]) ? this.responsiveStructure[newResponsiveKey] : defaultStructure;
                var newIndex = 0;

                var hash = (index != 0) ? oldResponsiveStructure[index - 1] + 1 : oldResponsiveStructure[index - 1];
                $.each(newResponsiveStructure, function (i, value) {
                    if (value >= hash) {
                        newIndex = i;
                        return false;
                    }
                });
                return newIndex;
            },
            /**
             * Get the number of the screen that has section with this index
             * @param sectionIndex - The section number
             * @returns {number}
             */
            getScreenFromSectionIndex : function(sectionIndex) {
                if (this.responsiveStructure[this.responsiveKey] != null) {
                    var screenSctructure = this.responsiveStructure[this.responsiveKey];
                    var screenIndex = 0;
                    $.each(screenSctructure, function (i, v) {
                        if (sectionIndex <= v) {
                            screenIndex = i;
                            return false;
                        }
                    });
                    return screenIndex;
                }

                return sectionIndex-1;
            }

        };

        var screens = {
            canMove: true,
            count: 0,
            currentScreenIndex: settings.startScreen ? settings.startScreen : 0,
            responsiveKey: null,
            screenHeight: options.windowHeight,
            screenHeightFirst: options.windowHeight,
            screenHeightLast: options.windowHeight,
            /**
             * Init screen function
             */
            init: function () {
                this.createScreens();
                options.createResponsiveStructure();
                if (this.currentScreenIndex != 0) {
                    this.to(this.currentScreenIndex)
                }
            },
            /**
             * Get all responsive options
             * @returns {Object}
             */
            getScreenOptions: function () {
                var responsiveOptions = options.getResponsiveOptions();
                if (responsiveOptions != null) {
                    if (responsiveOptions.screens != undefined) {
                        return responsiveOptions.screens;
                    }
                }
                return null;
            },
            /**
             * Get all screens
             * @returns {jQuery}
             */
            getAll: function () {
                return el.children('section.screen');
            },
            /**
             * Create all screens by options
             */
            createScreens: function () {
                this.responsiveKey = options.getResponsiveKey();
                var screenOptions = this.getScreenOptions();
                if (screenOptions) {
                    $.each(screenOptions, function (screenIndex, screen) {
                        if (screen.sections != undefined) {
                            var screenNode = $();
                            $.each(screen.sections, function (index, sectionIndex) {
                                screenNode = $(screenNode).add(allSections.eq(sectionIndex));
                            });
                            screenNode.wrapAll('<section class="screen"></section>');
                        }
                    });
                    el.children('section').not('.screen').wrap('<section class="screen"></section>');
                } else {
                    el.children('section').wrap('<section class="screen"></section>');
                }
                this.setScreenHeight(options.windowHeight);
                this.mouseEvents(this.getAll());
                this.count = this.getAll().length;
            },
            /**
             * Set screen height
             * @param height
             */
            setScreenHeight: function (height) {
                var h = height;
                var responsiveOptions = options.getResponsiveOptions();
                if (responsiveOptions.headerFixed) {
                    if (settings.header) {
                        $(settings.header).addClass('fixedHeader');
                    }
                    h -= options.headerHeight;
                    this.getAll().css('padding-top', options.headerHeight);
                }
                if (responsiveOptions.footerFixed) {
                    if (settings.footer) {
                        $(settings.footer).addClass('fixedFooter');
                    }
                    h -= options.footerHeight;
                    this.getAll().css('padding-bottom', options.footerHeight);
                }
                this.getAll().height(h);
                this.screenHeight = this.screenHeightFirst = this.screenHeightLast = h;
                if (!responsiveOptions.headerFixed) {
                    if (settings.header) {
                        $(settings.header).removeClass('fixedHeader');
                    }
                    this.screenHeightFirst = this.screenHeightFirst - options.headerHeight;
                    this.getAll().first().height(this.screenHeightFirst);
                }
                if (!responsiveOptions.footerFixed) {
                    if (settings.footer) {
                        $(settings.footer).removeClass('fixedFooter');
                    }
                    this.screenHeightLast = this.screenHeightLast - options.footerHeight;
                    this.getAll().last().height(this.screenHeightLast);
                }
                this.setSectionHeight();
            },
            /**
             * Set sections height
             */
            setSectionHeight: function () {
                var screens = this.getScreenOptions();
                var el = this;
                $.each(screens, function (index, screen) {
                    //console.log(screen);
                    if (screen.sections != undefined) {
                        function compareNumbers(a, b) {
                            return a - b;
                        }

                        $.each(screen.sections, function (i, sectionIndex) {
                            if (screen.size != undefined && screen.size != 100) {
                                if (screen.sections.sort(compareNumbers)[0] == 0) {
                                    allSections.eq(sectionIndex).height((el.screenHeightFirst) / (100 / screen.size));
                                } else {
                                    if (screen.sections.sort(compareNumbers)[screen.sections.length - 1] == allSections.length - 1) {
                                        allSections.eq(sectionIndex).height((el.screenHeightLast) / (100 / screen.size));
                                    } else {
                                        allSections.eq(sectionIndex).height(el.screenHeight / (100 / screen.size));
                                    }
                                }
                            }
                        });
                    }
                });
            },
            /**
             * Mouse events for the screens
             * @param {jQuery} elems
             */
            mouseEvents: function (elems) {
                elems.on("touchmove", function (e) {
                    e.preventDefault();
                    //e.stopPropagation();
                });
                var obj = this;
                var ts;
                var tsx;
                elems.bind('touchstart', function (e) {
                    ts = e.originalEvent.touches[0].clientY;
                    tsx = e.originalEvent.touches[0].clientX;
                });

                elems.bind('touchend', function (e) {
                    var te = e.originalEvent.changedTouches[0].clientY;
                    var tex = e.originalEvent.changedTouches[0].clientX;
                    var deltaY = Math.abs(te - ts);
                    var deltaX = Math.abs(tex - tsx);

                    if (deltaY > deltaX) {
                        if (ts > te + 5) {
                            if (!$(this).is(':last-child')) {
                                obj.moveToNext();
                            }
                        } else if (ts < te - 5) {
                            if (!$(this).is(':first-child')) {
                                obj.moveToPrev();
                            }
                        }
                    }
                });

                elems.on('mousewheel', function (e) {
                    e.preventDefault();
                    if (e.originalEvent.deltaY > 0) {
                        if (!$(this).is(':last-child')) {
                            obj.moveToNext();
                        }
                    } else {
                        if (!$(this).is(':first-child')) {
                            obj.moveToPrev();
                        }
                    }
                });
            },
            /**
             * Move to next screen
             * @returns {boolean}
             */
            moveToNext: function () {
                if (this.moveTo(this.currentScreenIndex + 1)) {
                    return true;
                }

                return false;
            },
            /**
             * Move to previous screen
             * @returns {boolean}
             */
            moveToPrev: function () {
                if (this.moveTo(this.currentScreenIndex - 1)) {
                    return true;
                }

                return false;
            },
            /**
             * Move to screen index without animation
             * @param index
             * @returns {boolean}
             */
            to: function (index) {
                if (index < 0 || index >= this.count) {
                    return false;
                }
                var h = -1 * index * options.windowHeight;
                var transition = $('.screen-transition');
                transition.removeClass('screen-transition');
                transition.css('transform', 'translate3d(0, ' + h + 'px, 0)');
                transition.css('-webkit-transform', 'translate3d(0, ' + h + 'px, 0)');
                transition.css('-o-transform', 'translate3d(0, ' + h + 'px, 0)');
                transition.css('transform', 'translate3d(0, ' + h + 'px, 0)');
                this.currentScreenIndex = index;
                setTimeout(function () {
                    transition.addClass('screen-transition');
                }, 50);
            },
            /**
             * Move to screen index
             * @param index
             * @returns {boolean}
             */
            moveTo: function (index) {
                if (index < 0 || index >= this.count) {
                    return false;
                }
                if (this.canMove) {
                    el.trigger('screenScroll.beforeMove', {
                        currentScreenIndex: screens.currentScreenIndex,
                        currentScreen: this.getAll().eq(screens.currentScreenIndex),
                        responsiveOptions: options.getResponsiveOptions()
                    });
                    var h = -1 * index * options.windowHeight;
                    this.move(h);
                    this.canMove = false;
                    this.currentScreenIndex = index;
                    var obj = this;
                    setTimeout(function () {
                        obj.canMove = true;
                    }, settings.scrollTimeOut);
                    el.trigger('screenScroll.afterMove', {
                        currentScreenIndex: index,
                        currentScreen: this.getAll().eq(index),
                        responsiveOptions: options.getResponsiveOptions()
                    });
                    return true;
                }

                return false;
            },
            /**
             * Move to section index
             * @param sectionIndex
             * @returns {boolean}
             */
            moveToSection: function (sectionIndex) {
                var index = options.getScreenFromSectionIndex(sectionIndex);
                return (typeof index == "number") ? this.moveTo(index) : false;
            },
            /**
             * Move to section index without animation
             * @param sectionIndex
             * @returns {boolean}
             */
            goToSection : function (sectionIndex) {
                var index = options.getScreenFromSectionIndex(sectionIndex);
                return (typeof index == "number") ? this.to(index) : false;
            },
            /**
             * Move to section #id without animation
             * @param id
             * @returns boolean
             */
            goToSectionId : function (id) {
                var section = allSections.filter('#'+id);
                if(section.length > 0){
                    var index = options.getScreenFromSectionIndex(allSections.index(section));
                    return (typeof index == "number") ? this.to(index) : false;
                }
                return false;
            },
            /**
             * Move to section #id
             * @param id
             * @returns {boolean}
             */
            moveToSectionId : function (id) {
                var section = allSections.filter('#'+id);
                if(section.length > 0){
                    var index = options.getScreenFromSectionIndex(allSections.index(section)+1);
                    return (typeof index == "number") ? this.moveTo(index) : false;
                }
                return false;
            },
            /**
             * Move container to offset number
             * @param offset
             */
            move: function (offset) {
                $('.screen-transition').animate({textIndent: 0}, {
                    step: function (go) {
                        $(this).css('-moz-transform', 'translate3d(0, ' + offset + 'px, 0)');
                        $(this).css('-webkit-transform', 'translate3d(0, ' + offset + 'px, 0)');
                        $(this).css('-o-transform', 'translate3d(0, ' + offset + 'px, 0)');
                        $(this).css('transform', 'translate3d(0, ' + offset + 'px, 0)');
                    },
                    duration: 0,
                });
            },
            /**
             * Remove screens
             */
            destroy: function () {
                el.children('section.screen').children().unwrap().height('');
                this.count = 0;
            },
            /**
             * Recreate screens with new options
             */
            refresh: function () {
                var newResponsiveKey = options.getResponsiveKey();
                if (this.responsiveKey != newResponsiveKey) {
                    var currentIndex = options.convertCurrentIndex(this.currentScreenIndex, this.responsiveKey, newResponsiveKey);
                    this.destroy();
                    this.createScreens();
                    this.to(currentIndex);
                    this.currentScreenIndex = currentIndex;
                } else {
                    options.getValues();
                    this.setScreenHeight(options.windowHeight);
                    this.to(this.currentScreenIndex);
                }
            }
        }

        /**
         * Main init function
         */
        function init() {
            wrapPage();
            screens.init();
            onResize();

            $('*[data-screenscroll="next"]').on('click', function () {
                screens.canMove = true;
                screens.moveToNext();
                return el;
            });
            $('*[data-screenscroll="prev"]').on('click', function () {
                screens.canMove = true;
                screens.moveToPrev();
                return el;
            });
            $('*[data-screenscroll-movetosection]').on('click', function () {
                var data = $(this).data('screenscroll-movetosection');
                if(data == "") return false;
                screens.canMove = true;
                if(typeof data == "string"){
                    screens.moveToSectionId(data);
                }
                if(typeof data == 'number'){
                    screens.moveToSection(data);
                }
                return false
            });
            $('*[data-screenscroll-gotosection]').on('click', function () {
                var data = $(this).data('screenscroll-gotosection');
                if(data == "") return false;
                screens.canMove = true;
                if(typeof data == "string"){
                    screens.goToSectionId(data);
                }
                if(typeof data == 'number'){
                    screens.goToSection(data);
                }
                return false
            });
            $('*[data-screenscroll-moveto]').on('click', function () {
                var data = $(this).data('screenscroll-moveto');
                screens.canMove = true;
                if(typeof data == 'number'){
                    screens.moveTo(data);
                }
                return false
            });
            $('*[data-screenscroll-goto]').on('click', function () {
                var data = $(this).data('screenscroll-goto');
                screens.canMove = true;
                if(typeof data == 'number'){
                    screens.to(data);
                }
                return false
            });
            $(window).on('screenScroll.next', function () {
                screens.canMove = true;
                screens.moveToNext();
                return el;
            });
            $(window).on('screenScroll.prev', function () {
                screens.canMove = true;
                screens.moveToPrev();
                return el;
            });
            $(window).on('screenScroll.moveTo', function (e, index) {
                screens.canMove = true;
                screens.moveTo(index);
                return el;
            });
            $(window).on('screenScroll.goTo', function (e, index) {
                screens.canMove = true;
                screens.to(index);
                return el;
            });
            $(window).on('screenScroll.moveToSection', function (e, index) {
                screens.canMove = true;
                screens.moveToSection(index);
                return el;
            });
            $(window).on('screenScroll.goToSection', function (e, index) {
                screens.canMove = true;
                screens.goToSection(index);
                return el;
            });
            $(window).on('screenScroll.goToSectionId', function (e, id) {
                screens.canMove = true;
                screens.goToSectionId(id);
                return el;
            });
            $(window).on('screenScroll.moveToSectionId', function (e, id) {
                screens.canMove = true;
                screens.moveToSectionId(id);
                return el;
            });
            el.trigger('screenScroll.init', {
                options: options,
                screens: screens
            });
        }

        function onResize() {
            $(window).resize(function (e) {
                wrapPage();
                screens.refresh();
                el.trigger('screenScroll.resize', {
                    options: options,
                    screens: screens
                });
            });
        }

        /**
         * Wrap nodes in screen-scroll container
         */
        function wrapPage() {
            $('html').addClass('screen-scroll');
            var responsive = options.getResponsiveOptions();
            if (tmpHeaderFixed != responsive.headerFixed || tmpFooterFixed != responsive.footerFixed) {
                var wrap = el;
                $('#screen-scroll').children().unwrap();
                wrap = (settings.header && !responsive.headerFixed) ? wrap.add(settings.header) : wrap;
                wrap = (settings.footer && !responsive.footerFixed) ? wrap.add(settings.footer) : wrap;
                wrap.wrapAll('<div id="screen-scroll" class="screen-transition"></div>');
                tmpHeaderFixed = responsive.headerFixed;
                tmpFooterFixed = responsive.footerFixed;
            }
        }

        init();
        return el;
    };
})(jQuery);