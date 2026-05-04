const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html', 'utf8');
const servicesStart = content.indexOf('<section id="services"');
const processStart = content.indexOf('<section id="process"');
console.log(content.substring(servicesStart, processStart).split('\n').slice(-10).join('\n'));
