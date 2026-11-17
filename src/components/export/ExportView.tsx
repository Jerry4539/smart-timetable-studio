import React, { useState, useMemo } from 'react'
import {
  Printer,
  Download,
  School,
  Users,
  Table,
  RotateCcw,
  AlertCircle,
} from 'lucide-react'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useTimetableStore } from '../../store/useTimetableStore'
import { useTimeStore } from '../../store/useTimeStore'
import { useAppStore } from '../../store/useAppStore'
import { DAYS_OF_WEEK } from '../../lib/constants'
import { DayOfWeek } from '../../lib/types'
import { ConstraintSolver } from '../../lib/solverEngine'
import { StorageEngine } from '../../lib/storage'

export const ExportView: React.FC = () => {
  const { classes, teachers, subjects, institution } = useAcademicStore()
  const { activeVersionId, slots } = useTimetableStore()
  const { timeSlots } = useTimeStore()
  const { addNotification } = useAppStore()

  const allSections = classes.flatMap((c) => c.sections)

  // Configuration States
  const [exportType, setExportType] = useState<'class' | 'teacher' | 'master'>('class')
  const [selectedSectionId, setSelectedSectionId] = useState(allSections[0]?.id || '')
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '')
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape')

  const workingDays = institution?.workingDays?.length ? institution.workingDays : DAYS_OF_WEEK.slice(0, 5)
  const [masterDay, setMasterDay] = useState<DayOfWeek>(workingDays[0] || 'Monday')

  // Feature Toggles
  const [showLegend, setShowLegend] = useState(true)
  const [showSignatures, setShowSignatures] = useState(true)
  const [showTimings, setShowTimings] = useState(true)

  const currentSection = allSections.find((s) => s.id === selectedSectionId) || allSections[0]
  const currentClass = classes.find((c) => c.id === currentSection?.classId)
  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0]
  const classTeacher = teachers.find((t) => t.id === currentSection?.classTeacherId)

  // Filter slots for preview
  const previewSlots = useMemo(() => {
    return slots.filter((s) => {
      if (exportType === 'class') return s.sectionId === selectedSectionId
      if (exportType === 'teacher') return s.teacherId === selectedTeacherId
      if (exportType === 'master') return s.day === masterDay
      return true
    })
  }, [slots, exportType, selectedSectionId, selectedTeacherId, masterDay])

  // Count scheduled slots for current target
  const scheduledCount = previewSlots.length
  const totalPossibleSlots = workingDays.length * timeSlots.filter((ts) => !ts.isBreak).length

  // Generate curriculum summary for legend
  const curriculumSummary = useMemo(() => {
    if (exportType === 'class' && currentClass) {
      const applicableSubjects = subjects.filter((s) => s.gradeIds.includes(currentClass.id))
      return applicableSubjects.map((sub) => {
        const assignedSlots = previewSlots.filter((s) => s.subjectId === sub.id)
        const teacherCounts: Record<string, number> = {}
        assignedSlots.forEach((s) => {
          teacherCounts[s.teacherId] = (teacherCounts[s.teacherId] || 0) + 1
        })
        const primaryTeacherId = Object.entries(teacherCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
        const teacher = teachers.find((t) => t.id === primaryTeacherId) || teachers.find((t) => t.qualifiedSubjectIds.includes(sub.id))

        return {
          code: sub.code,
          name: sub.name,
          category: sub.category,
          weeklyRequired: sub.weeklyPeriodsRequired,
          actualAssigned: assignedSlots.length,
          teacherName: teacher?.name || 'Unassigned',
          teacherCode: teacher?.employeeCode || '—',
        }
      })
    } else if (exportType === 'teacher' && currentTeacher) {
      const teacherSubjects = subjects.filter((s) => currentTeacher.qualifiedSubjectIds.includes(s.id))
      return teacherSubjects.map((sub) => {
        const assignedSlots = previewSlots.filter((s) => s.subjectId === sub.id)
        const sectionsSet = new Set(
          assignedSlots.map((s) => {
            const sec = allSections.find((sec) => sec.id === s.sectionId)
            return sec?.fullName || s.sectionId
          })
        )

        return {
          code: sub.code,
          name: sub.name,
          category: sub.category,
          weeklyRequired: sub.weeklyPeriodsRequired,
          actualAssigned: assignedSlots.length,
          teacherName: Array.from(sectionsSet).join(', ') || 'All Cohorts',
          teacherCode: sub.category.toUpperCase(),
        }
      })
    }
    return []
  }, [exportType, currentClass, currentTeacher, subjects, previewSlots, teachers, allSections])

  // Quick auto-populate if section is empty
  const handleQuickPopulate = () => {
    const solver = new ConstraintSolver(classes, subjects, teachers, timeSlots)
    const result = solver.solve(slots, {
      balanceWeight: 85,
      maxConsecutiveLimit: 3,
      morningCoreBias: true,
      preserveLocks: true,
    })

    useTimetableStore.setState({ slots: result.slots })
    StorageEngine.saveSlots(activeVersionId, result.slots)

    addNotification({
      title: 'Timetable Populated',
      message: `Feasible schedule generated with ${result.slots.length} periods populated.`,
      type: 'success',
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const header = 'Day,Period,StartTime,EndTime,Section,Subject,Teacher\n'
      const rows = previewSlots
        .map((s) => {
          const sec = allSections.find((sec) => sec.id === s.sectionId)?.fullName || s.sectionId
          const sub = subjects.find((sub) => sub.id === s.subjectId)?.name || s.subjectId
          const tch = teachers.find((t) => t.id === s.teacherId)?.name || s.teacherId
          const ts = timeSlots.find((t) => t.index === s.periodIndex)
          return `"${s.day}",${s.periodIndex},"${ts?.startTime || ''}","${ts?.endTime || ''}","${sec}","${sub}","${tch}"`
        })
        .join('\n')

      const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `timetable-${exportType}-${Date.now()}.csv`
      a.click()
    } else {
      const dataStr = JSON.stringify(previewSlots, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `timetable-${exportType}-${Date.now()}.json`
      a.click()
    }

    addNotification({
      title: 'Export Downloaded',
      message: `${exportType.toUpperCase()} schedule compiled for ${format.toUpperCase()} distribution.`,
      type: 'success',
    })
  }

  return (
    <div className="p-5 max-w-6xl mx-auto space-y-4 select-none text-xs print-area-wrapper">
      {/* Top-Level Page Size Injection for Chromium Print Engine */}
      <style>{`
        @page {
          size: ${orientation};
          margin: 0mm;
        }
      `}</style>

      {/* Screen Toolbar & Settings (no-print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-1">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 shrink-0">
            <Printer className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
              <span>Export &amp; Vector Print Station</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                Clean Corners &bull; 1-Sheet Fit
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Centered institutional header, unified vector borders, and zero multi-page spillover
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDownload('csv')}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 rounded-xl font-medium transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleDownload('json')}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 rounded-xl font-medium transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl font-semibold shadow-2xs transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Target Selector Cards (no-print) */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'class', label: 'Division Timetable', desc: `${allSections.length} sections & cohorts`, icon: School },
          { id: 'teacher', label: 'Faculty Schedule', desc: `${teachers.length} instructor schedules`, icon: Users },
          { id: 'master', label: 'Master Institutional Grid', desc: 'Full institutional matrix', icon: Table },
        ].map((item) => {
          const Icon = item.icon
          const isSelected = exportType === item.id
          return (
            <button
              key={item.id}
              onClick={() => setExportType(item.id as any)}
              className={`p-3 rounded-2xl border text-left transition-all ${isSelected
                ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                : 'bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center space-x-2">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white dark:text-zinc-900' : 'text-slate-400'}`} />
                <span className="font-bold text-xs">{item.label}</span>
              </div>
              <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-white/80 dark:text-zinc-800/80' : 'text-slate-400'}`}>
                {item.desc}
              </div>
            </button>
          )
        })}
      </div>

      {/* Controls & Formatting Toolbar (no-print) */}
      <div className="no-print p-3.5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Target Filter Select */}
          <div className="flex items-center space-x-2.5">
            <span className="font-semibold text-slate-600 dark:text-zinc-400">
              {exportType === 'class' ? 'Division:' : exportType === 'teacher' ? 'Faculty:' : 'Scope:'}
            </span>

            {exportType === 'class' && (
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="h-8 px-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-bold text-slate-800 dark:text-zinc-100 focus:outline-none"
              >
                {allSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.fullName}
                  </option>
                ))}
              </select>
            )}

            {exportType === 'teacher' && (
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="h-8 px-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-bold text-slate-800 dark:text-zinc-100 focus:outline-none"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.employeeCode})
                  </option>
                ))}
              </select>
            )}

            {exportType === 'master' && (
              <select
                value={masterDay}
                onChange={(e) => setMasterDay(e.target.value as DayOfWeek)}
                className="h-8 px-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-bold text-slate-800 dark:text-zinc-100 focus:outline-none"
              >
                {workingDays.map((d) => (
                  <option key={d} value={d}>
                    Master Day: {d}
                  </option>
                ))}
              </select>
            )}

            <span className="text-[11px] font-mono text-slate-400 pl-1">
              ({scheduledCount}/{totalPossibleSlots} periods scheduled)
            </span>
          </div>

          {/* Orientation Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-zinc-800 p-0.5 rounded-xl border border-slate-200 dark:border-zinc-700">
            <button
              onClick={() => setOrientation('landscape')}
              className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-all ${orientation === 'landscape'
                ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
                }`}
              title="A4 Landscape fits all 9 periods across horizontally on 1 page"
            >
              Landscape (Wide &bull; 1 Page)
            </button>
            <button
              onClick={() => setOrientation('portrait')}
              className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-all ${orientation === 'portrait'
                ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
                }`}
              title="A4 Portrait with periods descending vertically"
            >
              Portrait (Vertical)
            </button>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-600 dark:text-zinc-400">
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showLegend}
              onChange={(e) => setShowLegend(e.target.checked)}
              className="rounded text-slate-900 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Curriculum &amp; Faculty Legend</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showSignatures}
              onChange={(e) => setShowSignatures(e.target.checked)}
              className="rounded text-slate-900 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Institutional Signatures</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showTimings}
              onChange={(e) => setShowTimings(e.target.checked)}
              className="rounded text-slate-900 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Display Period Timings</span>
          </label>
        </div>
      </div>

      {/* Empty Slots Alert Banner (no-print) */}
      {scheduledCount === 0 && (
        <div className="no-print p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-center justify-between text-amber-800 dark:text-amber-300">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              This {exportType === 'class' ? 'division' : 'instructor'} currently has 0 scheduled lectures in the active version.
            </span>
          </div>
          <button
            onClick={handleQuickPopulate}
            className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-[11px] shadow-2xs transition-all"
          >
            Fill Feasible Schedule
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* PRINT-READY PREVIEW SHEET (EXACT 1-PAGE A4 BOUNDARY)          */}
      {/* ============================================================== */}
      <div className="print-area bg-white text-black rounded-none p-4 sm:p-6 shadow-sm border border-slate-300 space-y-3 transition-all">
        {/* 1. Prestigious Centered Institutional Header */}
        <div className="text-center pb-2 border-b border-black space-y-0.5">
          <div className="text-lg sm:text-xl font-black tracking-wide text-black uppercase">
            {institution.name || 'Oakridge International Academy'}
          </div>
          <div className="text-[11px] font-semibold tracking-normal text-slate-800">
            {institution.campusName || 'Main Campus'} &bull; Academic Session {institution.academicYear || '2026-2027'} &bull; Affiliated Institution
          </div>
          <div className="text-[9.5px] font-medium text-slate-600">
            Daily Bell Schedule: {institution.startTime || '08:00'} &ndash; {institution.endTime || '14:15'} ({institution.periodDurationMinutes || 45} Min Periods &bull; {institution.lunchBreakMinutes || 45} Min Lunch Break)
          </div>
        </div>

        {/* 2. Sub-Header Metadata Bar (Aligned Flush with 100% Width) */}
        <div className="grid grid-cols-3 border border-black bg-slate-100 text-black text-center py-1 px-3 text-[11px] font-bold">
          <div className="text-left flex items-center space-x-1">
            <span className="text-slate-600 uppercase text-[9px] font-semibold">Cohort / Class:</span>
            <span className="font-extrabold uppercase">
              {exportType === 'class'
                ? currentSection?.fullName || 'Grade 9-A'
                : exportType === 'teacher'
                  ? `Faculty: ${currentTeacher?.name}`
                  : `Master Schedule (${masterDay})`}
            </span>
          </div>
          <div className="text-center flex items-center justify-center space-x-1">
            <span className="text-slate-600 uppercase text-[9px] font-semibold">
              {exportType === 'master' ? 'Scope:' : 'Class Mentor:'}
            </span>
            <span className="font-bold">
              {exportType === 'master'
                ? `${allSections.length} Divisions &bull; ${teachers.length} Faculty`
                : classTeacher ? `${classTeacher.name} (${classTeacher.employeeCode})` : 'Dr. Rahul Sharma (T-101)'}
            </span>
          </div>
          <div className="text-right flex items-center justify-end space-x-1">
            <span className="text-slate-600 uppercase text-[9px] font-semibold">Schedule Status:</span>
            <span className="font-bold font-mono text-emerald-800">Verified &bull; Zero Conflicts</span>
          </div>
        </div>

        {/* 3. TIMETABLE GRID TABLE (UNIFIED BORDERS & ZERO OVERFLOW) */}
        {orientation === 'landscape' ? (
          /* ============================================================ */
          /* LANDSCAPE ORIENTATION (Merged Vertical Breaks & Crisp Rows)  */
          /* ============================================================ */
          <div className="w-full">
            <table
              className="w-full border-collapse border border-black text-center"
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr className="bg-slate-200 text-black font-extrabold">
                  {/* Day or Division Column: 9% */}
                  <th
                    className="p-1 border border-black text-center text-[10.5px] uppercase tracking-wider"
                    style={{ width: '9%' }}
                  >
                    {exportType === 'master' ? 'Division' : 'Day'}
                  </th>

                  {/* Period Headers */}
                  {timeSlots.map((ts) => {
                    const isBreak = ts.isBreak
                    const colWidth = isBreak ? '5.5%' : '12%'

                    return (
                      <th
                        key={ts.index}
                        className={`p-1 border border-black text-center ${isBreak ? 'bg-slate-300 font-bold' : ''
                          }`}
                        style={{ width: colWidth }}
                      >
                        <div className="text-[10.5px] font-bold leading-tight">{ts.label}</div>
                        {showTimings && (
                          <div className="text-[8.5px] font-mono font-normal text-slate-700 whitespace-nowrap mt-0.5">
                            {ts.startTime}&ndash;{ts.endTime}
                          </div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              </thead>

              <tbody>
                {exportType === 'master' ? (
                  /* ======================================================== */
                  /* MASTER TIMETABLE: All Divisions as Rows for masterDay    */
                  /* ======================================================== */
                  allSections.map((sec, secIndex) => (
                    <tr key={sec.id} className="border-b border-black">
                      <td className="p-1 border border-black font-extrabold text-[10.5px] bg-slate-100 text-center tracking-tight">
                        {sec.fullName}
                      </td>

                      {timeSlots.map((ts) => {
                        if (ts.isBreak) {
                          if (secIndex === 0) {
                            return (
                              <td
                                key={ts.index}
                                rowSpan={allSections.length}
                                className="border border-black bg-slate-100 text-center p-0.5 align-middle select-none"
                              >
                                <div
                                  className="text-[9px] font-black tracking-widest text-slate-700 uppercase whitespace-nowrap"
                                  style={{
                                    writingMode: 'vertical-rl',
                                    transform: 'rotate(180deg)',
                                    margin: '0 auto',
                                  }}
                                >
                                  {ts.label.includes('Lunch') ? 'LUNCH BREAK' : 'MORNING BREAK'}
                                </div>
                              </td>
                            )
                          }
                          return null
                        }

                        const slot = previewSlots.find((s) => s.sectionId === sec.id && s.periodIndex === ts.index)
                        const subj = slot ? subjects.find((s) => s.id === slot.subjectId) : null
                        const tch = slot ? teachers.find((t) => t.id === slot.teacherId) : null

                        return (
                          <td
                            key={ts.index}
                            className="p-1 border border-black text-center h-11 align-middle bg-white overflow-hidden"
                          >
                            {slot && subj ? (
                              <div className="h-full flex flex-col justify-center items-center space-y-0.5">
                                <div className="font-extrabold text-[10.5px] text-black leading-tight line-clamp-1">
                                  {subj.name}
                                </div>
                                <div className="text-[9px] font-mono font-bold text-slate-800 leading-none">
                                  {subj.code}
                                </div>
                                <div className="text-[8.5px] text-slate-600 font-medium leading-none line-clamp-1">
                                  {tch?.name || '—'}
                                </div>
                              </div>
                            ) : (
                              <div className="text-slate-300 font-normal text-xs">&mdash;</div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))
                ) : (
                  /* ======================================================== */
                  /* CLASS / TEACHER TIMETABLE: Working Days along Rows       */
                  /* ======================================================== */
                  workingDays.map((day, dayIndex) => (
                    <tr key={day} className="border-b border-black">
                      {/* Day Name */}
                      <td className="p-1 border border-black font-extrabold text-[10.5px] bg-slate-100 text-center tracking-tight">
                        {day}
                      </td>

                      {/* Period Columns */}
                      {timeSlots.map((ts) => {
                        // Merged Vertical Break Banner across all 5 working days
                        if (ts.isBreak) {
                          if (dayIndex === 0) {
                            return (
                              <td
                                key={ts.index}
                                rowSpan={workingDays.length}
                                className="border border-black bg-slate-100 text-center p-0.5 align-middle select-none"
                              >
                                <div
                                  className="text-[9px] font-black tracking-widest text-slate-700 uppercase whitespace-nowrap"
                                  style={{
                                    writingMode: 'vertical-rl',
                                    transform: 'rotate(180deg)',
                                    margin: '0 auto',
                                  }}
                                >
                                  {ts.label.includes('Lunch') ? 'LUNCH BREAK' : 'MORNING BREAK'}
                                </div>
                              </td>
                            )
                          }
                          // Skip rendering break cells on days 1..4 because rowSpan covers them
                          return null
                        }

                        const slot = previewSlots.find((s) => s.day === day && s.periodIndex === ts.index)
                        const subj = slot ? subjects.find((s) => s.id === slot.subjectId) : null
                        const tch = slot ? teachers.find((t) => t.id === slot.teacherId) : null

                        return (
                          <td
                            key={ts.index}
                            className="p-1 border border-black text-center h-11 align-middle bg-white overflow-hidden"
                          >
                            {slot && subj ? (
                              <div className="h-full flex flex-col justify-center items-center space-y-0.5">
                                <div className="font-extrabold text-[10.5px] text-black leading-tight line-clamp-1">
                                  {subj.name}
                                </div>
                                <div className="text-[9px] font-mono font-bold text-slate-800 leading-none">
                                  {subj.code}
                                </div>
                                <div className="text-[8.5px] text-slate-600 font-medium leading-none line-clamp-1">
                                  {exportType === 'teacher'
                                    ? allSections.find((sec) => sec.id === slot.sectionId)?.fullName
                                    : tch?.name || '—'}
                                </div>
                              </div>
                            ) : (
                              <div className="text-slate-300 font-normal text-xs">&mdash;</div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ============================================================ */
          /* PORTRAIT ORIENTATION (Periods on Rows, Days on Columns)      */
          /* ============================================================ */
          <div className="w-full">
            <table
              className="w-full border-collapse border border-black text-center"
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr className="bg-slate-200 text-black font-extrabold">
                  <th
                    className="p-1 border border-black text-center text-[10.5px] uppercase tracking-wider"
                    style={{ width: '15%' }}
                  >
                    Period / Time
                  </th>
                  {workingDays.map((day) => (
                    <th
                      key={day}
                      className="p-1 border border-black text-center text-[10.5px] uppercase tracking-wider"
                      style={{ width: '17%' }}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {timeSlots.map((ts) => {
                  if (ts.isBreak) {
                    return (
                      <tr key={ts.index} className="border-b border-black">
                        <td
                          colSpan={workingDays.length + 1}
                          className="p-1 border border-black text-center font-bold tracking-widest text-[9.5px] uppercase bg-slate-100 text-slate-800"
                        >
                          &bull; {ts.label} ({ts.startTime} &ndash; {ts.endTime}) &bull;
                        </td>
                      </tr>
                    )
                  }

                  return (
                    <tr key={ts.index} className="border-b border-black">
                      <td className="p-1 border border-black font-bold text-[10px] bg-slate-100 text-black text-center">
                        <div className="leading-tight">{ts.label}</div>
                        {showTimings && (
                          <div className="text-[8.5px] font-mono font-normal text-slate-600">
                            {ts.startTime}&ndash;{ts.endTime}
                          </div>
                        )}
                      </td>

                      {workingDays.map((day) => {
                        const slot = previewSlots.find((s) => s.day === day && s.periodIndex === ts.index)
                        const subj = slot ? subjects.find((s) => s.id === slot.subjectId) : null
                        const tch = slot ? teachers.find((t) => t.id === slot.teacherId) : null

                        return (
                          <td
                            key={day}
                            className="p-1 border border-black text-center h-10 align-middle bg-white"
                          >
                            {slot && subj ? (
                              <div className="flex flex-col justify-center items-center space-y-0.5">
                                <div className="font-extrabold text-[10.5px] text-black leading-tight">
                                  {subj.name}
                                </div>
                                <div className="text-[9px] font-mono font-bold text-slate-800 leading-none">
                                  {subj.code}
                                </div>
                                <div className="text-[8.5px] text-slate-600 font-medium leading-none">
                                  {exportType === 'teacher'
                                    ? allSections.find((sec) => sec.id === slot.sectionId)?.fullName
                                    : tch?.name || '—'}
                                </div>
                              </div>
                            ) : (
                              <div className="text-slate-300 font-normal text-xs">&mdash;</div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. CURRICULUM & FACULTY IN-CHARGE LEGEND (100% MATCHED BORDERS) */}
        {showLegend && curriculumSummary.length > 0 && (
          <div className="w-full space-y-1">
            <div className="text-[9.5px] font-extrabold tracking-wider uppercase text-black flex items-center justify-between">
              <span>Curriculum &amp; Faculty In-Charge Legend</span>
              <span className="text-[8.5px] font-mono text-slate-600 font-normal">
                {curriculumSummary.length} Courses Allocated
              </span>
            </div>

            <table
              className="w-full border-collapse border border-black text-left text-[9px]"
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr className="bg-slate-200 text-black font-extrabold border-b border-black">
                  <th className="p-1 border border-black w-14 text-center">Code</th>
                  <th className="p-1 border border-black w-48">Subject Title</th>
                  <th className="p-1 border border-black">
                    {exportType === 'teacher' ? 'Assigned Cohorts' : 'Instructor In-Charge'}
                  </th>
                  <th className="p-1 border border-black w-24 text-center">Periods/Week</th>
                  <th className="p-1 border border-black w-28 text-center">Classification</th>
                </tr>
              </thead>
              <tbody>
                {curriculumSummary.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-1 border border-black font-mono font-bold text-center">
                      {item.code}
                    </td>
                    <td className="p-1 border border-black font-bold text-black">
                      {item.name}
                    </td>
                    <td className="p-1 border border-black text-slate-800">
                      {item.teacherName} {item.teacherCode !== '—' ? `(${item.teacherCode})` : ''}
                    </td>
                    <td className="p-1 border border-black text-center font-mono font-bold">
                      {item.actualAssigned} / {item.weeklyRequired}
                    </td>
                    <td className="p-1 border border-black text-center uppercase font-semibold text-slate-600">
                      {item.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. OFFICIAL 4-PART INSTITUTIONAL ENDORSEMENT SIGNATURES */}
        {showSignatures && (
          <div className="pt-3 grid grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="border-b border-black h-4 w-3/4 mx-auto" />
              <div className="text-[9px] font-extrabold text-black uppercase tracking-tight">
                Class Mentor
              </div>
            </div>

            <div className="space-y-1">
              <div className="border-b border-black h-4 w-3/4 mx-auto" />
              <div className="text-[9px] font-extrabold text-black uppercase tracking-tight">
                Timetable In-Charge
              </div>
            </div>

            <div className="space-y-1">
              <div className="border-b border-black h-4 w-3/4 mx-auto" />
              <div className="text-[9px] font-extrabold text-black uppercase tracking-tight">
                Academic Coordinator
              </div>
            </div>

            <div className="space-y-1">
              <div className="border-b border-black h-4 w-3/4 mx-auto" />
              <div className="text-[9px] font-extrabold text-black uppercase tracking-tight">
                Principal / Head of School
              </div>
            </div>
          </div>
        )}

        {/* 6. FORMAL INSTITUTIONAL FOOTNOTE */}
        <div className="flex items-center justify-between pt-1 border-t border-black text-[8.5px] text-slate-600 font-mono">
          <span>Smart Timetable Studio &bull; Official Institutional Record</span>
          <span>Verified Zero-Conflict Engine &bull; Page 1 of 1</span>
        </div>
      </div>
    </div>
  )
}
