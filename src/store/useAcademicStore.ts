import { create } from 'zustand'
import { Institution, GradeClass, Subject, Teacher, Section, LabRoomCapacity } from '../lib/types'
import { StorageEngine } from '../lib/storage'
import { DEFAULT_LAB_CAPACITIES } from '../lib/constants'

interface AcademicState {
  institution: Institution
  classes: GradeClass[]
  subjects: Subject[]
  teachers: Teacher[]
  labCapacities: LabRoomCapacity[]

  // Institution
  updateInstitution: (data: Partial<Institution>) => void

  // Classes & Sections
  addClass: (name: string, numericLevel: number) => void
  updateClass: (id: string, name: string, numericLevel: number) => void
  removeClass: (id: string) => void
  addSection: (classId: string, name: string, classTeacherId?: string) => void
  updateSection: (sectionId: string, updates: Partial<Section>) => void
  removeSection: (classId: string, sectionId: string) => void

  // Subjects (With Grade Assignment)
  addSubject: (subject: Omit<Subject, 'id'>) => void
  updateSubject: (id: string, updates: Partial<Subject>) => void
  removeSubject: (id: string) => void

  // Teachers
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void
  updateTeacher: (id: string, updates: Partial<Teacher>) => void
  removeTeacher: (id: string) => void

  // Labs & Room Capacity
  addLabCapacity: (lab: Omit<LabRoomCapacity, 'id'>) => void
  updateLabCapacity: (id: string, updates: Partial<LabRoomCapacity>) => void
  removeLabCapacity: (id: string) => void
  resetLabCapacities: () => void
}

export const useAcademicStore = create<AcademicState>((set, get) => ({
  institution: StorageEngine.getInstitution(),
  classes: StorageEngine.getClasses(),
  subjects: StorageEngine.getSubjects(),
  teachers: StorageEngine.getTeachers(),
  labCapacities: StorageEngine.getLabCapacities(),

  updateInstitution: (data) => {
    const updated = { ...get().institution, ...data }
    StorageEngine.saveInstitution(updated)
    set({ institution: updated })
  },

  addClass: (name, numericLevel) => {
    const newClass: GradeClass = {
      id: `class-${Date.now()}`,
      name,
      numericLevel,
      sections: [],
    }
    const updated = [...get().classes, newClass]
    StorageEngine.saveClasses(updated)
    set({ classes: updated })
  },

  updateClass: (id, name, numericLevel) => {
    const updated = get().classes.map((c) =>
      c.id === id ? { ...c, name, numericLevel } : c
    )
    StorageEngine.saveClasses(updated)
    set({ classes: updated })
  },

  removeClass: (id) => {
    const updated = get().classes.filter((c) => c.id !== id)
    StorageEngine.saveClasses(updated)
    set({ classes: updated })
  },

  addSection: (classId, name, classTeacherId) => {
    const targetClass = get().classes.find((c) => c.id === classId)
    if (!targetClass) return
    const newSection: Section = {
      id: `sec-${Date.now()}`,
      classId,
      name,
      fullName: `${targetClass.name} - ${name}`,
      classTeacherId,
    }
    const updated = get().classes.map((c) =>
      c.id === classId ? { ...c, sections: [...c.sections, newSection] } : c
    )
    StorageEngine.saveClasses(updated)
    set({ classes: updated })
  },

  updateSection: (sectionId, updates) => {
    const updated = get().classes.map((c) => ({
      ...c,
      sections: c.sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
    }))
    StorageEngine.saveClasses(updated)
    set({ classes: updated })
  },

  removeSection: (classId, sectionId) => {
    const updated = get().classes.map((c) =>
      c.id === classId
        ? { ...c, sections: c.sections.filter((s) => s.id !== sectionId) }
        : c
    )
    StorageEngine.saveClasses(updated)
    set({ classes: updated })
  },

  addSubject: (subjectData) => {
    const newSubject: Subject = {
      ...subjectData,
      id: `sub-${Date.now()}`,
    }
    const updated = [...get().subjects, newSubject]
    StorageEngine.saveSubjects(updated)
    set({ subjects: updated })
  },

  updateSubject: (id, updates) => {
    const updated = get().subjects.map((s) => (s.id === id ? { ...s, ...updates } : s))
    StorageEngine.saveSubjects(updated)
    set({ subjects: updated })
  },

  removeSubject: (id) => {
    const updated = get().subjects.filter((s) => s.id !== id)
    StorageEngine.saveSubjects(updated)
    set({ subjects: updated })
  },

  addTeacher: (teacherData) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `tch-${Date.now()}`,
    }
    const updated = [...get().teachers, newTeacher]
    StorageEngine.saveTeachers(updated)
    set({ teachers: updated })
  },

  updateTeacher: (id, updates) => {
    const updated = get().teachers.map((t) => (t.id === id ? { ...t, ...updates } : t))
    StorageEngine.saveTeachers(updated)
    set({ teachers: updated })
  },

  removeTeacher: (id) => {
    const updated = get().teachers.filter((t) => t.id !== id)
    StorageEngine.saveTeachers(updated)
    set({ teachers: updated })
  },

  addLabCapacity: (labData) => {
    const newLab: LabRoomCapacity = {
      ...labData,
      id: `lab-${Date.now()}`,
    }
    const updated = [...get().labCapacities, newLab]
    StorageEngine.saveLabCapacities(updated)
    set({ labCapacities: updated })
  },

  updateLabCapacity: (id, updates) => {
    const updated = get().labCapacities.map((l) => (l.id === id ? { ...l, ...updates } : l))
    StorageEngine.saveLabCapacities(updated)
    set({ labCapacities: updated })
  },

  removeLabCapacity: (id) => {
    const updated = get().labCapacities.filter((l) => l.id !== id)
    StorageEngine.saveLabCapacities(updated)
    set({ labCapacities: updated })
  },

  resetLabCapacities: () => {
    StorageEngine.saveLabCapacities(DEFAULT_LAB_CAPACITIES)
    set({ labCapacities: DEFAULT_LAB_CAPACITIES })
  },
}))
