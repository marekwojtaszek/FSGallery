(() => {
  "use strict";

  const body = document.body;
  const aE = document.addEventListener;
  const rE = document.removeEventListener;

  const cssStyles = {
    html: {
      height: "100%"
    },
    body: {
      height: "100%",
      padding: 0
    },
    ".fsContainer": {
      height: "100%",
      width: "100%",
      position: "absolute",
      top: "0",
      left: "0",
      background: "#000",
      overflow: "hidden",
      "z-index": "100000",
      "-webkit-user-select": "none"
    },
    ".fsStatus": {
      width: "80px",
      position: "absolute",
      top: "0",
      right: "0",
      padding: "6px 0",
      color: "#fff",
      background: "#000",
      "text-align": "center",
      "z-index": "1000000"
    },
    ".fsSlide": {
      height: "100%",
      width: "100%",
      "background-position": "center center",
      "background-repeat": "no-repeat",
      "background-size": "contain"
    },
    ".fsAutoplay": {
      "border-bottom": "1px solid #00c0ff"
    }
  };

  const closest = el => el && (el.id.length > 0 ? el : closest(el.parentNode));

  const getEl = (type, className, initContent) => {
    const el = document.createElement(type);
    if (className) el.classList.add(className);

    if (Array.isArray(initContent)) {
      initContent.forEach(content => el.appendChild(content));
    } else if (typeof initContent === "object") {
      el.appendChild(initContent);
    } else if (typeof initContent === "string") {
      el.innerText = initContent;
    }
    return el;
  };

  const addCssStyles = cssStyles => {
    const style = getEl("style", null, document.createTextNode(""));
    document.head.appendChild(style);

    Object.keys(cssStyles).forEach(el =>
      style.sheet.insertRule(
        `${el}
        ${JSON.stringify(cssStyles[el])
          .replace(/\"/gi, "")
          .replace(/\,/gi, ";")}`,
        0
      )
    );
  };

  const keyBinding = gallery => ({ which }) => {
    const keys = {
      "0": gallery.showNextSlide, // spacebar
      "32": gallery.showNextSlide, // spacebar
      "112": gallery.autoplay, // 'p' key
      "108": gallery.showNextSlide, // 'l' key
      "107": gallery.showPrevSlide // 'k' key
    };

    if (typeof keys[which] !== "function") return;
    else keys[which]();
  };

  class Status {
    constructor(initText) {
      this.content = getEl("div", "fsStatus", initText);
    }

    get text() {
      return this.content;
    }

    set text(text) {
      this.content.innerText = text;
    }

    set autoplay(value) {
      this.content.classList.toggle("fsAutoplay", value);
    }
  }

  class Gallery {
    constructor(images) {
      this.index = 0;
      this.interval = null;
      this.slides = this.getSlides(images);
      this.status = new Status(`${this.index + 1} / ${this.slides.length}`);
      this.container = getEl("div", "fsContainer", [
        this.status.text,
        ...this.slides
      ]);

      this.showNextSlide = this.changeSlide.bind(this, 1);
      this.showPrevSlide = this.changeSlide.bind(this, 0);
      this.autoplay = this.autoplay.bind(this);
    }

    get html() {
      return this.container;
    }

    getSlides(images) {
      return Array.from(images).reduce((slides, image) => {
        const slide = getEl("div", "fsSlide", image);
        slide.style.backgroundImage = `url(${image.src})`;
        image.style.opacity = 0;

        return [...slides, slide];
      }, []);
    }

    changeSlide(direction) {
      const nextIndex = direction ? this.index + 1 : this.index - 1;

      if (0 <= nextIndex && nextIndex <= this.slides.length - 1) {
        Object.assign(this.slides[this.index].style, { height: 0, width: 0 });
        Object.assign(this.slides[nextIndex].style, {
          height: "100%",
          width: "100%"
        });
        this.index = nextIndex;
        this.status.text = `${nextIndex + 1} / ${this.slides.length}`;
      }
    }

    autoplay() {
      if (this.interval) {
        this.status.autoplay = 0;
        this.interval = window.clearInterval(this.interval);
      } else {
        this.status.autoplay = 1;
        this.interval = setInterval(this.showNextSlide, 4000);
      }
    }
  }

  function generateGallery(e) {
    if (e.target.tagName === "IMG" && e.target !== e.currentTarget) {
      const images = document.querySelectorAll(
        `#${closest(e.target.parentNode).id} img`
      );
      const gallery = new Gallery(images);

      body.innerHTML = ""; // reset page content
      body.appendChild(gallery.html);

      addCssStyles(cssStyles);

      rE("click", generateGallery);
      aE("click", gallery.showNextSlide, false);
      aE("keypress", keyBinding(gallery), false);
    }

    e.preventDefault();
    e.stopPropagation();
  }

  function activateClickListener() {
    if (!document.processed) {
      document.processed = true; // allow gallery to be processed just once
      aE("click", generateGallery, false);
    }
  }

  document.processed = document.processed || false;
  activateClickListener();
})();
