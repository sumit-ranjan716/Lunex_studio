const fs = require('fs');
const file = 'c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html';
let content = fs.readFileSync(file, 'utf8');

// Increase opacity by 20%
content = content.replace(/lineColor:\s*'rgba\(232,\s*0,\s*29,\s*0\.38\)'/, "lineColor: 'rgba(232, 0, 29, 0.58)'");

// Ensure #waves-bg has z-index: -1 to absolutely guarantee no overlap
content = content.replace(/z-index:0;\s*pointer-events:none;/g, 'z-index:-1;\n  pointer-events:none;');

fs.writeFileSync(file, content);
console.log('Opacity increased and z-index secured.');
