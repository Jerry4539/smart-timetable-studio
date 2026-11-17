const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  const rows = [];
  for (const line of lines) {
    const row = [];
    let inQuotes = false;
    let token = '';
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        row.push(token.trim());
        token = '';
      } else {
        token += c;
      }
    }
    row.push(token.trim());
    rows.push(row);
  }
  return rows;
}

const dir = path.join(__dirname, '..', 'data', 'school_csv');
const schedRows = parseCSV(fs.readFileSync(path.join(dir, '1_institution_and_schedule.csv'), 'utf8'));
const stdRows = parseCSV(fs.readFileSync(path.join(dir, '2_standards_and_divisions.csv'), 'utf8'));
const subRows = parseCSV(fs.readFileSync(path.join(dir, '3_subjects.csv'), 'utf8'));
const tchRows = parseCSV(fs.readFileSync(path.join(dir, '4_teachers.csv'), 'utf8'));
const allocRows = parseCSV(fs.readFileSync(path.join(dir, '5_teacher_subject_allocation.csv'), 'utf8'));

// 1. Standards & Divisions
const classes = [];
const sectionMap = new Map();

for (let i = 1; i < stdRows.length; i++) {
  const [stdName, numLvl, divList, fullSecNames] = stdRows[i];
  const num = parseInt(numLvl, 10);
  const classId = `class-g${num}`;
  const divs = divList.split(',').map(s => s.trim());
  const fullNames = fullSecNames.split(',').map(s => s.trim());
  
  const sections = divs.map((div, idx) => {
    const divLetter = div.replace('Div', '').trim();
    const secId = `sec-${num}${divLetter.toLowerCase()}`;
    const fullName = fullNames[idx] || `${stdName}-${divLetter}`;
    const secObj = {
      id: secId,
      classId,
      name: div,
      fullName
    };
    sectionMap.set(`${stdName}-${num}${divLetter}`, secId);
    sectionMap.set(`${stdName}-${divLetter}`, secId);
    sectionMap.set(`${num}${divLetter}`, secId);
    return secObj;
  });

  classes.push({
    id: classId,
    name: stdName,
    numericLevel: num,
    sections
  });
}

// 2. Teachers
const teachers = [];
const teacherByName = new Map();

for (let i = 1; i < tchRows.length; i++) {
  const [empId, name, desig, email, phone, qualStr, maxDay, maxWeek, maxCon] = tchRows[i];
  const tchId = empId.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const tchObj = {
    id: tchId,
    name: name.trim(),
    employeeCode: empId,
    email: email || `${tchId}@hmps.edu.in`,
    phone: phone || '+91 98200 12345',
    designation: desig || 'Secondary Faculty',
    qualifiedSubjectIds: [],
    maxPeriodsPerDay: parseInt(maxDay, 10) || 6,
    maxPeriodsPerWeek: parseInt(maxWeek, 10) || 30,
    minPeriodsPerDay: 2,
    maxConsecutivePeriods: parseInt(maxCon, 10) || 3,
    availability: []
  };
  teachers.push(tchObj);
  teacherByName.set(name.trim().toLowerCase(), tchObj);
}

// 3. Subjects
const COLOR_MAP = {
  purple: { bg: '#fbf7ff', text: '#581c87', border: '#f3e8ff', indicator: '#9333ea' },
  green: { bg: '#f2fbf4', text: '#14532d', border: '#dcfce7', indicator: '#16a34a' },
  blue: { bg: '#f0f6ff', text: '#1e3a8a', border: '#dbeafe', indicator: '#3b82f6' },
  grey: { bg: '#f8fafc', text: '#1e293b', border: '#e2e8f0', indicator: '#64748b' },
  amber: { bg: '#fffdf5', text: '#78350f', border: '#fef3c7', indicator: '#d97706' },
  teal: { bg: '#f0fdfa', text: '#134e4a', border: '#ccfbf1', indicator: '#0d9488' },
};

const subjects = [];
const subjectByCode = new Map();

for (let i = 1; i < subRows.length; i++) {
  const [code, name, cat, stdName, weekly, maxDay, dbl, colorPref] = subRows[i];
  const numMatch = stdName.match(/\d+/);
  const gradeId = numMatch ? `class-g${numMatch[0]}` : 'class-g6';
  const colorKey = (colorPref || 'grey').toLowerCase();
  const color = COLOR_MAP[colorKey] || COLOR_MAP.grey;

  const subObj = {
    id: `sub-${code.toLowerCase()}`,
    code: code.trim(),
    name: name.trim(),
    category: cat.trim(),
    gradeIds: [gradeId],
    weeklyPeriodsRequired: parseInt(weekly, 10) || 2,
    maxPeriodsPerDay: parseInt(maxDay, 10) || 2,
    isDoublePeriodAllowed: (dbl || '').toLowerCase() === 'yes',
    color
  };
  subjects.push(subObj);
  subjectByCode.set(code.trim().toUpperCase(), subObj);
}

// 4. Allocations
const allocations = [];
for (let i = 1; i < allocRows.length; i++) {
  const [std, div, subName, subCode, tchName, periods] = allocRows[i];
  const secId = sectionMap.get(div.trim()) || sectionMap.get(`${std}-${div.trim()}`);
  const subObj = subjectByCode.get(subCode.trim().toUpperCase());
  const tchObj = teacherByName.get(tchName.trim().toLowerCase());

  if (secId && subObj && tchObj) {
    if (!tchObj.qualifiedSubjectIds.includes(subObj.id)) {
      tchObj.qualifiedSubjectIds.push(subObj.id);
    }
    allocations.push({
      sectionId: secId,
      subjectId: subObj.id,
      teacherId: tchObj.id,
      periodsPerWeek: parseInt(periods, 10) || subObj.weeklyPeriodsRequired
    });
  }
}

// Generate an initial schedule for these allocations
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TEACHING_PERIODS = [1, 2, 4, 5, 6, 8, 9, 10, 11, 12]; // 10 teaching periods per day

const schedule = [];
// Map for teacher tracking: `day-period-teacherId` -> boolean
const teacherOccupied = new Set();
// Map for section tracking: `day-period-sectionId` -> boolean
const sectionOccupied = new Set();

for (const alloc of allocations) {
  let placed = 0;
  // Distribute across days as evenly as possible
  for (let dayIdx = 0; dayIdx < DAYS.length && placed < alloc.periodsPerWeek; dayIdx++) {
    const day = DAYS[dayIdx];
    for (const p of TEACHING_PERIODS) {
      const secKey = `${day}-${p}-${alloc.sectionId}`;
      const tchKey = `${day}-${p}-${alloc.teacherId}`;

      if (!sectionOccupied.has(secKey) && !teacherOccupied.has(tchKey)) {
        sectionOccupied.add(secKey);
        teacherOccupied.add(tchKey);
        schedule.push({
          id: `hmps-slot-${schedule.length + 1}`,
          timetableId: 'tt-hmps-2027',
          day,
          periodIndex: p,
          sectionId: alloc.sectionId,
          subjectId: alloc.subjectId,
          teacherId: alloc.teacherId,
          lockType: 'none'
        });
        placed++;
        break;
      }
    }
  }

  // If still remaining periods (e.g. 5 periods per week), do another pass
  if (placed < alloc.periodsPerWeek) {
    for (let dayIdx = 0; dayIdx < DAYS.length && placed < alloc.periodsPerWeek; dayIdx++) {
      const day = DAYS[dayIdx];
      for (const p of TEACHING_PERIODS) {
        const secKey = `${day}-${p}-${alloc.sectionId}`;
        const tchKey = `${day}-${p}-${alloc.teacherId}`;

        if (!sectionOccupied.has(secKey) && !teacherOccupied.has(tchKey)) {
          sectionOccupied.add(secKey);
          teacherOccupied.add(tchKey);
          schedule.push({
            id: `hmps-slot-${schedule.length + 1}`,
            timetableId: 'tt-hmps-2027',
            day,
            periodIndex: p,
            sectionId: alloc.sectionId,
            subjectId: alloc.subjectId,
            teacherId: alloc.teacherId,
            lockType: 'none'
          });
          placed++;
          if (placed >= alloc.periodsPerWeek) break;
        }
      }
    }
  }
}

console.log('Total scheduled slots generated:', schedule.length);

// Generate ts content
const output = `// Auto-generated HMPS Secondary (2027-2028) Dataset from school CSVs
import { Institution, GradeClass, Subject, Teacher, TimeSlot, TimetableSlot, TimetableVersion } from './types'

export const HMPS_INSTITUTION: Institution = {
  id: 'inst-hmps',
  name: 'Hansraj Morarji Public School (ICSE)',
  code: 'HMPS',
  type: 'school',
  academicYear: '2027-2028',
  campusName: 'Main Campus',
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  startTime: '08:40',
  endTime: '15:10',
  periodDurationMinutes: 35,
  lunchBreakMinutes: 25,
  shortBreakMinutes: 15,
  defaultOrientation: 'periods-on-top',
}

export const HMPS_TIME_SLOTS: TimeSlot[] = [
  { index: 0, label: 'Assembly', startTime: '08:40', endTime: '09:00', type: 'assembly', isBreak: true },
  { index: 1, label: 'Period 1', startTime: '09:00', endTime: '09:35', type: 'regular', isBreak: false },
  { index: 2, label: 'Period 2', startTime: '09:35', endTime: '10:10', type: 'regular', isBreak: false },
  { index: 3, label: 'Morning Break', startTime: '10:10', endTime: '10:25', type: 'short_break', isBreak: true },
  { index: 4, label: 'Period 3', startTime: '10:25', endTime: '11:00', type: 'regular', isBreak: false },
  { index: 5, label: 'Period 4', startTime: '11:00', endTime: '11:35', type: 'regular', isBreak: false },
  { index: 6, label: 'Period 5', startTime: '11:35', endTime: '12:10', type: 'regular', isBreak: false },
  { index: 7, label: 'Lunch Recess', startTime: '12:10', endTime: '12:35', type: 'lunch', isBreak: true },
  { index: 8, label: 'Period 6', startTime: '12:35', endTime: '13:10', type: 'regular', isBreak: false },
  { index: 9, label: 'Period 7', startTime: '13:10', endTime: '13:40', type: 'regular', isBreak: false },
  { index: 10, label: 'Period 8', startTime: '13:40', endTime: '14:10', type: 'regular', isBreak: false },
  { index: 11, label: 'Period 9', startTime: '14:10', endTime: '14:40', type: 'regular', isBreak: false },
  { index: 12, label: 'Period 10', startTime: '14:40', endTime: '15:10', type: 'regular', isBreak: false },
]

export const HMPS_CLASSES: GradeClass[] = ${JSON.stringify(classes, null, 2)}

export const HMPS_SUBJECTS: Subject[] = ${JSON.stringify(subjects, null, 2)}

export const HMPS_TEACHERS: Teacher[] = ${JSON.stringify(teachers, null, 2)}

export const HMPS_TIMETABLE_VERSION: TimetableVersion = {
  id: 'tt-hmps-2027',
  name: 'HMPS Secondary 2027-28 Master Schedule',
  versionNumber: 1,
  academicYear: '2027-2028',
  status: 'reviewed',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  slotsCount: ${schedule.length},
  hardConflictsCount: 0,
  softConflictsCount: 0,
  healthScore: 98,
  isSandbox: false,
}

export const HMPS_SLOTS: TimetableSlot[] = ${JSON.stringify(schedule, null, 2)}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'lib', 'hmpsData.ts'), output, 'utf8');
console.log('Saved src/lib/hmpsData.ts successfully!');
