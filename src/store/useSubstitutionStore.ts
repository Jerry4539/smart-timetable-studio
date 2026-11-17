import { create } from 'zustand'
import { DayOfWeek, SubstitutionRecord } from '../lib/types'

interface SubstitutionState {
  activeDay: DayOfWeek
  activeDate: string
  absentTeacherIds: string[]
  absentReasons: Record<string, string>
  substitutions: SubstitutionRecord[]

  // Actions
  setActiveDay: (day: DayOfWeek) => void
  setActiveDate: (date: string) => void
  markTeacherAbsent: (teacherId: string, reason?: string) => void
  markTeacherPresent: (teacherId: string) => void
  assignSubstitute: (
    slotId: string,
    substituteTeacherId: string,
    originalTeacherId: string,
    periodIndex: number,
    sectionId: string,
    subjectId: string,
    reason?: string
  ) => void
  removeSubstitute: (id: string) => void
  clearAllSubstitutions: () => void
}

const STORAGE_KEY = 'stt_substitutions'
const ABSENT_KEY = 'stt_absent_teachers'

const loadSubstitutions = (): SubstitutionRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const loadAbsentTeachers = (): { ids: string[]; reasons: Record<string, string> } => {
  try {
    const raw = localStorage.getItem(ABSENT_KEY)
    return raw ? JSON.parse(raw) : { ids: [], reasons: {} }
  } catch {
    return { ids: [], reasons: {} }
  }
}

const initialAbsent = loadAbsentTeachers()

export const useSubstitutionStore = create<SubstitutionState>((set, get) => ({
  activeDay: 'Monday',
  activeDate: new Date().toISOString().split('T')[0],
  absentTeacherIds: initialAbsent.ids,
  absentReasons: initialAbsent.reasons,
  substitutions: loadSubstitutions(),

  setActiveDay: (day) => set({ activeDay: day }),
  setActiveDate: (date) => set({ activeDate: date }),

  markTeacherAbsent: (teacherId, reason = 'Personal Leave') => {
    const state = get()
    if (state.absentTeacherIds.includes(teacherId)) return

    const newAbsent = [...state.absentTeacherIds, teacherId]
    const newReasons = { ...state.absentReasons, [teacherId]: reason }

    localStorage.setItem(ABSENT_KEY, JSON.stringify({ ids: newAbsent, reasons: newReasons }))
    set({
      absentTeacherIds: newAbsent,
      absentReasons: newReasons,
    })
  },

  markTeacherPresent: (teacherId) => {
    const state = get()
    const newAbsent = state.absentTeacherIds.filter((id) => id !== teacherId)
    const newReasons = { ...state.absentReasons }
    delete newReasons[teacherId]

    // Also remove any pending substitutions for this teacher
    const newSubstitutions = state.substitutions.filter(
      (s) => s.originalTeacherId !== teacherId
    )

    localStorage.setItem(ABSENT_KEY, JSON.stringify({ ids: newAbsent, reasons: newReasons }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSubstitutions))

    set({
      absentTeacherIds: newAbsent,
      absentReasons: newReasons,
      substitutions: newSubstitutions,
    })
  },

  assignSubstitute: (
    slotId,
    substituteTeacherId,
    originalTeacherId,
    periodIndex,
    sectionId,
    subjectId,
    reason
  ) => {
    const state = get()
    // Remove previous assignment for this slot if any
    const filtered = state.substitutions.filter((s) => s.slotId !== slotId)

    const newRecord: SubstitutionRecord = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      day: state.activeDay,
      date: state.activeDate,
      slotId,
      periodIndex,
      sectionId,
      subjectId,
      originalTeacherId,
      substituteTeacherId,
      reason,
      status: 'assigned',
      createdAt: new Date().toISOString(),
    }

    const updated = [...filtered, newRecord]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    set({ substitutions: updated })
  },

  removeSubstitute: (id) => {
    const state = get()
    const updated = state.substitutions.filter((s) => s.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    set({ substitutions: updated })
  },

  clearAllSubstitutions: () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(ABSENT_KEY)
    set({
      absentTeacherIds: [],
      absentReasons: {},
      substitutions: [],
    })
  },
}))
