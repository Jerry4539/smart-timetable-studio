const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  return lines.map(line => {
    const row = [];
    let inQuotes = false;
    let token = '';
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') { token += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        row.push(token.trim());
        token = '';
      } else {
        token += c;
      }
    }
    row.push(token.trim());
    return row;
  });
}

const dir = path.join(__dirname, '..', 'data', 'school_csv');
const subRows = parseCSV(fs.readFileSync(path.join(dir, '3_subjects.csv'), 'utf8'));

// Test subject categorization
subRows.slice(1).forEach(r => {
  const name = r[1];
  const cat = r[2];
  const isPhysical = cat === 'sports' || /yoga|sport|dance|physical|pe|p\.e\.|gym/i.test(name);
  const isPlayful = cat === 'activity' || cat === 'sports' || /art|craft|dance|music|yoga|sport|lib|club|supw|circle|skill/i.test(name);
  if (isPhysical || isPlayful) {
    // console.log(`${name} -> Physical: ${isPhysical}, Playful: ${isPlayful}`);
  }
});
console.log('Script loaded successfully.');
