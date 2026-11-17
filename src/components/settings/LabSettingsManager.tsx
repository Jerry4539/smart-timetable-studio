import React, { useState, useMemo, useEffect } from 'react'
import {
  FlaskConical,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  School,
  AlertCircle,
} from 'lucide-react'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useAppStore } from '../../store/useAppStore'
import { LabRoomCapacity } from '../../lib/types'

export const LabSettingsManager: React.FC = () => {
  const { subjects, labCapacities, addLabCapacity, updateLabCapacity, removeLabCapacity, resetLabCapacities } =
    useAcademicStore()
  const { addNotification } = useAppStore()

  // Distinct subjects from curriculum for the dropdown
  const uniqueSubjects = useMemo(() => {
    const map = new Map<string, (typeof subjects)[0]>()
    subjects.forEach((s) => {
      const key = s.name.trim().toLowerCase()
      if (!map.has(key)) {
        map.set(key, s)
      }
    })
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [subjects])

  // Form State
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>('')
  const [labName, setLabName] = useState<string>('')
  const [capacity, setCapacity] = useState<number>(1)

  // Default subject selection
  useEffect(() => {
    if (uniqueSubjects.length > 0 && (!selectedSubjectName || !uniqueSubjects.some((u) => u.name === selectedSubjectName))) {
      const defaultSub =
        uniqueSubjects.find(
          (u) =>
            u.name.toLowerCase().includes('computer') ||
            u.name.toLowerCase().includes('physics') ||
            u.name.toLowerCase().includes('chem') ||
            u.name.toLowerCase().includes('bio')
        ) || uniqueSubjects[0]

      setSelectedSubjectName(defaultSub.name)
      setLabName(`${defaultSub.name} Lab`)
    }
  }, [uniqueSubjects, selectedSubjectName])

  // When subject changes, suggest a clean lab name
  const handleSubjectChange = (name: string) => {
    setSelectedSubjectName(name)
    setLabName(`${name} Lab`)
  }

  const handleAddLab = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubjectName.trim()) return

    const finalName = labName.trim() || `${selectedSubjectName} Lab`

    // Check if already exists for this subject
    const existing = labCapacities.find(
      (l) => l.subjectName.toLowerCase() === selectedSubjectName.toLowerCase()
    )
    if (existing) {
      updateLabCapacity(existing.id, { capacity, name: finalName })
      addNotification({
        title: 'Lab Updated',
        message: `${finalName} capacity set to ${capacity} simultaneous session(s).`,
        type: 'info',
      })
      return
    }

    addLabCapacity({
      name: finalName,
      subjectName: selectedSubjectName,
      capacity: Math.max(1, capacity),
    })

    addNotification({
      title: 'Lab Added',
      message: `${finalName} configured with capacity of ${capacity} class(es) at a time.`,
      type: 'success',
    })
  }

  // Quick auto-detect from curriculum
  const handleAutoDetect = () => {
    const candidates = [
      { key: 'computer', defaultName: 'Computer Lab' },
      { key: 'physics', defaultName: 'Physics Lab' },
      { key: 'chemistry', defaultName: 'Chemistry Lab' },
      { key: 'biology', defaultName: 'Biology Lab' },
    ]

    let addedCount = 0
    candidates.forEach((cand) => {
      const matchingSub = uniqueSubjects.find((u) =>
        u.name.toLowerCase().includes(cand.key)
      )
      if (matchingSub) {
        const alreadyConfigured = labCapacities.some(
          (l) => l.subjectName.toLowerCase() === matchingSub.name.toLowerCase()
        )
        if (!alreadyConfigured) {
          addLabCapacity({
            name: cand.defaultName,
            subjectName: matchingSub.name,
            capacity: 1,
          })
          addedCount++
        }
      }
    })

    addNotification({
      title: 'Auto-Detect Complete',
      message:
        addedCount > 0
          ? `Detected and added ${addedCount} science & computer lab room limits.`
          : 'All standard science & computer labs are already configured.',
      type: 'info',
    })
  }

  const handleResetDefaults = () => {
    resetLabCapacities()
    addNotification({
      title: 'Defaults Restored',
      message: 'Restored standard single-lab limits for Computer, Physics, Chemistry, Biology.',
      type: 'info',
    })
  }

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center font-bold shadow-2xs">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 dark:text-zinc-100 text-xs">
                  Physical Lab & Room Quantities
                </span>
                <span className="text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200/60 dark:border-purple-800/40">
                  Room Collision Prevention
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Set how many physical labs your school has so multiple teachers never overlap in the same lab
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleAutoDetect}
              className="flex items-center space-x-1 px-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Auto-Detect Labs</span>
            </button>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center space-x-1 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
          For example: If you have <strong>1 Computer Lab</strong> and 2 Computer teachers, setting Computer Lab capacity to <strong>1</strong> guarantees that the schedule generator will never schedule two classes for Computer in the same period. Both teachers' lectures will be scheduled in different periods without room clash.
        </p>
      </div>

      {/* Add New Lab Form */}
      <form
        onSubmit={handleAddLab}
        className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-3"
      >
        <div className="font-bold text-xs text-slate-900 dark:text-zinc-100 pb-1 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <span>Configure Lab or Special Room</span>
          <span className="text-[10px] text-slate-400 font-normal">
            Dynamic curriculum subjects
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Subject Dropdown */}
          <div className="sm:col-span-5">
            <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
              Select Curriculum Subject
            </label>
            <select
              value={selectedSubjectName}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-800 dark:text-zinc-100 font-medium focus:outline-none"
            >
              {uniqueSubjects.map((sub) => (
                <option key={sub.name} value={sub.name}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          {/* Lab Room Display Name */}
          <div className="sm:col-span-4">
            <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
              Lab Room Name
            </label>
            <input
              type="text"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              placeholder="e.g. Computer Lab, Physics Lab"
              className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 font-medium focus:outline-none"
            />
          </div>

          {/* Capacity Input */}
          <div className="sm:col-span-3">
            <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
              Available Lab Rooms
            </label>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                min={1}
                max={10}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 font-bold focus:outline-none text-center"
              />
              <button
                type="submit"
                className="h-8 px-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-2xs transition-colors shrink-0 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Configured Labs Bento Grid */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center justify-between">
          <span>Configured Facility Limits ({labCapacities.length})</span>
          <span className="text-[10px] text-slate-400">
            Enforced during auto-generation and manual drag-and-drop
          </span>
        </div>

        {labCapacities.length === 0 ? (
          <div className="text-center py-6 px-4 bg-white dark:bg-zinc-900 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl text-slate-400 text-xs">
            No lab constraints configured. Click "Auto-Detect Labs" or add one above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {labCapacities.map((lab) => (
              <div
                key={lab.id}
                className="p-3.5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span className="font-bold text-xs text-slate-900 dark:text-zinc-100 truncate">
                      {lab.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                    Subject: <strong className="text-slate-700 dark:text-zinc-200">{lab.subjectName}</strong>
                  </div>
                  <div className="text-[10px] text-purple-700 dark:text-purple-300 font-mono font-medium">
                    Max {lab.capacity} simultaneous class{lab.capacity > 1 ? 'es' : ''} allowed
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {/* Stepper buttons to increment/decrement capacity */}
                  <div className="flex items-center bg-slate-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-slate-200 dark:border-zinc-700">
                    <button
                      type="button"
                      onClick={() =>
                        updateLabCapacity(lab.id, { capacity: Math.max(1, lab.capacity - 1) })
                      }
                      className="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-zinc-300 hover:text-slate-900"
                      title="Decrease room count"
                    >
                      -
                    </button>
                    <span className="px-2 font-mono text-xs font-bold text-slate-900 dark:text-zinc-100">
                      {lab.capacity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateLabCapacity(lab.id, { capacity: lab.capacity + 1 })
                      }
                      className="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-zinc-300 hover:text-slate-900"
                      title="Increase room count"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLabCapacity(lab.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Remove Lab Limit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
