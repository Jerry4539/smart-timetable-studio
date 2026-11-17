import { create } from 'zustand'
import { DayOfWeek, LockType, TimetableSlot, TimetableVersion, StudioOrientation } from '../lib/types'
import { StorageEngine } from '../lib/storage'

interface TimetableState {
  versions: TimetableVersion[]
  activeVersionId: string
  slots: TimetableSlot[]
  history: TimetableSlot[][]
  historyIndex: number
  selectedSlotId: string | null
  activeDay: DayOfWeek
  viewMode: 'class' | 'teacher'
  layoutOrientation: StudioOrientation
  filterSectionId: string
  filterTeacherId: string
  searchQuery: string

  // Actions
  setActiveVersionId: (id: string) => void
  setViewMode: (mode: 'class' | 'teacher') => void
  setLayoutOrientation: (orientation: StudioOrientation) => void
  setFilterSectionId: (id: string) => void
  setFilterTeacherId: (id: string) => void
  setSearchQuery: (query: string) => void
  setSelectedSlotId: (id: string | null) => void
  setActiveDay: (day: DayOfWeek) => void

  // Slot mutations
  moveSlot: (slotId: string, targetDay: DayOfWeek, targetPeriod: number) => boolean
  assignLecture: (day: DayOfWeek, periodIndex: number, sectionId: string, subjectId: string, teacherId: string) => void
  removeSlot: (slotId: string) => void
  toggleLock: (slotId: string) => void
  setLockType: (slotId: string, lockType: LockType) => void

  // History
  undo: () => void
  redo: () => void

  // Versions
  duplicateVersion: (name: string, isSandbox?: boolean) => void
}

const activeVerId = StorageEngine.getActiveVersionId()
const initialSlots = StorageEngine.getSlots(activeVerId)
const initialOrientation = StorageEngine.getStudioOrientation()

export const useTimetableStore = create<TimetableState>((set, get) => ({
  versions: StorageEngine.getVersions(),
  activeVersionId: activeVerId,
  slots: initialSlots,
  history: [initialSlots],
  historyIndex: 0,
  selectedSlotId: null,
  activeDay: 'Monday',
  viewMode: 'class',
  layoutOrientation: initialOrientation,
  filterSectionId: 'sec-9a',
  filterTeacherId: 'tch-01',
  searchQuery: '',

  setActiveVersionId: (id) => {
    const slots = StorageEngine.getSlots(id)
    StorageEngine.saveActiveVersionId(id)
    set({
      activeVersionId: id,
      slots,
      history: [slots],
      historyIndex: 0,
      selectedSlotId: null,
    })
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setLayoutOrientation: (orientation) => {
    StorageEngine.saveStudioOrientation(orientation)
    set({ layoutOrientation: orientation })
  },
  setFilterSectionId: (id) => set({ filterSectionId: id }),
  setFilterTeacherId: (id) => set({ filterTeacherId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedSlotId: (id) => set({ selectedSlotId: id }),
  setActiveDay: (day) => set({ activeDay: day }),

  moveSlot: (slotId, targetDay, targetPeriod) => {
    const state = get()
    const targetSlot = state.slots.find((s) => s.id === slotId)
    if (!targetSlot) return false

    // If hard locked, prevent moving
    if (targetSlot.lockType === 'hard') {
      return false
    }

    // If dropped on the same cell, no change needed
    if (targetSlot.day === targetDay && targetSlot.periodIndex === targetPeriod) {
      return true
    }

    // Check if slot in target exists in the current view (same section for class view, same teacher for teacher view)
    const occupiedSlot = state.slots.find((s) => {
      if (s.id === slotId) return false
      if (s.day !== targetDay || s.periodIndex !== targetPeriod) return false
      if (state.viewMode === 'teacher') {
        return s.teacherId === targetSlot.teacherId
      }
      return s.sectionId === targetSlot.sectionId
    })

    let newSlots: TimetableSlot[]
    if (occupiedSlot) {
      if (occupiedSlot.lockType === 'hard') return false

      // Swap positions
      newSlots = state.slots.map((s) => {
        if (s.id === slotId) {
          return { ...s, day: targetDay, periodIndex: targetPeriod }
        }
        if (s.id === occupiedSlot.id) {
          return { ...s, day: targetSlot.day, periodIndex: targetSlot.periodIndex }
        }
        return s
      })
    } else {
      // Simple move
      newSlots = state.slots.map((s) =>
        s.id === slotId ? { ...s, day: targetDay, periodIndex: targetPeriod } : s
      )
    }

    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(newSlots)

    StorageEngine.saveSlots(state.activeVersionId, newSlots)
    set({
      slots: newSlots,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
    return true
  },

  assignLecture: (day, periodIndex, sectionId, subjectId, teacherId) => {
    const state = get()
    const filtered = state.slots.filter(
      (s) => !(s.day === day && s.periodIndex === periodIndex && s.sectionId === sectionId)
    )

    const newSlot: TimetableSlot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timetableId: state.activeVersionId,
      day,
      periodIndex,
      sectionId,
      subjectId,
      teacherId,
      lockType: 'none',
    }

    const newSlots = [...filtered, newSlot]
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(newSlots)

    StorageEngine.saveSlots(state.activeVersionId, newSlots)
    set({
      slots: newSlots,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },

  removeSlot: (slotId) => {
    const state = get()
    const targetSlot = state.slots.find((s) => s.id === slotId)
    if (targetSlot?.lockType === 'hard') return

    const newSlots = state.slots.filter((s) => s.id !== slotId)
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(newSlots)

    StorageEngine.saveSlots(state.activeVersionId, newSlots)
    set({
      slots: newSlots,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      selectedSlotId: state.selectedSlotId === slotId ? null : state.selectedSlotId,
    })
  },

  toggleLock: (slotId) => {
    const state = get()
    const newSlots = state.slots.map((s) => {
      if (s.id !== slotId) return s
      const nextLock: LockType = s.lockType === 'none' ? 'soft' : s.lockType === 'soft' ? 'hard' : 'none'
      return { ...s, lockType: nextLock }
    })

    StorageEngine.saveSlots(state.activeVersionId, newSlots)
    set({ slots: newSlots })
  },

  setLockType: (slotId, lockType) => {
    const state = get()
    const newSlots = state.slots.map((s) => (s.id === slotId ? { ...s, lockType } : s))
    StorageEngine.saveSlots(state.activeVersionId, newSlots)
    set({ slots: newSlots })
  },

  undo: () => {
    const state = get()
    if (state.historyIndex > 0) {
      const prevIndex = state.historyIndex - 1
      const prevSlots = state.history[prevIndex]
      StorageEngine.saveSlots(state.activeVersionId, prevSlots)
      set({
        slots: prevSlots,
        historyIndex: prevIndex,
      })
    }
  },

  redo: () => {
    const state = get()
    if (state.historyIndex < state.history.length - 1) {
      const nextIndex = state.historyIndex + 1
      const nextSlots = state.history[nextIndex]
      StorageEngine.saveSlots(state.activeVersionId, nextSlots)
      set({
        slots: nextSlots,
        historyIndex: nextIndex,
      })
    }
  },

  duplicateVersion: (name, isSandbox = false) => {
    const state = get()
    const currentSlots = state.slots
    const newVer: TimetableVersion = {
      id: `tt-ver-${Date.now()}`,
      name,
      versionNumber: state.versions.length + 1,
      academicYear: '2026-2027',
      status: isSandbox ? 'draft' : 'reviewed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slotsCount: currentSlots.length,
      hardConflictsCount: 0,
      softConflictsCount: 0,
      healthScore: 100,
      isSandbox,
    }

    const updatedVersions = [...state.versions, newVer]
    StorageEngine.saveVersions(updatedVersions)
    StorageEngine.saveSlots(newVer.id, [...currentSlots])

    set({
      versions: updatedVersions,
      activeVersionId: newVer.id,
      slots: [...currentSlots],
      history: [[...currentSlots]],
      historyIndex: 0,
    })
  },
}))
