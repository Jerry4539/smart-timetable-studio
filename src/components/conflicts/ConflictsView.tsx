import React, { useEffect } from 'react'
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Activity,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { useValidationStore } from '../../store/useValidationStore'
import { useTimetableStore } from '../../store/useTimetableStore'
import { useAcademicStore } from '../../store/useAcademicStore'

export const ConflictsView: React.FC = () => {
  const { conflicts, health, validateTimetable, setSelectedConflict } = useValidationStore()
  const { slots } = useTimetableStore()
  const { teachers } = useAcademicStore()

  useEffect(() => {
    validateTimetable()
  }, [slots, validateTimetable])

  const hardConflicts = conflicts.filter((c) => c.severity === 'hard')
  const softConflicts = conflicts.filter((c) => c.severity === 'soft')

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Conflicts, Diagnostics & Timetable Health
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated verification engine checking teacher overlaps, workload caps, and feasibility.
          </p>
        </div>
        <button
          onClick={validateTimetable}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 rounded-xl text-xs font-medium transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-validate Matrix</span>
        </button>
      </div>

      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-soft-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Publish Readiness</span>
            <div
              className={`p-2 rounded-lg ${
                health.readyToPublish
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
              }`}
            >
              {health.readyToPublish ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {health.readyToPublish ? 'Ready to Publish' : 'Needs Resolution'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {hardConflicts.length === 0
                ? 'All mandatory hard constraints satisfied'
                : `${hardConflicts.length} blocking conflict(s)`}
            </div>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-soft-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Hard Conflicts</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {hardConflicts.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Zero-tolerance collision violations
            </div>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-soft-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Soft Advisories</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {softConflicts.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Daily cap & consecutive distribution
            </div>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-soft-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Overall Feasibility</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {health.overallScore}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Composite constraint satisfaction index
            </div>
          </div>
        </div>
      </div>

      {/* Conflict Audit List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-soft-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Detected Violations & Advisories ({conflicts.length})
        </h2>

        {conflicts.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              Flawless Schedule &mdash; Zero Collisions
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No teacher clashes, no division overlaps, and all weekly workloads are safely within regulatory boundaries.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conflicts.map((conflict) => {
              const isHard = conflict.severity === 'hard'

              return (
                <div
                  key={conflict.id}
                  onClick={() => setSelectedConflict(conflict)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                    isHard
                      ? 'bg-rose-50/60 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 hover:bg-rose-50'
                      : 'bg-amber-50/60 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        isHard
                          ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300'
                      }`}
                    >
                      {isHard ? <AlertCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                        <span>{conflict.title}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                            isHard
                              ? 'bg-rose-200/80 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                              : 'bg-amber-200/80 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                          }`}
                        >
                          {conflict.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {conflict.description}
                      </p>
                      {conflict.suggestion && (
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">
                          Tip: {conflict.suggestion}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-medium text-slate-400 hover:text-slate-700 flex items-center space-x-1 shrink-0 ml-4">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
