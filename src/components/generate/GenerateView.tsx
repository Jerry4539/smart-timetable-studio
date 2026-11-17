import React, { useState, useEffect, useMemo } from 'react'
import {
  Calendar,
  Layers,
  Play,
  RotateCcw,
  Check,
  Plus,
  X,
  Trash2,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useTimetableStore } from '../../store/useTimetableStore'
import { useTimeStore } from '../../store/useTimeStore'
import { useAppStore } from '../../store/useAppStore'
import { useValidationStore } from '../../store/useValidationStore'
import {
  ConstraintSolver,
  SolverResult,
  isPhysicalOrYogaSubject,
  isPlayfulActivitySubject,
} from '../../lib/solverEngine'
import { SubjectBlockRule } from '../../lib/types'

const BLOCK_RULES_STORAGE_KEY = 'smart_timetable_block_rules_v2'
const PRE_LUNCH_NAMES_STORAGE_KEY = 'smart_timetable_pre_lunch_names'
const ACTIVITY_NAMES_STORAGE_KEY = 'smart_timetable_activity_names'

interface DisplayBlockRule {
  id: string
  subjectName: string
  blockSize: number
  enabled: boolean
}

export const GenerateView: React.FC = () => {
  const { teachers, classes, subjects, institution, labCapacities } = useAcademicStore()
  const { slots } = useTimetableStore()
  const { timeSlots } = useTimeStore()
  const { validateTimetable } = useValidationStore()
  const { setActiveView, addNotification } = useAppStore()

  // Standard Scheduling Settings
  const [balanceWeight, setBalanceWeight] = useState(85)
  const [consecutiveLimit, setConsecutiveLimit] = useState(2)
  const [morningCoreBias, setMorningCoreBias] = useState(true)
  const [preserveLocks, setPreserveLocks] = useState(true)

  // Distinct curriculum subjects grouped by normalized name (Deduplicated!)
  const uniqueSubjects = useMemo(() => {
    const map = new Map<string, (typeof subjects)[0] & { allIds: string[] }>()
    subjects.forEach((s) => {
      const key = s.name.trim().toLowerCase()
      if (!map.has(key)) {
        map.set(key, { ...s, allIds: [s.id] })
      } else {
        map.get(key)!.allIds.push(s.id)
      }
    })
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [subjects])

  // 1. Consecutive Block Periods
  const [enableBlockRules, setEnableBlockRules] = useState(true)
  const [blockRules, setBlockRules] = useState<DisplayBlockRule[]>(() => {
    try {
      const saved = localStorage.getItem(BLOCK_RULES_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return []
  })

  const [selectedBlockSubjectName, setSelectedBlockSubjectName] = useState<string>('')
  const [selectedBlockSize, setSelectedBlockSize] = useState<number>(2)

  // 2. Dynamic Pre-Lunch Subject Names (Unique distinct names: Yoga, Sports, PE, Dance)
  const [enablePreLunchRule, setEnablePreLunchRule] = useState<boolean>(true)
  const [preLunchSubjectNames, setPreLunchSubjectNames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(PRE_LUNCH_NAMES_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    // Auto-detect unique names
    const names = new Set<string>()
    subjects.filter(isPhysicalOrYogaSubject).forEach((s) => names.add(s.name.trim()))
    return Array.from(names)
  })

  // 3. Dynamic Activity Subject Names (Unique distinct names: Art, Music, Library, SUPW)
  const [enableActivitySpread, setEnableActivitySpread] = useState<boolean>(true)
  const [activitySubjectNames, setActivitySubjectNames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(ACTIVITY_NAMES_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    // Auto-detect unique names
    const names = new Set<string>()
    subjects.filter(isPlayfulActivitySubject).forEach((s) => names.add(s.name.trim()))
    return Array.from(names)
  })
  const [maxActivitiesPerDay, setMaxActivitiesPerDay] = useState<number>(1)

  // Execution & Diagnostics States
  const [isSolving, setIsSolving] = useState(false)
  const [progress, setProgress] = useState(0)
  const [lastResult, setLastResult] = useState<SolverResult | null>(null)
  const [showLogs, setShowLogs] = useState(false)
  const [solverLog, setSolverLog] = useState<string[]>([
    'Scheduler ready. Set your conditions and click Generate Timetable.',
  ])

  // Default block subject selection fallback
  useEffect(() => {
    if (uniqueSubjects.length > 0) {
      if (!selectedBlockSubjectName || !uniqueSubjects.some((u) => u.name === selectedBlockSubjectName)) {
        setSelectedBlockSubjectName(uniqueSubjects[0].name)
      }
    }
  }, [uniqueSubjects, selectedBlockSubjectName])

  // Clean up any stale names if subjects are deleted from store
  useEffect(() => {
    const validNames = new Set(uniqueSubjects.map((u) => u.name.toLowerCase()))

    setBlockRules((prev) => prev.filter((r) => validNames.has(r.subjectName.toLowerCase())))
    setPreLunchSubjectNames((prev) => prev.filter((name) => validNames.has(name.toLowerCase())))
    setActivitySubjectNames((prev) => prev.filter((name) => validNames.has(name.toLowerCase())))
  }, [uniqueSubjects])

  // Persist configurations
  useEffect(() => {
    try {
      localStorage.setItem(BLOCK_RULES_STORAGE_KEY, JSON.stringify(blockRules))
    } catch {
      // ignore
    }
  }, [blockRules])

  useEffect(() => {
    try {
      localStorage.setItem(PRE_LUNCH_NAMES_STORAGE_KEY, JSON.stringify(preLunchSubjectNames))
    } catch {
      // ignore
    }
  }, [preLunchSubjectNames])

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVITY_NAMES_STORAGE_KEY, JSON.stringify(activitySubjectNames))
    } catch {
      // ignore
    }
  }, [activitySubjectNames])

  // Block rule handlers
  const handleAddBlockRule = () => {
    if (!selectedBlockSubjectName) return

    const existingIndex = blockRules.findIndex(
      (r) => r.subjectName.toLowerCase() === selectedBlockSubjectName.toLowerCase()
    )
    if (existingIndex >= 0) {
      const updated = [...blockRules]
      updated[existingIndex].blockSize = selectedBlockSize
      updated[existingIndex].enabled = true
      setBlockRules(updated)
      addNotification({
        title: 'Rule Updated',
        message: `Set ${selectedBlockSize} consecutive periods for ${selectedBlockSubjectName}.`,
        type: 'info',
      })
      return
    }

    const newRule: DisplayBlockRule = {
      id: `block-${selectedBlockSubjectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      subjectName: selectedBlockSubjectName,
      blockSize: selectedBlockSize,
      enabled: true,
    }

    setBlockRules([...blockRules, newRule])
    addNotification({
      title: 'Rule Added',
      message: `Configured ${selectedBlockSize} consecutive periods for ${selectedBlockSubjectName}.`,
      type: 'success',
    })
  }

  const handleToggleBlockRule = (id: string) => {
    setBlockRules(blockRules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)))
  }

  const handleRemoveBlockRule = (id: string) => {
    setBlockRules(blockRules.filter((r) => r.id !== id))
  }

  // Pre-lunch subject handlers
  const handleAddPreLunchSubject = (name: string) => {
    if (!name || preLunchSubjectNames.some((n) => n.toLowerCase() === name.toLowerCase())) return
    setPreLunchSubjectNames([...preLunchSubjectNames, name])
  }

  const handleRemovePreLunchSubject = (name: string) => {
    setPreLunchSubjectNames(preLunchSubjectNames.filter((n) => n.toLowerCase() !== name.toLowerCase()))
  }

  const handleResetPreLunchToDefaults = () => {
    const names = new Set<string>()
    subjects.filter(isPhysicalOrYogaSubject).forEach((s) => names.add(s.name.trim()))
    const detected = Array.from(names)
    setPreLunchSubjectNames(detected)
    addNotification({
      title: 'Subjects Updated',
      message: `Selected ${detected.length} distinct physical & yoga subjects.`,
      type: 'info',
    })
  }

  // Activity subject handlers
  const handleAddActivitySubject = (name: string) => {
    if (!name || activitySubjectNames.some((n) => n.toLowerCase() === name.toLowerCase())) return
    setActivitySubjectNames([...activitySubjectNames, name])
  }

  const handleRemoveActivitySubject = (name: string) => {
    setActivitySubjectNames(activitySubjectNames.filter((n) => n.toLowerCase() !== name.toLowerCase()))
  }

  const handleResetActivitiesToDefaults = () => {
    const names = new Set<string>()
    subjects.filter(isPlayfulActivitySubject).forEach((s) => names.add(s.name.trim()))
    const detected = Array.from(names)
    setActivitySubjectNames(detected)
    addNotification({
      title: 'Subjects Updated',
      message: `Selected ${detected.length} distinct activity & elective subjects.`,
      type: 'info',
    })
  }

  // Reset all settings to defaults
  const handleResetAll = () => {
    setBalanceWeight(85)
    setConsecutiveLimit(2)
    setMorningCoreBias(true)
    setPreserveLocks(true)
    setEnableBlockRules(true)
    setEnablePreLunchRule(true)
    setEnableActivitySpread(true)
    setMaxActivitiesPerDay(1)
    handleResetPreLunchToDefaults()
    handleResetActivitiesToDefaults()
    addNotification({
      title: 'Defaults Restored',
      message: 'Reset all generator parameters to standard values.',
      type: 'info',
    })
  }

  // Run the timetable solver
  const handleRunSolver = () => {
    setIsSolving(true)
    setProgress(20)
    setSolverLog([
      `Preparing schedule for ${classes.length} classes and ${teachers.length} teachers...`,
      'Validating period counts and teacher allocations...',
    ])

    setTimeout(() => {
      setProgress(55)

      // Map block rules to all matching grade-level subject IDs
      const compiledBlockRules: SubjectBlockRule[] = []
      if (enableBlockRules) {
        blockRules
          .filter((r) => r.enabled)
          .forEach((r) => {
            const matching = uniqueSubjects.find(
              (u) => u.name.toLowerCase() === r.subjectName.toLowerCase()
            )
            if (matching) {
              matching.allIds.forEach((id) => {
                compiledBlockRules.push({
                  id: `rule-${id}`,
                  subjectId: id,
                  blockSize: r.blockSize,
                  enabled: true,
                })
              })
            }
          })
      }

      // Map pre-lunch subject names to all matching subject IDs
      const preLunchSubjectIds: string[] = []
      if (enablePreLunchRule) {
        subjects.forEach((s) => {
          if (preLunchSubjectNames.some((n) => n.toLowerCase() === s.name.trim().toLowerCase())) {
            preLunchSubjectIds.push(s.id)
          }
        })
      }

      // Map activity subject names to all matching subject IDs
      const activitySubjectIds: string[] = []
      if (enableActivitySpread) {
        subjects.forEach((s) => {
          if (activitySubjectNames.some((n) => n.toLowerCase() === s.name.trim().toLowerCase())) {
            activitySubjectIds.push(s.id)
          }
        })
      }

      const solver = new ConstraintSolver(classes, subjects, teachers, timeSlots)
      const result = solver.solve(slots, {
        balanceWeight,
        maxConsecutiveLimit: consecutiveLimit,
        morningCoreBias,
        preserveLocks,
        blockRules: compiledBlockRules,
        noPostLunchPhysical: enablePreLunchRule,
        preLunchSubjectIds,
        spreadActivitiesEvenly: enableActivitySpread,
        activitySubjectIds,
        maxActivitiesPerDay,
        labCapacities,
      })

      setTimeout(() => {
        setProgress(100)
        setIsSolving(false)
        setLastResult(result)
        setSolverLog(result.logs)

        useTimetableStore.setState({ slots: result.slots })
        validateTimetable()

        addNotification({
          title: 'Timetable Generated',
          message: `Scheduled ${result.slots.length} periods without clashes.`,
          type: 'success',
        })
      }, 300)
    }, 200)
  }

  // Find lunch timing for clean reference
  const lunchSlot = timeSlots.find(
    (ts) => ts.type === 'lunch' || ts.label.toLowerCase().includes('lunch')
  )

  // Unselected candidate subjects for dropdowns (Unique names only!)
  const availableForPreLunch = uniqueSubjects.filter(
    (u) => !preLunchSubjectNames.some((n) => n.toLowerCase() === u.name.toLowerCase())
  )
  const availableForActivity = uniqueSubjects.filter(
    (u) => !activitySubjectNames.some((n) => n.toLowerCase() === u.name.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4 select-none text-slate-800 dark:text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-zinc-50 tracking-tight">
            Generate Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Configure rules and generate conflict-free schedules for your classes and teachers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('studio')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg text-xs font-medium hover:bg-slate-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timetable Studio</span>
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl">
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Classes & Sections</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">
            {classes.length} Classes &bull; {classes.flatMap((c) => c.sections).length} Sections
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl">
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Teaching Faculty</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">
            {teachers.length} Teachers
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl">
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Daily Periods</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">
            {timeSlots.length} Periods {lunchSlot ? `(Lunch: ${lunchSlot.startTime})` : ''}
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl">
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Curriculum Subjects</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">
            {uniqueSubjects.length} Distinct Subjects
          </div>
        </div>
      </div>

      {/* Lab Constraints Active Strip */}
      {labCapacities && labCapacities.length > 0 && (
        <div className="p-3 bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/40 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            <span className="font-semibold text-purple-900 dark:text-purple-200">
              Lab & Facility Capacity Active:
            </span>
            <span className="text-purple-700 dark:text-purple-300">
              {labCapacities.map((l) => `${l.name} (${l.capacity})`).join(' • ')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('settings')}
            className="text-[11px] text-purple-700 dark:text-purple-300 hover:underline font-medium"
          >
            Configure in Settings →
          </button>
        </div>
      )}

      {/* Main Rules Configuration */}
      <div className="space-y-3.5">
        {/* Section 1: Consecutive Block Periods */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <span className="font-semibold text-xs text-slate-900 dark:text-zinc-100 block">
                Consecutive / Double Periods (Labs & Practicals)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                Schedule back-to-back periods for practical subjects without crossing break or lunch recess.
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableBlockRules}
                onChange={(e) => setEnableBlockRules(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-zinc-600 peer-checked:bg-slate-900 dark:peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {enableBlockRules && (
            <div className="space-y-3 pt-1">
              {/* Creator Form (Deduplicated subjects in dropdown!) */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedBlockSubjectName}
                  onChange={(e) => setSelectedBlockSubjectName(e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-800 dark:text-zinc-100 focus:outline-none font-medium min-w-[200px]"
                >
                  {uniqueSubjects.map((sub) => (
                    <option key={sub.name} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-0.5">
                  {[2, 3, 4].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedBlockSize(size)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                        selectedBlockSize === size
                          ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-2xs font-semibold'
                          : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800'
                      }`}
                    >
                      {size} Periods
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddBlockRule}
                  className="flex items-center space-x-1 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg text-xs font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Rule</span>
                </button>
              </div>

              {/* Active Block Rules */}
              {blockRules.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {blockRules.map((rule) => (
                    <div
                      key={rule.id}
                      className={`inline-flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                        rule.enabled
                          ? 'bg-slate-50 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200'
                          : 'bg-slate-50/40 dark:bg-zinc-900/40 border-slate-200/50 dark:border-zinc-800 text-slate-400 line-through'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => handleToggleBlockRule(rule.id)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-0 w-3.5 h-3.5"
                      />
                      <span className="font-medium">{rule.subjectName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                        {rule.blockSize} back-to-back
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlockRule(rule.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic pt-1">
                  No block rules added. Select a practical subject above and click "Add Rule".
                </p>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Morning-Only Subjects (Before Lunch) - ZERO DUPLICATES! */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <span className="font-semibold text-xs text-slate-900 dark:text-zinc-100 block">
                Schedule Before Lunch (Morning Only)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                Strictly places selected physical activities or exercises before the lunch recess.
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enablePreLunchRule}
                onChange={(e) => setEnablePreLunchRule(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-zinc-600 peer-checked:bg-slate-900 dark:peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {enablePreLunchRule && (
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                {/* Clean Deduplicated Subject Tags */}
                {preLunchSubjectNames.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-200 text-xs font-medium"
                  >
                    <span>{name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePreLunchSubject(name)}
                      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 transition-colors"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Add Subject Dropdown (Unique names only!) */}
                {availableForPreLunch.length > 0 && (
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) handleAddPreLunchSubject(e.target.value)
                    }}
                    className="text-xs px-2 py-1 bg-slate-50 dark:bg-zinc-800 border border-dashed border-slate-300 dark:border-zinc-700 rounded-md text-slate-600 dark:text-zinc-300 focus:outline-none cursor-pointer"
                  >
                    <option value="">+ Add Subject to Morning Rule...</option>
                    {availableForPreLunch.map((sub) => (
                      <option key={sub.name} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  type="button"
                  onClick={handleResetPreLunchToDefaults}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 underline ml-auto"
                >
                  Auto-detect from curriculum
                </button>
              </div>

              {preLunchSubjectNames.length === 0 && (
                <p className="text-[11px] text-slate-400 italic">
                  No subjects selected. Pick subjects from the dropdown or click auto-detect.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Activity Subject Distribution - ZERO DUPLICATES! */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <span className="font-semibold text-xs text-slate-900 dark:text-zinc-100 block">
                Spread Activity Subjects Across Week
              </span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                Prevents recreational and elective subjects from clustering on the same day for any section.
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableActivitySpread}
                onChange={(e) => setEnableActivitySpread(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-zinc-600 peer-checked:bg-slate-900 dark:peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {enableActivitySpread && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-slate-600 dark:text-zinc-300 font-medium">Daily limit per section:</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setMaxActivitiesPerDay(1)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      maxActivitiesPerDay === 1
                        ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
                    }`}
                  >
                    Max 1 per day
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaxActivitiesPerDay(2)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      maxActivitiesPerDay === 2
                        ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
                    }`}
                  >
                    Max 2 per day
                  </button>
                </div>
              </div>

              {/* Clean Deduplicated Subject Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {activitySubjectNames.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs font-medium"
                  >
                    <span>{name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActivitySubject(name)}
                      className="text-amber-700 dark:text-amber-400 hover:text-amber-950 transition-colors"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Add Subject Dropdown (Unique names only!) */}
                {availableForActivity.length > 0 && (
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) handleAddActivitySubject(e.target.value)
                    }}
                    className="text-xs px-2 py-1 bg-slate-50 dark:bg-zinc-800 border border-dashed border-slate-300 dark:border-zinc-700 rounded-md text-slate-600 dark:text-zinc-300 focus:outline-none cursor-pointer"
                  >
                    <option value="">+ Add Subject to Activity Spread...</option>
                    {availableForActivity.map((sub) => (
                      <option key={sub.name} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  type="button"
                  onClick={handleResetActivitiesToDefaults}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 underline ml-auto"
                >
                  Auto-detect from curriculum
                </button>
              </div>

              {activitySubjectNames.length === 0 && (
                <p className="text-[11px] text-slate-400 italic">
                  No subjects selected. Pick subjects from the dropdown or click auto-detect.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Section 4: Teacher Workload & Core Options */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-3.5">
          <div className="pb-1 border-b border-slate-100 dark:border-zinc-800">
            <span className="font-semibold text-xs text-slate-900 dark:text-zinc-100 block">
              Teacher Workload & Placement Options
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex items-center justify-between font-medium text-slate-700 dark:text-zinc-300 mb-1">
                <span>Teacher Workload Distribution</span>
                <span className="font-mono text-slate-500">{balanceWeight}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={balanceWeight}
                onChange={(e) => setBalanceWeight(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-lg cursor-pointer accent-slate-900 dark:accent-blue-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Evenly spaces teaching periods across weekdays to prevent faculty overload.
              </span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-zinc-300 mb-1">
                Max Consecutive Teaching Periods
              </label>
              <input
                type="number"
                min={1}
                max={4}
                value={consecutiveLimit}
                onChange={(e) => setConsecutiveLimit(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100 font-medium focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Limits consecutive back-to-back lectures for a single teacher before a free period.
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 space-y-2">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={morningCoreBias}
                onChange={(e) => setMorningCoreBias(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-0 w-3.5 h-3.5"
              />
              <div>
                <span className="text-xs font-medium text-slate-800 dark:text-zinc-200 block">
                  Prioritize core subjects for morning periods
                </span>
                <span className="text-[11px] text-slate-400">
                  Places Mathematics, Science, and languages earlier in the school day.
                </span>
              </div>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={preserveLocks}
                onChange={(e) => setPreserveLocks(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-0 w-3.5 h-3.5"
              />
              <div>
                <span className="text-xs font-medium text-slate-800 dark:text-zinc-200 block">
                  Preserve locked periods
                </span>
                <span className="text-[11px] text-slate-400">
                  Leaves manually pinned slots untouched during timetable generation.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Area & Output */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleRunSolver}
            disabled={isSolving}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isSolving ? 'Generating Timetable...' : 'Generate Timetable'}</span>
          </button>

          {lastResult && (
            <div className="flex items-center space-x-4 text-xs">
              <span className="text-slate-600 dark:text-zinc-300">
                Scheduled <strong className="text-slate-900 dark:text-zinc-100">{lastResult.slots.length}</strong> periods in {lastResult.metrics.executionTimeMs}ms
                {lastResult.metrics.labClashesPrevented ? ` • ${lastResult.metrics.labClashesPrevented} lab collision(s) avoided` : ''}
              </span>
              <button
                type="button"
                onClick={() => setActiveView('studio')}
                className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                <span>Open in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {isSolving && (
          <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Collapsible Log Output */}
        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 font-medium"
          >
            <span>Generation Logs ({solverLog.length} lines)</span>
            {showLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showLogs && (
            <div className="mt-2 p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-slate-200/80 dark:border-zinc-700 text-[11px] font-mono text-slate-600 dark:text-zinc-400 space-y-1 max-h-48 overflow-y-auto">
              {solverLog.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
