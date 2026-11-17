import React, { useState, useMemo } from 'react'
import {
  UserCheck,
  UserX,
  Calendar,
  Clock,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Search,
  BookOpen,
} from 'lucide-react'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useTimetableStore } from '../../store/useTimetableStore'
import { useTimeStore } from '../../store/useTimeStore'
import { useSubstitutionStore } from '../../store/useSubstitutionStore'
import { useAppStore } from '../../store/useAppStore'
import { DAYS_OF_WEEK } from '../../lib/constants'
import { DayOfWeek } from '../../lib/types'

const LEAVE_REASONS = [
  'Sick / Medical Leave',
  'Casual / Personal Leave',
  'Official Institutional Duty',
  'Examination Invigilation',
  'Academic Conference',
]

export const SubstitutionsView: React.FC = () => {
  const { teachers, subjects, classes, institution } = useAcademicStore()
  const { slots } = useTimetableStore()
  const { timeSlots } = useTimeStore()
  const { addNotification } = useAppStore()

  const {
    activeDay,
    setActiveDay,
    absentTeacherIds,
    absentReasons,
    substitutions,
    markTeacherAbsent,
    markTeacherPresent,
    assignSubstitute,
    removeSubstitute,
  } = useSubstitutionStore()

  const [searchTeacher, setSearchTeacher] = useState('')
  const [selectedReason, setSelectedReason] = useState(LEAVE_REASONS[0])
  const [selectedSlotForSubstitute, setSelectedSlotForSubstitute] = useState<string | null>(null)

  const allSections = classes.flatMap((c) => c.sections)
  const workingDays = institution?.workingDays?.length ? institution.workingDays : DAYS_OF_WEEK.slice(0, 5)

  // Slots scheduled for today
  const todaySlots = useMemo(() => {
    return slots.filter((s) => s.day === activeDay)
  }, [slots, activeDay])

  // Slots affected by absent teachers
  const affectedSlots = useMemo(() => {
    return todaySlots.filter((s) => absentTeacherIds.includes(s.teacherId))
  }, [todaySlots, absentTeacherIds])

  // Map of substitutions by slotId
  const substitutionBySlot = useMemo(() => {
    const map = new Map<string, (typeof substitutions)[0]>()
    substitutions.forEach((sub) => {
      if (sub.day === activeDay) {
        map.set(sub.slotId, sub)
      }
    })
    return map
  }, [substitutions, activeDay])

  // Stats
  const coveredCount = affectedSlots.filter((s) => substitutionBySlot.has(s.id)).length
  const uncoveredCount = affectedSlots.length - coveredCount

  // Filtered teachers list for absence panel
  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(searchTeacher.toLowerCase()) ||
        t.employeeCode.toLowerCase().includes(searchTeacher.toLowerCase())
    )
  }, [teachers, searchTeacher])

  // Compute availability and workload for all candidates for a specific period
  const getCandidateRecommendations = (slot: (typeof slots)[0]) => {
    const targetSubject = subjects.find((s) => s.id === slot.subjectId)

    return teachers
      .filter((t) => !absentTeacherIds.includes(t.id) && t.id !== slot.teacherId)
      .map((teacher) => {
        // Check if teacher is busy in this period
        const isBusy = todaySlots.some(
          (s) => s.periodIndex === slot.periodIndex && (s.teacherId === teacher.id || substitutionBySlot.get(s.id)?.substituteTeacherId === teacher.id)
        )

        // Count how many periods teacher has today
        const regularPeriodsCount = todaySlots.filter((s) => s.teacherId === teacher.id).length
        const substitutedPeriodsCount = Array.from(substitutionBySlot.values()).filter(
          (sub) => sub.substituteTeacherId === teacher.id
        ).length
        const totalPeriodsToday = regularPeriodsCount + substitutedPeriodsCount

        // Check if qualified for this subject
        const isQualified = targetSubject ? teacher.qualifiedSubjectIds.includes(targetSubject.id) : false

        return {
          teacher,
          isBusy,
          isQualified,
          totalPeriodsToday,
          maxPeriods: teacher.maxPeriodsPerDay || 4,
          score: (isQualified ? 10 : 0) - (isBusy ? 100 : 0) - totalPeriodsToday,
        }
      })
      .sort((a, b) => b.score - a.score)
  }

  const handlePrintCircular = () => {
    window.print()
  }

  return (
    <div className="p-5 max-w-6xl mx-auto space-y-4 select-none text-xs print-area-wrapper">
      {/* Dynamic Print Styles for Daily Relief Circular */}
      <style>{`
        @media print {
          @page {
            size: portrait;
            margin: 8mm 10mm;
          }
          aside, header, nav, .no-print {
            display: none !important;
          }
          .circular-sheet {
            display: block !important;
            width: 100% !important;
          }
        }
      `}</style>

      {/* Header Bar (no-print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-1">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
              <span>Daily Faculty Substitution &amp; Relief Planner</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold">
                Real-Time Relief Engine
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Log daily teacher leaves and find free qualified substitutes with zero timetable disruption
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Working Day Selector */}
          <div className="flex items-center bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-0.5 shadow-2xs">
            {workingDays.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  activeDay === day
                    ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrintCircular}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl font-semibold shadow-2xs transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Daily Notice</span>
          </button>
        </div>
      </div>

      {/* Metrics Bento Bar (no-print) */}
      <div className="no-print grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs">
          <div className="text-[11px] text-slate-500 font-medium">Faculty On Leave Today</div>
          <div className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-0.5 flex items-baseline space-x-1">
            <span>{absentTeacherIds.length}</span>
            <span className="text-xs font-normal text-slate-400">/ {teachers.length} faculty</span>
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs">
          <div className="text-[11px] text-slate-500 font-medium">Affected Class Lectures</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
            {affectedSlots.length}
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs">
          <div className="text-[11px] text-slate-500 font-medium">Substitutes Assigned</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-baseline space-x-1">
            <span>{coveredCount}</span>
            <span className="text-xs font-normal text-slate-400">
              ({affectedSlots.length ? Math.round((coveredCount / affectedSlots.length) * 100) : 100}%)
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs">
          <div className="text-[11px] text-slate-500 font-medium">Uncovered Gaps</div>
          <div
            className={`text-xl font-bold mt-0.5 ${
              uncoveredCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'
            }`}
          >
            {uncoveredCount}
          </div>
        </div>
      </div>

      {/* Main Workspace: 2-Column Bento (no-print) */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Left Column: Faculty Absence Logger (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
            <span className="font-bold text-slate-900 dark:text-zinc-100">Faculty Leave Logger</span>
            <span className="text-[10px] text-slate-400 font-mono">{activeDay} Roster</span>
          </div>

          {/* Quick Leave Reason Selector */}
          <div>
            <label className="block text-slate-500 text-[10px] font-semibold mb-1">
              Select Leave Reason:
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-medium text-slate-800 dark:text-zinc-200 focus:outline-none text-xs"
            >
              {LEAVE_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Search Faculty */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search faculty name or code..."
              value={searchTeacher}
              onChange={(e) => setSearchTeacher(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
            />
          </div>

          {/* Teacher Roster List */}
          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredTeachers.map((teacher) => {
              const isAbsent = absentTeacherIds.includes(teacher.id)
              const reason = absentReasons[teacher.id]
              const lecturesToday = todaySlots.filter((s) => s.teacherId === teacher.id).length

              return (
                <div
                  key={teacher.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    isAbsent
                      ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                      : 'bg-white dark:bg-zinc-800/60 border-slate-200/70 dark:border-zinc-800 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-zinc-100 flex items-center space-x-1.5">
                      <span>{teacher.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">
                        ({teacher.employeeCode})
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {isAbsent ? (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">
                          On Leave &bull; {reason}
                        </span>
                      ) : (
                        <span>{lecturesToday} periods scheduled today</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (isAbsent) {
                        markTeacherPresent(teacher.id)
                        addNotification({
                          title: 'Marked Present',
                          message: `${teacher.name} marked present.`,
                          type: 'info',
                        })
                      } else {
                        markTeacherAbsent(teacher.id, selectedReason)
                        addNotification({
                          title: 'Leave Logged',
                          message: `${teacher.name} marked on leave. Relieving candidates calculated.`,
                          type: 'warning',
                        })
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${
                      isAbsent
                        ? 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border border-slate-200 hover:bg-slate-100'
                        : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                  >
                    {isAbsent ? 'Mark Present' : 'Mark Leave'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Affected Lectures & Candidate Matcher (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <span className="font-bold text-slate-900 dark:text-zinc-100">
                Affected Lectures on {activeDay}
              </span>
              <span className="text-[10px] text-slate-400 ml-2">
                Click any slot to review and assign qualified substitute teachers
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold">
              {affectedSlots.length} Slots Requiring Relief
            </span>
          </div>

          {affectedSlots.length === 0 ? (
            <div className="p-10 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="font-bold text-slate-800 dark:text-zinc-200 text-sm">
                Full Faculty Attendance on {activeDay}
              </div>
              <p className="text-slate-400 text-[11px] max-w-sm mx-auto">
                No faculty members are marked on leave for {activeDay}. All class lectures are operating according to the official timetable schedule.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {affectedSlots.map((slot) => {
                const section = allSections.find((s) => s.id === slot.sectionId)
                const subject = subjects.find((s) => s.id === slot.subjectId)
                const originalTeacher = teachers.find((t) => t.id === slot.teacherId)
                const timeSlot = timeSlots.find((ts) => ts.index === slot.periodIndex)
                const activeSub = substitutionBySlot.get(slot.id)
                const substituteTeacher = activeSub
                  ? teachers.find((t) => t.id === activeSub.substituteTeacherId)
                  : null

                const isSelected = selectedSlotForSubstitute === slot.id
                const candidates = getCandidateRecommendations(slot)

                return (
                  <div
                    key={slot.id}
                    className={`rounded-2xl border transition-all ${
                      activeSub
                        ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                        : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10'
                    }`}
                  >
                    {/* Slot Header Row */}
                    <div className="p-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                            activeSub
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          P{slot.periodIndex}
                        </div>

                        <div>
                          <div className="font-bold text-slate-900 dark:text-zinc-100 text-xs">
                            {section?.fullName} &bull; {subject?.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {timeSlot?.startTime} &ndash; {timeSlot?.endTime} &bull; Original:{' '}
                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                              {originalTeacher?.name} (On Leave)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status / Toggle Candidates */}
                      <div className="flex items-center space-x-2">
                        {activeSub ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Relieved by {substituteTeacher?.name}</span>
                            </span>
                            <button
                              onClick={() => removeSubstitute(activeSub.id)}
                              className="text-[10px] text-slate-400 hover:text-rose-600 underline font-medium"
                            >
                              Change
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              setSelectedSlotForSubstitute(isSelected ? null : slot.id)
                            }
                            className="flex items-center space-x-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[11px] shadow-2xs transition-all active:scale-95"
                          >
                            <span>Find Substitute</span>
                            <ChevronRight
                              className={`w-3 h-3 transition-transform ${
                                isSelected ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Candidate Recommendations Expansion */}
                    {isSelected && !activeSub && (
                      <div className="p-3 bg-white dark:bg-zinc-900/90 rounded-b-2xl space-y-2 border-t border-slate-100 dark:border-zinc-800">
                        <div className="text-[10px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                          <span>Recommended Free Faculty for Period {slot.periodIndex}</span>
                          <span>Ranked by Subject Qualification &amp; Daily Workload</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {candidates.slice(0, 6).map(({ teacher, isBusy, isQualified, totalPeriodsToday, maxPeriods }) => (
                            <div
                              key={teacher.id}
                              className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                                isBusy
                                  ? 'bg-slate-50 dark:bg-zinc-800/30 border-slate-200 dark:border-zinc-800 opacity-50 select-none'
                                  : isQualified
                                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400'
                                  : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:border-slate-400'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="font-bold text-slate-900 dark:text-zinc-100 flex items-center space-x-1.5">
                                  <span>{teacher.name}</span>
                                  {isQualified && (
                                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-[9px] rounded font-bold">
                                      ★ Qualified
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {isBusy ? (
                                    <span className="text-rose-500 font-medium">Busy teaching another class</span>
                                  ) : (
                                    <span>
                                      Free &bull; {totalPeriodsToday}/{maxPeriods} periods today
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                disabled={isBusy}
                                onClick={() => {
                                  assignSubstitute(
                                    slot.id,
                                    teacher.id,
                                    slot.teacherId,
                                    slot.periodIndex,
                                    slot.sectionId,
                                    slot.subjectId,
                                    'Daily Relief Assignment'
                                  )
                                  setSelectedSlotForSubstitute(null)
                                  addNotification({
                                    title: 'Substitute Assigned',
                                    message: `${teacher.name} assigned to ${section?.fullName} (Period ${slot.periodIndex}).`,
                                    type: 'success',
                                  })
                                }}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${
                                  isBusy
                                    ? 'bg-slate-200 dark:bg-zinc-700 text-slate-400 cursor-not-allowed'
                                    : isQualified
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                                    : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900'
                                }`}
                              >
                                Assign
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* PRINT-ONLY DAILY FACULTY RELIEF CIRCULAR (For Notice Board)     */}
      {/* ============================================================== */}
      <div className="hidden print:block circular-sheet bg-white text-black p-6 space-y-4">
        {/* Institutional Header */}
        <div className="text-center pb-2 border-b-2 border-black space-y-1">
          <div className="text-xl font-black uppercase tracking-wider">
            {institution.name || 'Oakridge International Academy'}
          </div>
          <div className="text-xs font-semibold uppercase">
            Daily Faculty Substitution &amp; Relief Circular &bull; {activeDay}
          </div>
          <div className="text-[10px] font-mono text-slate-600">
            Date of Issue: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Absent Teachers Summary */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
            1. Faculty Members On Leave Today ({absentTeacherIds.length})
          </div>
          <div className="border border-black p-2 text-xs grid grid-cols-2 gap-2">
            {absentTeacherIds.map((id) => {
              const teacher = teachers.find((t) => t.id === id)
              return (
                <div key={id} className="flex items-center space-x-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                  <span>{teacher?.name} ({teacher?.employeeCode}) &ndash; {absentReasons[id] || 'Leave'}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Substitution Allocations Table */}
        <div className="space-y-1 pt-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
            2. Daily Lecture Substitutions &amp; Period Relief Schedule
          </div>

          <table className="w-full border-collapse border border-black text-left text-xs" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-black">
                <th className="p-1.5 border border-black w-14 text-center">Period</th>
                <th className="p-1.5 border border-black w-24">Timing</th>
                <th className="p-1.5 border border-black w-28">Class / Cohort</th>
                <th className="p-1.5 border border-black">Subject</th>
                <th className="p-1.5 border border-black">Regular Faculty</th>
                <th className="p-1.5 border border-black font-extrabold bg-slate-200">Substitute Faculty</th>
              </tr>
            </thead>
            <tbody>
              {affectedSlots.map((slot) => {
                const section = allSections.find((s) => s.id === slot.sectionId)
                const subject = subjects.find((s) => s.id === slot.subjectId)
                const originalTeacher = teachers.find((t) => t.id === slot.teacherId)
                const timeSlot = timeSlots.find((ts) => ts.index === slot.periodIndex)
                const activeSub = substitutionBySlot.get(slot.id)
                const substituteTeacher = activeSub ? teachers.find((t) => t.id === activeSub.substituteTeacherId) : null

                return (
                  <tr key={slot.id} className="border-b border-black">
                    <td className="p-1.5 border border-black font-bold text-center">P{slot.periodIndex}</td>
                    <td className="p-1.5 border border-black font-mono text-[10px]">{timeSlot?.startTime}&ndash;{timeSlot?.endTime}</td>
                    <td className="p-1.5 border border-black font-bold">{section?.fullName}</td>
                    <td className="p-1.5 border border-black">{subject?.name}</td>
                    <td className="p-1.5 border border-black text-slate-700">{originalTeacher?.name}</td>
                    <td className="p-1.5 border border-black font-extrabold bg-slate-50 text-black">
                      {substituteTeacher ? `${substituteTeacher.name} (${substituteTeacher.employeeCode})` : '— UNCOVERED —'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Endorsements */}
        <div className="pt-8 grid grid-cols-3 gap-6 text-center">
          <div className="space-y-1">
            <div className="border-b border-black h-4 w-3/4 mx-auto" />
            <div className="text-[10px] font-bold uppercase">Timetable Coordinator</div>
          </div>
          <div className="space-y-1">
            <div className="border-b border-black h-4 w-3/4 mx-auto" />
            <div className="text-[10px] font-bold uppercase">Staff Secretary</div>
          </div>
          <div className="space-y-1">
            <div className="border-b border-black h-4 w-3/4 mx-auto" />
            <div className="text-[10px] font-bold uppercase">Principal / Head of School</div>
          </div>
        </div>
      </div>
    </div>
  )
}
