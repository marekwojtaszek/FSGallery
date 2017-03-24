(() => {
  'use strict'

  const body = document.body
  const cssStyles = {
    container: {
      'height': '100%',
      'width': '100%',
      'position': 'absolute',
      'top': '0',
      'left': '0',
      'background': '#000',
      'text-align': 'center',
      'z-index': '100000'
    },
    status: {
      'width': '80px',
      'position': 'absolute',
      'top': '0',
      'right': '0',
      'padding': '6px 0',
      'color': '#fff',
      'background': '#000',
      'text-align': 'center',
      'z-index': '1000000'
    },
    slide: {
      'height': '100%',
      'width': '100%',
      'display': 'none',
      'background-position': 'center center',
      'background-repeat': 'no-repeat',
      'background-size': 'contain'
    }
  }

  const closest = (el) => el && (el.id.length > 0 ? el : closest(el.parentNode))

  const addCssStyles = (cssStyles) => {
    const style = document.createElement('style')
    style.appendChild(document.createTextNode(''))    // WebKit hack
    document.head.appendChild(style)

    Object.keys(cssStyles).forEach((el) => {
      style.sheet.insertRule(`.fs-gallery-${el}
        ${JSON.stringify(cssStyles[el])
              .replace(/\"/gi,'')
              .replace(/\,/gi,';')}`, 0)
    })
  }

  const renderDiv = (className, container) => {
    const el = document.createElement('div')
    el.classList.add(`fs-gallery-${className}`)

    if (container) container.appendChild(el)

    return el
  }

  const renderSlides = (className, container, images) => {
    const slides = []
    let slide

    images.forEach((image, i) => {
      image.style.opacity = 0
      slide = renderDiv(className, container)
      slide.style.backgroundImage = 'url(' + image.src + ')',
      slide.appendChild(image)
      slides[i] = slide
    })

    slides[0].style.display = 'block'   // show first image

    return slides
  }

  class Gallery {
    constructor(images) {
      this._container = renderDiv('container')
      this._status    = renderDiv('status', this._container)
      this._slides    = renderSlides('slide', this._container, images)
      this._index     = 0
      this._updateStatus(this._index)   // set initial status

      this.showNextSlide = this._showNextSlide.bind(this)
      this.showPrevSlide = this._showPrevSlide.bind(this)
    }

    get html() {
      return this._container
    }

    _updateStatus(index) {
      this._status.innerText = parseInt(index + 1, 10) + ' / ' + this._slides.length
    }

    _showNextSlide() {
      if (this._index < this._slides.length - 1) {
        this._slides[this._index].style.display   = 'none'
        this._slides[++this._index].style.display = 'block'
        this._updateStatus(this._index)
      }
    }

    _showPrevSlide() {
      if (this._index > 0) {
        this._slides[this._index].style.display   = 'none'
        this._slides[--this._index].style.display = 'block'
        this._updateStatus(this._index)
      }
    }
  }

  function generateGallery (e) {
    if (e.target.tagName === 'IMG' && e.target !== e.currentTarget) {
      const images = document.querySelectorAll(`#${closest(e.target.parentNode).id} img`)
      const gallery = new Gallery(images)

      document.documentElement.style.height = '100%'
      Object.assign(body.style, { height: '100%', padding: 0 })
      body.innerHTML = ''     // reset page content
      body.appendChild(gallery.html)

      addCssStyles(cssStyles)

      document.removeEventListener('click', generateGallery)

      document.addEventListener('click', gallery.showNextSlide, false)
      document.addEventListener('keypress', ({which}) => {
        const keys = {
          '0'   : gallery.showNextSlide,  // spacebar
          '32'  : gallery.showNextSlide,  // spacebar
          '108' : gallery.showNextSlide,  // 'l' key
          '107' : gallery.showPrevSlide   // 'k' key
        }

        if (typeof keys[which] !== 'function') return
        else keys[which]()
      }, false)
    }

    e.preventDefault()
    e.stopPropagation()
  }

  function activateClickListener () {
    if (!document.processed) {
      document.processed = true      // allow gallery to be processed just once
      document.addEventListener('click', generateGallery, false)
    }
  }

  document.processed = document.processed || false

  activateClickListener()
})()
