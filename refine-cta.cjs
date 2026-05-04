const fs = require('fs');
const file = 'c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html';
let content = fs.readFileSync(file, 'utf8');

let newA = '.cta-glow-a{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(170,0,20,.09) 0%,transparent 65%);pointer-events:none}';
let newB = '.cta-glow-b{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(170,0,20,.14) 0%,transparent 55%);pointer-events:none;animation:breathe 5s ease-in-out infinite}';

content = content.replace(/\.cta-glow-a\s*\{[^\}]*\}/g, newA);
content = content.replace(/\.cta-glow-b\s*\{[^\}]*\}/g, newB);

fs.writeFileSync(file, content);
console.log('CTA red tone refined');
