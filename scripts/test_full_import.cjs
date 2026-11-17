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

function processImportedFiles(fileEntries, currentClasses = [], currentSubjects = [], currentTeachers = [], currentInstitution = {}) {
  const logs = [];
  const stats = { standardsCount: 0, divisionsCount: 0, subjectsCount: 0, teachersCount: 0, allocationsCount: 0 };

  const schedFile = fileEntries.find(f => f.type === 'schedule');
  const stdFile = fileEntries.find(f => f.type === 'standards');
  const subFile = fileEntries.find(f => f.type === 'subjects');
  const tchFile = fileEntries.find(f => f.type === 'teachers');
  const allocFile = fileEntries.find(f => f.type === 'allocations');

  // 1. Process Schedule
  let updatedInstitution = { ...currentInstitution };
  let newTimeSlots = null;

  if (schedFile) {
    const kvMap = new Map();
    schedFile.rawRows.forEach(r => {
      if (r[0] && r[1]) kvMap.set(r[0].toLowerCase().trim(), r[1].trim());
    });

    const name = kvMap.get('school name') || kvMap.get('institution name') || updatedInstitution.name;
    const code = kvMap.get('institution code') || kvMap.get('code') || updatedInstitution.code;
    const campus = kvMap.get('campus name') || updatedInstitution.campusName;
    const year = kvMap.get('academic year') || updatedInstitution.academicYear;
    const startTimeRaw = kvMap.get('daily start time') || updatedInstitution.startTime || '08:40';
    const endTimeRaw = kvMap.get('daily end time') || updatedInstitution.endTime || '15:10';
    const totalPeriods = parseInt(kvMap.get('total teaching periods per day') || '0', 10);

    // Normalize start/end times (remove AM/PM if present)
    const normTime = (t) => {
      if (!t) return '08:00';
      const m = t.match(/(\d{1,2}):(\d{2})/);
      if (!m) return '08:00';
      let h = parseInt(m[1], 10);
      const min = m[2];
      if (/pm/i.test(t) && h < 12) h += 12;
      return `${String(h).padStart(2, '0')}:${min}`;
    };

    updatedInstitution = {
      ...updatedInstitution,
      name: name || updatedInstitution.name,
      code: code || updatedInstitution.code,
      campusName: campus || updatedInstitution.campusName,
      academicYear: year || updatedInstitution.academicYear,
      startTime: normTime(startTimeRaw),
      endTime: normTime(endTimeRaw),
      periodDurationMinutes: parseInt(kvMap.get('period duration (mins)') || '35', 10) || 35,
      lunchBreakMinutes: parseInt(kvMap.get('lunch break duration (mins)') || '25', 10) || 25,
      shortBreakMinutes: parseInt(kvMap.get('morning break duration (mins)') || '15', 10) || 15,
    };

    logs.push(`Configured institution profile: ${updatedInstitution.name} (${updatedInstitution.academicYear})`);

    // Build time slots if 10 periods (or custom)
    if (totalPeriods === 10) {
      newTimeSlots = [
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
      ];
      logs.push(`Generated 10 teaching periods + Assembly + Morning Break + Lunch Recess.`);
    }
  }

  // 2. Process Standards & Divisions
  let classes = stdFile ? [] : [...currentClasses];
  const sectionLookup = new Map();

  if (stdFile) {
    stdFile.rawRows.forEach((r, idx) => {
      const stdName = r[0] || `Grade ${idx + 1}`;
      const numMatch = stdName.match(/\d+/) || (r[1] ? r[1].match(/\d+/) : null);
      const num = numMatch ? parseInt(numMatch[0], 10) : idx + 1;
      const classId = `class-g${num}`;
      const divStr = r[2] || 'Section A';
      const divs = divStr.split(',').map(s => s.trim());
      const fullSecs = (r[3] || '').split(',').map(s => s.trim());

      const sections = divs.map((div, dIdx) => {
        const divClean = div.replace(/^div(ision)?\s*/i, '').replace(/^sec(tion)?\s*/i, '').trim();
        const secId = `sec-${num}${divClean.toLowerCase()}`;
        const fullName = fullSecs[dIdx] || `${stdName} - ${div}`;

        // Lookups for matching allocations
        sectionLookup.set(`${stdName.toLowerCase()}-${div.toLowerCase()}`, secId);
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
    });

    stats.standardsCount = classes.length;
    stats.divisionsCount = classes.flatMap(c => c.sections).length;
    logs.push(`Loaded ${classes.length} standards and ${stats.divisionsCount} sections.`);
  } else {
    // Populate lookup from current classes
    classes.forEach(c => {
      c.sections.forEach(s => {
        sectionLookup.set(s.id, s.id);
        sectionLookup.set(s.name.toLowerCase(), s.id);
        sectionLookup.set(s.fullName.toLowerCase(), s.id);
      });
    });
  }

  // 3. Process Subjects
  let subjects = subFile ? [] : [...currentSubjects];
  const subjectLookup = new Map();

  const COLOR_PALETTE = {
    purple: { bg: '#fbf7ff', text: '#581c87', border: '#f3e8ff', indicator: '#9333ea' },
    green: { bg: '#f2fbf4', text: '#14532d', border: '#dcfce7', indicator: '#16a34a' },
    blue: { bg: '#f0f6ff', text: '#1e3a8a', border: '#dbeafe', indicator: '#3b82f6' },
    grey: { bg: '#f8fafc', text: '#1e293b', border: '#e2e8f0', indicator: '#64748b' },
    amber: { bg: '#fffdf5', text: '#78350f', border: '#fef3c7', indicator: '#d97706' },
    teal: { bg: '#f0fdfa', text: '#134e4a', border: '#ccfbf1', indicator: '#0d9488' },
  };

  if (subFile) {
    subFile.rawRows.forEach((r, idx) => {
      const code = (r[0] || `SUB-${idx + 1}`).trim();
      const name = (r[1] || `Subject ${idx + 1}`).trim();
      const cat = (r[2] || 'core').toLowerCase().trim();
      const stdName = (r[3] || '').trim();
      const weekly = parseInt(r[4], 10) || 3;
      const maxDay = parseInt(r[5], 10) || 2;
      const dbl = (r[6] || '').toLowerCase() === 'yes';
      const colorPref = (r[7] || 'blue').toLowerCase().trim();

      const subId = `sub-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

      // Match gradeIds
      const gradeIds = [];
      if (stdName) {
        const stdClean = stdName.toLowerCase();
        classes.forEach(c => {
          if (stdClean.includes(c.name.toLowerCase()) || stdClean.includes(String(c.numericLevel))) {
            gradeIds.push(c.id);
          }
        });
      }
      if (gradeIds.length === 0 && classes.length > 0) {
        classes.forEach(c => gradeIds.push(c.id));
      }

      const color = COLOR_PALETTE[colorPref] || COLOR_PALETTE.blue;

      const subObj = {
        id: subId,
        code,
        name,
        category: ['core', 'elective', 'lab', 'activity', 'sports', 'language'].includes(cat) ? cat : 'core',
        gradeIds,
        weeklyPeriodsRequired: weekly,
        maxPeriodsPerDay: maxDay,
        isDoublePeriodAllowed: dbl,
        color
      };

      subjects.push(subObj);
      subjectLookup.set(code.toUpperCase(), subObj);
      subjectLookup.set(name.toLowerCase(), subObj);
      subjectLookup.set(subId, subObj);
    });

    stats.subjectsCount = subjects.length;
    logs.push(`Loaded ${subjects.length} curriculum subjects with grade allocations.`);
  } else {
    subjects.forEach(s => {
      subjectLookup.set(s.code.toUpperCase(), s);
      subjectLookup.set(s.name.toLowerCase(), s);
      subjectLookup.set(s.id, s);
    });
  }

  // 4. Process Teachers
  let teachers = tchFile ? [] : [...currentTeachers];
  const teacherLookup = new Map();

  if (tchFile) {
    tchFile.rawRows.forEach((r, idx) => {
      const empId = (r[0] || `TCH-${idx + 1}`).trim();
      const name = (r[1] || `Faculty ${idx + 1}`).trim();
      const desig = (r[2] || 'Faculty').trim();
      const email = (r[3] || '').trim();
      const phone = (r[4] || '').trim();
      const qualStr = (r[5] || '').trim();
      const maxDay = parseInt(r[6], 10) || 6;
      const maxWeek = parseInt(r[7], 10) || 30;
      const maxCon = parseInt(r[8], 10) || 3;

      const tchId = empId.toLowerCase().replace(/[^a-z0-9]/g, '-');

      // Match qualifiedSubjectIds
      const qualIds = [];
      if (qualStr) {
        const tokens = qualStr.split(',').map(s => s.trim().toLowerCase());
        tokens.forEach(tok => {
          subjects.forEach(sub => {
            if (sub.name.toLowerCase().includes(tok) || sub.code.toLowerCase().includes(tok)) {
              if (!qualIds.includes(sub.id)) qualIds.push(sub.id);
            }
          });
        });
      }

      const tchObj = {
        id: tchId,
        name,
        employeeCode: empId,
        email,
        phone,
        designation: desig,
        qualifiedSubjectIds: qualIds,
        maxPeriodsPerDay: maxDay,
        maxPeriodsPerWeek: maxWeek,
        minPeriodsPerDay: 2,
        maxConsecutivePeriods: maxCon,
        availability: []
      };

      teachers.push(tchObj);
      teacherLookup.set(name.toLowerCase(), tchObj);
      teacherLookup.set(empId.toUpperCase(), tchObj);
      teacherLookup.set(tchId, tchObj);
    });

    stats.teachersCount = teachers.length;
    logs.push(`Loaded ${teachers.length} faculty profiles with workload targets.`);
  } else {
    teachers.forEach(t => {
      teacherLookup.set(t.name.toLowerCase(), t);
      teacherLookup.set(t.employeeCode.toUpperCase(), t);
      teacherLookup.set(t.id, t);
    });
  }

  // 5. Process Allocations
  let slots = [];
  if (allocFile) {
    const allocations = [];
    allocFile.rawRows.forEach(r => {
      const std = (r[0] || '').trim().toLowerCase();
      const div = (r[1] || '').trim().toLowerCase();
      const subName = (r[2] || '').trim().toLowerCase();
      const subCode = (r[3] || '').trim().toUpperCase();
      const tchName = (r[4] || '').trim().toLowerCase();
      const periods = parseInt(r[5], 10) || 3;

      const divClean = div.replace(/^div(ision)?\s*/i, '').replace(/^sec(tion)?\s*/i, '').trim();
      const secId = sectionLookup.get(`${std}-${div}`) ||
                    sectionLookup.get(`${std}-${divClean}`) ||
                    sectionLookup.get(div) ||
                    sectionLookup.get(divClean);

      const subObj = subjectLookup.get(subCode) || subjectLookup.get(subName);
      let tchObj = teacherLookup.get(tchName);

      // If teacher not found in teachers list, dynamically create teacher profile
      if (!tchObj && tchName) {
        const newTchId = `tch-${tchName.replace(/[^a-z0-9]/g, '-')}`;
        tchObj = {
          id: newTchId,
          name: r[4].trim(),
          employeeCode: `EMP-${teachers.length + 1}`,
          email: '',
          phone: '',
          designation: 'Faculty',
          qualifiedSubjectIds: [],
          maxPeriodsPerDay: 6,
          maxPeriodsPerWeek: 30,
          minPeriodsPerDay: 2,
          maxConsecutivePeriods: 3,
          availability: []
        };
        teachers.push(tchObj);
        teacherLookup.set(tchName, tchObj);
      }

      if (secId && subObj && tchObj) {
        if (!tchObj.qualifiedSubjectIds.includes(subObj.id)) {
          tchObj.qualifiedSubjectIds.push(subObj.id);
        }
        allocations.push({
          sectionId: secId,
          subjectId: subObj.id,
          teacherId: tchObj.id,
          periodsPerWeek: periods
        });
      }
    });

    stats.allocationsCount = allocations.length;
    logs.push(`Matched ${allocations.length} weekly subject-teacher-section allocations.`);

    // Generate conflict-free timetable slots from allocations
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const TEACHING_PERIODS = newTimeSlots
      ? newTimeSlots.filter(ts => !ts.isBreak).map(ts => ts.index)
      : [1, 2, 4, 5, 7, 8, 9];

    const teacherOccupied = new Set();
    const sectionOccupied = new Set();

    allocations.forEach(alloc => {
      let placed = 0;
      for (let pass = 0; pass < 2 && placed < alloc.periodsPerWeek; pass++) {
        for (let d = 0; d < DAYS.length && placed < alloc.periodsPerWeek; d++) {
          const day = DAYS[d];
          for (const p of TEACHING_PERIODS) {
            const secKey = `${day}-${p}-${alloc.sectionId}`;
            const tchKey = `${day}-${p}-${alloc.teacherId}`;

            if (!sectionOccupied.has(secKey) && !teacherOccupied.has(tchKey)) {
              sectionOccupied.add(secKey);
              teacherOccupied.add(tchKey);
              slots.push({
                id: `slot-imp-${slots.length + 1}`,
                timetableId: 'tt-master',
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
      }
    });

    logs.push(`Pre-generated ${slots.length} conflict-free schedule slots into master timetable.`);
  }

  return {
    institution: updatedInstitution,
    classes,
    subjects,
    teachers,
    timeSlots: newTimeSlots,
    slots,
    logs,
    stats
  };
}

// Test with all 5 files from school_csv
const dir = path.join(__dirname, '..', 'data', 'school_csv');
const dirFiles = [
  { name: '1_institution_and_schedule.csv', type: 'schedule', rawRows: parseCSV(fs.readFileSync(path.join(dir, '1_institution_and_schedule.csv'), 'utf8')).slice(1) },
  { name: '2_standards_and_divisions.csv', type: 'standards', rawRows: parseCSV(fs.readFileSync(path.join(dir, '2_standards_and_divisions.csv'), 'utf8')).slice(1) },
  { name: '3_subjects.csv', type: 'subjects', rawRows: parseCSV(fs.readFileSync(path.join(dir, '3_subjects.csv'), 'utf8')).slice(1) },
  { name: '4_teachers.csv', type: 'teachers', rawRows: parseCSV(fs.readFileSync(path.join(dir, '4_teachers.csv'), 'utf8')).slice(1) },
  { name: '5_teacher_subject_allocation.csv', type: 'allocations', rawRows: parseCSV(fs.readFileSync(path.join(dir, '5_teacher_subject_allocation.csv'), 'utf8')).slice(1) },
];

const result = processImportedFiles(dirFiles);
console.log('Stats:', result.stats);
console.log('Logs:');
result.logs.forEach(l => console.log('  -', l));
console.log('Total slots scheduled:', result.slots.length);
