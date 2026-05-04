const fs = require('fs');
const file = 'c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html';
let content = fs.readFileSync(file, 'utf8');

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

const processIdx = content.indexOf('/* ==========================================================\r\n   PROCESS');
let finalIdx = processIdx > -1 ? processIdx : content.indexOf('/* ==========================================================\n   PROCESS');

if (finalIdx !== -1) {
  content = content.substring(0, finalIdx) + cssCode + '\n' + content.substring(finalIdx);
  fs.writeFileSync(file, content);
  console.log('CSS injected successfully!');
} else {
  console.log('Could not find PROCESS comment block.');
}
