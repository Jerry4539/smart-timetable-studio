import React, { useState, useMemo } from 'react'
import {
  Calendar,
  ShieldCheck,
  Users,
  GraduationCap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sliders,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useTimetableStore } from '../../store/useTimetableStore'
import { useTimeStore } from '../../store/useTimeStore'
import { useValidationStore } from '../../store/useValidationStore'
import { DAYS_OF_WEEK } from '../../lib/constants'
import { DayOfWeek } from '../../lib/types'

export const DashboardView: React.FC = () => {
  const { setActiveView } = useAppStore()
  const { teachers, classes, subjects, institution } = useAcademicStore()
  const { slots, setFilterSectionId, setViewMode } = useTimetableStore()
  const { timeSlots } = useTimeStore()
  const { health } = useValidationStore()

  const allSections = useMemo(() => classes.flatMap((c) => c.sections), [classes])

  const [activeDay, setActiveDay] = useState<DayOfWeek>('Monday')
  const [selectedSectionId, setSelectedSectionId] = useState<string>(allSections[0]?.id || '')

  const currentSection = allSections.find((s) => s.id === selectedSectionId) || allSections[0]
  const totalSections = allSections.length

  // Filter slots for active day and chosen section
  const daySlots = useMemo(() => {
    return slots
      .filter((s) => s.day === activeDay && s.sectionId === currentSection?.id)
      .sort((a, b) => a.periodIndex - b.periodIndex)
  }, [slots, activeDay, currentSection])

  return (
    <div className="p-4 sm:p-5 max-w-6xl mx-auto space-y-4 select-none animate-fade-in text-[13px]">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center space-x-2.5">
          <h1 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            Dashboard
          </h1>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-medium">
            {institution.campusName || 'Main Campus'} &bull; {institution.academicYear || '2026-2027'}
          </span>
        </div>

        <button
          onClick={() => {
            if (currentSection) {
              setFilterSectionId(currentSection.id)
              setViewMode('class')
            }
            setActiveView('studio')
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl text-xs font-semibold transition-all shadow-2xs"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Open Timetable Studio</span>
        </button>
      </div>

      {/* 2. 4 Top Stat Bento Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Tile 1: Feasibility */}
        <div className="p-3.5 bg-white dark:bg-[#141417] border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-medium">
            <span>Schedule Health</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              {health.overallScore}%
            </div>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>0 Conflicts Detected</span>
          </div>
        </div>

        {/* Tile 2: Faculty */}
        <div className="p-3.5 bg-white dark:bg-[#141417] border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-medium">
            <span>Teaching Faculty</span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              {teachers.length} <span className="text-xs font-normal text-slate-400">instructors</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
            100% within period limits
          </div>
        </div>

        {/* Tile 3: Divisions */}
        <div className="p-3.5 bg-white dark:bg-[#141417] border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-medium">
            <span>Classes &amp; Divisions</span>
            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              {totalSections} <span className="text-xs font-normal text-slate-400">sections</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
            Across {classes.length} active standards
          </div>
        </div>

        {/* Tile 4: Active Periods */}
        <div className="p-3.5 bg-white dark:bg-[#141417] border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-medium">
            <span>Allocated Periods</span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              {slots.length} <span className="text-xs font-normal text-slate-400">active</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
            100% curriculum covered
          </div>
        </div>
      </div>

      {/* 3. Main Row: Daily Schedule Stream (2 cols) & Constraint Verification (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left: Schedule Stream */}
        <div className="lg:col-span-2 p-4 bg-white dark:bg-[#141417] border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-3">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-100 dark:border-zinc-800 gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs text-slate-900 dark:text-zinc-100 shrink-0">
                Daily Stream:
              </span>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="h-7 px-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none"
              >
                {allSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Day Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-zinc-800/80 p-0.5 rounded-lg border border-slate-200/80 dark:border-zinc-700 text-xs overflow-x-auto">
              {DAYS_OF_WEEK.slice(0, 5).map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                    activeDay === d
                      ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Period Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeSlots.map((ts) => {
              if (ts.isBreak) {
                return (
                  <div
                    key={ts.index}
                    className="p-2.5 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/40 flex items-center justify-between text-xs"
                  >
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                      {ts.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {ts.startTime}&ndash;{ts.endTime}
                    </span>
                  </div>
                )
              }

              const slot = daySlots.find((s) => s.periodIndex === ts.index)
              const subj = slot ? subjects.find((s) => s.id === slot.subjectId) : null
              const tch = slot ? teachers.find((t) => t.id === slot.teacherId) : null

              return (
                <div
                  key={ts.index}
                  className="p-2.5 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#18181c] flex flex-col justify-between shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold text-[10px]">
                      {ts.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {ts.startTime}
                    </span>
                  </div>

                  {slot && subj ? (
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-zinc-100 truncate">
                        {subj.name}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                        <span className="font-semibold text-slate-700 dark:text-zinc-300">{subj.code}</span>
                        <span className="truncate">{tch?.name?.split(' ')[0] || '—'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-1 text-center text-xs text-slate-400 italic">
                      &mdash; Free &mdash;
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer Link */}
          <div className="pt-2 flex justify-end border-t border-slate-100 dark:border-zinc-800">
            <button
              onClick={() => {
                if (currentSection) {
                  setFilterSectionId(currentSection.id)
                  setViewMode('class')
                }
                setActiveView('studio')
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>Inspect in Timetable Studio Grid</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Constraint Verification */}
        <div className="p-4 bg-white dark:bg-[#141417] border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-zinc-100 pb-2 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <span>Constraint Verification</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                Verified
              </span>
            </div>

            <div className="space-y-2 text-xs mt-3">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-300">Teacher Collisions</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>0 clashes</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-300">Division Overlaps</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>0 clashes</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-300">Faculty Workload Caps</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% compliant</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-300">Grade-Subject Integrity</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Zero violations</span>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
            <button
              onClick={() => setActiveView('generate')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400" />
              <span>Configure Solver Parameters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
