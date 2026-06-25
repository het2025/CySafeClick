const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'src', 'assets', 'data', 'scam-reports.json');

fs.writeFileSync(outputPath, JSON.stringify({ reports: [] }, null, 2));
console.log('Public scam reports are disabled. Wrote an empty reports file.');
