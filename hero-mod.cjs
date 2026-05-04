const fs = require('fs');
const file = 'c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Beams
const beamStr1 = `/* Beams */
      const bm=new THREE.LineBasicMaterial({color:0xe8001d,transparent:true,opacity:.1});
      [[[-7,1.8,0],[0,.15,.5],[7,1.8,0]],[[-7,-1.5,0],[0,-.1,.5],[7,-1.5,0]],[[-7,.2,-1],[0,.05,0],[7,.2,-1]]].forEach(pts=>{
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(...p))),bm.clone()));
      });`;
content = content.replace(beamStr1, '');
content = content.replace(`const beams=scene.children.filter(c=>c.isLine);`, '');
content = content.replace(`beams.forEach((b,i)=>{b.material.opacity=.45+Math.sin(t*2.2+i*1.1)*.4;});`, '');

// 2. Particle density and visibility
content = content.replace(`const PC=4200,pp=new Float32Array(PC*3),pc=new Float32Array(PC*3);`, `const PC=5200,pp=new Float32Array(PC*3),pc=new Float32Array(PC*3);`);
content = content.replace(`new THREE.PointsMaterial({size:.026,vertexColors:true,transparent:true,opacity:.72})`, `new THREE.PointsMaterial({size:.031,vertexColors:true,transparent:true,opacity:.85})`);

// 3. Enhance Red Rim Glow
const oldGlow = `.hero-overlay-glow{
  position:absolute;top:0;right:0;width:60%;height:100%;z-index:1;pointer-events:none;
  /* soften the red glow so the photo isn't washed out */
  background:radial-gradient(ellipse at 68% 42%,rgba(232,0,29,0.06) 0%,rgba(232,0,29,0.02) 40%,transparent 65%);
}`;
const newGlow = `.hero-overlay-glow{
  position:absolute;top:0;right:0;width:65%;height:100%;z-index:1;pointer-events:none;
  /* enhanced soft rim glow */
  background:radial-gradient(ellipse at 70% 38%,rgba(232,0,29,0.075) 0%,rgba(232,0,29,0.035) 48%,transparent 80%);
}`;
content = content.replace(oldGlow, newGlow);
// Also try another format if line endings are different
if (!content.includes(newGlow)) {
    const oldGlowRegex = /\.hero-overlay-glow\{[\s\S]*?transparent 65%\);\s*\}/;
    content = content.replace(oldGlowRegex, newGlow);
}

// 4. Add Micro-interactions
const oldContent = `.hero-content{
  position:relative;z-index:10;
  padding:0 72px;max-width:900px;margin-top:40px;
}`;
const newContent = `.hero-content{
  position:relative;z-index:10;
  padding:0 72px;max-width:900px;margin-top:40px;
  animation: heroBreathing 10s ease-in-out 2s infinite;
  transform-origin: center left;
}`;
content = content.replace(oldContent, newContent);
if (!content.includes(newContent)) {
    const oldContentRegex = /\.hero-content\{[\s\S]*?margin-top:40px;\s*\}/;
    content = content.replace(oldContentRegex, newContent);
}

const oldAccent = `.hero-title .accent{color:var(--red)}`;
const newAccent = `.hero-title .accent{
  color: transparent;
  background: linear-gradient(90deg, var(--red) 0%, var(--red) 40%, #ff6b77 50%, var(--red) 60%, var(--red) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  animation: accentSweep 8s ease-in-out 3s infinite;
}`;
content = content.replace(oldAccent, newAccent);

// Inject keyframes
const keyframes = `
@keyframes heroBreathing {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.015); opacity: 0.97; }
}
@keyframes accentSweep {
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
}
`;

const insertPoint = `.hero-sub-divider{`;
if (content.includes(insertPoint) && !content.includes('@keyframes heroBreathing')) {
  content = content.replace(insertPoint, keyframes + insertPoint);
}

fs.writeFileSync(file, content);
console.log('Hero modifications applied.');
