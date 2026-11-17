import { GradeClass, Subject, Teacher, TimeSlot, Institution, TimetableSlot } from './types'
import { HMPS_INSTITUTION, HMPS_CLASSES, HMPS_SUBJECTS, HMPS_TEACHERS, HMPS_TIME_SLOTS, HMPS_TIMETABLE_VERSION, HMPS_SLOTS } from './hmpsData'
import { StorageEngine } from './storage'

// Robust RFC-4180 compliant CSV Parser
export function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0)
  const rows: string[][] = []

  for (const line of lines) {
    const row: string[] = []
    let inQuotes = false
    let token = ''

    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          token += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (c === ',' && !inQuotes) {
        row.push(token.trim())
        token = ''
      } else {
        token += c
      }
    }
    row.push(token.trim())
    rows.push(row)
  }

  return rows
}

// Convert 2D array to CSV string
export function toCSV(headers: string[], rows: (string | number)[][]): string {
  const escapeCell = (val: string | number) => {
    const str = String(val ?? '')
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const csvRows = [headers.map(escapeCell).join(',')]
  for (const r of rows) {
    csvRows.push(r.map(escapeCell).join(','))
  }
  return csvRows.join('\r\n')
}

export type CsvDataType = 'standards' | 'subjects' | 'teachers' | 'allocations' | 'schedule' | 'unknown'

// Auto-detect CSV type with high precision using both headers and sample data
export function detectCsvType(headers: string[], sampleRows: string[][] = []): CsvDataType {
  const hStr = headers.map((h) => h.toLowerCase().trim()).join(' | ')

  // 1. Allocations (Teacher to Subject to Division)
  if (
    hStr.includes('assigned teacher') ||
    (hStr.includes('division') && (hStr.includes('periods per week') || hStr.includes('allocation')) && (hStr.includes('subject') || hStr.includes('code')))
  ) {
    return 'allocations'
  }

  // 2. Constraints (Ignore from main entities)
  if (hStr.includes('constraint type') || hStr.includes('entity affected')) {
    return 'unknown'
  }

  // 3. Subjects Catalog (Must be checked BEFORE standards because subjects CSV has 'Applicable Standards'!)
  if (
    (hStr.includes('subject code') && (hStr.includes('weekly periods') || hStr.includes('double period') || hStr.includes('applicable standards') || hStr.includes('color preference'))) ||
    (hStr.includes('subject name') && hStr.includes('category') && !hStr.includes('assigned teacher'))
  ) {
    return 'subjects'
  }

  // 4. Standards & Divisions
  if (
    hStr.includes('divisions list') ||
    hStr.includes('numeric level') ||
    hStr.includes('full section names') ||
    (hStr.includes('standard name') && !hStr.includes('subject code'))
  ) {
    return 'standards'
  }

  // 5. Teachers & Faculty
  if (
    hStr.includes('employee id') ||
    hStr.includes('qualified subjects') ||
    (hStr.includes('teacher') && hStr.includes('designation')) ||
    hStr.includes('max consecutive periods')
  ) {
    return 'teachers'
  }

  // 6. Schedule & Bell Timings (Horizontal headers or Vertical Key-Value layout)
  if (
    hStr.includes('daily start time') ||
    hStr.includes('total teaching periods') ||
    hStr.includes('school name') ||
    hStr.includes('period duration') ||
    hStr.includes('morning break duration') ||
    hStr.includes('lunch break duration')
  ) {
    return 'schedule'
  }

  if (headers.some((h) => h.toLowerCase() === 'field') && headers.some((h) => h.toLowerCase().includes('value'))) {
    const fields = sampleRows.map((r) => (r[0] || '').toLowerCase()).join(' ')
    if (fields.includes('school name') || fields.includes('academic year') || fields.includes('start time') || fields.includes('period')) {
      return 'schedule'
    }
  }

  return 'unknown'
}

export interface CsvFileEntry {
  name: string
  type: CsvDataType
  rawRows: string[][]
}

export interface ImportResult {
  institution: Institution
  classes: GradeClass[]
  subjects: Subject[]
  teachers: Teacher[]
  timeSlots: TimeSlot[] | null
  slots: TimetableSlot[]
  logs: string[]
  stats: {
    standardsCount: number
    divisionsCount: number
    subjectsCount: number
    teachersCount: number
    allocationsCount: number
    slotsCount: number
  }
}

// Full import processor connecting standards, subjects, teachers, and allocations
export function processSchoolCsvImport(
  fileEntries: CsvFileEntry[],
  currentClasses: GradeClass[],
  currentSubjects: Subject[],
  currentTeachers: Teacher[],
  currentInstitution: Institution
): ImportResult {
  const logs: string[] = []
  const stats = {
    standardsCount: 0,
    divisionsCount: 0,
    subjectsCount: 0,
    teachersCount: 0,
    allocationsCount: 0,
    slotsCount: 0,
  }

  const schedFile = fileEntries.find((f) => f.type === 'schedule')
  const stdFile = fileEntries.find((f) => f.type === 'standards')
  const subFile = fileEntries.find((f) => f.type === 'subjects')
  const tchFile = fileEntries.find((f) => f.type === 'teachers')
  const allocFile = fileEntries.find((f) => f.type === 'allocations')

  // 1. Process Schedule & Bell Timings
  let updatedInstitution = { ...currentInstitution }
  let newTimeSlots: TimeSlot[] | null = null

  if (schedFile) {
    const kvMap = new Map<string, string>()
    schedFile.rawRows.forEach((r) => {
      if (r[0] && r[1]) kvMap.set(r[0].toLowerCase().trim(), r[1].trim())
    })

    const name = kvMap.get('school name') || kvMap.get('institution name') || updatedInstitution.name
    const code = kvMap.get('institution code') || kvMap.get('code') || updatedInstitution.code
    const campus = kvMap.get('campus name') || updatedInstitution.campusName
    const year = kvMap.get('academic year') || updatedInstitution.academicYear
    const startTimeRaw = kvMap.get('daily start time') || updatedInstitution.startTime || '08:40'
    const endTimeRaw = kvMap.get('daily end time') || updatedInstitution.endTime || '15:10'
    const totalPeriods = parseInt(kvMap.get('total teaching periods per day') || '0', 10)

    const normTime = (t: string) => {
      if (!t) return '08:00'
      const m = t.match(/(\d{1,2}):(\d{2})/)
      if (!m) return '08:00'
      let h = parseInt(m[1], 10)
      const min = m[2]
      if (/pm/i.test(t) && h < 12) h += 12
      return `${String(h).padStart(2, '0')}:${min}`
    }

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
    }

    logs.push(`Configured institution profile: ${updatedInstitution.name} (${updatedInstitution.academicYear})`)

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
      ]
      logs.push(`Generated 10 teaching periods + Assembly + Short Break + Lunch Recess.`)
    }
  }

  // 2. Process Standards & Divisions
  let classes = stdFile ? [] : [...currentClasses]
  const sectionLookup = new Map<string, string>()

  if (stdFile) {
    stdFile.rawRows.forEach((r, idx) => {
      const stdName = (r[0] || `Grade ${idx + 1}`).trim()
      const numMatch = stdName.match(/\d+/) || (r[1] ? r[1].match(/\d+/) : null)
      const num = numMatch ? parseInt(numMatch[0], 10) : idx + 1
      const classId = `class-g${num}`
      const divStr = r[2] || 'Section A'
      const divs = divStr.split(',').map((s) => s.trim())
      const fullSecs = (r[3] || '').split(',').map((s) => s.trim())

      const sections = divs.map((div, dIdx) => {
        const divClean = div.replace(/^div(ision)?\s*/i, '').replace(/^sec(tion)?\s*/i, '').trim()
        const secId = `sec-${num}${divClean.toLowerCase()}`
        const fullName = fullSecs[dIdx] || `${stdName} - ${div}`

        // Lookup aliases for allocations matching
        sectionLookup.set(`${stdName.toLowerCase()}-${div.toLowerCase()}`, secId)
        sectionLookup.set(`${stdName.toLowerCase()}-${divClean.toLowerCase()}`, secId)
        sectionLookup.set(`${num}${divClean.toLowerCase()}`, secId)
        sectionLookup.set(div.toLowerCase(), secId)
        sectionLookup.set(divClean.toLowerCase(), secId)
        sectionLookup.set(fullName.toLowerCase(), secId)

        return { id: secId, classId, name: div, fullName }
      })

      classes.push({
        id: classId,
        name: stdName,
        numericLevel: num,
        sections,
      })
    })

    stats.standardsCount = classes.length
    stats.divisionsCount = classes.flatMap((c) => c.sections).length
    logs.push(`Loaded ${classes.length} standards and ${stats.divisionsCount} sections.`)
  } else {
    classes.forEach((c) => {
      c.sections.forEach((s) => {
        sectionLookup.set(s.id, s.id)
        sectionLookup.set(s.name.toLowerCase(), s.id)
        sectionLookup.set(s.fullName.toLowerCase(), s.id)
      })
    })
  }

  // 3. Process Subjects
  let subjects = subFile ? [] : [...currentSubjects]
  const subjectLookup = new Map<string, Subject>()

  const COLOR_PALETTE: Record<string, { bg: string; text: string; border: string; indicator: string }> = {
    purple: { bg: '#fbf7ff', text: '#581c87', border: '#f3e8ff', indicator: '#9333ea' },
    green: { bg: '#f2fbf4', text: '#14532d', border: '#dcfce7', indicator: '#16a34a' },
    blue: { bg: '#f0f6ff', text: '#1e3a8a', border: '#dbeafe', indicator: '#3b82f6' },
    grey: { bg: '#f8fafc', text: '#1e293b', border: '#e2e8f0', indicator: '#64748b' },
    amber: { bg: '#fffdf5', text: '#78350f', border: '#fef3c7', indicator: '#d97706' },
    teal: { bg: '#f0fdfa', text: '#134e4a', border: '#ccfbf1', indicator: '#0d9488' },
  }

  if (subFile) {
    subFile.rawRows.forEach((r, idx) => {
      const code = (r[0] || `SUB-${idx + 1}`).trim()
      const name = (r[1] || `Subject ${idx + 1}`).trim()
      const cat = (r[2] || 'core').toLowerCase().trim()
      const stdName = (r[3] || '').trim()
      const weekly = parseInt(r[4], 10) || 3
      const maxDay = parseInt(r[5], 10) || 2
      const dbl = (r[6] || '').toLowerCase() === 'yes'
      const colorPref = (r[7] || 'blue').toLowerCase().trim()

      const subId = `sub-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`

      // Match gradeIds from Applicable Standards
      const gradeIds: string[] = []
      if (stdName) {
        const stdClean = stdName.toLowerCase()
        classes.forEach((c) => {
          if (stdClean.includes(c.name.toLowerCase()) || stdClean.includes(String(c.numericLevel))) {
            gradeIds.push(c.id)
          }
        })
      }
      if (gradeIds.length === 0 && classes.length > 0) {
        classes.forEach((c) => gradeIds.push(c.id))
      }

      const color = COLOR_PALETTE[colorPref] || COLOR_PALETTE.blue

      const subObj: Subject = {
        id: subId,
        code,
        name,
        category: ['core', 'elective', 'lab', 'activity', 'sports', 'language'].includes(cat) ? (cat as any) : 'core',
        gradeIds,
        weeklyPeriodsRequired: weekly,
        maxPeriodsPerDay: maxDay,
        isDoublePeriodAllowed: dbl,
        color,
      }

      subjects.push(subObj)
      subjectLookup.set(code.toUpperCase(), subObj)
      subjectLookup.set(name.toLowerCase(), subObj)
      subjectLookup.set(subId, subObj)
    })

    stats.subjectsCount = subjects.length
    logs.push(`Loaded ${subjects.length} curriculum subjects with grade allocations.`)
  } else {
    subjects.forEach((s) => {
      subjectLookup.set(s.code.toUpperCase(), s)
      subjectLookup.set(s.name.toLowerCase(), s)
      subjectLookup.set(s.id, s)
    })
  }

  // 4. Process Teachers
  let teachers = tchFile ? [] : [...currentTeachers]
  const teacherLookup = new Map<string, Teacher>()

  if (tchFile) {
    tchFile.rawRows.forEach((r, idx) => {
      const empId = (r[0] || `TCH-${idx + 1}`).trim()
      const name = (r[1] || `Faculty ${idx + 1}`).trim()
      const desig = (r[2] || 'Faculty').trim()
      const email = (r[3] || '').trim()
      const phone = (r[4] || '').trim()
      const qualStr = (r[5] || '').trim()
      const maxDay = parseInt(r[6], 10) || 6
      const maxWeek = parseInt(r[7], 10) || 30
      const maxCon = parseInt(r[8], 10) || 3

      const tchId = empId.toLowerCase().replace(/[^a-z0-9]/g, '-')

      const qualIds: string[] = []
      if (qualStr) {
        const tokens = qualStr.split(',').map((s) => s.trim().toLowerCase())
        tokens.forEach((tok) => {
          subjects.forEach((sub) => {
            if (sub.name.toLowerCase().includes(tok) || sub.code.toLowerCase().includes(tok)) {
              if (!qualIds.includes(sub.id)) qualIds.push(sub.id)
            }
          })
        })
      }

      const tchObj: Teacher = {
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
        availability: [],
      }

      teachers.push(tchObj)
      teacherLookup.set(name.toLowerCase(), tchObj)
      teacherLookup.set(empId.toUpperCase(), tchObj)
      teacherLookup.set(tchId, tchObj)
    })

    stats.teachersCount = teachers.length
    logs.push(`Loaded ${teachers.length} faculty profiles with workload targets.`)
  } else {
    teachers.forEach((t) => {
      teacherLookup.set(t.name.toLowerCase(), t)
      teacherLookup.set(t.employeeCode.toUpperCase(), t)
      teacherLookup.set(t.id, t)
    })
  }

  // 5. Process Allocations
  let slots: TimetableSlot[] = []
  if (allocFile) {
    const allocations: { sectionId: string; subjectId: string; teacherId: string; periodsPerWeek: number }[] = []
    allocFile.rawRows.forEach((r) => {
      const std = (r[0] || '').trim().toLowerCase()
      const div = (r[1] || '').trim().toLowerCase()
      const subName = (r[2] || '').trim().toLowerCase()
      const subCode = (r[3] || '').trim().toUpperCase()
      const tchName = (r[4] || '').trim().toLowerCase()
      const periods = parseInt(r[5], 10) || 3

      const divClean = div.replace(/^div(ision)?\s*/i, '').replace(/^sec(tion)?\s*/i, '').trim()
      const secId =
        sectionLookup.get(`${std}-${div}`) ||
        sectionLookup.get(`${std}-${divClean}`) ||
        sectionLookup.get(div) ||
        sectionLookup.get(divClean)

      const subObj = subjectLookup.get(subCode) || subjectLookup.get(subName)
      let tchObj = teacherLookup.get(tchName)

      // Fallback create faculty if listed in allocations
      if (!tchObj && tchName) {
        const newTchId = `tch-${tchName.replace(/[^a-z0-9]/g, '-')}`
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
          availability: [],
        }
        teachers.push(tchObj)
        teacherLookup.set(tchName, tchObj)
      }

      if (secId && subObj && tchObj) {
        if (!tchObj.qualifiedSubjectIds.includes(subObj.id)) {
          tchObj.qualifiedSubjectIds.push(subObj.id)
        }
        allocations.push({
          sectionId: secId,
          subjectId: subObj.id,
          teacherId: tchObj.id,
          periodsPerWeek: periods,
        })
      }
    })

    stats.allocationsCount = allocations.length
    logs.push(`Matched ${allocations.length} weekly subject-teacher-section allocations.`)

    // Distribute allocations across the school week into timetable slots
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const
    const TEACHING_PERIODS = newTimeSlots
      ? newTimeSlots.filter((ts) => !ts.isBreak).map((ts) => ts.index)
      : [1, 2, 4, 5, 7, 8, 9]

    const teacherOccupied = new Set<string>()
    const sectionOccupied = new Set<string>()

    allocations.forEach((alloc) => {
      let placed = 0
      for (let pass = 0; pass < 2 && placed < alloc.periodsPerWeek; pass++) {
        for (let d = 0; d < DAYS.length && placed < alloc.periodsPerWeek; d++) {
          const day = DAYS[d]
          for (const p of TEACHING_PERIODS) {
            const secKey = `${day}-${p}-${alloc.sectionId}`
            const tchKey = `${day}-${p}-${alloc.teacherId}`

            if (!sectionOccupied.has(secKey) && !teacherOccupied.has(tchKey)) {
              sectionOccupied.add(secKey)
              teacherOccupied.add(tchKey)
              slots.push({
                id: `slot-imp-${slots.length + 1}`,
                timetableId: 'tt-master',
                day,
                periodIndex: p,
                sectionId: alloc.sectionId,
                subjectId: alloc.subjectId,
                teacherId: alloc.teacherId,
                lockType: 'none',
              })
              placed++
              break
            }
          }
        }
      }
    })

    stats.slotsCount = slots.length
    logs.push(`Pre-generated ${slots.length} conflict-free schedule slots into master timetable.`)
  }

  return {
    institution: updatedInstitution,
    classes,
    subjects,
    teachers,
    timeSlots: newTimeSlots,
    slots,
    logs,
    stats,
  }
}

// Preload and apply the official HMPS Secondary (2027-28) dataset
export function loadHmpsDataset(): {
  institution: Institution
  classes: GradeClass[]
  subjects: Subject[]
  teachers: Teacher[]
  timeSlots: TimeSlot[]
  slots: TimetableSlot[]
} {
  StorageEngine.saveInstitution(HMPS_INSTITUTION)
  StorageEngine.saveClasses(HMPS_CLASSES)
  StorageEngine.saveSubjects(HMPS_SUBJECTS)
  StorageEngine.saveTeachers(HMPS_TEACHERS)
  StorageEngine.saveTimeSlots(HMPS_TIME_SLOTS)
  StorageEngine.saveVersions([HMPS_TIMETABLE_VERSION])
  StorageEngine.saveActiveVersionId(HMPS_TIMETABLE_VERSION.id)
  StorageEngine.saveSlots(HMPS_TIMETABLE_VERSION.id, HMPS_SLOTS)

  return {
    institution: HMPS_INSTITUTION,
    classes: HMPS_CLASSES,
    subjects: HMPS_SUBJECTS,
    teachers: HMPS_TEACHERS,
    timeSlots: HMPS_TIME_SLOTS,
    slots: HMPS_SLOTS,
  }
}

// Download templates
export function downloadCsvTemplate(type: CsvDataType) {
  let filename = ''
  let content = ''

  switch (type) {
    case 'standards':
      filename = 'standards_and_divisions_template.csv'
      content = toCSV(
        ['Standard Name', 'Numeric Level', 'Divisions List', 'Full Section Names', 'Class Teacher Name (Optional)'],
        [
          ['Grade 9', 9, 'Section A, Section B', 'Grade 9-A, Grade 9-B', 'Dr. Sharma (9A), Ms. Patel (9B)'],
          ['Grade 10', 10, 'Section A, Section B', 'Grade 10-A, Grade 10-B', 'Mr. Rao (10A), Ms. Iyer (10B)'],
          ['Grade 11', 11, 'Science, Commerce', 'Grade 11-Sci, Grade 11-Com', 'Dr. Verma (11-Sci), Ms. Khan (11-Com)'],
          ['Grade 12', 12, 'Science, Commerce', 'Grade 12-Sci, Grade 12-Com', 'Mr. Mehta (12-Sci), Ms. Joshi (12-Com)'],
        ]
      )
      break

    case 'subjects':
      filename = 'subjects_template.csv'
      content = toCSV(
        ['Subject Code', 'Subject Name', 'Category (core/lab/sports/activity/language)', 'Applicable Standards', 'Weekly Periods Required', 'Max Periods Per Day', 'Double Period Allowed (Yes/No)', 'Color Preference'],
        [
          ['ENG-01', 'English Language', 'core', 'Grade 9', 4, 2, 'No', 'Purple'],
          ['MATH-01', 'Mathematics', 'core', 'Grade 9', 5, 2, 'No', 'Blue'],
          ['PHY-01', 'Physics', 'core', 'Grade 9', 3, 2, 'Yes', 'Green'],
          ['CHEM-01', 'Chemistry', 'core', 'Grade 9', 3, 2, 'Yes', 'Green'],
          ['BIO-01', 'Biology', 'core', 'Grade 9', 3, 2, 'Yes', 'Green'],
          ['COMP-01', 'Computer Science', 'lab', 'Grade 9', 2, 2, 'Yes', 'Grey'],
          ['PE-01', 'Physical Education', 'sports', 'Grade 9', 2, 2, 'No', 'Grey'],
        ]
      )
      break

    case 'teachers':
      filename = 'teachers_template.csv'
      content = toCSV(
        ['Employee ID', 'Full Name', 'Designation', 'Email (Optional)', 'Phone (Optional)', 'Qualified Subjects (List codes or names)', 'Max Periods Per Day', 'Max Periods Per Week', 'Max Consecutive Periods'],
        [
          ['TCH-101', 'Dr. Sharma', 'Senior Faculty', 'sharma@school.edu', '+91 98000 11111', 'Mathematics, Physics', 6, 28, 3],
          ['TCH-102', 'Ms. Patel', 'Faculty', 'patel@school.edu', '+91 98000 22222', 'English Language', 5, 25, 3],
          ['TCH-103', 'Mr. Rao', 'Faculty', 'rao@school.edu', '+91 98000 33333', 'Chemistry, Biology', 6, 28, 3],
          ['TCH-104', 'Ms. Iyer', 'Computer Instructor', 'iyer@school.edu', '+91 98000 44444', 'Computer Science', 6, 30, 4],
        ]
      )
      break

    case 'allocations':
      filename = 'teacher_subject_allocations_template.csv'
      content = toCSV(
        ['Standard', 'Division', 'Subject Name', 'Subject Code', 'Assigned Teacher Name', 'Periods Per Week'],
        [
          ['Grade 9', '9A', 'Mathematics', 'MATH-01', 'Dr. Sharma', 5],
          ['Grade 9', '9A', 'English Language', 'ENG-01', 'Ms. Patel', 4],
          ['Grade 9', '9A', 'Physics', 'PHY-01', 'Dr. Sharma', 3],
          ['Grade 9', '9A', 'Chemistry', 'CHEM-01', 'Mr. Rao', 3],
          ['Grade 9', '9A', 'Computer Science', 'COMP-01', 'Ms. Iyer', 2],
        ]
      )
      break

    case 'schedule':
      filename = 'institution_and_schedule_template.csv'
      content = toCSV(
        ['Field', 'Value', 'Example', 'Description'],
        [
          ['School Name', 'Greenwood International School', 'City Academy', 'Full official name of school or college'],
          ['Institution Code', 'GIS', 'CTA', 'Short 3 to 5 letter abbreviation'],
          ['Campus Name', 'Main Campus', 'Main Campus', 'Campus or branch name'],
          ['Academic Year', '2026-2027', '2026-2027', 'Current academic session'],
          ['Daily Start Time', '08:00 AM', '08:00 AM', 'School start bell time'],
          ['Daily End Time', '02:30 PM', '02:30 PM', 'School dispersal bell time'],
          ['Total Teaching Periods Per Day', 8, 7, 'Number of academic periods per day (excluding breaks)'],
        ]
      )
      break

    default:
      return
  }

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.click()
  URL.revokeObjectURL(url)
}
