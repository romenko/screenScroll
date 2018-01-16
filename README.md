# ScreenScroll
One screen scroll Jquery plugin, that lets you create a one page scroll website. The plugin allows you to create beautiful screens for the entire window from one or several sections. You can set the number of sections on the screen, fix the header or footer depending on the width of the window.

## Install
This package can be installed with:
- npm install --save romenko.screenscroll
- bower install --save romenko.screenscroll

## Usage
Put the required stylesheet at the top of your markup:
```html
<link rel="stylesheet" href="/node_modules/romenko.screenscroll/dist/screenScroll.min.css" />
```

```html
<link rel="stylesheet" href="/bower_components/romenko.screenscroll/dist/screenScroll.min.css" />
```

Put the script at the bottom of your markup right after jQuery:
```html
<script src="/node_modules/jquery/dist/jquery.min.js"></script>
<script src="/node_modules/jquery-mousewheel/jquery.mousewheel.js"></script>
<script src="/node_modules/romenko.screenscroll/dist/screenScroll.min.js"></script>
```

```html
<script src="/bower_components/jquery/dist/jquery.min.js"></script>
<script src="/bower_components/jquery-mousewheel/jquery.mousewheel.js"></script>
<script src="/bower_components/romenko.screenscroll/dist/screenScroll.min.js"></script>
```

Document structure
```html
<header class="header">...</header>
<main class="main">
    <section>1</section>
    <section>2</section>
    <section>3</section>
</main>
<footer class="footer">...</footer>
```

Call the plugin function
```javascript
$('main.main').screenScroll({
    header: $(header.header),
    footer: $(footer.footer)
})
```
## Example
[View demo](http://screenscroll.romenko.com.ua/)
```javascript
$('main.main').screenScroll({
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
```

## Options
```javascript
$('main.main').screenScroll({
    header: $(header.header), //header node
    footer: $(footer.footer), //footer node
    headerFixed: true, // fixed header
    footerFixed: false, // fixed footer
    startScreen: 0, // start plugin position
    scrollTimeOut: 800 // delay after move screen
    responsive : [] // responsive options
})
```
## Events
```javascript
    var screenScroll = $('main.main').screenScroll();

    //When the plugin gets resized.
    screenScroll.on('screenScroll.resize', function(e, data){
       console.log(data);
    });

    //After screen move.
    screenScroll.on('screenScroll.afterMove', function(e, data){
        console.log(data);
    });

    //Before screen move.
    screenScroll.on('screenScroll.beforeMove', function(e, data){
        console.log(data);
    });

    //Move to next item.
    screenScroll.trigger('screenScroll.next');

    //Move to previous screen.
    screenScroll.trigger('screenScroll.prev');

    //Move to screen by index
    screenScroll.trigger('screenScroll.moveTo', 1);

    //Goes to screen by index (Without animation)
    screenScroll.trigger('screenScroll.goTo', 1);

    //Move to screen where has section index.
    screenScroll.trigger('screenScroll.moveToSection', 3);

    //Goes to screen where has section index.
    screenScroll.trigger('screenScroll.goToSection', 3);

    //Move to section where has section id
    screenScroll.trigger('screenScroll.moveToSectionId', 'example');

    //Goes to section where has section id
    screenScroll.trigger('screenScroll.goToSectionId', 'example');
```

## License
The code and the documentation are released under the [MIT License](LICENSE).