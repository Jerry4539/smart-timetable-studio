import React, { useState, useMemo } from 'react'
import { X, Plus, Users, School, BookOpen, Check } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useAcademicStore } from '../../store/useAcademicStore'
import { SUBJECT_PALETTE } from '../../lib/constants'

export const QuickAddModal: React.FC = () => {
  const { quickAddModalOpen, setQuickAddModalOpen, quickAddType, addNotification } = useAppStore()
  const { addTeacher, addSubject, addClass, classes, subjects } = useAcademicStore()

  const [activeTab, setActiveTab] = useState<'teacher' | 'class' | 'subject'>('teacher')

  // Teacher fields (A teacher can teach MULTIPLE subjects)
  const [tName, setTName] = useState('')
  const [tCode, setTCode] = useState('')
  const [tDesignation, setTDesignation] = useState('Faculty')
  const [tSubjectIds, setTSubjectIds] = useState<string[]>([])

  // Class / Standard fields
  const [cName, setCName] = useState('')
  const [cLevel, setCLevel] = useState(9)

  // Subject fields (A subject can apply to MULTIPLE grades)
  const [sName, setSName] = useState('')
  const [sCode, setSCode] = useState('')
  const [sGradeIds, setSGradeIds] = useState<string[]>([])
  const [sPeriods, setSPeriods] = useState(5)
  const [sPaletteKey, setSPaletteKey] = useState('blue')

  if (!quickAddModalOpen) return null

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

  const toggleTeacherSubjectByName = (subjectName: string) => {
    const matching = uniqueSubjects.find((u) => u.name.toLowerCase() === subjectName.toLowerCase())
    if (!matching) return

    const isAssigned = matching.allIds.some((id) => tSubjectIds.includes(id))
    if (isAssigned) {
      setTSubjectIds((prev) => prev.filter((id) => !matching.allIds.includes(id)))
    } else {
      setTSubjectIds((prev) => Array.from(new Set([...prev, ...matching.allIds])))
    }
  }

  const toggleSubjectGrade = (gradeId: string) => {
    setSGradeIds((prev) =>
      prev.includes(gradeId) ? prev.filter((id) => id !== gradeId) : [...prev, gradeId]
    )
  }

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tName.trim()) return
    addTeacher({
      name: tName.trim(),
      employeeCode: tCode.trim() || `T-${Math.floor(100 + Math.random() * 900)}`,
      email: `${tName.toLowerCase().replace(/\s+/g, '.')}@institution.edu`,
      phone: '+91 98000 00000',
      designation: tDesignation,
      qualifiedSubjectIds: tSubjectIds,
      maxPeriodsPerDay: 4,
      maxPeriodsPerWeek: 20,
      minPeriodsPerDay: 1,
      maxConsecutivePeriods: 2,
      availability: [],
    })
    addNotification({
      title: 'Teacher Created',
      message: `${tName} added with ${tSubjectIds.length} qualified subject(s).`,
      type: 'success',
    })
    setQuickAddModalOpen(false)
  }

  const handleClassSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cName.trim()) return
    addClass(cName.trim(), cLevel)
    addNotification({
      title: 'Standard Created',
      message: `${cName} added to academic structure.`,
      type: 'success',
    })
    setQuickAddModalOpen(false)
  }

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sName.trim()) return
    const palette = SUBJECT_PALETTE[sPaletteKey] || SUBJECT_PALETTE.blue
    const assignedGrades = sGradeIds.length > 0 ? sGradeIds : classes.map((c) => c.id)

    addSubject({
      name: sName.trim(),
      code: sCode.trim() || sName.slice(0, 4).toUpperCase(),
      category: 'core',
      gradeIds: assignedGrades,
      weeklyPeriodsRequired: sPeriods,
      maxPeriodsPerDay: 2,
      isDoublePeriodAllowed: false,
      color: palette,
    })
    addNotification({
      title: 'Subject Added',
      message: `${sName} assigned to ${assignedGrades.length} standard(s).`,
      type: 'success',
    })
    setQuickAddModalOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 dark:bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-popover overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
            <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
              Quick Add Resource
            </span>
          </div>
          <button
            onClick={() => setQuickAddModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200/80 dark:border-zinc-800 p-1.5 bg-slate-50 dark:bg-zinc-950">
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'teacher'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Teacher</span>
          </button>
          <button
            onClick={() => setActiveTab('class')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'class'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Standard</span>
          </button>
          <button
            onClick={() => setActiveTab('subject')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'subject'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Subject</span>
          </button>
        </div>

        {/* Forms */}
        <div className="p-4 text-xs">
          {activeTab === 'teacher' && (
            <form onSubmit={handleTeacherSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Priya Patel"
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  required
                  className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                    Employee Code
                  </label>
                  <input
                    type="text"
                    placeholder="T-107"
                    value={tCode}
                    onChange={(e) => setTCode(e.target.value)}
                    className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={tDesignation}
                    onChange={(e) => setTDesignation(e.target.value)}
                    className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Multi-subject assignment */}
              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                  Qualified Subjects (Can teach multiple)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700">
                  {uniqueSubjects.map((sub) => {
                    const isSelected = sub.allIds.some((id) => tSubjectIds.includes(id))
                    return (
                      <button
                        type="button"
                        key={sub.name}
                        onClick={() => toggleTeacherSubjectByName(sub.name)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                            : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{sub.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl font-semibold transition-all active:scale-95 shadow-2xs"
              >
                Create Teacher
              </button>
            </form>
          )}

          {activeTab === 'class' && (
            <form onSubmit={handleClassSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                  Standard / Grade Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Std 11, Grade 9"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  required
                  className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                  Numeric Level (1-12)
                </label>
                <input
                  type="number"
                  value={cLevel}
                  onChange={(e) => setCLevel(Number(e.target.value))}
                  min={1}
                  max={12}
                  className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl font-semibold transition-all active:scale-95 shadow-2xs"
              >
                Create Standard
              </button>
            </form>
          )}

          {activeTab === 'subject' && (
            <form onSubmit={handleSubjectSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Environmental Studies"
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  required
                  className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              {/* Multi-Grade assignment chips */}
              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                  Applies to Standards (Select one or more)
                </label>
                <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700">
                  {classes.map((cls) => {
                    const isSelected = sGradeIds.includes(cls.id)
                    return (
                      <button
                        type="button"
                        key={cls.id}
                        onClick={() => toggleSubjectGrade(cls.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                            : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{cls.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. EVS"
                    value={sCode}
                    onChange={(e) => setSCode(e.target.value)}
                    className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                    Periods / Week
                  </label>
                  <input
                    type="number"
                    value={sPeriods}
                    onChange={(e) => setSPeriods(Number(e.target.value))}
                    min={1}
                    max={12}
                    className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                  Color Tag
                </label>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {Object.entries(SUBJECT_PALETTE).map(([key, pal]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setSPaletteKey(key)}
                      style={{ backgroundColor: pal.bg, color: pal.text, borderColor: pal.border }}
                      className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold capitalize transition-all ${
                        sPaletteKey === key ? 'ring-2 ring-blue-500 scale-105' : 'opacity-80'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl font-semibold transition-all active:scale-95 shadow-2xs"
              >
                Create Subject
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
