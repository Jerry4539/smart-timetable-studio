import React, { useState } from 'react'
import { X, Building2, Save, Check } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useAcademicStore } from '../../store/useAcademicStore'
import { DayOfWeek, InstitutionType } from '../../lib/types'
import { DAYS_OF_WEEK } from '../../lib/constants'

export const InstitutionModal: React.FC = () => {
  const { institutionModalOpen, setInstitutionModalOpen, addNotification } = useAppStore()
  const { institution, updateInstitution } = useAcademicStore()

  const [name, setName] = useState(institution.name)
  const [code, setCode] = useState(institution.code)
  const [type, setType] = useState<InstitutionType>(institution.type)
  const [academicYear, setAcademicYear] = useState(institution.academicYear)
  const [campusName, setCampusName] = useState(institution.campusName)
  const [startTime, setStartTime] = useState(institution.startTime)
  const [endTime, setEndTime] = useState(institution.endTime)
  const [workingDays, setWorkingDays] = useState<DayOfWeek[]>(institution.workingDays)

  if (!institutionModalOpen) return null

  const handleToggleDay = (day: DayOfWeek) => {
    if (workingDays.includes(day)) {
      if (workingDays.length > 1) {
        setWorkingDays(workingDays.filter((d) => d !== day))
      }
    } else {
      setWorkingDays([...workingDays, day])
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateInstitution({
      name,
      code,
      type,
      academicYear,
      campusName,
      startTime,
      endTime,
      workingDays,
    })
    addNotification({
      title: 'Institution Updated',
      message: `${name} configuration saved successfully.`,
      type: 'success',
    })
    setInstitutionModalOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-soft-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Institution Profile & Settings
              </h3>
              <p className="text-[11px] text-slate-400">Manage school metadata and working schedule</p>
            </div>
          </div>
          <button
            onClick={() => setInstitutionModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Institution Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InstitutionType)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="school">K-12 School</option>
                <option value="college">College / University</option>
                <option value="coaching">Coaching Institute</option>
                <option value="training_center">Training Center</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Academic Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2026-2027"
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Campus / Branch
              </label>
              <input
                type="text"
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Working Days */}
            <div className="col-span-2 pt-2">
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-2">
                Active Working Days
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = workingDays.includes(day)
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleToggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center space-x-1.5 transition-all ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 shadow-2xs'
                          : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                      <span>{day}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setInstitutionModalOpen(false)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
