const fs = require('fs');
const file = 'c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html';
let content = fs.readFileSync(file, 'utf8');

// Find and remove the broken line creation loop
const regex = /\[\[\[-7[\s\S]*?\}\);/g;
content = content.replace(regex, '');

// Verify if there are any other `bm.clone` or `isLine`
content = content.replace(/.*bm\.clone.*\n/g, '');

fs.writeFileSync(file, content);
console.log('Fixed ReferenceError in Three.js loop');
