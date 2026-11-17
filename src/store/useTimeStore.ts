import { create } from 'zustand'
import { TimeSlot } from '../lib/types'
import { StorageEngine } from '../lib/storage'

interface TimeState {
  timeSlots: TimeSlot[]
  updateTimeSlot: (index: number, updates: Partial<TimeSlot>) => void
  addTimeSlot: (slot: TimeSlot) => void
  removeTimeSlot: (index: number) => void
  resetToDefault: () => void
}

export const useTimeStore = create<TimeState>((set, get) => ({
  timeSlots: StorageEngine.getTimeSlots(),

  updateTimeSlot: (index, updates) => {
    const updated = get().timeSlots.map((s) => (s.index === index ? { ...s, ...updates } : s))
    StorageEngine.saveTimeSlots(updated)
    set({ timeSlots: updated })
  },

  addTimeSlot: (newSlot) => {
    const updated = [...get().timeSlots, newSlot].sort((a, b) => a.index - b.index)
    StorageEngine.saveTimeSlots(updated)
    set({ timeSlots: updated })
  },

  removeTimeSlot: (index) => {
    const updated = get().timeSlots.filter((s) => s.index !== index)
    StorageEngine.saveTimeSlots(updated)
    set({ timeSlots: updated })
  },

  resetToDefault: () => {
    const defaults = StorageEngine.getTimeSlots()
    set({ timeSlots: defaults })
  },
}))
