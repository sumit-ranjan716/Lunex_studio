const fs = require('fs');
const file = 'c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace CSS
const cssStart = '/* FINTRACK MOCKUP */';
const cssEnd = '.mock-bc.hi{background:var(--red)}';
const cssReplacement = `/* CAROUSEL MOCKUP REPLACEMENT */
.img-carousel {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.carousel-track {
  width: 100%;
  height: 100%;
  position: relative;
}
.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.8s var(--ease-out-expo), transform 0.8s var(--ease-out-expo);
  transform: scale(0.98);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel-slide.active {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
  z-index: 2;
}
.carousel-slide img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.5);
}
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(12, 12, 12, 0.6);
  border: 1px solid var(--border-mid);
  color: var(--white);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
  opacity: 0;
  font-family: monospace;
  font-size: 1rem;
}
.img-carousel:hover .carousel-nav {
  opacity: 1;
}
.carousel-nav:hover {
  background: var(--red);
  border-color: var(--red);
  box-shadow: 0 0 16px var(--red-glow);
}
.carousel-nav.prev { left: 16px; }
.carousel-nav.next { right: 16px; }
.carousel-dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}
.carousel-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s;
}
.carousel-dot.active {
  background: var(--red);
  box-shadow: 0 0 8px var(--red-glow);
  transform: scale(1.3);
}`;

let i1 = content.indexOf(cssStart);
let i2 = content.indexOf(cssEnd);
if (i1 !== -1 && i2 !== -1) {
  content = content.substring(0, i1) + cssReplacement + content.substring(i2 + cssEnd.length);
  console.log('CSS replaced');
}

// HTML Red-Horizon
const rhArray = `["/Red-Horizon/Red-horizon1.jpg", "/Red-Horizon/Red-Horizon2.jpg", "/Red-Horizon/Red-horizon3.jpg", "/Red-Horizon/Red-horizon4.jpg", "/Red-Horizon/Red-horizon5.jpg"]`;
content = content.replace(/<div class="mock-fintrack">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/, `<div class="img-carousel" data-images='${rhArray}'></div>\n        </div>\n      </div>\n    </div>`);

// HTML Blixtro
const blArray = `["/Blixtro/Blixtro1.jpeg", "/Blixtro/blixtro2.jpeg", "/Blixtro/blixtro3.jpeg", "/Blixtro/Blixtro4.jpeg", "/Blixtro/blixtro5.jpeg"]`;
content = content.replace(/<div class="mock-leadforge">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/, `<div class="img-carousel" data-images='${blArray}'></div>\n        </div>\n      </div>\n    </div>`);

// HTML Snack
const snArray = `["/Snack shakes/Snack shake1.jpeg", "/Snack shakes/snack shake2.jpeg", "/Snack shakes/snack shake 3.jpeg", "/Snack shakes/snack shake 4.jpeg", "/Snack shakes/snack shake5.jpeg"]`;
content = content.replace(/<div class="mock-fitpulse">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/, `<div class="img-carousel" data-images='${snArray}'></div>\n        </div>\n      </div>\n    </div>`);

const jsLogic = `

  /* ==========================================================
     IMAGE CAROUSELS
  ========================================================== */
  ;(function initCarousels() {
    const carousels = document.querySelectorAll('.img-carousel');
    carousels.forEach(container => {
      let images = [];
      try {
        images = JSON.parse(container.getAttribute('data-images') || '[]');
      } catch (e) {
        console.error('Invalid carousel images JSON', e);
      }
      if (images.length === 0) return;

      const track = document.createElement('div');
      track.className = 'carousel-track';
      
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'carousel-dots';

      let slides = [];
      let dots = [];
      let currentIndex = 0;
      let autoplayTimer = null;

      images.forEach((src, i) => {
        // Slide
        const slide = document.createElement('div');
        slide.className = 'carousel-slide' + (i === 0 ? ' active' : '');
        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy';
        slide.appendChild(img);
        track.appendChild(slide);
        slides.push(slide);

        // Dot
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });

      container.appendChild(track);
      container.appendChild(dotsContainer);

      // Nav Arrows
      if (images.length > 1) {
        const prevBtn = document.createElement('div');
        prevBtn.className = 'carousel-nav prev';
        prevBtn.innerHTML = '&#10094;';
        prevBtn.addEventListener('click', () => nextSlide(-1));
        container.appendChild(prevBtn);

        const nextBtn = document.createElement('div');
        nextBtn.className = 'carousel-nav next';
        nextBtn.innerHTML = '&#10095;';
        nextBtn.addEventListener('click', () => nextSlide(1));
        container.appendChild(nextBtn);
      }

      function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');
        currentIndex = (index + images.length) % images.length;
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
      }

      function nextSlide(dir) {
        goToSlide(currentIndex + dir);
      }

      function startAutoplay() {
        if (images.length <= 1) return;
        stopAutoplay();
        autoplayTimer = setInterval(() => nextSlide(1), 4000);
      }

      function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
      }

      container.addEventListener('mouseenter', stopAutoplay);
      container.addEventListener('mouseleave', startAutoplay);

      startAutoplay();
    });
  })();
`;

const insertTarget = '/* ==========================================================\n   WAVES BACKGROUND ANIMATION';
let idx = content.indexOf(insertTarget);
if (idx !== -1) {
  content = content.substring(0, idx) + jsLogic + '\n' + content.substring(idx);
  console.log('JS replaced');
} else {
  // If not found, try something else like before closing script tag
  content = content.replace('</script>\n</body>', jsLogic + '\n</script>\n</body>');
}

fs.writeFileSync(file, content);
console.log('Done');
