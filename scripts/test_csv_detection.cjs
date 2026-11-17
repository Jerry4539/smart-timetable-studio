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

function detectCsvType(headers, sampleRows = []) {
  const hStr = headers.map(h => h.toLowerCase().trim()).join(' | ');

  // 1. Allocations (Teacher to Subject to Division)
  if (hStr.includes('assigned teacher') || (hStr.includes('division') && hStr.includes('periods per week') && hStr.includes('subject'))) {
    return 'allocations';
  }

  // 2. Constraints
  if (hStr.includes('constraint type') || hStr.includes('entity affected')) {
    return 'constraints';
  }

  // 3. Subjects Catalog (Must check before standards because subjects CSV has 'Applicable Standards'!)
  if ((hStr.includes('subject code') && hStr.includes('weekly periods')) || (hStr.includes('subject name') && hStr.includes('category') && !hStr.includes('assigned teacher'))) {
    return 'subjects';
  }

  // 4. Standards & Divisions
  if (hStr.includes('divisions list') || hStr.includes('numeric level') || hStr.includes('full section names') || (hStr.includes('standard name') && !hStr.includes('subject code'))) {
    return 'standards';
  }

  // 5. Teachers & Faculty
  if (hStr.includes('employee id') || hStr.includes('qualified subjects') || (hStr.includes('teacher') && hStr.includes('designation')) || hStr.includes('max consecutive periods')) {
    return 'teachers';
  }

  // 6. Schedule & Institutional Bell Timings
  if (hStr.includes('daily start time') || hStr.includes('total teaching periods') || hStr.includes('school name') || hStr.includes('period duration')) {
    return 'schedule';
  }
  // Vertical key-value layout: Field, Value
  if (headers.some(h => h.toLowerCase() === 'field') && headers.some(h => h.toLowerCase().includes('value'))) {
    const fields = sampleRows.map(r => (r[0] || '').toLowerCase()).join(' ');
    if (fields.includes('school name') || fields.includes('academic year') || fields.includes('start time') || fields.includes('period')) {
      return 'schedule';
    }
  }

  return 'unknown';
}

const dir = path.join(__dirname, '..', 'data', 'school_csv');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));
files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const rows = parseCSV(content);
  const type = detectCsvType(rows[0], rows.slice(1, 10));
  console.log(`${f} -> detected as: ${type}`);
});
