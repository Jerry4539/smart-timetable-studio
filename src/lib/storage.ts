import {
  Institution,
  GradeClass,
  Subject,
  Teacher,
  TimeSlot,
  TimetableSlot,
  TimetableVersion,
  StudioOrientation,
  LabRoomCapacity,
} from './types'
import {
  SEED_INSTITUTION,
  SEED_CLASSES,
  SEED_SUBJECTS,
  SEED_TEACHERS,
  SEED_TIMETABLE_VERSION,
  SEED_SLOTS,
} from './seedData'
import { DEFAULT_TIME_SLOTS, DEFAULT_LAB_CAPACITIES } from './constants'

const STORAGE_KEYS = {
  INSTITUTION: 'stt_institution',
  CLASSES: 'stt_classes',
  SUBJECTS: 'stt_subjects',
  TEACHERS: 'stt_teachers',
  TIME_SLOTS: 'stt_time_slots',
  VERSIONS: 'stt_versions',
  ACTIVE_VERSION_ID: 'stt_active_version_id',
  SLOTS_PREFIX: 'stt_slots_',
  ORIENTATION: 'stt_orientation',
  LAB_CAPACITIES: 'stt_lab_capacities',
}

export const StorageEngine = {
  getLabCapacities(): LabRoomCapacity[] {
    const data = localStorage.getItem(STORAGE_KEYS.LAB_CAPACITIES)
    return data ? JSON.parse(data) : DEFAULT_LAB_CAPACITIES
  },

  saveLabCapacities(labs: LabRoomCapacity[]): void {
    localStorage.setItem(STORAGE_KEYS.LAB_CAPACITIES, JSON.stringify(labs))
  },
  getInstitution(): Institution {
    const data = localStorage.getItem(STORAGE_KEYS.INSTITUTION)
    return data ? JSON.parse(data) : SEED_INSTITUTION
  },

  saveInstitution(inst: Institution): void {
    localStorage.setItem(STORAGE_KEYS.INSTITUTION, JSON.stringify(inst))
  },

  getClasses(): GradeClass[] {
    const data = localStorage.getItem(STORAGE_KEYS.CLASSES)
    return data ? JSON.parse(data) : SEED_CLASSES
  },

  saveClasses(classes: GradeClass[]): void {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes))
  },

  getSubjects(): Subject[] {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS)
    return data ? JSON.parse(data) : SEED_SUBJECTS
  },

  saveSubjects(subjects: Subject[]): void {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects))
  },

  getTeachers(): Teacher[] {
    const data = localStorage.getItem(STORAGE_KEYS.TEACHERS)
    return data ? JSON.parse(data) : SEED_TEACHERS
  },

  saveTeachers(teachers: Teacher[]): void {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers))
  },

  getTimeSlots(): TimeSlot[] {
    const data = localStorage.getItem(STORAGE_KEYS.TIME_SLOTS)
    return data ? JSON.parse(data) : DEFAULT_TIME_SLOTS
  },

  saveTimeSlots(slots: TimeSlot[]): void {
    localStorage.setItem(STORAGE_KEYS.TIME_SLOTS, JSON.stringify(slots))
  },

  getVersions(): TimetableVersion[] {
    const data = localStorage.getItem(STORAGE_KEYS.VERSIONS)
    return data ? JSON.parse(data) : [SEED_TIMETABLE_VERSION]
  },

  saveVersions(versions: TimetableVersion[]): void {
    localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(versions))
  },

  getActiveVersionId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_VERSION_ID) || SEED_TIMETABLE_VERSION.id
  },

  saveActiveVersionId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VERSION_ID, id)
  },

  getSlots(versionId: string): TimetableSlot[] {
    const key = `${STORAGE_KEYS.SLOTS_PREFIX}${versionId}`
    const data = localStorage.getItem(key)
    if (data) return JSON.parse(data)
    if (versionId === SEED_TIMETABLE_VERSION.id) return SEED_SLOTS
    return []
  },

  saveSlots(versionId: string, slots: TimetableSlot[]): void {
    const key = `${STORAGE_KEYS.SLOTS_PREFIX}${versionId}`
    localStorage.setItem(key, JSON.stringify(slots))
  },

  getStudioOrientation(): StudioOrientation {
    return (localStorage.getItem(STORAGE_KEYS.ORIENTATION) as StudioOrientation) || 'periods-on-top'
  },

  saveStudioOrientation(orientation: StudioOrientation): void {
    localStorage.setItem(STORAGE_KEYS.ORIENTATION, orientation)
  },

  resetToDefaults(): void {
    localStorage.clear()
  },
}
