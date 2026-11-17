import React, { useState, useMemo } from 'react'
import {
  Grid,
  Users,
  GraduationCap,
  Calendar,
  Printer,
  Download,
  Search,
  Play,
  AlertTriangle,
  UserCheck,
  Clock,
  CheckCircle2,
  HelpCircle,
  Eye,
} from 'lucide-react'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useTimetableStore } from '../../store/useTimetableStore'
import { useTimeStore } from '../../store/useTimeStore'
import { useSubstitutionStore } from '../../store/useSubstitutionStore'
import { useAppStore } from '../../store/useAppStore'
import { DayOfWeek } from '../../lib/types'
import { DAYS_OF_WEEK } from '../../lib/constants'
import { ConstraintSolver } from '../../lib/solverEngine'
import { StorageEngine } from '../../lib/storage'

export const MasterTimetableMatrixView: React.FC = () => {
  const { classes, teachers, subjects, institution } = useAcademicStore()
  const { slots, activeVersionId } = useTimetableStore()
  const { timeSlots } = useTimeStore()
  const { absentTeacherIds, substitutions } = useSubstitutionStore()
  const { addNotification, setActiveView } = useAppStore()

  const workingDays = institution?.workingDays?.length
    ? institution.workingDays
    : DAYS_OF_WEEK.slice(0, 5)

  // Navigation & Filter States
  const [matrixMode, setMatrixMode] = useState<'division' | 'faculty'>('division')
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(workingDays[0] || 'Monday')
  const [searchQuery, setSearchQuery] = useState('')
  const [inspectPeriod, setInspectPeriod] = useState<number | null>(null)

  const allSections = useMemo(() => {
    return classes.flatMap((c) => c.sections)
  }, [classes])

  // Filtered lists
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return allSections
    const q = searchQuery.toLowerCase()
    return allSections.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        classes.find((c) => c.id === s.classId)?.name.toLowerCase().includes(q)
    )
  }, [allSections, classes, searchQuery])

  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return teachers
    const q = searchQuery.toLowerCase()
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.employeeCode.toLowerCase().includes(q) ||
        t.designation?.toLowerCase().includes(q)
    )
  }, [teachers, searchQuery])

  // Map slots for quick lookup: key = `${day}-${periodIndex}-${sectionId}` or `${day}-${periodIndex}-${teacherId}`
  const slotsMap = useMemo(() => {
    const secMap = new Map<string, typeof slots[0]>()
    const tchMap = new Map<string, typeof slots[0]>()
    const teacherDoubleBookings = new Set<string>()

    // Check teacher clashes
    const teacherSlotCount: Record<string, number> = {}

    slots.forEach((s) => {
      secMap.set(`${s.day}-${s.periodIndex}-${s.sectionId}`, s)
      tchMap.set(`${s.day}-${s.periodIndex}-${s.teacherId}`, s)

      const key = `${s.day}-${s.periodIndex}-${s.teacherId}`
      teacherSlotCount[key] = (teacherSlotCount[key] || 0) + 1
      if (teacherSlotCount[key] > 1) {
        teacherDoubleBookings.add(key)
      }
    })

    return { secMap, tchMap, teacherDoubleBookings }
  }, [slots])

  // Free Teachers Inspector for any period
  const periodOccupancy = useMemo(() => {
    if (inspectPeriod === null) return null

    const teachingTeacherIds = new Set<string>()
    slots
      .filter((s) => s.day === selectedDay && s.periodIndex === inspectPeriod)
      .forEach((s) => teachingTeacherIds.add(s.teacherId))

    const teachingList = teachers.filter((t) => teachingTeacherIds.has(t.id))
    const freeList = teachers.filter((t) => !teachingTeacherIds.has(t.id))

    return { teachingList, freeList }
  }, [inspectPeriod, slots, selectedDay, teachers])

  // Quick Auto-Fill
  const handleAutoFill = () => {
    const solver = new ConstraintSolver(classes, subjects, teachers, timeSlots)
    const result = solver.solve(slots, {
      balanceWeight: 80,
      maxConsecutiveLimit: 3,
      morningCoreBias: true,
      preserveLocks: true,
    })

    useTimetableStore.setState({ slots: result.slots })
    StorageEngine.saveSlots(activeVersionId, result.slots)

    addNotification({
      title: 'Master Schedule Balanced',
      message: `Generated feasible schedule across all divisions with ${result.slots.length} lectures populated.`,
      type: 'success',
    })
  }

  // Export Matrix to CSV
  const handleExportCSV = () => {
    let csv = ''
    if (matrixMode === 'division') {
      csv = `Master Division Schedule - ${selectedDay}\n`
      csv += `Division,Class Mentor,${timeSlots.map((ts) => `"${ts.label} (${ts.startTime}-${ts.endTime})"`).join(',')}\n`

      filteredSections.forEach((sec) => {
        const mentor = teachers.find((t) => t.id === sec.classTeacherId)?.name || '—'
        const rowCells = timeSlots.map((ts) => {
          if (ts.isBreak) return `"${ts.label}"`
          const slot = slotsMap.secMap.get(`${selectedDay}-${ts.index}-${sec.id}`)
          if (!slot) return '"—"'
          const sub = subjects.find((s) => s.id === slot.subjectId)
          const tch = teachers.find((t) => t.id === slot.teacherId)
          return `"${sub?.name || '—'} (${tch?.name || '—'})"`
        })
        csv += `"${sec.fullName}","${mentor}",${rowCells.join(',')}\n`
      })
    } else {
      csv = `Master Faculty Schedule - ${selectedDay}\n`
      csv += `Faculty Name,Code,Department,${timeSlots.map((ts) => `"${ts.label} (${ts.startTime}-${ts.endTime})"`).join(',')}\n`

      filteredTeachers.forEach((tch) => {
        const rowCells = timeSlots.map((ts) => {
          if (ts.isBreak) return `"${ts.label}"`
          const slot = slotsMap.tchMap.get(`${selectedDay}-${ts.index}-${tch.id}`)
          if (!slot) return '"FREE / PREP"'
          const sub = subjects.find((s) => s.id === slot.subjectId)
          const sec = allSections.find((s) => s.id === slot.sectionId)
          return `"${sec?.fullName || '—'}: ${sub?.code || '—'}"`
        })
        csv += `"${tch.name}","${tch.employeeCode}","${tch.designation || 'Faculty'}",${rowCells.join(',')}\n`
      })
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Master_Schedule_${matrixMode}_${selectedDay}.csv`
    a.click()
    URL.revokeObjectURL(url)

    addNotification({
      title: 'Master CSV Exported',
      message: `Downloaded ${selectedDay} master matrix.`,
      type: 'success',
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in text-xs">
      {/* 1. Header Toolbar (no-print) */}
      <div className="no-print bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shadow-2xs">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-extrabold text-slate-900 dark:text-zinc-100">
                  Master Timetable Matrix
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  Live School-Wide Overview
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Consolidated matrix displaying all {allSections.length} divisions and {teachers.length} faculty simultaneously.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAutoFill}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl font-semibold transition-all active:scale-95 shadow-2xs"
              title="Run constraint solver across all empty slots"
            >
              <Play className="w-3.5 h-3.5 text-white dark:text-zinc-900" />
              <span>Fill Empty Slots</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl font-bold transition-all active:scale-95 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl font-bold transition-all active:scale-95 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Matrix</span>
            </button>
          </div>
        </div>

        {/* 2. Mode Selector & Day Tabs Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
          {/* Left: Mode Toggle */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-slate-100 dark:bg-zinc-800 p-0.5 rounded-xl border border-slate-200 dark:border-zinc-700">
              <button
                onClick={() => setMatrixMode('division')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  matrixMode === 'division'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-2xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Division Matrix ({allSections.length})</span>
              </button>
              <button
                onClick={() => setMatrixMode('faculty')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  matrixMode === 'faculty'
                    ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-2xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Faculty Matrix ({teachers.length})</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  matrixMode === 'division' ? 'Filter division...' : 'Filter teacher...'
                }
                className="h-7 pl-7 pr-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none w-36 focus:w-48 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>

          {/* Right: Working Day Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 lg:pb-0">
            {workingDays.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1 rounded-xl font-bold text-xs transition-all ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. PRINTABLE INSTITUTIONAL PREVIEW SHEET */}
      <div className="print-area bg-white text-black rounded-2xl border border-slate-200 dark:border-zinc-800/80 shadow-2xs overflow-hidden">
        {/* Printable Institutional Header */}
        <div className="p-4 border-b border-black text-center bg-white space-y-0.5">
          <div className="text-base sm:text-lg font-black uppercase tracking-wide">
            {institution.name || 'Oakridge International Academy'}
          </div>
          <div className="text-[10.5px] font-semibold text-slate-800">
            Master Institutional Schedule &bull; {matrixMode === 'division' ? 'Class-by-Class Matrix' : 'Faculty Deployment Matrix'} &bull; {selectedDay}
          </div>
          <div className="text-[9px] text-slate-600">
            Academic Session {institution.academicYear || '2026-2027'} &bull; Generated from Smart Timetable Studio
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-center" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="bg-slate-200 text-black font-extrabold">
                {/* Fixed Label Column: 14% */}
                <th
                  className="p-1.5 border border-black text-center text-[10px] uppercase tracking-wider"
                  style={{ width: '14%' }}
                >
                  {matrixMode === 'division' ? 'Division / Cohort' : 'Faculty Member'}
                </th>

                {/* Period Headers */}
                {timeSlots.map((ts) => {
                  const isBreak = ts.isBreak
                  const colWidth = isBreak ? '5%' : `${(86 - 5 * timeSlots.filter((t) => t.isBreak).length) / timeSlots.filter((t) => !t.isBreak).length}%`

                  return (
                    <th
                      key={ts.index}
                      onClick={() => !isBreak && setInspectPeriod(inspectPeriod === ts.index ? null : ts.index)}
                      className={`p-1.5 border border-black text-center cursor-pointer transition-colors ${
                        isBreak
                          ? 'bg-slate-300 font-bold'
                          : inspectPeriod === ts.index
                          ? 'bg-blue-100 text-blue-900 font-black ring-2 ring-blue-500'
                          : 'hover:bg-slate-300/80'
                      }`}
                      style={{ width: colWidth }}
                      title={!isBreak ? `Click to inspect Period ${ts.index} availability` : undefined}
                    >
                      <div className="text-[10px] font-bold leading-tight">{ts.label}</div>
                      <div className="text-[8px] font-mono font-normal text-slate-700 whitespace-nowrap mt-0.5">
                        {ts.startTime}&ndash;{ts.endTime}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody>
              {matrixMode === 'division' ? (
                /* ======================================================== */
                /* DIVISION-WISE ROWS                                        */
                /* ======================================================== */
                filteredSections.map((sec) => {
                  const mentor = teachers.find((t) => t.id === sec.classTeacherId)

                  return (
                    <tr key={sec.id} className="border-b border-black hover:bg-slate-50/50">
                      {/* Division Name & Mentor */}
                      <td className="p-1.5 border border-black font-bold text-[10px] bg-slate-100 text-left pl-2.5">
                        <div className="font-extrabold text-black leading-tight">{sec.fullName}</div>
                        <div className="text-[8.5px] text-slate-600 font-medium leading-none mt-0.5 truncate">
                          Mentor: {mentor ? mentor.name.split(' ')[0] : '—'}
                        </div>
                      </td>

                      {/* Period Cells */}
                      {timeSlots.map((ts) => {
                        if (ts.isBreak) {
                          return (
                            <td
                              key={ts.index}
                              className="border border-black bg-slate-200 text-center p-0.5 align-middle select-none text-[8px] font-bold text-slate-600"
                            >
                              BREAK
                            </td>
                          )
                        }

                        const slot = slotsMap.secMap.get(`${selectedDay}-${ts.index}-${sec.id}`)
                        const subj = slot ? subjects.find((s) => s.id === slot.subjectId) : null
                        const tch = slot ? teachers.find((t) => t.id === slot.teacherId) : null
                        const hasDoubleBooking = tch && slotsMap.teacherDoubleBookings.has(`${selectedDay}-${ts.index}-${tch.id}`)
                        const isSubstituted = substitutions.some(
                          (sub) => sub.day === selectedDay && sub.periodIndex === ts.index && sub.sectionId === sec.id
                        )

                        return (
                          <td
                            key={ts.index}
                            className={`p-1 border border-black text-center h-10 align-middle ${
                              hasDoubleBooking
                                ? 'bg-red-50 text-red-900'
                                : isSubstituted
                                ? 'bg-amber-50 text-amber-900'
                                : 'bg-white'
                            }`}
                          >
                            {slot && subj ? (
                              <div className="flex flex-col justify-center items-center space-y-0.5 leading-tight">
                                <div className="font-extrabold text-[9.5px] text-black line-clamp-1">
                                  {subj.code} &bull; {subj.name}
                                </div>
                                <div className="text-[8px] text-slate-700 font-medium line-clamp-1">
                                  {tch?.name || '—'}
                                </div>
                                {hasDoubleBooking && (
                                  <span className="text-[7.5px] font-bold text-red-600 bg-red-100 px-1 rounded-sm uppercase">
                                    Double-Booked
                                  </span>
                                )}
                                {isSubstituted && (
                                  <span className="text-[7.5px] font-bold text-amber-700 bg-amber-100 px-1 rounded-sm uppercase">
                                    Relief
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-slate-300 font-light text-xs">&mdash;</div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              ) : (
                /* ======================================================== */
                /* FACULTY-WISE ROWS                                         */
                /* ======================================================== */
                filteredTeachers.map((tch) => {
                  const isAbsent = absentTeacherIds.includes(tch.id)
                  const todayLoad = slots.filter(
                    (s) => s.day === selectedDay && s.teacherId === tch.id
                  ).length

                  return (
                    <tr
                      key={tch.id}
                      className={`border-b border-black hover:bg-slate-50/50 ${
                        isAbsent ? 'bg-red-50/60' : ''
                      }`}
                    >
                      {/* Teacher Name & Dept */}
                      <td className="p-1.5 border border-black font-bold text-[10px] bg-slate-100 text-left pl-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-black leading-tight truncate">
                            {tch.name}
                          </span>
                          <span className="text-[8px] font-mono text-slate-500 font-normal ml-1">
                            {tch.employeeCode}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[8px] text-slate-600 font-medium leading-none mt-0.5">
                          <span className="truncate">{tch.designation || 'Faculty'}</span>
                          <span className="font-bold text-slate-800">{todayLoad} periods</span>
                        </div>
                      </td>

                      {/* Period Cells */}
                      {timeSlots.map((ts) => {
                        if (ts.isBreak) {
                          return (
                            <td
                              key={ts.index}
                              className="border border-black bg-slate-200 text-center p-0.5 align-middle select-none text-[8px] font-bold text-slate-600"
                            >
                              BREAK
                            </td>
                          )
                        }

                        const slot = slotsMap.tchMap.get(`${selectedDay}-${ts.index}-${tch.id}`)
                        const subj = slot ? subjects.find((s) => s.id === slot.subjectId) : null
                        const sec = slot ? allSections.find((s) => s.id === slot.sectionId) : null
                        const hasDoubleBooking = slotsMap.teacherDoubleBookings.has(`${selectedDay}-${ts.index}-${tch.id}`)

                        return (
                          <td
                            key={ts.index}
                            className={`p-1 border border-black text-center h-10 align-middle ${
                              hasDoubleBooking
                                ? 'bg-red-100 text-red-900'
                                : slot
                                ? 'bg-white'
                                : 'bg-slate-50/80 text-slate-400'
                            }`}
                          >
                            {slot && subj && sec ? (
                              <div className="flex flex-col justify-center items-center space-y-0.5 leading-tight">
                                <div className="font-black text-[9.5px] text-blue-900 line-clamp-1">
                                  {sec.fullName}
                                </div>
                                <div className="text-[8px] text-slate-800 font-semibold line-clamp-1">
                                  {subj.code} &ndash; {subj.name}
                                </div>
                                {hasDoubleBooking && (
                                  <span className="text-[7.5px] font-bold text-red-600 bg-red-200 px-1 rounded-sm uppercase">
                                    Clash
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-[8.5px] font-medium text-emerald-700 bg-emerald-50/60 rounded px-1 py-0.5 inline-block">
                                Free
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Official 4-Column Signatures Row (Print-Ready) */}
        <div className="grid grid-cols-4 border-t border-black bg-slate-50 text-center p-2.5 text-[9.5px]">
          <div>
            <div className="h-6 border-b border-dashed border-slate-400 mb-1"></div>
            <span className="font-bold uppercase text-slate-800">Academic In-Charge</span>
          </div>
          <div>
            <div className="h-6 border-b border-dashed border-slate-400 mb-1"></div>
            <span className="font-bold uppercase text-slate-800">Timetable Committee</span>
          </div>
          <div>
            <div className="h-6 border-b border-dashed border-slate-400 mb-1"></div>
            <span className="font-bold uppercase text-slate-800">Dean / Vice-Principal</span>
          </div>
          <div>
            <div className="h-6 border-b border-dashed border-slate-400 mb-1"></div>
            <span className="font-bold uppercase text-slate-800">Principal / Head of School</span>
          </div>
        </div>
      </div>

      {/* 4. Live Period Inspection Tray (no-print) */}
      {inspectPeriod !== null && periodOccupancy && (
        <div className="no-print bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 shadow-sm space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                Period {inspectPeriod} Faculty Spotlight ({selectedDay})
              </h2>
            </div>
            <button
              onClick={() => setInspectPeriod(null)}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 font-semibold"
            >
              Close Tray &times;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Available / Free Teachers */}
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Free / Available Faculty ({periodOccupancy.freeList.length})</span>
                </div>
                <span className="text-[10px] font-normal">Ready for relief or prep</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {periodOccupancy.freeList.map((t) => (
                  <span
                    key={t.id}
                    className="px-2 py-0.5 bg-white dark:bg-zinc-800 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-900 dark:text-emerald-200 font-medium text-[11px]"
                  >
                    {t.name} ({t.employeeCode})
                  </span>
                ))}
                {periodOccupancy.freeList.length === 0 && (
                  <span className="text-slate-400 italic">No free faculty in this period.</span>
                )}
              </div>
            </div>

            {/* Occupied Teachers */}
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-slate-800 dark:text-zinc-300 font-bold text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Teaching Faculty ({periodOccupancy.teachingList.length})</span>
                </div>
                <span className="text-[10px] font-normal text-slate-500">Currently in lecture</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {periodOccupancy.teachingList.map((t) => {
                  const slot = slots.find(
                    (s) => s.day === selectedDay && s.periodIndex === inspectPeriod && s.teacherId === t.id
                  )
                  const sec = allSections.find((s) => s.id === slot?.sectionId)

                  return (
                    <span
                      key={t.id}
                      className="px-2 py-0.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-700 dark:text-zinc-300 font-medium text-[11px]"
                    >
                      {t.name} &rarr; <strong className="text-black dark:text-white">{sec?.fullName || '—'}</strong>
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
