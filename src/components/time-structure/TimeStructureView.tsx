import React from 'react'
import { Clock, Plus, Trash2, Coffee, Utensils, RotateCcw } from 'lucide-react'
import { useTimeStore } from '../../store/useTimeStore'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useAppStore } from '../../store/useAppStore'

export const TimeStructureView: React.FC = () => {
  const { timeSlots, updateTimeSlot, addTimeSlot, removeTimeSlot, resetToDefault } = useTimeStore()
  const { institution, updateInstitution } = useAcademicStore()
  const { addNotification } = useAppStore()

  const handleDurationChange = (minutes: number) => {
    updateInstitution({ periodDurationMinutes: minutes })
    addNotification({
      title: 'Duration Updated',
      message: `Standard lecture duration set to ${minutes} minutes.`,
      type: 'info',
    })
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Time Structure & Period Configuration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure school bell schedule, instructional periods, short breaks, and lunch intervals.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetToDefault}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Timing Quick Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-soft-xs space-y-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Institution Hours
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{institution.startTime} &mdash; {institution.endTime}</span>
          </div>
          <p className="text-[11px] text-slate-400">Total daily institutional span</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-soft-xs space-y-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Period Duration
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <span>{institution.periodDurationMinutes} Minutes</span>
          </div>
          <p className="text-[11px] text-slate-400">Standard teaching lecture slot</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-soft-xs space-y-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Break Configuration
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Utensils className="w-4 h-4 text-amber-500" />
            <span>Lunch ({institution.lunchBreakMinutes}m) + Recess ({institution.shortBreakMinutes}m)</span>
          </div>
          <p className="text-[11px] text-slate-400">Non-instructional blocks</p>
        </div>
      </div>

      {/* Period Timeline List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-soft-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Daily Period Sequence & Schedule Slots
        </h2>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          {timeSlots.map((slot) => {
            const isLunch = slot.type === 'lunch'
            const isShort = slot.type === 'short_break'

            return (
              <div
                key={slot.index}
                className={`p-3.5 flex items-center justify-between transition-colors ${
                  slot.isBreak
                    ? 'bg-amber-50/40 dark:bg-amber-950/20'
                    : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                    {slot.isBreak ? (
                      isLunch ? <Utensils className="w-4 h-4 text-amber-600" /> : <Coffee className="w-4 h-4 text-amber-600" />
                    ) : (
                      slot.index
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {slot.label}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {slot.startTime} &mdash; {slot.endTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      slot.isBreak
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}
                  >
                    {slot.isBreak ? 'Break Interval' : 'Instructional Period'}
                  </span>

                  {timeSlots.length > 4 && (
                    <button
                      onClick={() => removeTimeSlot(slot.index)}
                      className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Remove Slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
