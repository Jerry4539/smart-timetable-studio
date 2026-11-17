import React from 'react'
import { X, AlertTriangle, AlertCircle, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useValidationStore } from '../../store/useValidationStore'
import { useTimetableStore } from '../../store/useTimetableStore'
import { useAcademicStore } from '../../store/useAcademicStore'

export const ConflictDetailModal: React.FC = () => {
  const { selectedConflict, setSelectedConflict } = useValidationStore()
  const { slots, moveSlot } = useTimetableStore()
  const { teachers, classes, subjects } = useAcademicStore()

  if (!selectedConflict) return null

  const isHard = selectedConflict.severity === 'hard'

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-soft-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isHard
              ? 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40'
              : 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isHard
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400'
                  : 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400'
              }`}
            >
              {isHard ? <AlertCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {isHard ? 'Hard Constraint Violation' : 'Soft Constraint Advisory'}
              </h3>
              <p className="text-[11px] text-slate-500">Why can't this lecture be placed?</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedConflict(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {selectedConflict.title}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
              {selectedConflict.description}
            </p>
          </div>

          {/* Conflict Meta Info */}
          <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                Target Slot
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {selectedConflict.day} &bull; Period {selectedConflict.periodIndex}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                Constraint Type
              </span>
              <span className="font-medium capitalize text-slate-800 dark:text-slate-200">
                {selectedConflict.entityType} Constraint
              </span>
            </div>
          </div>

          {/* Recommendation / Alternative */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Recommended Resolution
            </div>
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-lg text-slate-700 dark:text-slate-300">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">{selectedConflict.suggestion}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setSelectedConflict(null)}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 font-medium rounded-lg text-xs transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
