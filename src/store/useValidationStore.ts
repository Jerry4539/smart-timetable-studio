import { create } from 'zustand'
import { TimetableConflict, TimetableHealth } from '../lib/types'
import { useTimetableStore } from './useTimetableStore'
import { useAcademicStore } from './useAcademicStore'
import { StorageEngine } from '../lib/storage'

interface ValidationState {
  conflicts: TimetableConflict[]
  health: TimetableHealth
  selectedConflict: TimetableConflict | null
  setSelectedConflict: (c: TimetableConflict | null) => void
  validateTimetable: () => void
}

export const useValidationStore = create<ValidationState>((set) => ({
  conflicts: [],
  health: {
    overallScore: 100,
    hardConflictsCount: 0,
    softConflictsCount: 0,
    teacherWorkloadBalance: 100,
    classScheduleCompleteness: 100,
    readyToPublish: true,
  },
  selectedConflict: null,
  setSelectedConflict: (c) => set({ selectedConflict: c }),

  validateTimetable: () => {
    const { slots } = useTimetableStore.getState()
    const { teachers, classes, subjects } = useAcademicStore.getState()

    const detectedConflicts: TimetableConflict[] = []

    // 1. Check Teacher Double-booking (Hard Conflict)
    const teacherMap = new Map<string, typeof slots>()
    slots.forEach((s) => {
      const key = `${s.teacherId}_${s.day}_${s.periodIndex}`
      const existing = teacherMap.get(key) || []
      existing.push(s)
      teacherMap.set(key, existing)
    })

    teacherMap.forEach((overlappingSlots, key) => {
      if (overlappingSlots.length > 1) {
        const teacher = teachers.find((t) => t.id === overlappingSlots[0].teacherId)
        const tName = teacher?.name || 'Teacher'
        const day = overlappingSlots[0].day
        const period = overlappingSlots[0].periodIndex

        detectedConflicts.push({
          id: `conflict-tch-${key}`,
          severity: 'hard',
          title: `Teacher Collision: ${tName}`,
          description: `${tName} is simultaneously scheduled for ${overlappingSlots.length} different sections on ${day} Period ${period}.`,
          day,
          periodIndex: period,
          slotIds: overlappingSlots.map((s) => s.id),
          entityType: 'teacher',
          entityId: overlappingSlots[0].teacherId,
          suggestion: `Reassign one of the lecture slots to an open period or another qualified faculty member.`,
        })
      }
    })

    // 2. Teacher Daily Workload Limits (Soft Conflict)
    teachers.forEach((t) => {
      const teacherSlots = slots.filter((s) => s.teacherId === t.id)
      const dayCounts = new Map<string, number>()
      teacherSlots.forEach((s) => {
        dayCounts.set(s.day, (dayCounts.get(s.day) || 0) + 1)
      })

      dayCounts.forEach((count, day) => {
        if (count > t.maxPeriodsPerDay) {
          detectedConflicts.push({
            id: `conflict-tch-limit-${t.id}-${day}`,
            severity: 'soft',
            title: `Daily Workload Advisory: ${t.name}`,
            description: `${t.name} is assigned ${count} periods on ${day}, exceeding the daily cap of ${t.maxPeriodsPerDay} periods/day.`,
            day: day as any,
            periodIndex: 0,
            slotIds: teacherSlots.filter((s) => s.day === day).map((s) => s.id),
            entityType: 'workload',
            entityId: t.id,
            suggestion: `Spread lectures across lighter days to avoid teacher fatigue.`,
          })
        }
      })
    })

    // 3. Lab / Special Room Overcapacity Check (Hard Conflict)
    const labCapacities = StorageEngine.getLabCapacities()
    if (labCapacities && labCapacities.length > 0) {
      labCapacities.forEach((lab) => {
        const periodSlotsMap = new Map<string, typeof slots>()
        slots.forEach((s) => {
          const sub = subjects.find((item) => item.id === s.subjectId)
          if (!sub) return
          const subName = sub.name.trim().toLowerCase()
          const labSubName = lab.subjectName.trim().toLowerCase()
          if (subName.includes(labSubName) || labSubName.includes(subName)) {
            const key = `${s.day}_${s.periodIndex}`
            const existing = periodSlotsMap.get(key) || []
            existing.push(s)
            periodSlotsMap.set(key, existing)
          }
        })

        periodSlotsMap.forEach((overlappingSlots, key) => {
          if (overlappingSlots.length > lab.capacity) {
            const day = overlappingSlots[0].day
            const period = overlappingSlots[0].periodIndex
            detectedConflicts.push({
              id: `conflict-lab-${lab.id}-${key}`,
              severity: 'hard',
              title: `Lab Collision: ${lab.name}`,
              description: `${overlappingSlots.length} classes are simultaneously scheduled for ${lab.name} on ${day} Period ${period}, exceeding available capacity (${lab.capacity} lab available).`,
              day,
              periodIndex: period,
              slotIds: overlappingSlots.map((s) => s.id),
              entityType: 'subject',
              entityId: overlappingSlots[0].subjectId,
              suggestion: `Move one of the lab sessions to another period or day to avoid facility collision.`,
            })
          }
        })
      })
    }

    const hardCount = detectedConflicts.filter((c) => c.severity === 'hard').length
    const softCount = detectedConflicts.filter((c) => c.severity === 'soft').length
    const overall = Math.max(20, 100 - hardCount * 15 - softCount * 3)

    set({
      conflicts: detectedConflicts,
      health: {
        overallScore: overall,
        hardConflictsCount: hardCount,
        softConflictsCount: softCount,
        teacherWorkloadBalance: Math.max(70, 100 - softCount * 2),
        classScheduleCompleteness: 100,
        readyToPublish: hardCount === 0,
      },
    })
  },
}))
