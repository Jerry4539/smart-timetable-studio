// Auto-generated HMPS Secondary (2027-2028) Dataset from school CSVs
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

export const HMPS_CLASSES: GradeClass[] = [
  {
    "id": "class-g6",
    "name": "Grade 6",
    "numericLevel": 6,
    "sections": [
      {
        "id": "sec-6a",
        "classId": "class-g6",
        "name": "Div A",
        "fullName": "Grade 6-A"
      },
      {
        "id": "sec-6b",
        "classId": "class-g6",
        "name": "Div B",
        "fullName": "Grade 6-B"
      },
      {
        "id": "sec-6c",
        "classId": "class-g6",
        "name": "Div C",
        "fullName": "Grade 6-C"
      }
    ]
  },
  {
    "id": "class-g7",
    "name": "Grade 7",
    "numericLevel": 7,
    "sections": [
      {
        "id": "sec-7a",
        "classId": "class-g7",
        "name": "Div A",
        "fullName": "Grade 7-A"
      },
      {
        "id": "sec-7b",
        "classId": "class-g7",
        "name": "Div B",
        "fullName": "Grade 7-B"
      }
    ]
  },
  {
    "id": "class-g8",
    "name": "Grade 8",
    "numericLevel": 8,
    "sections": [
      {
        "id": "sec-8a",
        "classId": "class-g8",
        "name": "Div A",
        "fullName": "Grade 8-A"
      },
      {
        "id": "sec-8b",
        "classId": "class-g8",
        "name": "Div B",
        "fullName": "Grade 8-B"
      }
    ]
  },
  {
    "id": "class-g9",
    "name": "Grade 9",
    "numericLevel": 9,
    "sections": [
      {
        "id": "sec-9a",
        "classId": "class-g9",
        "name": "Div A",
        "fullName": "Grade 9-A"
      }
    ]
  },
  {
    "id": "class-g10",
    "name": "Grade 10",
    "numericLevel": 10,
    "sections": [
      {
        "id": "sec-10a",
        "classId": "class-g10",
        "name": "Div A",
        "fullName": "Grade 10-A"
      }
    ]
  }
]

export const HMPS_SUBJECTS: Subject[] = [
  {
    "id": "sub-eng-lit-6",
    "code": "ENG-LIT-6",
    "name": "English Literature",
    "category": "core",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#fbf7ff",
      "text": "#581c87",
      "border": "#f3e8ff",
      "indicator": "#9333ea"
    }
  },
  {
    "id": "sub-eng-lang-6",
    "code": "ENG-LANG-6",
    "name": "English Language",
    "category": "core",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#fbf7ff",
      "text": "#581c87",
      "border": "#f3e8ff",
      "indicator": "#9333ea"
    }
  },
  {
    "id": "sub-phy-6",
    "code": "PHY-6",
    "name": "Physics",
    "category": "core",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-chem-6",
    "code": "CHEM-6",
    "name": "Chemistry",
    "category": "core",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-bio-6",
    "code": "BIO-6",
    "name": "Biology",
    "category": "core",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-math-6",
    "code": "MATH-6",
    "name": "Mathematics",
    "category": "core",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 5,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f0f6ff",
      "text": "#1e3a8a",
      "border": "#dbeafe",
      "indicator": "#3b82f6"
    }
  },
  {
    "id": "sub-hist-6",
    "code": "HIST-6",
    "name": "History",
    "category": "core",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-geo-6",
    "code": "GEO-6",
    "name": "Geography",
    "category": "core",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-comp-6",
    "code": "COMP-6",
    "name": "Computer",
    "category": "lab",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-hin-6",
    "code": "HIN-6",
    "name": "Hindi",
    "category": "language",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-mar-6",
    "code": "MAR-6",
    "name": "Marathi",
    "category": "language",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-art-6",
    "code": "ART-6",
    "name": "Art",
    "category": "activity",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-dance-6",
    "code": "DANCE-6",
    "name": "Dance",
    "category": "activity",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-music-6",
    "code": "MUSIC-6",
    "name": "Music",
    "category": "activity",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-lib-6",
    "code": "LIB-6",
    "name": "Library",
    "category": "activity",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-yoga-6",
    "code": "YOGA-6",
    "name": "Yoga",
    "category": "sports",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-skill-6",
    "code": "SKILL-6",
    "name": "Skill",
    "category": "activity",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-supw-6",
    "code": "SUPW-6",
    "name": "Club / SUPW",
    "category": "activity",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-sport-6",
    "code": "SPORT-6",
    "name": "Sports",
    "category": "sports",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-gk-6",
    "code": "GK-6",
    "name": "G.K.",
    "category": "activity",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-ve-6",
    "code": "VE-6",
    "name": "Value Education",
    "category": "activity",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-ct-6",
    "code": "CT-6",
    "name": "Circle Time",
    "category": "activity",
    "gradeIds": [
      "class-g6"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-eng-lit-7",
    "code": "ENG-LIT-7",
    "name": "English Literature",
    "category": "core",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#fbf7ff",
      "text": "#581c87",
      "border": "#f3e8ff",
      "indicator": "#9333ea"
    }
  },
  {
    "id": "sub-eng-lang-7",
    "code": "ENG-LANG-7",
    "name": "English Language",
    "category": "core",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#fbf7ff",
      "text": "#581c87",
      "border": "#f3e8ff",
      "indicator": "#9333ea"
    }
  },
  {
    "id": "sub-phy-7",
    "code": "PHY-7",
    "name": "Physics",
    "category": "core",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-chem-7",
    "code": "CHEM-7",
    "name": "Chemistry",
    "category": "core",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-bio-7",
    "code": "BIO-7",
    "name": "Biology",
    "category": "core",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-math-7",
    "code": "MATH-7",
    "name": "Mathematics",
    "category": "core",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 5,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f0f6ff",
      "text": "#1e3a8a",
      "border": "#dbeafe",
      "indicator": "#3b82f6"
    }
  },
  {
    "id": "sub-hist-7",
    "code": "HIST-7",
    "name": "History",
    "category": "core",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-geo-7",
    "code": "GEO-7",
    "name": "Geography",
    "category": "core",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-comp-7",
    "code": "COMP-7",
    "name": "Computer",
    "category": "lab",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-hin-7",
    "code": "HIN-7",
    "name": "Hindi",
    "category": "language",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-mar-7",
    "code": "MAR-7",
    "name": "Marathi",
    "category": "language",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-art-7",
    "code": "ART-7",
    "name": "Art",
    "category": "activity",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-dance-7",
    "code": "DANCE-7",
    "name": "Dance",
    "category": "activity",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-music-7",
    "code": "MUSIC-7",
    "name": "Music",
    "category": "activity",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-lib-7",
    "code": "LIB-7",
    "name": "Library",
    "category": "activity",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-yoga-7",
    "code": "YOGA-7",
    "name": "Yoga",
    "category": "sports",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-skill-7",
    "code": "SKILL-7",
    "name": "Skill",
    "category": "activity",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-supw-7",
    "code": "SUPW-7",
    "name": "Club / SUPW",
    "category": "activity",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-sport-7",
    "code": "SPORT-7",
    "name": "Sports",
    "category": "sports",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-gk-7",
    "code": "GK-7",
    "name": "G.K.",
    "category": "activity",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-ve-7",
    "code": "VE-7",
    "name": "Value Education",
    "category": "activity",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-ct-7",
    "code": "CT-7",
    "name": "Circle Time",
    "category": "activity",
    "gradeIds": [
      "class-g7"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-eng-lit-8",
    "code": "ENG-LIT-8",
    "name": "English Literature",
    "category": "core",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#fbf7ff",
      "text": "#581c87",
      "border": "#f3e8ff",
      "indicator": "#9333ea"
    }
  },
  {
    "id": "sub-eng-lang-8",
    "code": "ENG-LANG-8",
    "name": "English Language",
    "category": "core",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#fbf7ff",
      "text": "#581c87",
      "border": "#f3e8ff",
      "indicator": "#9333ea"
    }
  },
  {
    "id": "sub-phy-8",
    "code": "PHY-8",
    "name": "Physics",
    "category": "core",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-chem-8",
    "code": "CHEM-8",
    "name": "Chemistry",
    "category": "core",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-bio-8",
    "code": "BIO-8",
    "name": "Biology",
    "category": "core",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-math-8",
    "code": "MATH-8",
    "name": "Mathematics",
    "category": "core",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 5,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f0f6ff",
      "text": "#1e3a8a",
      "border": "#dbeafe",
      "indicator": "#3b82f6"
    }
  },
  {
    "id": "sub-hist-8",
    "code": "HIST-8",
    "name": "History",
    "category": "core",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-geo-8",
    "code": "GEO-8",
    "name": "Geography",
    "category": "core",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-comp-8",
    "code": "COMP-8",
    "name": "Computer",
    "category": "lab",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-hin-8",
    "code": "HIN-8",
    "name": "Hindi",
    "category": "language",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-mar-8",
    "code": "MAR-8",
    "name": "Marathi",
    "category": "language",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-art-8",
    "code": "ART-8",
    "name": "Art",
    "category": "activity",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-dance-8",
    "code": "DANCE-8",
    "name": "Dance",
    "category": "activity",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-music-8",
    "code": "MUSIC-8",
    "name": "Music",
    "category": "activity",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-lib-8",
    "code": "LIB-8",
    "name": "Library",
    "category": "activity",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-yoga-8",
    "code": "YOGA-8",
    "name": "Yoga",
    "category": "sports",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-skill-8",
    "code": "SKILL-8",
    "name": "Skill",
    "category": "activity",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-supw-8",
    "code": "SUPW-8",
    "name": "Club / SUPW",
    "category": "activity",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-sport-8",
    "code": "SPORT-8",
    "name": "Sports",
    "category": "sports",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-gk-8",
    "code": "GK-8",
    "name": "G.K.",
    "category": "activity",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-ve-8",
    "code": "VE-8",
    "name": "Value Education",
    "category": "activity",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-ct-8",
    "code": "CT-8",
    "name": "Circle Time",
    "category": "activity",
    "gradeIds": [
      "class-g8"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-eng-lit-9",
    "code": "ENG-LIT-9",
    "name": "English Literature",
    "category": "core",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#fbf7ff",
      "text": "#581c87",
      "border": "#f3e8ff",
      "indicator": "#9333ea"
    }
  },
  {
    "id": "sub-eng-lang-9",
    "code": "ENG-LANG-9",
    "name": "English Language",
    "category": "core",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#fbf7ff",
      "text": "#581c87",
      "border": "#f3e8ff",
      "indicator": "#9333ea"
    }
  },
  {
    "id": "sub-hin-9",
    "code": "HIN-9",
    "name": "Hindi",
    "category": "language",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-mar-9",
    "code": "MAR-9",
    "name": "Marathi",
    "category": "language",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-hist-9",
    "code": "HIST-9",
    "name": "History",
    "category": "core",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-geo-9",
    "code": "GEO-9",
    "name": "Geography",
    "category": "core",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-phy-9",
    "code": "PHY-9",
    "name": "Physics",
    "category": "core",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-chem-9",
    "code": "CHEM-9",
    "name": "Chemistry",
    "category": "core",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-bio-9",
    "code": "BIO-9",
    "name": "Biology",
    "category": "core",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-math-9",
    "code": "MATH-9",
    "name": "Mathematics",
    "category": "core",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 5,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f0f6ff",
      "text": "#1e3a8a",
      "border": "#dbeafe",
      "indicator": "#3b82f6"
    }
  },
  {
    "id": "sub-comp-9",
    "code": "COMP-9",
    "name": "Computer",
    "category": "lab",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-pe-9",
    "code": "PE-9",
    "name": "Physical Education",
    "category": "sports",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-lib-9",
    "code": "LIB-9",
    "name": "Library",
    "category": "activity",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-skill-9",
    "code": "SKILL-9",
    "name": "Skill",
    "category": "activity",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-sport-9",
    "code": "SPORT-9",
    "name": "Sports",
    "category": "sports",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-eco-9",
    "code": "ECO-9",
    "name": "Economics",
    "category": "core",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-comm-9",
    "code": "COMM-9",
    "name": "Commerce",
    "category": "core",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-supw-9",
    "code": "SUPW-9",
    "name": "SUPW",
    "category": "activity",
    "gradeIds": [
      "class-g9"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-eng-lit-10",
    "code": "ENG-LIT-10",
    "name": "English Literature",
    "category": "core",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#fbf7ff",
      "text": "#581c87",
      "border": "#f3e8ff",
      "indicator": "#9333ea"
    }
  },
  {
    "id": "sub-eng-lang-10",
    "code": "ENG-LANG-10",
    "name": "English Language",
    "category": "core",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#fbf7ff",
      "text": "#581c87",
      "border": "#f3e8ff",
      "indicator": "#9333ea"
    }
  },
  {
    "id": "sub-hin-10",
    "code": "HIN-10",
    "name": "Hindi",
    "category": "language",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-mar-10",
    "code": "MAR-10",
    "name": "Marathi",
    "category": "language",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-hist-10",
    "code": "HIST-10",
    "name": "History",
    "category": "core",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-geo-10",
    "code": "GEO-10",
    "name": "Geography",
    "category": "core",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-phy-10",
    "code": "PHY-10",
    "name": "Physics",
    "category": "core",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-chem-10",
    "code": "CHEM-10",
    "name": "Chemistry",
    "category": "core",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-bio-10",
    "code": "BIO-10",
    "name": "Biology",
    "category": "core",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 3,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f2fbf4",
      "text": "#14532d",
      "border": "#dcfce7",
      "indicator": "#16a34a"
    }
  },
  {
    "id": "sub-math-10",
    "code": "MATH-10",
    "name": "Mathematics",
    "category": "core",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 5,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f0f6ff",
      "text": "#1e3a8a",
      "border": "#dbeafe",
      "indicator": "#3b82f6"
    }
  },
  {
    "id": "sub-comp-10",
    "code": "COMP-10",
    "name": "Computer",
    "category": "lab",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": true,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-pe-10",
    "code": "PE-10",
    "name": "Physical Education",
    "category": "sports",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-lib-10",
    "code": "LIB-10",
    "name": "Library",
    "category": "activity",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-skill-10",
    "code": "SKILL-10",
    "name": "Skill",
    "category": "activity",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-sport-10",
    "code": "SPORT-10",
    "name": "Sports",
    "category": "sports",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 2,
    "maxPeriodsPerDay": 2,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-eco-10",
    "code": "ECO-10",
    "name": "Economics",
    "category": "core",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-comm-10",
    "code": "COMM-10",
    "name": "Commerce",
    "category": "core",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  },
  {
    "id": "sub-supw-10",
    "code": "SUPW-10",
    "name": "SUPW",
    "category": "activity",
    "gradeIds": [
      "class-g10"
    ],
    "weeklyPeriodsRequired": 1,
    "maxPeriodsPerDay": 1,
    "isDoublePeriodAllowed": false,
    "color": {
      "bg": "#f8fafc",
      "text": "#1e293b",
      "border": "#e2e8f0",
      "indicator": "#64748b"
    }
  }
]

export const HMPS_TEACHERS: Teacher[] = [
  {
    "id": "hmps-t001",
    "name": "Ms. Jaspreet Kaur",
    "employeeCode": "HMPS-T001",
    "email": "hmps-t001@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-math-6",
      "sub-eco-9",
      "sub-comm-9",
      "sub-eco-10",
      "sub-comm-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t002",
    "name": "Ms. Shilpa Chaugule",
    "employeeCode": "HMPS-T002",
    "email": "hmps-t002@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-geo-6",
      "sub-geo-7",
      "sub-geo-8",
      "sub-geo-9",
      "sub-geo-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t003",
    "name": "Ms. Pragya Dubey",
    "employeeCode": "HMPS-T003",
    "email": "hmps-t003@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-eng-lit-6",
      "sub-hist-6",
      "sub-gk-6",
      "sub-ct-6",
      "sub-gk-7",
      "sub-ct-7",
      "sub-gk-8",
      "sub-ct-8"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t004",
    "name": "Ms. Kanchi Hindocha",
    "employeeCode": "HMPS-T004",
    "email": "hmps-t004@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-chem-6",
      "sub-bio-7",
      "sub-bio-8",
      "sub-bio-9",
      "sub-pe-9",
      "sub-bio-10",
      "sub-pe-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t005",
    "name": "Ms. Dharni Barot",
    "employeeCode": "HMPS-T005",
    "email": "hmps-t005@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-math-6",
      "sub-math-7"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t006",
    "name": "Ms. Fiza Shaikh",
    "employeeCode": "HMPS-T006",
    "email": "hmps-t006@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-ve-6",
      "sub-eng-lit-7",
      "sub-hist-7",
      "sub-ve-7",
      "sub-eng-lit-8",
      "sub-hist-8",
      "sub-ve-8"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t007",
    "name": "Ms. Deepshikha Singh",
    "employeeCode": "HMPS-T007",
    "email": "hmps-t007@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-eng-lang-6",
      "sub-eng-lang-7",
      "sub-eng-lang-8"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t008",
    "name": "Ms. Aabha Minocha",
    "employeeCode": "HMPS-T008",
    "email": "hmps-t008@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-bio-6",
      "sub-chem-6",
      "sub-chem-7",
      "sub-chem-8",
      "sub-chem-9",
      "sub-chem-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t009",
    "name": "Ms. Manisha Sonawane",
    "employeeCode": "HMPS-T009",
    "email": "hmps-t009@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-math-8",
      "sub-math-9",
      "sub-math-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t010",
    "name": "Ms. Sucheta Shetty",
    "employeeCode": "HMPS-T010",
    "email": "hmps-t010@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-eng-lit-9",
      "sub-eng-lang-9",
      "sub-supw-9",
      "sub-eng-lit-10",
      "sub-eng-lang-10",
      "sub-supw-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t011",
    "name": "Ms. Mavis D'Souza",
    "employeeCode": "HMPS-T011",
    "email": "hmps-t011@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-hist-8",
      "sub-hist-9",
      "sub-hist-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t012",
    "name": "Ms. Manasi Tembe",
    "employeeCode": "HMPS-T012",
    "email": "hmps-t012@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-mar-6",
      "sub-ve-6",
      "sub-mar-7",
      "sub-mar-8",
      "sub-mar-9",
      "sub-mar-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t013",
    "name": "Ms. Ashwini Barigalla",
    "employeeCode": "HMPS-T013",
    "email": "hmps-t013@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-comp-6",
      "sub-comp-7",
      "sub-comp-8",
      "sub-comp-9",
      "sub-comp-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t014",
    "name": "Ms. Trupti Nazare",
    "employeeCode": "HMPS-T014",
    "email": "hmps-t014@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-hin-6",
      "sub-hin-7",
      "sub-hin-8",
      "sub-hin-9",
      "sub-hin-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t015",
    "name": "Ms. Shraddha Yadav",
    "employeeCode": "HMPS-T015",
    "email": "hmps-t015@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-phy-6",
      "sub-phy-7",
      "sub-phy-8",
      "sub-phy-9",
      "sub-phy-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t016",
    "name": "Ms. Sonia (French)",
    "employeeCode": "HMPS-T016",
    "email": "hmps-t016@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t017",
    "name": "Mr. Vishal Singh",
    "employeeCode": "HMPS-T017",
    "email": "hmps-t017@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-music-6",
      "sub-music-7",
      "sub-music-8"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t018",
    "name": "Ms. Kiran (Dance)",
    "employeeCode": "HMPS-T018",
    "email": "hmps-t018@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-dance-6",
      "sub-dance-7",
      "sub-dance-8"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t019",
    "name": "Ms. Madhura (Yoga)",
    "employeeCode": "HMPS-T019",
    "email": "hmps-t019@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-yoga-6",
      "sub-yoga-7",
      "sub-yoga-8"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t020",
    "name": "Art Teacher (Name Pending)",
    "employeeCode": "HMPS-T020",
    "email": "hmps-t020@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-art-6",
      "sub-art-7",
      "sub-art-8"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t021",
    "name": "Ms. Sherli",
    "employeeCode": "HMPS-T021",
    "email": "hmps-t021@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-lib-6",
      "sub-lib-7",
      "sub-lib-8",
      "sub-lib-9",
      "sub-lib-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t022",
    "name": "Mr. Ankit (Sports)",
    "employeeCode": "HMPS-T022",
    "email": "hmps-t022@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-sport-6",
      "sub-sport-7",
      "sub-sport-8",
      "sub-sport-9",
      "sub-sport-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t023",
    "name": "Skill Teacher (Provisional)",
    "employeeCode": "HMPS-T023",
    "email": "hmps-t023@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-skill-6",
      "sub-skill-7",
      "sub-skill-8",
      "sub-skill-9",
      "sub-skill-10"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  },
  {
    "id": "hmps-t024",
    "name": "SUPW / Club Teacher (Provisional)",
    "employeeCode": "HMPS-T024",
    "email": "hmps-t024@hmps.edu.in",
    "phone": "+91 98200 12345",
    "designation": "Teacher",
    "qualifiedSubjectIds": [
      "sub-supw-6",
      "sub-supw-7",
      "sub-supw-8"
    ],
    "maxPeriodsPerDay": 6,
    "maxPeriodsPerWeek": 30,
    "minPeriodsPerDay": 2,
    "maxConsecutivePeriods": 3,
    "availability": []
  }
]

export const HMPS_TIMETABLE_VERSION: TimetableVersion = {
  id: 'tt-hmps-2027',
  name: 'HMPS Secondary 2027-28 Master Schedule',
  versionNumber: 1,
  academicYear: '2027-2028',
  status: 'reviewed',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  slotsCount: 355,
  hardConflictsCount: 0,
  softConflictsCount: 0,
  healthScore: 98,
  isSandbox: false,
}

export const HMPS_SLOTS: TimetableSlot[] = [
  {
    "id": "hmps-slot-1",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 1,
    "sectionId": "sec-6a",
    "subjectId": "sub-eng-lit-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-2",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 1,
    "sectionId": "sec-6a",
    "subjectId": "sub-eng-lit-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-3",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 2,
    "sectionId": "sec-6a",
    "subjectId": "sub-eng-lang-6",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-4",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 2,
    "sectionId": "sec-6a",
    "subjectId": "sub-eng-lang-6",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-5",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 1,
    "sectionId": "sec-6a",
    "subjectId": "sub-eng-lang-6",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-6",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 4,
    "sectionId": "sec-6a",
    "subjectId": "sub-phy-6",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-7",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 4,
    "sectionId": "sec-6a",
    "subjectId": "sub-phy-6",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-8",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 5,
    "sectionId": "sec-6a",
    "subjectId": "sub-chem-6",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-9",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 5,
    "sectionId": "sec-6a",
    "subjectId": "sub-chem-6",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-10",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 6,
    "sectionId": "sec-6a",
    "subjectId": "sub-bio-6",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-11",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 6,
    "sectionId": "sec-6a",
    "subjectId": "sub-bio-6",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-12",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 8,
    "sectionId": "sec-6a",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t001",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-13",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 8,
    "sectionId": "sec-6a",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t001",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-14",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 2,
    "sectionId": "sec-6a",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t001",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-15",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 1,
    "sectionId": "sec-6a",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t001",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-16",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 1,
    "sectionId": "sec-6a",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t001",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-17",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 9,
    "sectionId": "sec-6a",
    "subjectId": "sub-hist-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-18",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 9,
    "sectionId": "sec-6a",
    "subjectId": "sub-hist-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-19",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 10,
    "sectionId": "sec-6a",
    "subjectId": "sub-geo-6",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-20",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 10,
    "sectionId": "sec-6a",
    "subjectId": "sub-geo-6",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-21",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 11,
    "sectionId": "sec-6a",
    "subjectId": "sub-comp-6",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-22",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 11,
    "sectionId": "sec-6a",
    "subjectId": "sub-comp-6",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-23",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 12,
    "sectionId": "sec-6a",
    "subjectId": "sub-hin-6",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-24",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 12,
    "sectionId": "sec-6a",
    "subjectId": "sub-hin-6",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-25",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 4,
    "sectionId": "sec-6a",
    "subjectId": "sub-hin-6",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-26",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 5,
    "sectionId": "sec-6a",
    "subjectId": "sub-mar-6",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-27",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 2,
    "sectionId": "sec-6a",
    "subjectId": "sub-mar-6",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-28",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 6,
    "sectionId": "sec-6a",
    "subjectId": "sub-art-6",
    "teacherId": "hmps-t020",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-29",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 8,
    "sectionId": "sec-6a",
    "subjectId": "sub-dance-6",
    "teacherId": "hmps-t018",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-30",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 9,
    "sectionId": "sec-6a",
    "subjectId": "sub-music-6",
    "teacherId": "hmps-t017",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-31",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 10,
    "sectionId": "sec-6a",
    "subjectId": "sub-lib-6",
    "teacherId": "hmps-t021",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-32",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 11,
    "sectionId": "sec-6a",
    "subjectId": "sub-yoga-6",
    "teacherId": "hmps-t019",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-33",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 12,
    "sectionId": "sec-6a",
    "subjectId": "sub-skill-6",
    "teacherId": "hmps-t023",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-34",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 4,
    "sectionId": "sec-6a",
    "subjectId": "sub-supw-6",
    "teacherId": "hmps-t024",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-35",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 5,
    "sectionId": "sec-6a",
    "subjectId": "sub-sport-6",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-36",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 2,
    "sectionId": "sec-6a",
    "subjectId": "sub-sport-6",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-37",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 6,
    "sectionId": "sec-6a",
    "subjectId": "sub-sport-6",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-38",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 8,
    "sectionId": "sec-6a",
    "subjectId": "sub-gk-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-39",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 9,
    "sectionId": "sec-6a",
    "subjectId": "sub-ve-6",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-40",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 10,
    "sectionId": "sec-6a",
    "subjectId": "sub-ct-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-41",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 2,
    "sectionId": "sec-6b",
    "subjectId": "sub-eng-lit-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-42",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 2,
    "sectionId": "sec-6b",
    "subjectId": "sub-eng-lit-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-43",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 1,
    "sectionId": "sec-6b",
    "subjectId": "sub-eng-lang-6",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-44",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 1,
    "sectionId": "sec-6b",
    "subjectId": "sub-eng-lang-6",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-45",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 2,
    "sectionId": "sec-6b",
    "subjectId": "sub-eng-lang-6",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-46",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 5,
    "sectionId": "sec-6b",
    "subjectId": "sub-phy-6",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-47",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 5,
    "sectionId": "sec-6b",
    "subjectId": "sub-phy-6",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-48",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 4,
    "sectionId": "sec-6b",
    "subjectId": "sub-chem-6",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-49",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 4,
    "sectionId": "sec-6b",
    "subjectId": "sub-chem-6",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-50",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 8,
    "sectionId": "sec-6b",
    "subjectId": "sub-bio-6",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-51",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 8,
    "sectionId": "sec-6b",
    "subjectId": "sub-bio-6",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-52",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 6,
    "sectionId": "sec-6b",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-53",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 6,
    "sectionId": "sec-6b",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-54",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 1,
    "sectionId": "sec-6b",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-55",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 1,
    "sectionId": "sec-6b",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-56",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 1,
    "sectionId": "sec-6b",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-57",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 10,
    "sectionId": "sec-6b",
    "subjectId": "sub-hist-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-58",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 10,
    "sectionId": "sec-6b",
    "subjectId": "sub-hist-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-59",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 9,
    "sectionId": "sec-6b",
    "subjectId": "sub-geo-6",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-60",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 9,
    "sectionId": "sec-6b",
    "subjectId": "sub-geo-6",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-61",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 12,
    "sectionId": "sec-6b",
    "subjectId": "sub-comp-6",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-62",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 12,
    "sectionId": "sec-6b",
    "subjectId": "sub-comp-6",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-63",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 11,
    "sectionId": "sec-6b",
    "subjectId": "sub-hin-6",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-64",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 11,
    "sectionId": "sec-6b",
    "subjectId": "sub-hin-6",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-65",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 5,
    "sectionId": "sec-6b",
    "subjectId": "sub-hin-6",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-66",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 4,
    "sectionId": "sec-6b",
    "subjectId": "sub-mar-6",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-67",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 4,
    "sectionId": "sec-6b",
    "subjectId": "sub-mar-6",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-68",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 8,
    "sectionId": "sec-6b",
    "subjectId": "sub-art-6",
    "teacherId": "hmps-t020",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-69",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 6,
    "sectionId": "sec-6b",
    "subjectId": "sub-dance-6",
    "teacherId": "hmps-t018",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-70",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 10,
    "sectionId": "sec-6b",
    "subjectId": "sub-music-6",
    "teacherId": "hmps-t017",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-71",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 9,
    "sectionId": "sec-6b",
    "subjectId": "sub-lib-6",
    "teacherId": "hmps-t021",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-72",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 12,
    "sectionId": "sec-6b",
    "subjectId": "sub-yoga-6",
    "teacherId": "hmps-t019",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-73",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 11,
    "sectionId": "sec-6b",
    "subjectId": "sub-skill-6",
    "teacherId": "hmps-t023",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-74",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 2,
    "sectionId": "sec-6b",
    "subjectId": "sub-supw-6",
    "teacherId": "hmps-t024",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-75",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 8,
    "sectionId": "sec-6b",
    "subjectId": "sub-sport-6",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-76",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 4,
    "sectionId": "sec-6b",
    "subjectId": "sub-sport-6",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-77",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 9,
    "sectionId": "sec-6b",
    "subjectId": "sub-sport-6",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-78",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 5,
    "sectionId": "sec-6b",
    "subjectId": "sub-gk-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-79",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 6,
    "sectionId": "sec-6b",
    "subjectId": "sub-ve-6",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-80",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 11,
    "sectionId": "sec-6b",
    "subjectId": "sub-ct-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-81",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 4,
    "sectionId": "sec-6c",
    "subjectId": "sub-eng-lit-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-82",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 4,
    "sectionId": "sec-6c",
    "subjectId": "sub-eng-lit-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-83",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 5,
    "sectionId": "sec-6c",
    "subjectId": "sub-eng-lang-6",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-84",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 5,
    "sectionId": "sec-6c",
    "subjectId": "sub-eng-lang-6",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-85",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 4,
    "sectionId": "sec-6c",
    "subjectId": "sub-eng-lang-6",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-86",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 1,
    "sectionId": "sec-6c",
    "subjectId": "sub-phy-6",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-87",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 1,
    "sectionId": "sec-6c",
    "subjectId": "sub-phy-6",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-88",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 2,
    "sectionId": "sec-6c",
    "subjectId": "sub-chem-6",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-89",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 2,
    "sectionId": "sec-6c",
    "subjectId": "sub-chem-6",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-90",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 9,
    "sectionId": "sec-6c",
    "subjectId": "sub-bio-6",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-91",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 9,
    "sectionId": "sec-6c",
    "subjectId": "sub-bio-6",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-92",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 8,
    "sectionId": "sec-6c",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-93",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 8,
    "sectionId": "sec-6c",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-94",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 2,
    "sectionId": "sec-6c",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-95",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 2,
    "sectionId": "sec-6c",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-96",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 2,
    "sectionId": "sec-6c",
    "subjectId": "sub-math-6",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-97",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 6,
    "sectionId": "sec-6c",
    "subjectId": "sub-hist-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-98",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 6,
    "sectionId": "sec-6c",
    "subjectId": "sub-hist-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-99",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 11,
    "sectionId": "sec-6c",
    "subjectId": "sub-geo-6",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-100",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 11,
    "sectionId": "sec-6c",
    "subjectId": "sub-geo-6",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-101",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 10,
    "sectionId": "sec-6c",
    "subjectId": "sub-comp-6",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-102",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 10,
    "sectionId": "sec-6c",
    "subjectId": "sub-comp-6",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-103",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 1,
    "sectionId": "sec-6c",
    "subjectId": "sub-hin-6",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-104",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 1,
    "sectionId": "sec-6c",
    "subjectId": "sub-hin-6",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-105",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 1,
    "sectionId": "sec-6c",
    "subjectId": "sub-hin-6",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-106",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 12,
    "sectionId": "sec-6c",
    "subjectId": "sub-mar-6",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-107",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 12,
    "sectionId": "sec-6c",
    "subjectId": "sub-mar-6",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-108",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 5,
    "sectionId": "sec-6c",
    "subjectId": "sub-art-6",
    "teacherId": "hmps-t020",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-109",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 9,
    "sectionId": "sec-6c",
    "subjectId": "sub-dance-6",
    "teacherId": "hmps-t018",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-110",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 6,
    "sectionId": "sec-6c",
    "subjectId": "sub-music-6",
    "teacherId": "hmps-t017",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-111",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 8,
    "sectionId": "sec-6c",
    "subjectId": "sub-lib-6",
    "teacherId": "hmps-t021",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-112",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 10,
    "sectionId": "sec-6c",
    "subjectId": "sub-yoga-6",
    "teacherId": "hmps-t019",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-113",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 4,
    "sectionId": "sec-6c",
    "subjectId": "sub-skill-6",
    "teacherId": "hmps-t023",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-114",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 11,
    "sectionId": "sec-6c",
    "subjectId": "sub-supw-6",
    "teacherId": "hmps-t024",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-115",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 12,
    "sectionId": "sec-6c",
    "subjectId": "sub-sport-6",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-116",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 10,
    "sectionId": "sec-6c",
    "subjectId": "sub-sport-6",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-117",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 5,
    "sectionId": "sec-6c",
    "subjectId": "sub-sport-6",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-118",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 6,
    "sectionId": "sec-6c",
    "subjectId": "sub-gk-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-119",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 5,
    "sectionId": "sec-6c",
    "subjectId": "sub-ve-6",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-120",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 9,
    "sectionId": "sec-6c",
    "subjectId": "sub-ct-6",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-121",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 1,
    "sectionId": "sec-7a",
    "subjectId": "sub-eng-lit-7",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-122",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 1,
    "sectionId": "sec-7a",
    "subjectId": "sub-eng-lit-7",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-123",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 4,
    "sectionId": "sec-7a",
    "subjectId": "sub-eng-lang-7",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-124",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 4,
    "sectionId": "sec-7a",
    "subjectId": "sub-eng-lang-7",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-125",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 5,
    "sectionId": "sec-7a",
    "subjectId": "sub-eng-lang-7",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-126",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 2,
    "sectionId": "sec-7a",
    "subjectId": "sub-phy-7",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-127",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 2,
    "sectionId": "sec-7a",
    "subjectId": "sub-phy-7",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-128",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 5,
    "sectionId": "sec-7a",
    "subjectId": "sub-chem-7",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-129",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 5,
    "sectionId": "sec-7a",
    "subjectId": "sub-chem-7",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-130",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 6,
    "sectionId": "sec-7a",
    "subjectId": "sub-bio-7",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-131",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 6,
    "sectionId": "sec-7a",
    "subjectId": "sub-bio-7",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-132",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 9,
    "sectionId": "sec-7a",
    "subjectId": "sub-math-7",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-133",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 9,
    "sectionId": "sec-7a",
    "subjectId": "sub-math-7",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-134",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 4,
    "sectionId": "sec-7a",
    "subjectId": "sub-math-7",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-135",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 4,
    "sectionId": "sec-7a",
    "subjectId": "sub-math-7",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-136",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 4,
    "sectionId": "sec-7a",
    "subjectId": "sub-math-7",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-137",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 8,
    "sectionId": "sec-7a",
    "subjectId": "sub-hist-7",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-138",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 8,
    "sectionId": "sec-7a",
    "subjectId": "sub-hist-7",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-139",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 12,
    "sectionId": "sec-7a",
    "subjectId": "sub-geo-7",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-140",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 12,
    "sectionId": "sec-7a",
    "subjectId": "sub-geo-7",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-141",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 1,
    "sectionId": "sec-7a",
    "subjectId": "sub-comp-7",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-142",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 1,
    "sectionId": "sec-7a",
    "subjectId": "sub-comp-7",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-143",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 10,
    "sectionId": "sec-7a",
    "subjectId": "sub-hin-7",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-144",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 10,
    "sectionId": "sec-7a",
    "subjectId": "sub-hin-7",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-145",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 2,
    "sectionId": "sec-7a",
    "subjectId": "sub-hin-7",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-146",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 11,
    "sectionId": "sec-7a",
    "subjectId": "sub-mar-7",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-147",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 11,
    "sectionId": "sec-7a",
    "subjectId": "sub-mar-7",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-148",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 9,
    "sectionId": "sec-7a",
    "subjectId": "sub-art-7",
    "teacherId": "hmps-t020",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-149",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 10,
    "sectionId": "sec-7a",
    "subjectId": "sub-dance-7",
    "teacherId": "hmps-t018",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-150",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 8,
    "sectionId": "sec-7a",
    "subjectId": "sub-music-7",
    "teacherId": "hmps-t017",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-151",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 6,
    "sectionId": "sec-7a",
    "subjectId": "sub-lib-7",
    "teacherId": "hmps-t021",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-152",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 2,
    "sectionId": "sec-7a",
    "subjectId": "sub-yoga-7",
    "teacherId": "hmps-t019",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-153",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 5,
    "sectionId": "sec-7a",
    "subjectId": "sub-skill-7",
    "teacherId": "hmps-t023",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-154",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 12,
    "sectionId": "sec-7a",
    "subjectId": "sub-supw-7",
    "teacherId": "hmps-t024",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-155",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 11,
    "sectionId": "sec-7a",
    "subjectId": "sub-sport-7",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-156",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 11,
    "sectionId": "sec-7a",
    "subjectId": "sub-sport-7",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-157",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 1,
    "sectionId": "sec-7a",
    "subjectId": "sub-sport-7",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-158",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 12,
    "sectionId": "sec-7a",
    "subjectId": "sub-gk-7",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-159",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 6,
    "sectionId": "sec-7a",
    "subjectId": "sub-ve-7",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-160",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 2,
    "sectionId": "sec-7a",
    "subjectId": "sub-ct-7",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-161",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 2,
    "sectionId": "sec-7b",
    "subjectId": "sub-eng-lit-7",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-162",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 2,
    "sectionId": "sec-7b",
    "subjectId": "sub-eng-lit-7",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-163",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 6,
    "sectionId": "sec-7b",
    "subjectId": "sub-eng-lang-7",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-164",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 6,
    "sectionId": "sec-7b",
    "subjectId": "sub-eng-lang-7",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-165",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 6,
    "sectionId": "sec-7b",
    "subjectId": "sub-eng-lang-7",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-166",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 8,
    "sectionId": "sec-7b",
    "subjectId": "sub-phy-7",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-167",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 8,
    "sectionId": "sec-7b",
    "subjectId": "sub-phy-7",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-168",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 1,
    "sectionId": "sec-7b",
    "subjectId": "sub-chem-7",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-169",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 1,
    "sectionId": "sec-7b",
    "subjectId": "sub-chem-7",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-170",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 9,
    "sectionId": "sec-7b",
    "subjectId": "sub-bio-7",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-171",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 9,
    "sectionId": "sec-7b",
    "subjectId": "sub-bio-7",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-172",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 4,
    "sectionId": "sec-7b",
    "subjectId": "sub-math-7",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-173",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 4,
    "sectionId": "sec-7b",
    "subjectId": "sub-math-7",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-174",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 5,
    "sectionId": "sec-7b",
    "subjectId": "sub-math-7",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-175",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 5,
    "sectionId": "sec-7b",
    "subjectId": "sub-math-7",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-176",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 5,
    "sectionId": "sec-7b",
    "subjectId": "sub-math-7",
    "teacherId": "hmps-t005",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-177",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 5,
    "sectionId": "sec-7b",
    "subjectId": "sub-hist-7",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-178",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 5,
    "sectionId": "sec-7b",
    "subjectId": "sub-hist-7",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-179",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 1,
    "sectionId": "sec-7b",
    "subjectId": "sub-geo-7",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-180",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 1,
    "sectionId": "sec-7b",
    "subjectId": "sub-geo-7",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-181",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 2,
    "sectionId": "sec-7b",
    "subjectId": "sub-comp-7",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-182",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 2,
    "sectionId": "sec-7b",
    "subjectId": "sub-comp-7",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-183",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 8,
    "sectionId": "sec-7b",
    "subjectId": "sub-hin-7",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-184",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 4,
    "sectionId": "sec-7b",
    "subjectId": "sub-hin-7",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-185",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 2,
    "sectionId": "sec-7b",
    "subjectId": "sub-hin-7",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-186",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 10,
    "sectionId": "sec-7b",
    "subjectId": "sub-mar-7",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-187",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 10,
    "sectionId": "sec-7b",
    "subjectId": "sub-mar-7",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-188",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 11,
    "sectionId": "sec-7b",
    "subjectId": "sub-art-7",
    "teacherId": "hmps-t020",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-189",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 12,
    "sectionId": "sec-7b",
    "subjectId": "sub-dance-7",
    "teacherId": "hmps-t018",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-190",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 11,
    "sectionId": "sec-7b",
    "subjectId": "sub-music-7",
    "teacherId": "hmps-t017",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-191",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 12,
    "sectionId": "sec-7b",
    "subjectId": "sub-lib-7",
    "teacherId": "hmps-t021",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-192",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 4,
    "sectionId": "sec-7b",
    "subjectId": "sub-yoga-7",
    "teacherId": "hmps-t019",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-193",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 9,
    "sectionId": "sec-7b",
    "subjectId": "sub-skill-7",
    "teacherId": "hmps-t023",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-194",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 10,
    "sectionId": "sec-7b",
    "subjectId": "sub-supw-7",
    "teacherId": "hmps-t024",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-195",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 12,
    "sectionId": "sec-7b",
    "subjectId": "sub-sport-7",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-196",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 6,
    "sectionId": "sec-7b",
    "subjectId": "sub-sport-7",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-197",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 8,
    "sectionId": "sec-7b",
    "subjectId": "sub-sport-7",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-198",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 11,
    "sectionId": "sec-7b",
    "subjectId": "sub-gk-7",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-199",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 12,
    "sectionId": "sec-7b",
    "subjectId": "sub-ve-7",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-200",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 1,
    "sectionId": "sec-7b",
    "subjectId": "sub-ct-7",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-201",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 4,
    "sectionId": "sec-8a",
    "subjectId": "sub-eng-lit-8",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-202",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 4,
    "sectionId": "sec-8a",
    "subjectId": "sub-eng-lit-8",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-203",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 8,
    "sectionId": "sec-8a",
    "subjectId": "sub-eng-lang-8",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-204",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 8,
    "sectionId": "sec-8a",
    "subjectId": "sub-eng-lang-8",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-205",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 8,
    "sectionId": "sec-8a",
    "subjectId": "sub-eng-lang-8",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-206",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 6,
    "sectionId": "sec-8a",
    "subjectId": "sub-phy-8",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-207",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 6,
    "sectionId": "sec-8a",
    "subjectId": "sub-phy-8",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-208",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 10,
    "sectionId": "sec-8a",
    "subjectId": "sub-chem-8",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-209",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 10,
    "sectionId": "sec-8a",
    "subjectId": "sub-chem-8",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-210",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 1,
    "sectionId": "sec-8a",
    "subjectId": "sub-bio-8",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-211",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 1,
    "sectionId": "sec-8a",
    "subjectId": "sub-bio-8",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-212",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 2,
    "sectionId": "sec-8a",
    "subjectId": "sub-math-8",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-213",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 2,
    "sectionId": "sec-8a",
    "subjectId": "sub-math-8",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-214",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 1,
    "sectionId": "sec-8a",
    "subjectId": "sub-math-8",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-215",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 1,
    "sectionId": "sec-8a",
    "subjectId": "sub-math-8",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-216",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 1,
    "sectionId": "sec-8a",
    "subjectId": "sub-math-8",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-217",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 9,
    "sectionId": "sec-8a",
    "subjectId": "sub-hist-8",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-218",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 9,
    "sectionId": "sec-8a",
    "subjectId": "sub-hist-8",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-219",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 5,
    "sectionId": "sec-8a",
    "subjectId": "sub-geo-8",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-220",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 5,
    "sectionId": "sec-8a",
    "subjectId": "sub-geo-8",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-221",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 4,
    "sectionId": "sec-8a",
    "subjectId": "sub-comp-8",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-222",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 4,
    "sectionId": "sec-8a",
    "subjectId": "sub-comp-8",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-223",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 6,
    "sectionId": "sec-8a",
    "subjectId": "sub-hin-8",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-224",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 2,
    "sectionId": "sec-8a",
    "subjectId": "sub-hin-8",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-225",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 4,
    "sectionId": "sec-8a",
    "subjectId": "sub-hin-8",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-226",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 2,
    "sectionId": "sec-8a",
    "subjectId": "sub-mar-8",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-227",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 5,
    "sectionId": "sec-8a",
    "subjectId": "sub-mar-8",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-228",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 12,
    "sectionId": "sec-8a",
    "subjectId": "sub-art-8",
    "teacherId": "hmps-t020",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-229",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 11,
    "sectionId": "sec-8a",
    "subjectId": "sub-dance-8",
    "teacherId": "hmps-t018",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-230",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 12,
    "sectionId": "sec-8a",
    "subjectId": "sub-music-8",
    "teacherId": "hmps-t017",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-231",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 11,
    "sectionId": "sec-8a",
    "subjectId": "sub-lib-8",
    "teacherId": "hmps-t021",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-232",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 5,
    "sectionId": "sec-8a",
    "subjectId": "sub-yoga-8",
    "teacherId": "hmps-t019",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-233",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 10,
    "sectionId": "sec-8a",
    "subjectId": "sub-skill-8",
    "teacherId": "hmps-t023",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-234",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 9,
    "sectionId": "sec-8a",
    "subjectId": "sub-supw-8",
    "teacherId": "hmps-t024",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-235",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 9,
    "sectionId": "sec-8a",
    "subjectId": "sub-sport-8",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-236",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 10,
    "sectionId": "sec-8a",
    "subjectId": "sub-sport-8",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-237",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 11,
    "sectionId": "sec-8a",
    "subjectId": "sub-sport-8",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-238",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 12,
    "sectionId": "sec-8a",
    "subjectId": "sub-gk-8",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-239",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 11,
    "sectionId": "sec-8a",
    "subjectId": "sub-ve-8",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-240",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 5,
    "sectionId": "sec-8a",
    "subjectId": "sub-ct-8",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-241",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 6,
    "sectionId": "sec-8b",
    "subjectId": "sub-eng-lit-8",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-242",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 6,
    "sectionId": "sec-8b",
    "subjectId": "sub-eng-lit-8",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-243",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 9,
    "sectionId": "sec-8b",
    "subjectId": "sub-eng-lang-8",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-244",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 9,
    "sectionId": "sec-8b",
    "subjectId": "sub-eng-lang-8",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-245",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 9,
    "sectionId": "sec-8b",
    "subjectId": "sub-eng-lang-8",
    "teacherId": "hmps-t007",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-246",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 10,
    "sectionId": "sec-8b",
    "subjectId": "sub-phy-8",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-247",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 10,
    "sectionId": "sec-8b",
    "subjectId": "sub-phy-8",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-248",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 4,
    "sectionId": "sec-8b",
    "subjectId": "sub-chem-8",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-249",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 4,
    "sectionId": "sec-8b",
    "subjectId": "sub-chem-8",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-250",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 2,
    "sectionId": "sec-8b",
    "subjectId": "sub-bio-8",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-251",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 2,
    "sectionId": "sec-8b",
    "subjectId": "sub-bio-8",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-252",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 1,
    "sectionId": "sec-8b",
    "subjectId": "sub-math-8",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-253",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 1,
    "sectionId": "sec-8b",
    "subjectId": "sub-math-8",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-254",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 2,
    "sectionId": "sec-8b",
    "subjectId": "sub-math-8",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-255",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 2,
    "sectionId": "sec-8b",
    "subjectId": "sub-math-8",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-256",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 2,
    "sectionId": "sec-8b",
    "subjectId": "sub-math-8",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-257",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 5,
    "sectionId": "sec-8b",
    "subjectId": "sub-hist-8",
    "teacherId": "hmps-t011",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-258",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 5,
    "sectionId": "sec-8b",
    "subjectId": "sub-hist-8",
    "teacherId": "hmps-t011",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-259",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 8,
    "sectionId": "sec-8b",
    "subjectId": "sub-geo-8",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-260",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 8,
    "sectionId": "sec-8b",
    "subjectId": "sub-geo-8",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-261",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 5,
    "sectionId": "sec-8b",
    "subjectId": "sub-comp-8",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-262",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 5,
    "sectionId": "sec-8b",
    "subjectId": "sub-comp-8",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-263",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 10,
    "sectionId": "sec-8b",
    "subjectId": "sub-hin-8",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-264",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 6,
    "sectionId": "sec-8b",
    "subjectId": "sub-hin-8",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-265",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 5,
    "sectionId": "sec-8b",
    "subjectId": "sub-hin-8",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-266",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 1,
    "sectionId": "sec-8b",
    "subjectId": "sub-mar-8",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-267",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 1,
    "sectionId": "sec-8b",
    "subjectId": "sub-mar-8",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-268",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 11,
    "sectionId": "sec-8b",
    "subjectId": "sub-art-8",
    "teacherId": "hmps-t020",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-269",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 12,
    "sectionId": "sec-8b",
    "subjectId": "sub-dance-8",
    "teacherId": "hmps-t018",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-270",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 11,
    "sectionId": "sec-8b",
    "subjectId": "sub-music-8",
    "teacherId": "hmps-t017",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-271",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 12,
    "sectionId": "sec-8b",
    "subjectId": "sub-lib-8",
    "teacherId": "hmps-t021",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-272",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 6,
    "sectionId": "sec-8b",
    "subjectId": "sub-yoga-8",
    "teacherId": "hmps-t019",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-273",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 4,
    "sectionId": "sec-8b",
    "subjectId": "sub-skill-8",
    "teacherId": "hmps-t023",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-274",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 8,
    "sectionId": "sec-8b",
    "subjectId": "sub-supw-8",
    "teacherId": "hmps-t024",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-275",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 4,
    "sectionId": "sec-8b",
    "subjectId": "sub-sport-8",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-276",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 12,
    "sectionId": "sec-8b",
    "subjectId": "sub-sport-8",
    "teacherId": "hmps-t022",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-277",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 4,
    "sectionId": "sec-8b",
    "subjectId": "sub-gk-8",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-278",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 8,
    "sectionId": "sec-8b",
    "subjectId": "sub-ve-8",
    "teacherId": "hmps-t006",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-279",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 6,
    "sectionId": "sec-8b",
    "subjectId": "sub-ct-8",
    "teacherId": "hmps-t003",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-280",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 1,
    "sectionId": "sec-9a",
    "subjectId": "sub-eng-lit-9",
    "teacherId": "hmps-t010",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-281",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 1,
    "sectionId": "sec-9a",
    "subjectId": "sub-eng-lit-9",
    "teacherId": "hmps-t010",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-282",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 2,
    "sectionId": "sec-9a",
    "subjectId": "sub-eng-lang-9",
    "teacherId": "hmps-t010",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-283",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 2,
    "sectionId": "sec-9a",
    "subjectId": "sub-eng-lang-9",
    "teacherId": "hmps-t010",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-284",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 4,
    "sectionId": "sec-9a",
    "subjectId": "sub-hin-9",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-285",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 4,
    "sectionId": "sec-9a",
    "subjectId": "sub-hin-9",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-286",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 9,
    "sectionId": "sec-9a",
    "subjectId": "sub-hin-9",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-287",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 5,
    "sectionId": "sec-9a",
    "subjectId": "sub-mar-9",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-288",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 5,
    "sectionId": "sec-9a",
    "subjectId": "sub-mar-9",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-289",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 6,
    "sectionId": "sec-9a",
    "subjectId": "sub-hist-9",
    "teacherId": "hmps-t011",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-290",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 6,
    "sectionId": "sec-9a",
    "subjectId": "sub-hist-9",
    "teacherId": "hmps-t011",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-291",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 1,
    "sectionId": "sec-9a",
    "subjectId": "sub-hist-9",
    "teacherId": "hmps-t011",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-292",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 2,
    "sectionId": "sec-9a",
    "subjectId": "sub-geo-9",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-293",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 2,
    "sectionId": "sec-9a",
    "subjectId": "sub-geo-9",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-294",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 1,
    "sectionId": "sec-9a",
    "subjectId": "sub-geo-9",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-295",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 9,
    "sectionId": "sec-9a",
    "subjectId": "sub-phy-9",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-296",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 9,
    "sectionId": "sec-9a",
    "subjectId": "sub-phy-9",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-297",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 4,
    "sectionId": "sec-9a",
    "subjectId": "sub-phy-9",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-298",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 11,
    "sectionId": "sec-9a",
    "subjectId": "sub-chem-9",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-299",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 11,
    "sectionId": "sec-9a",
    "subjectId": "sub-chem-9",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-300",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 5,
    "sectionId": "sec-9a",
    "subjectId": "sub-chem-9",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-301",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 8,
    "sectionId": "sec-9a",
    "subjectId": "sub-bio-9",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-302",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 8,
    "sectionId": "sec-9a",
    "subjectId": "sub-bio-9",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-303",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 6,
    "sectionId": "sec-9a",
    "subjectId": "sub-bio-9",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-304",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 10,
    "sectionId": "sec-9a",
    "subjectId": "sub-math-9",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-305",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 10,
    "sectionId": "sec-9a",
    "subjectId": "sub-math-9",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-306",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 8,
    "sectionId": "sec-9a",
    "subjectId": "sub-math-9",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-307",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 4,
    "sectionId": "sec-9a",
    "subjectId": "sub-math-9",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-308",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 4,
    "sectionId": "sec-9a",
    "subjectId": "sub-math-9",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-309",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 10,
    "sectionId": "sec-9a",
    "subjectId": "sub-comp-9",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-310",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 6,
    "sectionId": "sec-9a",
    "subjectId": "sub-comp-9",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-311",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 12,
    "sectionId": "sec-9a",
    "subjectId": "sub-pe-9",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-312",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 12,
    "sectionId": "sec-9a",
    "subjectId": "sub-pe-9",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-313",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 11,
    "sectionId": "sec-9a",
    "subjectId": "sub-lib-9",
    "teacherId": "hmps-t021",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-314",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 1,
    "sectionId": "sec-9a",
    "subjectId": "sub-skill-9",
    "teacherId": "hmps-t023",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-315",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 12,
    "sectionId": "sec-9a",
    "subjectId": "sub-eco-9",
    "teacherId": "hmps-t001",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-316",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 5,
    "sectionId": "sec-9a",
    "subjectId": "sub-comm-9",
    "teacherId": "hmps-t001",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-317",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 8,
    "sectionId": "sec-9a",
    "subjectId": "sub-supw-9",
    "teacherId": "hmps-t010",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-318",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 4,
    "sectionId": "sec-10a",
    "subjectId": "sub-eng-lit-10",
    "teacherId": "hmps-t010",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-319",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 4,
    "sectionId": "sec-10a",
    "subjectId": "sub-eng-lit-10",
    "teacherId": "hmps-t010",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-320",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 5,
    "sectionId": "sec-10a",
    "subjectId": "sub-eng-lang-10",
    "teacherId": "hmps-t010",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-321",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 5,
    "sectionId": "sec-10a",
    "subjectId": "sub-eng-lang-10",
    "teacherId": "hmps-t010",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-322",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 1,
    "sectionId": "sec-10a",
    "subjectId": "sub-hin-10",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-323",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 1,
    "sectionId": "sec-10a",
    "subjectId": "sub-hin-10",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-324",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 11,
    "sectionId": "sec-10a",
    "subjectId": "sub-hin-10",
    "teacherId": "hmps-t014",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-325",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 2,
    "sectionId": "sec-10a",
    "subjectId": "sub-mar-10",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-326",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 2,
    "sectionId": "sec-10a",
    "subjectId": "sub-mar-10",
    "teacherId": "hmps-t012",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-327",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 8,
    "sectionId": "sec-10a",
    "subjectId": "sub-hist-10",
    "teacherId": "hmps-t011",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-328",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 8,
    "sectionId": "sec-10a",
    "subjectId": "sub-hist-10",
    "teacherId": "hmps-t011",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-329",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 2,
    "sectionId": "sec-10a",
    "subjectId": "sub-hist-10",
    "teacherId": "hmps-t011",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-330",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 6,
    "sectionId": "sec-10a",
    "subjectId": "sub-geo-10",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-331",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 6,
    "sectionId": "sec-10a",
    "subjectId": "sub-geo-10",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-332",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 4,
    "sectionId": "sec-10a",
    "subjectId": "sub-geo-10",
    "teacherId": "hmps-t002",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-333",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 11,
    "sectionId": "sec-10a",
    "subjectId": "sub-phy-10",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-334",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 11,
    "sectionId": "sec-10a",
    "subjectId": "sub-phy-10",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-335",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 1,
    "sectionId": "sec-10a",
    "subjectId": "sub-phy-10",
    "teacherId": "hmps-t015",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-336",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 12,
    "sectionId": "sec-10a",
    "subjectId": "sub-chem-10",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-337",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 12,
    "sectionId": "sec-10a",
    "subjectId": "sub-chem-10",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-338",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 6,
    "sectionId": "sec-10a",
    "subjectId": "sub-chem-10",
    "teacherId": "hmps-t008",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-339",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 10,
    "sectionId": "sec-10a",
    "subjectId": "sub-bio-10",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-340",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 10,
    "sectionId": "sec-10a",
    "subjectId": "sub-bio-10",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-341",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 5,
    "sectionId": "sec-10a",
    "subjectId": "sub-bio-10",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-342",
    "timetableId": "tt-hmps-2027",
    "day": "Monday",
    "periodIndex": 9,
    "sectionId": "sec-10a",
    "subjectId": "sub-math-10",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-343",
    "timetableId": "tt-hmps-2027",
    "day": "Tuesday",
    "periodIndex": 9,
    "sectionId": "sec-10a",
    "subjectId": "sub-math-10",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-344",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 9,
    "sectionId": "sec-10a",
    "subjectId": "sub-math-10",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-345",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 5,
    "sectionId": "sec-10a",
    "subjectId": "sub-math-10",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-346",
    "timetableId": "tt-hmps-2027",
    "day": "Friday",
    "periodIndex": 5,
    "sectionId": "sec-10a",
    "subjectId": "sub-math-10",
    "teacherId": "hmps-t009",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-347",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 8,
    "sectionId": "sec-10a",
    "subjectId": "sub-comp-10",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-348",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 8,
    "sectionId": "sec-10a",
    "subjectId": "sub-comp-10",
    "teacherId": "hmps-t013",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-349",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 10,
    "sectionId": "sec-10a",
    "subjectId": "sub-pe-10",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-350",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 1,
    "sectionId": "sec-10a",
    "subjectId": "sub-pe-10",
    "teacherId": "hmps-t004",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-351",
    "timetableId": "tt-hmps-2027",
    "day": "Wednesday",
    "periodIndex": 12,
    "sectionId": "sec-10a",
    "subjectId": "sub-lib-10",
    "teacherId": "hmps-t021",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-352",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 2,
    "sectionId": "sec-10a",
    "subjectId": "sub-skill-10",
    "teacherId": "hmps-t023",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-353",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 4,
    "sectionId": "sec-10a",
    "subjectId": "sub-eco-10",
    "teacherId": "hmps-t001",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-354",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 6,
    "sectionId": "sec-10a",
    "subjectId": "sub-comm-10",
    "teacherId": "hmps-t001",
    "lockType": "none"
  },
  {
    "id": "hmps-slot-355",
    "timetableId": "tt-hmps-2027",
    "day": "Thursday",
    "periodIndex": 9,
    "sectionId": "sec-10a",
    "subjectId": "sub-supw-10",
    "teacherId": "hmps-t010",
    "lockType": "none"
  }
]
