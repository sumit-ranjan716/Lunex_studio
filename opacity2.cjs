const fs = require('fs');
const file = 'c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html';
let content = fs.readFileSync(file, 'utf8');

// The current opacity is 0.58. 
// If the user said "increase by another 20%" they probably mean 0.58 + 0.20 = 0.78
content = content.replace(/lineColor:\s*'rgba\(232,\s*0,\s*29,\s*0\.58\)'/, "lineColor: 'rgba(232, 0, 29, 0.78)'");

// In case the previous update didn't work and it's still 0.38, bump it to 0.58
content = content.replace(/lineColor:\s*'rgba\(232,\s*0,\s*29,\s*0\.38\)'/, "lineColor: 'rgba(232, 0, 29, 0.58)'");

// Set z-index to 0
content = content.replace(/z-index:-1;\n\s*pointer-events:none;/g, 'z-index:0;\n  pointer-events:none;');
content = content.replace(/z-index:-1;\r\n\s*pointer-events:none;/g, 'z-index:0;\n  pointer-events:none;');

fs.writeFileSync(file, content);
console.log('Opacity and z-index updated successfully.');
