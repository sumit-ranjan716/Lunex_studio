const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html', 'utf8');
const start = content.indexOf('document.addEventListener(\'mousemove\'');
console.log(content.substring(Math.max(0, start - 100), start + 800));
