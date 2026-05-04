const fs = require('fs');
const file = 'c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html';
let content = fs.readFileSync(file, 'utf8');

const svgs = [
  { name: 'Schools', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>' },
  { name: 'Colleges', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>' },
  { name: 'Hotels', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4M9 7h6M9 11h6"></path></svg>' },
  { name: 'Supermarts', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>' },
  { name: 'Restaurants', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"></path></svg>' },
  { name: 'Clinics', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M12 7v6M9 10h6"></path></svg>' },
  { name: 'Gyms & Fitness', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h3a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-3M6 10H3a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h3M14 8v8M10 8v8M6 8h12"></path></svg>' },
  { name: 'Freelancers', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"></path></svg>' },
  { name: 'Cafes', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"></path></svg>' },
  { name: 'Photographers', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>' },
  { name: 'Auto Services', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>' },
  { name: 'Startups', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>' },
];

let cardsHtml = '';
svgs.forEach((item, index) => {
  // Add staggered animation delay based on 4 columns
  const delayClass = `d${(index % 4) + 1}`; 
  cardsHtml += `
    <div class="ind-card reveal ${delayClass}">
      <div class="ind-icon">${item.svg}</div>
      <span class="ind-label">${item.name}</span>
    </div>`;
});

const sectionHtml = `
<!-- INDUSTRIES WE SERVE -->
<section id="industries" class="section industries-section">
  <div class="reveal">
    <div class="section-eyebrow"><span class="section-eyebrow-text">Industries We Serve</span></div>
    <h2 class="section-title">Websites For Every<br><em>Business</em></h2>
    <p class="section-sub">Whether you run a school, hotel, or small shop — we build you a professional online presence that works.</p>
  </div>
  <div class="industries-grid">
    ${cardsHtml}
  </div>
</section>
`;

// Insert HTML after SERVICES section
const servicesEndIdx1 = content.indexOf('</section>\r\n\r\n<!-- PROCESS + GUARANTEES -->');
const servicesEndIdx2 = content.indexOf('</section>\n\n<!-- PROCESS + GUARANTEES -->');
const idx = servicesEndIdx1 !== -1 ? servicesEndIdx1 : servicesEndIdx2;

if (idx !== -1) {
  content = content.substring(0, idx + 10) + '\n\n' + sectionHtml + content.substring(idx + 10);
  console.log('HTML Injected');
} else {
  console.log('Could not find SERVICES insertion point');
}

// CSS
const cssCode = `
/* ==========================================================
   INDUSTRIES SECTION
========================================================== */
.industries-section {
  background: var(--darker);
}
.industries-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 60px;
}
@media (min-width: 768px) {
  .industries-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}
@media (min-width: 1024px) {
  .industries-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
}

.ind-card {
  background: var(--card-3);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.ind-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(255,255,255,0.03), transparent);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
  transition: all 0.3s ease-out;
}

.ind-icon {
  color: var(--silver);
  margin-bottom: 16px;
  transition: color 0.3s ease-out, transform 0.3s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ind-icon svg {
  width: 32px;
  height: 32px;
}

.ind-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--white);
  transition: color 0.3s ease-out;
}

.ind-card:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: rgba(232, 0, 29, 0.4);
  box-shadow: 0 16px 32px rgba(0,0,0,0.6), 0 0 24px rgba(232, 0, 29, 0.15);
}

.ind-card:hover::after {
  box-shadow: inset 0 0 0 1px rgba(232, 0, 29, 0.3);
}

.ind-card:hover .ind-icon {
  color: var(--red);
  transform: scale(1.1);
}
`;

const cssInsertIdx1 = content.indexOf('/* ==========================================================\r\n   PROCESS + GUARANTEES');
const cssInsertIdx2 = content.indexOf('/* ==========================================================\n   PROCESS + GUARANTEES');
const cssIdx = cssInsertIdx1 !== -1 ? cssInsertIdx1 : cssInsertIdx2;

if (cssIdx !== -1) {
  content = content.substring(0, cssIdx) + cssCode + '\n' + content.substring(cssIdx);
  console.log('CSS Injected');
} else {
  console.log('Could not find CSS insertion point');
}

fs.writeFileSync(file, content);
