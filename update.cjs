const fs = require('fs');
const file = 'c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html';
let content = fs.readFileSync(file, 'utf8');

// Update CSS
const cssStartMarker = '/* CAROUSEL MOCKUP REPLACEMENT */';
const cssEndMarker1 = '/* ==========================================================\r\n   SERVICES';
const cssEndMarker2 = '/* ==========================================================\n   SERVICES';
const cssEndMarker3 = '/* ==========================================================\n   SERVICES';

let startIdx = content.indexOf(cssStartMarker);
let endIdx = content.indexOf('/* ==========================================================\n   SERVICES');
if (endIdx === -1) endIdx = content.indexOf('/* ==========================================================\r\n   SERVICES');

if (startIdx !== -1 && endIdx !== -1) {
  const newCss = `/* CAROUSEL MOCKUP REPLACEMENT */
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

/* New Refactored Image Styling */
.img-wrapper {
  width: 88%;
  height: 88%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 10px;
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
  box-shadow: 0 12px 32px rgba(0,0,0,0.5), 0 0 15px rgba(232,0,29,0.15);
  background: var(--card-3);
}

.img-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 4px 12px rgba(0,0,0,0.4);
  background: linear-gradient(135deg, rgba(255,255,255,0.04), transparent);
  transition: box-shadow 0.3s ease-out;
}

.carousel-slide img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.carousel-slide:hover .img-wrapper {
  transform: scale(1.03);
  box-shadow: 0 16px 40px rgba(0,0,0,0.6), 0 0 24px rgba(232,0,29,0.35);
}

.carousel-slide:hover .img-wrapper::after {
  box-shadow: inset 0 0 0 2px var(--red), inset 0 4px 12px rgba(0,0,0,0.4);
}
/* End New Image Styling */

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
}
`;
  content = content.substring(0, startIdx) + newCss + content.substring(endIdx);
  console.log('CSS updated');
} else {
  console.log('CSS markers not found', startIdx, endIdx);
}

// Update JS
const jsStartIdx = content.indexOf('/* ==========================================================\n     IMAGE CAROUSELS') !== -1 
  ? content.indexOf('/* ==========================================================\n     IMAGE CAROUSELS')
  : content.indexOf('/* ==========================================================\r\n     IMAGE CAROUSELS');

const jsEndIdx = content.indexOf('})();\n</script>\n</body>') !== -1
  ? content.indexOf('})();\n</script>\n</body>') + 5
  : content.indexOf('})();\r\n</script>\r\n</body>') + 5;

if (jsStartIdx !== -1 && jsEndIdx !== -1) {
  const newJs = `/* ==========================================================
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
        
        // Wrapper for refined visual styling
        const wrapper = document.createElement('div');
        wrapper.className = 'img-wrapper';

        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy';
        
        wrapper.appendChild(img);
        slide.appendChild(wrapper);
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
  })();`;

  content = content.substring(0, jsStartIdx) + newJs + content.substring(jsEndIdx);
  console.log('JS updated');
} else {
  console.log('JS markers not found', jsStartIdx, jsEndIdx);
}

fs.writeFileSync(file, content);
console.log('Done');
