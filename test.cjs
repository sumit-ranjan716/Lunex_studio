const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sumit Ranjan/Desktop/lnx/Lunexstudio/public/lunexstudio-portfolio.html', 'utf8');
const i = content.indexOf('<div class="waves-bg">');
if(i !== -1) {
    console.log(content.substring(Math.max(0, i - 100), i + 200));
} else {
    console.log('No waves-bg found');
}
