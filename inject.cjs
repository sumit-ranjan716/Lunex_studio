const fs = require('fs');
const file = 'c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html';
let content = fs.readFileSync(file, 'utf8');

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

content = content.replace(/<\/script>\s*<\/body>/, jsLogic + '\n</script>\n</body>');
fs.writeFileSync(file, content);
console.log('JS Injected successfully.');
