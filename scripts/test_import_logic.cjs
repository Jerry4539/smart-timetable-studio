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

  if (hStr.includes('assigned teacher') || (hStr.includes('division') && hStr.includes('periods per week') && hStr.includes('subject'))) {
    return 'allocations';
  }
  if (hStr.includes('constraint type') || hStr.includes('entity affected')) {
    return 'constraints';
  }
  if ((hStr.includes('subject code') && hStr.includes('weekly periods')) || (hStr.includes('subject name') && hStr.includes('category') && !hStr.includes('assigned teacher'))) {
    return 'subjects';
  }
  if (hStr.includes('divisions list') || hStr.includes('numeric level') || hStr.includes('full section names') || (hStr.includes('standard name') && !hStr.includes('subject code'))) {
    return 'standards';
  }
  if (hStr.includes('employee id') || hStr.includes('qualified subjects') || (hStr.includes('teacher') && hStr.includes('designation')) || hStr.includes('max consecutive periods')) {
    return 'teachers';
  }
  if (hStr.includes('daily start time') || hStr.includes('total teaching periods') || hStr.includes('school name') || hStr.includes('period duration')) {
    return 'schedule';
  }
  if (headers.some(h => h.toLowerCase() === 'field') && headers.some(h => h.toLowerCase().includes('value'))) {
    const fields = sampleRows.map(r => (r[0] || '').toLowerCase()).join(' ');
    if (fields.includes('school name') || fields.includes('academic year') || fields.includes('start time') || fields.includes('period')) {
      return 'schedule';
    }
  }

  return 'unknown';
}

const dir = path.join(__dirname, '..', 'data', 'school_csv');

// Load files
const stdRows = parseCSV(fs.readFileSync(path.join(dir, '2_standards_and_divisions.csv'), 'utf8'));
const subRows = parseCSV(fs.readFileSync(path.join(dir, '3_subjects.csv'), 'utf8'));
const tchRows = parseCSV(fs.readFileSync(path.join(dir, '4_teachers.csv'), 'utf8'));
const allocRows = parseCSV(fs.readFileSync(path.join(dir, '5_teacher_subject_allocation.csv'), 'utf8'));

// 1. Process Standards
const classes = [];
const sectionLookup = new Map();

for (let i = 1; i < stdRows.length; i++) {
  const [stdName, numLvl, divList, fullSecNames] = stdRows[i];
  const num = parseInt(numLvl, 10) || i;
  const classId = `class-g${num}`;
  const divs = divList.split(',').map(s => s.trim());
  const fullNames = (fullSecNames || '').split(',').map(s => s.trim());

  const sections = divs.map((div, idx) => {
    const divClean = div.replace(/^div\s*/i, '').replace(/^section\s*/i, '').trim();
    const secId = `sec-${num}${divClean.toLowerCase()}`;
    const fullName = fullNames[idx] || `${stdName} - ${div}`;
    
    // Register aliases
    sectionLookup.set(`${stdName.toLowerCase()}-${divClean.toLowerCase()}`, secId);
    sectionLookup.set(`${num}${divClean.toLowerCase()}`, secId);
    sectionLookup.set(div.toLowerCase(), secId);
    sectionLookup.set(divClean.toLowerCase(), secId);
    sectionLookup.set(fullName.toLowerCase(), secId);

    return { id: secId, classId, name: div, fullName };
  });

  classes.push({
    id: classId,
    name: stdName,
    numericLevel: num,
    sections
  });
}

// 2. Process Subjects
const subjects = [];
const subjectLookup = new Map();

for (let i = 1; i < subRows.length; i++) {
  const [code, name, cat, stdName, weekly, maxDay, dbl, colorPref] = subRows[i];
  const subId = `sub-${code.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  // Find matching class IDs
  const gradeIds = [];
  const stdClean = (stdName || '').toLowerCase().trim();
  classes.forEach(c => {
    if (stdClean.includes(c.name.toLowerCase()) || stdClean.includes(String(c.numericLevel))) {
      gradeIds.push(c.id);
    }
  });

  const subObj = {
    id: subId,
    code: code.trim(),
    name: name.trim(),
    category: cat?.trim() || 'core',
    gradeIds: gradeIds.length > 0 ? gradeIds : classes.map(c => c.id),
    weeklyPeriodsRequired: parseInt(weekly, 10) || 3,
    maxPeriodsPerDay: parseInt(maxDay, 10) || 2,
    isDoublePeriodAllowed: (dbl || '').toLowerCase() === 'yes',
    color: { bg: '#f0f6ff', text: '#1e3a8a', border: '#dbeafe', indicator: '#3b82f6' }
  };
  subjects.push(subObj);
  subjectLookup.set(code.trim().toUpperCase(), subObj);
  subjectLookup.set(name.trim().toLowerCase(), subObj);
}

// 3. Process Teachers
const teachers = [];
const teacherLookup = new Map();

for (let i = 1; i < tchRows.length; i++) {
  const [empId, name, desig, email, phone, qualStr, maxDay, maxWeek, maxCon] = tchRows[i];
  const tchId = empId.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
  const tchName = name.trim();

  // Find qualified subject IDs from qualStr
  const qualIds = [];
  if (qualStr) {
    const tokens = qualStr.split(',').map(s => s.trim().toLowerCase());
    tokens.forEach(token => {
      // Direct subject match
      subjects.forEach(sub => {
        if (sub.name.toLowerCase().includes(token) || sub.code.toLowerCase().includes(token)) {
          if (!qualIds.includes(sub.id)) qualIds.push(sub.id);
        }
      });
    });
  }

  const tchObj = {
    id: tchId,
    name: tchName,
    employeeCode: empId.trim(),
    email: email || '',
    phone: phone || '',
    designation: desig || 'Faculty',
    qualifiedSubjectIds: qualIds,
    maxPeriodsPerDay: parseInt(maxDay, 10) || 6,
    maxPeriodsPerWeek: parseInt(maxWeek, 10) || 30,
    minPeriodsPerDay: 2,
    maxConsecutivePeriods: parseInt(maxCon, 10) || 3,
    availability: []
  };

  teachers.push(tchObj);
  teacherLookup.set(tchName.toLowerCase(), tchObj);
}

// 4. Process Allocations
let matchedAlloc = 0;
const allocations = [];

for (let i = 1; i < allocRows.length; i++) {
  const [std, div, subName, subCode, tchName, periods] = allocRows[i];
  const divClean = div.trim().toLowerCase();
  const secId = sectionLookup.get(`${std.toLowerCase()}-${divClean}`) ||
                sectionLookup.get(divClean) ||
                sectionLookup.get(divClean.replace(/^div\s*/i, ''));

  const subObj = subjectLookup.get(subCode.trim().toUpperCase()) || subjectLookup.get(subName.trim().toLowerCase());
  const tchObj = teacherLookup.get(tchName.trim().toLowerCase());

  if (secId && subObj && tchObj) {
    matchedAlloc++;
    if (!tchObj.qualifiedSubjectIds.includes(subObj.id)) {
      tchObj.qualifiedSubjectIds.push(subObj.id);
    }
    allocations.push({
      sectionId: secId,
      subjectId: subObj.id,
      teacherId: tchObj.id,
      periodsPerWeek: parseInt(periods, 10) || subObj.weeklyPeriodsRequired
    });
  } else {
    // console.log(`Unmatched: std=${std}, div=${div}, sub=${subCode}, tch=${tchName}`);
  }
}

console.log('Result:');
console.log('Classes:', classes.length, 'Sections:', classes.flatMap(c => c.sections).length);
console.log('Subjects:', subjects.length, 'Subjects with gradeIds:', subjects.filter(s => s.gradeIds.length > 0).length);
console.log('Teachers:', teachers.length, 'Teachers with qualifiedSubjectIds:', teachers.filter(t => t.qualifiedSubjectIds.length > 0).length);
console.log('Allocations matched:', matchedAlloc, 'out of', allocRows.length - 1);
