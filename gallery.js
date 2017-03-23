/**
 * gallery.js
 */

(function() {
    "use strict";

    var body  = document.body;
    var index = 0;
    var wrapper;
    var status;
    var slides;
    var slidesCount;
    var i,j;

    function updateStatus (index) {
        status.innerText = parseInt(index + 1, 10) + ' / ' + slidesCount;
    }

    function showNextSlide () {
        if (index < slidesCount - 1) {
            slides[index].style.display   = 'none';
            slides[++index].style.display = 'block';
            updateStatus(index);
        }
    }

    function showPrevSlide () {
        if (index > 0) {
            slides[index].style.display   = 'none';
            slides[--index].style.display = 'block';
            updateStatus(index);
        }
    }

    function closest (el) {
        return el && (el.id.length > 0 ? el : closest(el.parentNode));
    }

    function generateGallery (event) {
        if (event.target.tagName === 'IMG' && event.target !== event.currentTarget) {
            var images = document.querySelectorAll('#' + closest(event.target.parentNode).id + ' img');

            document.documentElement.style.height = '100%';  // apply styles for HTML element
            body.style.height  = '100%';                     // apply styles for body element
            body.style.padding = '0';                        // apply styles for body element

            body.innerHTML = '';

            wrapper = renderWrapper();
            status  = renderStatus();
            slides  = renderSlides(images, wrapper);
            slidesCount = slides.length;

            updateStatus(index);   // set initial status

            document.removeEventListener('click', generateGallery);     // remove listener for click for gallery generation

            document.addEventListener('click', showNextSlide, false);   // add listener for click for next slide
            document.addEventListener('keypress', keypress, false);     // add listener for keypress for prev / next slide
        }

        event.preventDefault();
        event.stopPropagation();
    }

    function renderWrapper () {
        var wrapper = document.createElement('div');
        wrapper.style.height     = '100%';
        wrapper.style.width      = '100%';
        wrapper.style.position   = 'absolute';
        wrapper.style.top        = '0';
        wrapper.style.left       = '0';
        wrapper.style.zIndex     = '100000';
        wrapper.style.background = '#000';
        wrapper.style.textAlign  = 'center';

        body.appendChild(wrapper);

        return wrapper;
    }

    function renderStatus () {
        var status = document.createElement('div');
        status.style.width      = '80px';
        status.style.position   = 'absolute';
        status.style.top        = '0';
        status.style.right      = '0';
        status.style.zIndex     = '1000000';
        status.style.color      = '#fff';
        status.style.background = 'rgba(0,0,0,0.6)';
        status.style.textAlign  = 'center';
        status.style.padding    = '6px 0';

        body.appendChild(status);

        return status;
    }

    function renderImage(src) {
        var img = document.createElement('img');
        img.src = src;
        img.style.opacity = 0;

        return img;
    }

    function renderSlides (images, wrapper) {
        var slides = [];
        var el;

        for (i = 0, j = images.length; i < j; i++) {
            el = document.createElement('div');
            el.style.height             = '100%';
            el.style.width              = '100%';
            el.style.display            = 'none';
            el.style.backgroundImage    = 'url(' + images[i].src + ')';
            el.style.backgroundPosition = 'center center';
            el.style.backgroundRepeat   = 'no-repeat';
            el.style.backgroundSize     = 'contain';
            el.appendChild(renderImage(images[i].src));
            slides[i] = el;             // replace current image with image block

            wrapper.appendChild(el);
        }

        slides[0].style.display = 'block';  // show first image

        return slides;
    }

    function activateClickListener () {
        if (!document.processed) {
            document.processed = true;      // allow gallery to be processed just once
            document.addEventListener('click', generateGallery, false);
        }
    }

    function keypress (event) {
        var key = event.which;

        if (typeof keys[key] !== 'function') {
            return;
        } else {
            keys[key]();
        }
    }

    var keys = {
        '0'   : showNextSlide,  // spacebar
        '32'  : showNextSlide,  // spacebar
        '108' : showNextSlide,  // 'l' key
        '107' : showPrevSlide   // 'k' key
    };

    document.processed = document.processed || false;

    activateClickListener();
})();
