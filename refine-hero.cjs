const fs = require('fs');
const file = 'c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Update CSS for silver text and remove text-shadow from accentSweep
const cssToInsert = `
.hero-title .word-inner:not(.accent) {
  color: transparent;
  background: linear-gradient(110deg, #FFFFFF 0%, #B8B8B8 50%, #EAEAEA 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  animation: silverShimmer 12s ease-in-out infinite alternate;
}
@keyframes silverShimmer {
  0% { background-position: 0% center; }
  100% { background-position: 100% center; }
}
`;

if (!content.includes('silverShimmer')) {
  content = content.replace('.hero-title .accent{', cssToInsert + '\n.hero-title .accent{');
}

// Modify accentSweep to remove text-shadow
const oldAccentSweep = `@keyframes accentSweep {
  0%, 75% { 
    background-position: 200% center; 
    text-shadow: 0 0 0px rgba(232,0,29,0);
  }
  87% {
    text-shadow: 0 0 20px rgba(232,0,29,0.4);
  }
  100% { 
    background-position: -200% center; 
    text-shadow: 0 0 0px rgba(232,0,29,0);
  }
}`;

const newAccentSweep = `@keyframes accentSweep {
  0%, 75% { background-position: 200% center; }
  100% { background-position: -200% center; }
}`;
if (content.includes(oldAccentSweep)) {
  content = content.replace(oldAccentSweep, newAccentSweep);
} else {
  // If formatting differs, use regex
  const accentRegex = /@keyframes accentSweep\s*\{[\s\S]*?100%\s*\{[^}]*\}\s*\}/;
  content = content.replace(accentRegex, newAccentSweep);
}

// 2. Add JS synchronization in the Three.js loop
const animateSearch = `rl.intensity=1.9+Math.sin(t*1.6)*.6;`;
if (content.includes(animateSearch)) {
  const replacement = `rl.intensity=1.9+Math.sin(t*1.6)*.6;
        const accentEl = document.querySelector('.hero-title .accent');
        if (accentEl) {
          const glowVal = Math.sin(t * 1.6);
          const alpha = 0.2 + glowVal * 0.15; // 0.05 to 0.35 opacity
          accentEl.style.textShadow = \`0 0 24px rgba(232,0,29,\${alpha.toFixed(3)})\`;
        }`;
  // Prevent duplicate injection
  if (!content.includes('const accentEl = document.querySelector')) {
    content = content.replace(animateSearch, replacement);
  }
}

fs.writeFileSync(file, content);
console.log('Hero refinement applied.');
