import React, { useState, useMemo } from 'react'
import {
  Users,
  Search,
  Check,
  Plus,
  SlidersHorizontal,
  Trash2,
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
} from 'lucide-react'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useTimetableStore } from '../../store/useTimetableStore'
import { useAppStore } from '../../store/useAppStore'
import { Teacher, Subject } from '../../lib/types'

export const TeachersView: React.FC = () => {
  const { teachers, subjects, updateTeacher, removeTeacher } = useAcademicStore()
  const { slots } = useTimetableStore()
  const { addNotification } = useAppStore()

  const [activeTab, setActiveTab] = useState<'cards' | 'matrix'>('cards')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all')
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null)

  // Workload limits modal
  const [editingLimitsTeacher, setEditingLimitsTeacher] = useState<Teacher | null>(null)
  const [maxPerDay, setMaxPerDay] = useState(4)
  const [maxPerWeek, setMaxPerWeek] = useState(20)
  const [maxConsecutive, setMaxConsecutive] = useState(3)

  // Distinct subjects grouped by normalized name
  const uniqueSubjects = useMemo(() => {
    const map = new Map<string, Subject & { allIds: string[] }>()
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

  const handleDelete = (id: string, name: string) => {
    removeTeacher(id)
    addNotification({
      title: 'Teacher Removed',
      message: `${name} was removed from the faculty registry.`,
      type: 'info',
    })
  }

  // Toggle a unique subject for a teacher (assigns/unassigns all matching grade IDs)
  const toggleTeacherUniqueSubject = (teacher: Teacher, subjectName: string) => {
    const matching = uniqueSubjects.find((u) => u.name.toLowerCase() === subjectName.toLowerCase())
    if (!matching) return

    const isAssigned = matching.allIds.some((id) => teacher.qualifiedSubjectIds.includes(id))
    let newSubjectIds: string[]
    if (isAssigned) {
      newSubjectIds = teacher.qualifiedSubjectIds.filter((id) => !matching.allIds.includes(id))
    } else {
      newSubjectIds = Array.from(new Set([...teacher.qualifiedSubjectIds, ...matching.allIds]))
    }

    updateTeacher(teacher.id, { qualifiedSubjectIds: newSubjectIds })
    addNotification({
      title: isAssigned ? 'Subject Unassigned' : 'Subject Qualified',
      message: `${teacher.name} ${isAssigned ? 'unassigned from' : 'is now qualified for'} ${matching.name}.`,
      type: 'info',
    })
  }

  const handleOpenLimitsModal = (t: Teacher) => {
    setEditingLimitsTeacher(t)
    setMaxPerDay(t.maxPeriodsPerDay)
    setMaxPerWeek(t.maxPeriodsPerWeek)
    setMaxConsecutive(t.maxConsecutivePeriods)
  }

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLimitsTeacher) return
    updateTeacher(editingLimitsTeacher.id, {
      maxPeriodsPerDay: maxPerDay,
      maxPeriodsPerWeek: maxPerWeek,
      maxConsecutivePeriods: maxConsecutive,
    })
    addNotification({
      title: 'Workload Caps Updated',
      message: `${editingLimitsTeacher.name}'s period limits have been saved.`,
      type: 'success',
    })
    setEditingLimitsTeacher(null)
  }

  // Filtered teachers
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.designation.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSubject =
      selectedSubjectFilter === 'all' ||
      t.qualifiedSubjectIds.some((id) => {
        const s = subjects.find((item) => item.id === id)
        return s && s.name.toLowerCase() === selectedSubjectFilter.toLowerCase()
      })

    return matchesSearch && matchesSubject
  })

  return (
    <div className="p-4 sm:p-5 max-w-6xl mx-auto space-y-4 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80 dark:border-zinc-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Faculty & Teaching Staff
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Manage teachers, map subject qualifications, and configure workload bounds
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Switcher: Cards vs Matrix */}
          <div className="flex bg-slate-100 dark:bg-zinc-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-zinc-700 text-xs">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeTab === 'cards'
                  ? 'bg-white text-slate-900 dark:bg-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Faculty Profiles
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-white text-slate-900 dark:bg-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Subject Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-2.5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search faculty by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="h-8 px-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700 rounded-xl font-medium text-slate-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="all">All Subjects ({uniqueSubjects.length})</option>
            {uniqueSubjects.map((sub) => (
              <option key={sub.name} value={sub.name.toLowerCase()}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-[11px] text-slate-400 font-medium">
          Showing {filteredTeachers.length} of {teachers.length} faculty
        </div>
      </div>

      {/* VIEW 1: Bento Profile Cards */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {filteredTeachers.map((teacher) => {
            const qualifiedUnique = uniqueSubjects.filter((u) =>
              u.allIds.some((id) => teacher.qualifiedSubjectIds.includes(id))
            )
            const assignedCount = slots.filter((s) => s.teacherId === teacher.id).length
            const isEditing = editingTeacherId === teacher.id
            const loadPercent = Math.min(
              100,
              Math.round((assignedCount / (teacher.maxPeriodsPerWeek || 1)) * 100)
            )

            // Initials
            const initials = teacher.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')

            return (
              <div
                key={teacher.id}
                className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs space-y-3.5 transition-all hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col justify-between"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold flex items-center justify-center border border-slate-200 dark:border-zinc-700 text-xs">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                          {teacher.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-mono bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-semibold">
                          {teacher.employeeCode}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                        {teacher.designation} &bull; <span className="font-mono text-[10px]">{teacher.email || 'No email'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenLimitsModal(teacher)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-medium transition-all"
                      title="Edit Period Caps"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(teacher.id, teacher.name)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
                      title="Remove Faculty"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Workload Progress Bar Tile */}
                <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600 dark:text-zinc-400">
                      Workload Assignment
                    </span>
                    <span className="font-mono text-slate-900 dark:text-zinc-100 font-bold">
                      {assignedCount} / {teacher.maxPeriodsPerWeek} periods/wk ({loadPercent}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        loadPercent > 90 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                    <span>Daily Cap: max {teacher.maxPeriodsPerDay} periods</span>
                    <span>Consecutive: max {teacher.maxConsecutivePeriods} periods</span>
                  </div>
                </div>

                {/* Subjects Section */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Qualified Subjects ({qualifiedUnique.length})
                    </div>
                    <button
                      onClick={() => setEditingTeacherId(isEditing ? null : teacher.id)}
                      className={`text-[11px] px-2 py-0.5 rounded-lg font-semibold transition-all ${
                        isEditing
                          ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                      }`}
                    >
                      {isEditing ? 'Done' : '+ Edit Subjects'}
                    </button>
                  </div>

                  {isEditing ? (
                    /* Interactive distinct subject chips in edit mode (No duplicates!) */
                    <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700 flex flex-wrap gap-1.5 animate-in fade-in duration-100 max-h-56 overflow-y-auto">
                      {uniqueSubjects.map((sub) => {
                        const isAssigned = sub.allIds.some((id) =>
                          teacher.qualifiedSubjectIds.includes(id)
                        )
                        return (
                          <button
                            key={sub.name}
                            type="button"
                            onClick={() => toggleTeacherUniqueSubject(teacher, sub.name)}
                            style={
                              isAssigned
                                ? {
                                    backgroundColor: sub.color.bg,
                                    color: sub.color.text,
                                    borderColor: sub.color.indicator,
                                  }
                                : undefined
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-all ${
                              isAssigned
                                ? 'border-l-[3.5px] shadow-2xs font-bold'
                                : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-400 opacity-70 hover:opacity-100'
                            }`}
                          >
                            {isAssigned && <Check className="w-3 h-3" />}
                            <span>{sub.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    /* Clean deduplicated tag view */
                    <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
                      {qualifiedUnique.length > 0 ? (
                        qualifiedUnique.map((s) => (
                          <span
                            key={s.name}
                            style={{
                              backgroundColor: s.color.bg,
                              borderLeftColor: s.color.indicator,
                              color: s.color.text,
                            }}
                            className="px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-zinc-800 border-l-[3.5px] text-[11px] font-bold shadow-2xs"
                          >
                            {s.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          No subjects assigned. Click "+ Edit Subjects" to assign.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* VIEW 2: Subject Matrix (Shows distinct subjects and assigned teachers) */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {uniqueSubjects.map((sub) => {
            const qualifiedTeachers = teachers.filter((t) =>
              sub.allIds.some((id) => t.qualifiedSubjectIds.includes(id))
            )

            return (
              <div
                key={sub.name}
                className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: sub.color.indicator }}
                    />
                    <span className="font-bold text-xs text-slate-900 dark:text-zinc-100">
                      {sub.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      ({sub.code})
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500 font-medium">
                    {qualifiedTeachers.length} Qualified Teachers
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {qualifiedTeachers.length > 0 ? (
                      qualifiedTeachers.map((t) => (
                        <span
                          key={t.id}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] font-medium"
                        >
                          {t.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-rose-500 font-medium">
                        No faculty assigned yet
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Limits Modal */}
      {editingLimitsTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                Workload Limits: {editingLimitsTeacher.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                Configure teaching period limits and consecutive limits
              </p>
            </div>

            <form onSubmit={handleSaveLimits} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                  Max Periods Per Day
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={maxPerDay}
                  onChange={(e) => setMaxPerDay(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                  Max Periods Per Week
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={maxPerWeek}
                  onChange={(e) => setMaxPerWeek(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                  Max Consecutive Periods
                </label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={maxConsecutive}
                  onChange={(e) => setMaxConsecutive(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingLimitsTeacher(null)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-medium shadow-2xs"
                >
                  Save Limits
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
