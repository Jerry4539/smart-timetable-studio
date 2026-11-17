import React, { useState, useMemo, useRef } from 'react'
import {
  Lock,
  RotateCcw,
  RotateCw,
  Plus,
  Trash2,
  X,
  Search,
  LayoutGrid,
  Columns,
  Rows,
  AlertCircle,
  CheckCircle2,
  Users,
  BookOpen,
  GitBranch,
  Play,
  Minimize2,
  Maximize2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowDownToLine,
  RefreshCw,
  GraduationCap,
} from 'lucide-react'
import { useTimetableStore } from '../../store/useTimetableStore'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useTimeStore } from '../../store/useTimeStore'
import { useAppStore } from '../../store/useAppStore'
import { useValidationStore } from '../../store/useValidationStore'
import { DAYS_OF_WEEK } from '../../lib/constants'
import { DayOfWeek, LockType, StudioOrientation } from '../../lib/types'
import { ConstraintSolver } from '../../lib/solverEngine'
import { StorageEngine } from '../../lib/storage'

// Global drag state tracker to survive any WebView2 or React event boundary
let globalActiveDrag: {
  type: 'dock' | 'grid'
  slotId?: string
  subjectId?: string
  teacherId?: string
  sectionId?: string
  subjectName?: string
} | null = null

export const TimetableStudioView: React.FC = () => {
  const {
    slots,
    versions,
    activeVersionId,
    viewMode,
    setViewMode,
    layoutOrientation,
    setLayoutOrientation,
    filterSectionId,
    setFilterSectionId,
    filterTeacherId,
    setFilterTeacherId,
    selectedSlotId,
    setSelectedSlotId,
    moveSlot,
    assignLecture,
    removeSlot,
    setLockType,
    undo,
    redo,
    historyIndex,
    history,
  } = useTimetableStore()

  const { classes, teachers, subjects } = useAcademicStore()
  const { timeSlots } = useTimeStore()
  const { addNotification, setVersionModalOpen } = useAppStore()
  const { conflicts } = useValidationStore()

  const [draggedSlotId, setDraggedSlotId] = useState<string | null>(null)
  const [dragOverKey, setDragOverKey] = useState<string | null>(null)
  const [filterSearch, setFilterSearch] = useState('')

  // Bottom Staging Dock State
  const [dockExpanded, setDockExpanded] = useState(true)
  const [dockTab, setDockTab] = useState<'subjects' | 'teachers'>('subjects')
  const [draggedDockItem, setDraggedDockItem] = useState<{
    subjectId: string
    teacherId: string
    sectionId: string
    subjectName: string
  } | null>(null)
  const [isOverDock, setIsOverDock] = useState(false)

  // Direct synchronous drag reference to guarantee instant, rock-solid DnD in WebView2
  const activeDragRef = useRef<{
    type: 'dock' | 'grid'
    slotId?: string
    subjectId?: string
    teacherId?: string
    sectionId?: string
    subjectName?: string
  } | null>(null)

  const isDragging = draggedSlotId !== null || draggedDockItem !== null || activeDragRef.current !== null

  // Assign Lecture Dialog State (Manual Fallback)
  const [assigningCell, setAssigningCell] = useState<{ day: DayOfWeek; periodIndex: number } | null>(null)
  const [selectedSubjId, setSelectedSubjId] = useState<string>('')
  const [selectedTchId, setSelectedTchId] = useState<string>('')

  // Current selections
  const allSections = classes.flatMap((c) => c.sections)
  const currentSection = allSections.find((s) => s.id === filterSectionId) || allSections[0]
  const currentTeacher = teachers.find((t) => t.id === filterTeacherId) || teachers[0]

  // Grade-specific subjects: subjects applicable to this section's grade
  const targetGradeId = currentSection?.classId
  const availableGradeSubjects = subjects.filter(
    (s) => !targetGradeId || s.gradeIds.includes(targetGradeId)
  )

  // Filter slots for current view
  const displayedSlots = slots.filter((slot) => {
    if (viewMode === 'class') return slot.sectionId === filterSectionId
    if (viewMode === 'teacher') return slot.teacherId === filterTeacherId
    return true
  })

  // Selected slot for inspector panel
  const selectedSlot = slots.find((s) => s.id === selectedSlotId)
  const selectedSubject = subjects.find((s) => s.id === selectedSlot?.subjectId)
  const selectedTeacher = teachers.find((t) => t.id === selectedSlot?.teacherId)
  const selectedSection = allSections.find((s) => s.id === selectedSlot?.sectionId)

  // Drag from timetable grid (Smooth Reposition / Swap)
  const handleGridDragStart = (e: React.DragEvent, slotId: string) => {
    const slot = slots.find((s) => s.id === slotId)
    if (slot?.lockType === 'hard') {
      e.preventDefault()
      addNotification({
        title: 'Slot Locked',
        message: 'Hard-locked periods cannot be repositioned.',
        type: 'warning',
      })
      return
    }
    const item = { type: 'grid' as const, slotId }
    globalActiveDrag = item
    activeDragRef.current = item
    e.dataTransfer.setData('text/plain', `grid|${slotId}`)
    e.dataTransfer.setData('application/json', JSON.stringify(item))
    e.dataTransfer.effectAllowed = 'all'

    // Defer visual state change so the browser creates the crisp drag ghost first
    setTimeout(() => {
      setDraggedSlotId(slotId)
      setDraggedDockItem(null)
    }, 0)
  }

  // Drag from bottom dock (New Lecture Assignment)
  const handleDockDragStart = (
    e: React.DragEvent,
    subjectId: string,
    teacherId: string,
    sectionId: string,
    subjectName: string
  ) => {
    const item = {
      type: 'dock' as const,
      subjectId,
      teacherId,
      sectionId,
      subjectName,
    }
    globalActiveDrag = item
    activeDragRef.current = item
    e.dataTransfer.setData('text/plain', `dock|${subjectId}|${teacherId}|${sectionId}|${encodeURIComponent(subjectName)}`)
    e.dataTransfer.setData('application/json', JSON.stringify(item))
    e.dataTransfer.effectAllowed = 'all'

    setTimeout(() => {
      setDraggedDockItem({ subjectId, teacherId, sectionId, subjectName })
      setDraggedSlotId(null)
    }, 0)
  }

  const handleDragEnd = () => {
    globalActiveDrag = null
    activeDragRef.current = null
    setDraggedSlotId(null)
    setDragOverKey(null)
    setDraggedDockItem(null)
    setIsOverDock(false)
  }

  const handleDragOver = (e: React.DragEvent, day: DayOfWeek, periodIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    const isDock = globalActiveDrag?.type === 'dock' || draggedDockItem !== null
    e.dataTransfer.dropEffect = isDock ? 'copy' : 'move'
    const key = `${day}-${periodIndex}`
    if (dragOverKey !== key) {
      setDragOverKey(key)
    }
  }

  const handleDragEnter = (e: React.DragEvent, _day?: DayOfWeek, _periodIndex?: number) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Drop on timetable grid cell
  const handleDrop = (e: React.DragEvent, targetDay: DayOfWeek, targetPeriod: number) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverKey(null)

    // 1. Global / Ref lookup (immune to any closure or re-render issues)
    let currentDrag = globalActiveDrag || activeDragRef.current

    // 2. React state fallback
    if (!currentDrag && draggedDockItem) {
      currentDrag = { type: 'dock', ...draggedDockItem }
    } else if (!currentDrag && draggedSlotId) {
      currentDrag = { type: 'grid', slotId: draggedSlotId }
    }

    // 3. Text dataTransfer fallback
    if (!currentDrag) {
      const textRaw = e.dataTransfer.getData('text/plain')
      if (textRaw?.startsWith('dock|')) {
        const parts = textRaw.split('|')
        currentDrag = {
          type: 'dock',
          subjectId: parts[1],
          teacherId: parts[2],
          sectionId: parts[3],
          subjectName: decodeURIComponent(parts[4] || ''),
        }
      } else if (textRaw?.startsWith('grid|')) {
        currentDrag = {
          type: 'grid',
          slotId: textRaw.replace('grid|', ''),
        }
      }
    }

    // 4. JSON dataTransfer fallback
    if (!currentDrag) {
      const jsonRaw = e.dataTransfer.getData('application/json')
      try {
        if (jsonRaw) currentDrag = JSON.parse(jsonRaw)
      } catch (err) {}
    }

    if (!currentDrag) {
      handleDragEnd()
      return
    }

    // Place Lecture from Bottom Dock
    if (currentDrag.type === 'dock') {
      const targetSecId = currentDrag.sectionId || (viewMode === 'class' ? filterSectionId : allSections[0]?.id)
      const targetTchId = currentDrag.teacherId || (viewMode === 'teacher' ? filterTeacherId : teachers[0]?.id)
      
      assignLecture(targetDay, targetPeriod, targetSecId, currentDrag.subjectId!, targetTchId)
      addNotification({
        title: 'Lecture Placed',
        message: `${currentDrag.subjectName || 'Lecture'} assigned to ${targetDay} Period ${targetPeriod}.`,
        type: 'success',
      })
      handleDragEnd()
      return
    }

    // Move or Swap existing slot from Grid
    if (currentDrag.type === 'grid' && currentDrag.slotId) {
      const slotId = currentDrag.slotId
      const success = moveSlot(slotId, targetDay, targetPeriod)
      if (success) {
        addNotification({
          title: 'Lecture Repositioned',
          message: `Assigned to ${targetDay} Period ${targetPeriod}.`,
          type: 'success',
        })
      } else {
        addNotification({
          title: 'Move Prevented',
          message: 'Target slot is locked or restricted.',
          type: 'warning',
        })
      }
      handleDragEnd()
      return
    }

    handleDragEnd()
  }

  // Drop on bottom dock (unassign/remove from schedule)
  const handleDockDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOverDock(false)

    let slotId = activeDragRef.current?.type === 'grid' ? activeDragRef.current.slotId : draggedSlotId
    if (!slotId) {
      const textRaw = e.dataTransfer.getData('text/plain')
      if (textRaw?.startsWith('grid|')) {
        slotId = textRaw.replace('grid|', '')
      }
    }

    if (slotId && !slotId.startsWith('dock:')) {
      removeSlot(slotId)
      addNotification({
        title: 'Lecture Unassigned',
        message: 'Slot removed from schedule and returned to staging pool.',
        type: 'info',
      })
    }
    handleDragEnd()
  }

  // Empty cell click handler (open manual assign dialog)
  const handleEmptyCellClick = (day: DayOfWeek, periodIndex: number) => {
    const defaultSubj = availableGradeSubjects[0]?.id || ''
    const qualified = teachers.filter((t) => t.qualifiedSubjectIds.includes(defaultSubj))
    setSelectedSubjId(defaultSubj)
    setSelectedTchId(qualified[0]?.id || teachers[0]?.id || '')
    setAssigningCell({ day, periodIndex })
  }

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!assigningCell || !currentSection || !selectedSubjId || !selectedTchId) return

    assignLecture(
      assigningCell.day,
      assigningCell.periodIndex,
      currentSection.id,
      selectedSubjId,
      selectedTchId
    )

    const subj = subjects.find((s) => s.id === selectedSubjId)
    const tch = teachers.find((t) => t.id === selectedTchId)
    addNotification({
      title: 'Lecture Assigned',
      message: `${subj?.name} assigned with ${tch?.name} on ${assigningCell.day} Period ${assigningCell.periodIndex}.`,
      type: 'success',
    })

    setAssigningCell(null)
  }

  const toggleOrientation = () => {
    const next: StudioOrientation =
      layoutOrientation === 'periods-on-top' ? 'days-on-top' : 'periods-on-top'
    setLayoutOrientation(next)
    addNotification({
      title: 'Layout Switched',
      message:
        next === 'days-on-top'
          ? 'Days on Columns / Periods in Rows'
          : 'Periods on Columns / Days in Rows (Default)',
      type: 'info',
    })
  }

  const workingDays = DAYS_OF_WEEK.slice(0, 5)

  // View Density Mode: 'fit' fits all periods on screen, 'standard' allows wider columns
  const [viewDensity, setViewDensity] = useState<'fit' | 'standard'>('fit')

  // Dynamic Responsive Grid Columns to ensure all periods and breaks fit without cropping
  const layout1TemplateColumns = useMemo(() => {
    const dayCol = viewDensity === 'fit' ? '76px' : '88px'
    const cols = timeSlots.map((ts) => {
      if (ts.isBreak) {
        return viewDensity === 'fit' ? '44px' : '56px'
      }
      return viewDensity === 'fit' ? 'minmax(96px, 1fr)' : 'minmax(130px, 1fr)'
    })
    return `${dayCol} ${cols.join(' ')}`
  }, [timeSlots, viewDensity])

  const layout2TemplateColumns = useMemo(() => {
    const labelCol = viewDensity === 'fit' ? '76px' : '88px'
    const dayMin = viewDensity === 'fit' ? 'minmax(120px, 1fr)' : 'minmax(150px, 1fr)'
    return `${labelCol} repeat(${workingDays.length}, ${dayMin})`
  }, [workingDays.length, viewDensity])

  // Auto-Fill unassigned slots for current division or whole schedule
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
      title: 'Division Auto-Balanced',
      message: `Feasible schedule generated with ${result.slots.length} lectures populated.`,
      type: 'success',
    })
  }

  // Teachers qualified for currently selected subject in assign dialog
  const teachersForSelectedSubject = teachers.filter((t) =>
    t.qualifiedSubjectIds.includes(selectedSubjId)
  )

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50/50 dark:bg-black/20 select-none">
      {/* Main Studio Work Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Ergonomic Studio Control Bar */}
        <div className="min-h-12 py-1.5 px-3 sm:px-4 border-b border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-wrap items-center justify-between gap-2 shrink-0 shadow-2xs">
          {/* Left: View Mode & Division / Faculty Selector */}
          <div className="flex items-center space-x-2 text-xs">
            {/* View Mode Toggle Pill */}
            <div className="flex bg-slate-100 dark:bg-zinc-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-zinc-700">
              <button
                onClick={() => setViewMode('class')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${viewMode === 'class'
                    ? 'bg-white text-slate-900 dark:bg-zinc-900 dark:text-zinc-100 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                Standard & Div
              </button>
              <button
                onClick={() => setViewMode('teacher')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${viewMode === 'teacher'
                    ? 'bg-white text-slate-900 dark:bg-zinc-900 dark:text-zinc-100 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                Faculty
              </button>
            </div>

            {/* Target Select */}
            {viewMode === 'class' && (
              <select
                value={filterSectionId}
                onChange={(e) => setFilterSectionId(e.target.value)}
                className="h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-bold text-slate-800 dark:text-zinc-200 focus:outline-none"
              >
                {allSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.fullName}
                  </option>
                ))}
              </select>
            )}

            {viewMode === 'teacher' && (
              <select
                value={filterTeacherId}
                onChange={(e) => setFilterTeacherId(e.target.value)}
                className="h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-bold text-slate-800 dark:text-zinc-200 focus:outline-none"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.employeeCode})
                  </option>
                ))}
              </select>
            )}

            {/* Search Filter in Grid */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Filter subject..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="h-8 pl-7 pr-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none w-32 focus:w-44 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Right: Layout Switcher (2 Orientations) & Undo/Redo */}
          <div className="flex items-center space-x-2">
            {/* Quick Auto-Fill Constraint Solver */}
            <button
              onClick={handleAutoFill}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-2xs"
              title="Solve and assign unallocated periods using constraint validation"
            >
              <Play className="w-3.5 h-3.5 text-white dark:text-zinc-900" />
              <span>Fill Empty Slots</span>
            </button>

            {/* Layout Orientation Switcher: 2 Types */}
            <button
              onClick={toggleOrientation}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-2xs"
              title="Toggle Layout: Periods on Columns vs Days on Columns"
            >
              {layoutOrientation === 'periods-on-top' ? (
                <>
                  <Columns className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Layout 1: Periods on Top</span>
                </>
              ) : (
                <>
                  <Rows className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Layout 2: Days on Top</span>
                </>
              )}
            </button>

            {/* Fit / Density Switcher */}
            <button
              onClick={() => setViewDensity((d) => (d === 'fit' ? 'standard' : 'fit'))}
              className={`flex items-center space-x-1.5 px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-2xs ${viewDensity === 'fit'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300'
                }`}
              title={viewDensity === 'fit' ? 'Switch to Comfortable Width' : 'Fit all periods on screen'}
            >
              {viewDensity === 'fit' ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Fit All</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400" />
                  <span>Comfortable</span>
                </>
              )}
            </button>


            {/* Undo / Redo */}
            <div className="flex items-center bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-0.5">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 transition-all"
                title="Undo Move"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 transition-all"
                title="Redo Move"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Timetable Grid View Canvas */}
        <div className="flex-1 min-w-0 overflow-y-auto overflow-x-auto p-4 custom-scrollbar">
          <div className="min-w-fit w-full bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs overflow-hidden">
            {layoutOrientation === 'periods-on-top' ? (
              /* ============================================================== */
              /* LAYOUT 1 (DEFAULT): Periods on Top (Columns), Days along Rows   */
              /* ============================================================== */
              <div className="w-full min-w-full">
                {/* Header: Periods along Top (All aligned in ONE single line) */}
                <div
                  style={{ gridTemplateColumns: layout1TemplateColumns }}
                  className="grid border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 sticky top-0 z-10 text-xs"
                >
                  <div className="p-1.5 text-[11px] font-bold text-slate-400 border-r border-slate-100 dark:border-zinc-800 flex items-center justify-center select-none">
                    Day / Period
                  </div>
                  {timeSlots.map((ts) =>
                    ts.isBreak ? (
                      <div
                        key={ts.index}
                        className="p-1 text-center border-r border-slate-100 dark:border-zinc-800 last:border-r-0 bg-slate-100/50 dark:bg-zinc-800/70 flex flex-col items-center justify-center select-none"
                        title={`${ts.label} (${ts.startTime} - ${ts.endTime})`}
                      >
                        <div className="font-extrabold text-slate-500 dark:text-zinc-400 text-[9.5px] tracking-wider uppercase truncate max-w-full">
                          {ts.type === 'lunch' ? 'Lunch' : 'Break'}
                        </div>
                        <div className="text-[8.5px] text-slate-400 font-mono mt-0.5 truncate">
                          {ts.startTime}
                        </div>
                      </div>
                    ) : (
                      <div
                        key={ts.index}
                        className="p-1.5 text-center border-r border-slate-100 dark:border-zinc-800 last:border-r-0 flex flex-col items-center justify-center select-none"
                        title={`${ts.label}: ${ts.startTime} - ${ts.endTime}`}
                      >
                        <div className="font-bold text-slate-800 dark:text-zinc-200 text-[11px] truncate max-w-full">
                          {ts.label}
                        </div>
                        <div className="text-[9.5px] text-slate-400 font-mono mt-0.5 truncate">
                          {ts.startTime} - {ts.endTime}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Rows: Each Working Day */}
                <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {workingDays.map((day) => (
                    <div
                      key={day}
                      style={{ gridTemplateColumns: layout1TemplateColumns }}
                      className="grid min-h-[58px]"
                    >
                      {/* Day Label Header */}
                      <div className="p-1.5 bg-slate-50/60 dark:bg-zinc-800/30 border-r border-slate-100 dark:border-zinc-800 flex flex-col justify-center items-center select-none">
                        <span className="font-bold text-[11px] text-slate-800 dark:text-zinc-200 leading-tight">
                          {day}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                          {displayedSlots.filter((s) => s.day === day).length} slots
                        </span>
                      </div>

                      {/* Period Cells */}
                      {timeSlots.map((ts) => {
                        const cellKey = `${day}-${ts.index}`
                        const isOver = dragOverKey === cellKey

                        if (ts.isBreak) {
                          return (
                            <div
                              key={ts.index}
                              className="border-r border-slate-100 dark:border-zinc-800/60 last:border-r-0 bg-slate-100/35 dark:bg-zinc-950/20 flex flex-col items-center justify-center p-0.5 text-center select-none"
                              title={`${ts.label} (${ts.startTime} - ${ts.endTime})`}
                            >
                              <span className="text-[8.5px] uppercase font-black text-slate-400 dark:text-zinc-500 tracking-widest [writing-mode:vertical-lr] rotate-180 py-0.5 select-none">
                                {ts.type === 'lunch' ? 'Lunch' : ts.label}
                              </span>
                            </div>
                          )
                        }

                        const slot = displayedSlots.find(
                          (s) => s.day === day && s.periodIndex === ts.index
                        )
                        const subj = slot ? subjects.find((sub) => sub.id === slot.subjectId) : null
                        const tch = slot ? teachers.find((t) => t.id === slot.teacherId) : null
                        const sec = slot ? allSections.find((s) => s.id === slot.sectionId) : null
                        const isSelf = slot && draggedSlotId === slot.id

                        // Check conflict for this slot
                        const hasConflict = conflicts.some((c) => slot && c.slotIds.includes(slot.id))

                        return (
                          <div
                            key={ts.index}
                            onDragOver={(e) => handleDragOver(e, day, ts.index)}
                            onDragEnter={(e) => handleDragEnter(e, day, ts.index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, day, ts.index)}
                            className={`border-r border-slate-100 dark:border-zinc-800/60 last:border-r-0 p-1 transition-all relative group flex flex-col justify-center ${
                              isOver
                                ? slot && subj
                                  ? 'bg-amber-50/95 dark:bg-amber-950/60 ring-2 ring-amber-500 ring-inset'
                                  : 'bg-blue-50/95 dark:bg-blue-950/60 ring-2 ring-blue-500 ring-inset'
                                : 'hover:bg-slate-50/70 dark:hover:bg-zinc-800/30'
                            }`}
                          >
                            {/* Hover Indicator during Drag */}
                            {isOver && (
                              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none rounded-lg">
                                <div
                                  className={`px-2 py-0.5 rounded text-[9.5px] font-bold shadow-md flex items-center space-x-1 ${
                                    slot && subj ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                                  }`}
                                >
                                  {slot && subj ? (
                                    <>
                                      <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                                      <span>Swap</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-2.5 h-2.5" />
                                      <span>Drop</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}

                            {slot && subj ? (
                              <div
                                draggable={slot.lockType !== 'hard'}
                                onDragStart={(e) => handleGridDragStart(e, slot.id)}
                                onDragEnd={handleDragEnd}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedSlotId(slot.id)
                                }}
                                title={`${subj.name} (${subj.code}) • ${viewMode === 'teacher' ? (sec?.fullName || 'Section') : (tch?.name || 'Faculty')} • Drag to reposition or swap`}
                                style={{
                                  backgroundColor: subj.color.bg,
                                  borderLeftColor: subj.color.indicator,
                                }}
                                className={`w-full h-full px-2 py-1.5 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 border-l-[3.5px] flex flex-col justify-center min-w-0 transition-all shadow-2xs hover:scale-[1.01] hover:shadow-xs active:cursor-grabbing cursor-grab select-none ${
                                  isSelf ? 'opacity-30 border-dashed scale-95' : ''
                                } ${isDragging && !isSelf ? 'pointer-events-none' : ''}`}
                              >
                                <div className="flex items-center justify-between gap-1 min-w-0 pointer-events-none">
                                  <span
                                    style={{ color: subj.color.text }}
                                    className="text-[11px] font-bold leading-tight truncate"
                                  >
                                    {subj.name}
                                  </span>
                                  <div className="flex items-center space-x-0.5 shrink-0 ml-0.5">
                                    {hasConflict && (
                                      <AlertCircle className="w-3 h-3 text-rose-500 animate-pulse shrink-0" />
                                    )}
                                    {slot.lockType !== 'none' && (
                                      <Lock
                                        className={`w-2.5 h-2.5 shrink-0 ${
                                          slot.lockType === 'hard'
                                            ? 'text-slate-600 dark:text-zinc-400'
                                            : 'text-amber-500'
                                        }`}
                                      />
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400 font-medium leading-none min-w-0 mt-1 pointer-events-none">
                                  <span className="truncate">
                                    {viewMode === 'teacher' ? (sec?.fullName || 'Section') : (tch?.name || 'Faculty')}
                                  </span>
                                  <GripVertical className="w-2.5 h-2.5 text-slate-400/60 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                                </div>
                              </div>
                            ) : (
                              <div
                                onClick={() => handleEmptyCellClick(day, ts.index)}
                                className={`w-full h-full rounded-lg border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-300 dark:text-zinc-700 hover:border-blue-400 hover:bg-blue-50/20 dark:hover:border-blue-700 transition-colors cursor-pointer group/cell ${
                                  isDragging ? 'pointer-events-none' : ''
                                }`}
                              >
                                <div className="flex items-center space-x-1 opacity-0 group-hover/cell:opacity-100 transition-opacity">
                                  <Plus className="w-3 h-3 text-blue-500" />
                                  <span className="text-[9px] font-medium text-blue-500">
                                    Drop / Add
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* ============================================================== */
              /* LAYOUT 2: Days on Top (Columns), Periods along Left (Rows)      */
              /* ============================================================== */
              <div className="w-full min-w-full">
                {/* Header: Days along Top */}
                <div
                  style={{ gridTemplateColumns: layout2TemplateColumns }}
                  className="grid border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 sticky top-0 z-10 text-xs"
                >
                  <div className="p-1.5 text-[11px] font-bold text-slate-400 border-r border-slate-100 dark:border-zinc-800 flex items-center justify-center select-none">
                    Period / Day
                  </div>
                  {workingDays.map((d) => (
                    <div
                      key={d}
                      className="p-1.5 text-center border-r border-slate-100 dark:border-zinc-800 last:border-r-0 select-none"
                    >
                      <div className="font-bold text-slate-800 dark:text-zinc-200 text-[11px]">{d}</div>
                      <div className="text-[9px] text-slate-400 font-mono">
                        {displayedSlots.filter((s) => s.day === d).length} lectures
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rows: Each Period */}
                <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                  {timeSlots.map((ts) => {
                    if (ts.isBreak) {
                      return (
                        <div
                          key={ts.index}
                          style={{ gridTemplateColumns: layout2TemplateColumns }}
                          className="grid bg-slate-100/30 dark:bg-zinc-950/20 py-1"
                        >
                          <div className="px-2 font-semibold text-[10px] text-slate-500 flex items-center justify-center select-none">
                            {ts.label}
                          </div>
                          <div
                            style={{ gridColumn: `span ${workingDays.length} / span ${workingDays.length}` }}
                            className="text-center text-[9px] text-slate-400 font-mono uppercase tracking-wider py-0.5 select-none"
                          >
                            {ts.startTime} - {ts.endTime} &bull; Institutional Recess
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div
                        key={ts.index}
                        style={{ gridTemplateColumns: layout2TemplateColumns }}
                        className="grid min-h-[58px]"
                      >
                        <div className="p-1.5 bg-slate-50/60 dark:bg-zinc-800/30 border-r border-slate-100 dark:border-zinc-800 flex flex-col justify-center items-center select-none">
                          <span className="font-bold text-[11px] text-slate-800 dark:text-zinc-200 leading-tight">
                            {ts.label}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                            {ts.startTime}
                          </span>
                        </div>

                        {workingDays.map((day) => {
                          const cellKey = `${day}-${ts.index}`
                          const isOver = dragOverKey === cellKey
                          const slot = displayedSlots.find(
                            (s) => s.day === day && s.periodIndex === ts.index
                          )
                          const subj = slot ? subjects.find((sub) => sub.id === slot.subjectId) : null
                          const tch = slot ? teachers.find((t) => t.id === slot.teacherId) : null
                          const sec = slot ? allSections.find((s) => s.id === slot.sectionId) : null
                          const isSelf = slot && draggedSlotId === slot.id
                          const hasConflict = conflicts.some(
                            (c) => slot && c.slotIds.includes(slot.id)
                          )

                          return (
                            <div
                              key={day}
                              onDragOver={(e) => handleDragOver(e, day, ts.index)}
                              onDragEnter={(e) => handleDragEnter(e, day, ts.index)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, day, ts.index)}
                              className={`border-r border-slate-100 dark:border-zinc-800/60 last:border-r-0 p-1 transition-all relative group flex flex-col justify-center ${
                                isOver
                                  ? slot && subj
                                    ? 'bg-amber-50/95 dark:bg-amber-950/60 ring-2 ring-amber-500 ring-inset'
                                    : 'bg-blue-50/95 dark:bg-blue-950/60 ring-2 ring-blue-500 ring-inset'
                                  : 'hover:bg-slate-50/70 dark:hover:bg-zinc-800/30'
                              }`}
                            >
                              {/* Hover Indicator during Drag */}
                              {isOver && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none rounded-lg">
                                  <div
                                    className={`px-2 py-0.5 rounded text-[9.5px] font-bold shadow-md flex items-center space-x-1 ${
                                      slot && subj ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                                    }`}
                                  >
                                    {slot && subj ? (
                                      <>
                                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                                        <span>Swap</span>
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="w-2.5 h-2.5" />
                                        <span>Drop</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}

                              {slot && subj ? (
                                <div
                                  draggable={slot.lockType !== 'hard'}
                                  onDragStart={(e) => handleGridDragStart(e, slot.id)}
                                  onDragEnd={handleDragEnd}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedSlotId(slot.id)
                                  }}
                                  title={`${subj.name} (${subj.code}) • ${viewMode === 'teacher' ? (sec?.fullName || 'Section') : (tch?.name || 'Faculty')} • Drag to reposition or swap`}
                                  style={{
                                    backgroundColor: subj.color.bg,
                                    borderLeftColor: subj.color.indicator,
                                  }}
                                  className={`w-full h-full px-2 py-1.5 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 border-l-[3.5px] flex flex-col justify-center min-w-0 transition-all shadow-2xs hover:scale-[1.01] hover:shadow-xs active:cursor-grabbing cursor-grab select-none ${
                                    isSelf ? 'opacity-30 border-dashed scale-95' : ''
                                  } ${isDragging && !isSelf ? 'pointer-events-none' : ''}`}
                                >
                                  <div className="flex items-center justify-between gap-1 min-w-0 pointer-events-none">
                                    <span
                                      style={{ color: subj.color.text }}
                                      className="text-[11px] font-bold leading-tight truncate"
                                    >
                                      {subj.name}
                                    </span>
                                    <div className="flex items-center space-x-0.5 shrink-0 ml-0.5">
                                      {hasConflict && (
                                        <AlertCircle className="w-3 h-3 text-rose-500 animate-pulse shrink-0" />
                                      )}
                                      {slot.lockType !== 'none' && (
                                        <Lock
                                          className={`w-2.5 h-2.5 shrink-0 ${
                                            slot.lockType === 'hard'
                                              ? 'text-slate-600 dark:text-zinc-400'
                                              : 'text-amber-500'
                                          }`}
                                        />
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400 font-medium leading-none min-w-0 mt-1 pointer-events-none">
                                    <span className="truncate">
                                      {viewMode === 'teacher' ? (sec?.fullName || 'Section') : (tch?.name || 'Faculty')}
                                    </span>
                                    <GripVertical className="w-2.5 h-2.5 text-slate-400/60 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => handleEmptyCellClick(day, ts.index)}
                                  className={`w-full h-full rounded-lg border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-300 dark:text-zinc-700 hover:border-blue-400 hover:bg-blue-50/20 dark:hover:border-blue-700 transition-colors cursor-pointer group/cell ${
                                    isDragging ? 'pointer-events-none' : ''
                                  }`}
                                >
                                  <div className="flex items-center space-x-1 opacity-0 group-hover/cell:opacity-100 transition-opacity">
                                    <Plus className="w-3 h-3 text-blue-500" />
                                    <span className="text-[9px] font-medium text-blue-500">
                                      Drop / Add
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* BOTTOM DOCK: LECTURES & FACULTY STAGING TRAY                   */}
        {/* ============================================================== */}
        <div
          onDragOver={(e) => {
            if (draggedSlotId || activeDragRef.current?.type === 'grid') {
              e.preventDefault()
              e.stopPropagation()
              e.dataTransfer.dropEffect = 'move'
              setIsOverDock(true)
            }
          }}
          onDragLeave={() => setIsOverDock(false)}
          onDrop={handleDockDrop}
          className={`border-t border-slate-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shrink-0 transition-all duration-300 flex flex-col z-20 ${
            isOverDock
              ? 'bg-rose-50/90 dark:bg-rose-950/40 ring-2 ring-rose-500 ring-inset'
              : ''
          } ${dockExpanded ? 'h-32 sm:h-36' : 'h-8'}`}
        >
          {/* Dock Header Bar */}
          <div className="h-8 px-3 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between shrink-0 text-xs">
            {/* Left: Title & Mode Info */}
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center font-bold">
                <Layers className="w-3 h-3" />
              </div>
              <span className="font-bold text-[11px] text-slate-800 dark:text-zinc-200">
                Staging Dock
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                {viewMode === 'class' ? currentSection?.fullName : currentTeacher?.name}
              </span>

              {/* Tabs: Subjects vs Faculty */}
              <div className="flex items-center bg-slate-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-slate-200 dark:border-zinc-700 ml-1.5">
                <button
                  onClick={() => setDockTab('subjects')}
                  className={`px-2 py-0.5 rounded-md font-semibold text-[10px] transition-all ${
                    dockTab === 'subjects'
                      ? 'bg-white text-slate-900 dark:bg-zinc-700 dark:text-zinc-100 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Subjects ({availableGradeSubjects.length})
                </button>
                <button
                  onClick={() => setDockTab('teachers')}
                  className={`px-2 py-0.5 rounded-md font-semibold text-[10px] transition-all ${
                    dockTab === 'teachers'
                      ? 'bg-white text-slate-900 dark:bg-zinc-700 dark:text-zinc-100 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Faculty ({teachers.length})
                </button>
              </div>
            </div>

            {/* Right: Unassign Hint / Collapse Toggle */}
            <div className="flex items-center space-x-2">
              {draggedSlotId || activeDragRef.current?.type === 'grid' ? (
                <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-bold text-[10px] animate-pulse">
                  <ArrowDownToLine className="w-3 h-3" />
                  <span>Drop here to unassign from grid</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-400 hidden md:inline">
                  Drag any card to timetable grid
                </span>
              )}

              <button
                onClick={() => setDockExpanded(!dockExpanded)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                title={dockExpanded ? 'Minimize Staging Dock' : 'Expand Staging Dock'}
              >
                {dockExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Dock Content Tray (When expanded) */}
          {dockExpanded && (
            <div className="flex-1 p-2 overflow-x-auto overflow-y-hidden custom-scrollbar flex items-center">
              {dockTab === 'subjects' ? (
                /* ------------------------------------------------------------- */
                /* TAB 1: CURRICULUM SUBJECTS (Direct full-card draggable)       */
                /* ------------------------------------------------------------- */
                <div className="flex items-center gap-2 h-full">
                  {availableGradeSubjects.map((subj) => {
                    const placedCount = slots.filter(
                      (s) => s.sectionId === currentSection.id && s.subjectId === subj.id
                    ).length
                    const requiredCount = subj.weeklyPeriodsRequired || 5
                    const remaining = Math.max(0, requiredCount - placedCount)
                    const qualified = teachers.filter((t) =>
                      t.qualifiedSubjectIds.includes(subj.id)
                    )
                    const defaultTeacher = qualified[0] || teachers[0]
                    const isComplete = remaining === 0

                    return (
                      <div
                        key={subj.id}
                        draggable={true}
                        onDragStart={(e) =>
                          handleDockDragStart(
                            e,
                            subj.id,
                            viewMode === 'teacher' ? filterTeacherId : (defaultTeacher?.id || teachers[0]?.id || ''),
                            viewMode === 'class' ? filterSectionId : (allSections[0]?.id || ''),
                            subj.name
                          )
                        }
                        onDragEnd={handleDragEnd}
                        style={{ borderLeftColor: subj.color.indicator }}
                        title={`Drag anywhere on this card to place ${subj.name} onto timetable grid`}
                        className="w-44 h-[76px] shrink-0 p-2 rounded-xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 border-l-[3.5px] shadow-2xs flex flex-col justify-between transition-all hover:shadow-md hover:scale-[1.02] hover:border-blue-400 dark:hover:border-blue-600 active:cursor-grabbing cursor-grab select-none group"
                      >
                        {/* Top: Name & Code */}
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span
                              style={{ color: subj.color.text }}
                              className="font-bold text-[11px] leading-tight truncate"
                            >
                              {subj.name}
                            </span>
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 font-bold shrink-0">
                              {subj.code}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                            {defaultTeacher ? defaultTeacher.name : 'Unassigned faculty'}
                          </div>
                        </div>

                        {/* Bottom: Progress Badge & Drag Cue */}
                        <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100 dark:border-zinc-700/60">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              isComplete
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                            }`}
                          >
                            {placedCount}/{requiredCount} placed
                          </span>

                          <div className="flex items-center space-x-0.5 text-[9px] font-bold text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            <GripVertical className="w-3 h-3" />
                            <span>Drag card</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* ------------------------------------------------------------- */
                /* TAB 2: FACULTY WORKLOAD POOL                                  */
                /* ------------------------------------------------------------- */
                <div className="flex items-center gap-2 h-full">
                  {teachers.map((t) => {
                    const assignedCount = slots.filter((s) => s.teacherId === t.id).length
                    const maxWeekly = t.maxPeriodsPerWeek || 24
                    
                    // Filter subjects by teacher qualification and current active grade/class
                    const teacherSubjects = subjects.filter((s) => {
                      if (!t.qualifiedSubjectIds.includes(s.id)) return false
                      if (targetGradeId && s.gradeIds && s.gradeIds.length > 0) {
                        return s.gradeIds.includes(targetGradeId)
                      }
                      return true
                    })

                    // Deduplicate by subject name to prevent duplicate cards
                    const uniqueTeacherSubjects: (typeof subjects)[0][] = []
                    const seenNames = new Set<string>()
                    for (const s of teacherSubjects) {
                      const key = s.name.trim().toLowerCase()
                      if (!seenNames.has(key)) {
                        seenNames.add(key)
                        uniqueTeacherSubjects.push(s)
                      }
                    }

                    return (
                      <div
                        key={t.id}
                        className="w-52 h-[76px] shrink-0 p-2 rounded-xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 shadow-2xs flex flex-col justify-between"
                      >
                        {/* Teacher Info */}
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-slate-900 dark:text-zinc-100 truncate">
                              {t.name}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {assignedCount}/{maxWeekly}
                            </span>
                          </div>
                        </div>

                        {/* Draggable Subjects for this Teacher */}
                        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pt-1 border-t border-slate-100 dark:border-zinc-700/60">
                          {uniqueTeacherSubjects.map((sub) => (
                            <div
                              key={sub.id}
                              draggable={true}
                              onDragStart={(e) =>
                                handleDockDragStart(
                                  e,
                                  sub.id,
                                  t.id,
                                  currentSection.id,
                                  `${sub.name} (${t.name})`
                                )
                              }
                              onDragEnd={handleDragEnd}
                              style={{
                                backgroundColor: sub.color.bg,
                                borderColor: sub.color.indicator,
                                color: sub.color.text,
                              }}
                              title={`Drag ${sub.name} to timetable`}
                              className="flex items-center space-x-1 px-2 py-0.5 rounded-lg border text-[9.5px] font-bold cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 transition-all shadow-2xs shrink-0 select-none"
                            >
                              <GripVertical className="w-2.5 h-2.5 opacity-60" />
                              <span>{sub.code}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Inspector Side Panel for Selected Slot */}
      {selectedSlot && selectedSubject && (
        <aside className="w-72 bg-white dark:bg-zinc-900 border-l border-slate-200/80 dark:border-zinc-800 flex flex-col shrink-0 select-none shadow-2xs">
          {/* Header */}
          <div className="h-12 px-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 dark:text-zinc-100">
              Lecture Inspector
            </span>
            <button
              onClick={() => setSelectedSlotId(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
            {/* Subject Pill */}
            <div
              style={{
                backgroundColor: selectedSubject.color.bg,
                borderLeftColor: selectedSubject.color.indicator,
              }}
              className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 border-l-[4px] shadow-2xs"
            >
              <div
                style={{ color: selectedSubject.color.text }}
                className="font-bold text-xs"
              >
                {selectedSubject.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {selectedSlot.day} &bull; Period {selectedSlot.periodIndex}
              </div>
            </div>

            {/* Lock Control */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                Constraint Lock
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['none', 'soft', 'hard'] as LockType[]).map((lt) => (
                  <button
                    key={lt}
                    onClick={() => setLockType(selectedSlot.id, lt)}
                    className={`py-1.5 rounded-xl text-[11px] font-semibold capitalize border transition-all ${selectedSlot.lockType === lt
                        ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-2xs'
                        : 'bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'
                      }`}
                  >
                    {lt}
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] text-slate-400 block font-medium">Standard & Division</span>
                <div className="font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
                  {selectedSection?.fullName}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] text-slate-400 block font-medium">Assigned Teacher</span>
                <div className="font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
                  {selectedTeacher?.name}
                </div>
              </div>
            </div>

            {/* Drag & Move Help */}
            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
              Tip: Drag and drop this lecture to any slot to reposition or swap smoothly.
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 space-y-2">
              <button
                onClick={() => removeSlot(selectedSlot.id)}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 rounded-xl font-semibold text-xs border border-rose-200 dark:border-rose-900 transition-colors flex items-center justify-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Lecture</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Assign Lecture Modal Dialog (Opened when clicking empty slot) */}
      {assigningCell && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 dark:bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-popover overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-zinc-800">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                  Assign Lecture
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {currentSection?.fullName} &bull; {assigningCell.day} Period {assigningCell.periodIndex}
                </p>
              </div>
              <button
                onClick={() => setAssigningCell(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="p-4 space-y-3.5 text-xs">
              {/* Subject Selection (Filtered for this Grade) */}
              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1 flex items-center justify-between">
                  <span>Subject (Curriculum for this Grade)</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {availableGradeSubjects.length} subjects
                  </span>
                </label>
                <select
                  value={selectedSubjId}
                  onChange={(e) => {
                    const newSubjId = e.target.value
                    setSelectedSubjId(newSubjId)
                    // Auto-select qualified teacher
                    const qTeachers = teachers.filter((t) =>
                      t.qualifiedSubjectIds.includes(newSubjId)
                    )
                    setSelectedTchId(qTeachers[0]?.id || teachers[0]?.id || '')
                  }}
                  className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-bold text-slate-800 dark:text-zinc-100 focus:outline-none"
                >
                  {availableGradeSubjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Teacher Selection (Multi-teacher support: shows teachers who teach this subject) */}
              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1 flex items-center justify-between">
                  <span>Faculty (Qualified for Subject)</span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">
                    {teachersForSelectedSubject.length} qualified
                  </span>
                </label>
                <select
                  value={selectedTchId}
                  onChange={(e) => setSelectedTchId(e.target.value)}
                  className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-bold text-slate-800 dark:text-zinc-100 focus:outline-none"
                >
                  {teachersForSelectedSubject.length > 0 ? (
                    teachersForSelectedSubject.map((tch) => {
                      const count = slots.filter((s) => s.teacherId === tch.id).length
                      return (
                        <option key={tch.id} value={tch.id}>
                          {tch.name} &bull; {count}/{tch.maxPeriodsPerWeek} periods
                        </option>
                      )
                    })
                  ) : (
                    teachers.map((tch) => (
                      <option key={tch.id} value={tch.id}>
                        {tch.name} (General Pool)
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setAssigningCell(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-2xs"
                >
                  Place Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
