// Core Domain Models for Smart Timetable Studio

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type LockType = 'none' | 'soft' | 'hard';

export type InstitutionType = 'school' | 'college' | 'coaching' | 'training_center';

export type StudioOrientation = 'periods-on-top' | 'days-on-top';

export interface Institution {
  id: string;
  name: string;
  code: string;
  type: InstitutionType;
  academicYear: string;
  campusName: string;
  workingDays: DayOfWeek[];
  startTime: string;
  endTime: string;
  periodDurationMinutes: number;
  lunchBreakMinutes: number;
  shortBreakMinutes: number;
  defaultOrientation?: StudioOrientation;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface GradeClass {
  id: string;
  name: string;
  numericLevel: number;
  sections: Section[];
}

export interface Section {
  id: string;
  classId: string;
  name: string;
  fullName: string;
  classTeacherId?: string;
}

export type SubjectCategory = 'core' | 'elective' | 'lab' | 'activity' | 'sports' | 'language';

export interface SubjectColor {
  bg: string;
  text: string;
  border: string;
  indicator: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  category: SubjectCategory;
  gradeIds: string[]; // Subject assigned specifically to distinct grades
  weeklyPeriodsRequired: number;
  maxPeriodsPerDay: number;
  isDoublePeriodAllowed: boolean;
  color: SubjectColor;
}

export interface TeacherAvailability {
  day: DayOfWeek;
  periodIndex: number;
  isAvailable: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  employeeCode: string;
  email: string;
  phone: string;
  designation: string;
  qualifiedSubjectIds: string[];
  maxPeriodsPerDay: number;
  maxPeriodsPerWeek: number;
  minPeriodsPerDay: number;
  maxConsecutivePeriods: number;
  availability: TeacherAvailability[];
  colorBadge?: string;
}

export type PeriodType = 'regular' | 'short_break' | 'long_break' | 'lunch' | 'assembly' | 'activity';

export interface TimeSlot {
  index: number;
  label: string;
  startTime: string;
  endTime: string;
  type: PeriodType;
  isBreak: boolean;
}

export interface TimetableSlot {
  id: string;
  timetableId: string;
  day: DayOfWeek;
  periodIndex: number;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  lockType: LockType;
  isDoublePeriod?: boolean;
  notes?: string;
}

export type ConflictSeverity = 'hard' | 'soft' | 'warning';

export interface TimetableConflict {
  id: string;
  severity: ConflictSeverity;
  title: string;
  description: string;
  day: DayOfWeek;
  periodIndex: number;
  slotIds: string[];
  entityType: 'teacher' | 'class' | 'lock' | 'workload' | 'subject';
  entityId: string;
  suggestion?: string;
}

export type TimetableStatus = 'draft' | 'generated' | 'reviewed' | 'published';

export interface TimetableVersion {
  id: string;
  name: string;
  versionNumber: number;
  academicYear: string;
  status: TimetableStatus;
  createdAt: string;
  updatedAt: string;
  slotsCount: number;
  hardConflictsCount: number;
  softConflictsCount: number;
  healthScore: number;
  isSandbox?: boolean;
}

export interface TimetableHealth {
  overallScore: number;
  hardConflictsCount: number;
  softConflictsCount: number;
  teacherWorkloadBalance: number;
  classScheduleCompleteness: number;
  readyToPublish: boolean;
}

export interface SubstitutionRecord {
  id: string;
  day: DayOfWeek;
  date: string;
  slotId: string;
  periodIndex: number;
  sectionId: string;
  subjectId: string;
  originalTeacherId: string;
  substituteTeacherId: string;
  reason?: string;
  status: 'assigned' | 'pending';
  createdAt: string;
}

export interface SubjectBlockRule {
  id: string;
  subjectId: string;
  blockSize: number; // e.g. 2 for double period, 3 for triple
  enabled: boolean;
}

export interface LabRoomCapacity {
  id: string;
  name: string; // e.g. "Computer Lab", "Physics Lab", "Chemistry Lab", "Biology Lab"
  subjectName: string; // Subject name this lab is allocated for (e.g. "Computer", "Physics", "Chemistry", "Biology")
  capacity: number; // Maximum simultaneous classes allowed in the school at the same period (default 1)
}

// 10 Clean Views (including Master Institutional Matrix)
export type ActiveView = 
  | 'dashboard'
  | 'studio'
  | 'master'
  | 'generate'
  | 'teachers'
  | 'classes'
  | 'subjects'
  | 'substitutions'
  | 'rules'
  | 'export'
  | 'settings';
