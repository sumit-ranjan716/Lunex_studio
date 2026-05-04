const fs = require('fs');
const file = 'c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Beams using Regex to avoid CRLF mismatch
content = content.replace(/\/\*\s*Beams\s*\*\/[\s\S]*?\}\);/g, '');
content = content.replace(/const\s+beams=scene\.children\.filter\(c=>c\.isLine\);/g, '');
content = content.replace(/beams\.forEach\(\(b,i\)=>\{[^\}]*\}\);/g, '');

// 2. Fix text visibility
// First remove the broken animation shorthand
const brokenShimmer = `animation: silverShimmer 12s ease-in-out infinite alternate;`;
content = content.replace(brokenShimmer, '');

// Then add the proper multi-animation preserving delay
const properAnimation = `
.hero-title .word-inner.animate:not(.accent) {
  animation-name: wordReveal, silverShimmer;
  animation-duration: 1.4s, 12s;
  animation-timing-function: var(--ease-out-expo), ease-in-out;
  animation-fill-mode: forwards, none;
  animation-iteration-count: 1, infinite;
  animation-direction: normal, alternate;
}
`;

if (!content.includes('animation-name: wordReveal, silverShimmer')) {
  // insert after @keyframes silverShimmer
  content = content.replace(/@keyframes silverShimmer\s*\{[\s\S]*?\}\s*\}/, match => match + '\n' + properAnimation);
}

fs.writeFileSync(file, content);
console.log('Fixed visibility and removed beams.');
