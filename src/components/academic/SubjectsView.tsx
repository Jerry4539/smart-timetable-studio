import React, { useState, useMemo } from 'react'
import {
  Plus,
  Trash2,
  Check,
  BookOpen,
  GraduationCap,
  Users,
  Search,
  Palette,
} from 'lucide-react'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useAppStore } from '../../store/useAppStore'
import { useTimetableStore } from '../../store/useTimetableStore'
import { SUBJECT_PALETTE } from '../../lib/constants'
import { Subject } from '../../lib/types'

export const SubjectsView: React.FC = () => {
  const { subjects, classes, teachers, updateSubject, removeSubject, addSubject, updateTeacher } =
    useAcademicStore()
  const { addNotification } = useAppStore()
  const { slots } = useTimetableStore()

  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingColorKey, setEditingColorKey] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [assigningFacultyKey, setAssigningFacultyKey] = useState<string | null>(null)

  // New Subject Form State
  const [newName, setNewName] = useState('')
  const [newCode, setNewCode] = useState('')
  const [newPeriods, setNewPeriods] = useState(5)
  const [newGradeIds, setNewGradeIds] = useState<string[]>([])
  const [newColorKey, setNewColorKey] = useState('blue')

  const toggleNewGrade = (gradeId: string) => {
    setNewGradeIds((prev) =>
      prev.includes(gradeId) ? prev.filter((id) => id !== gradeId) : [...prev, gradeId]
    )
  }

  // Canonical curriculum subjects grouped by unique name
  const uniqueCurriculumSubjects = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string
        name: string
        code: string
        color: Subject['color']
        allSubjectIds: string[]
        gradeIds: string[]
        minPeriods: number
        maxPeriods: number
      }
    >()

    subjects.forEach((s) => {
      const key = s.name.trim().toLowerCase()
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: s.name.trim(),
          code: s.code.replace(/-\d+$/, ''),
          color: s.color,
          allSubjectIds: [s.id],
          gradeIds: [...s.gradeIds],
          minPeriods: s.weeklyPeriodsRequired,
          maxPeriods: s.weeklyPeriodsRequired,
        })
      } else {
        const item = map.get(key)!
        item.allSubjectIds.push(s.id)
        s.gradeIds.forEach((gid) => {
          if (!item.gradeIds.includes(gid)) item.gradeIds.push(gid)
        })
        item.minPeriods = Math.min(item.minPeriods, s.weeklyPeriodsRequired)
        item.maxPeriods = Math.max(item.maxPeriods, s.weeklyPeriodsRequired)
      }
    })

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [subjects])

  const handleColorChange = (allSubjectIds: string[], paletteKey: string) => {
    const pal = SUBJECT_PALETTE[paletteKey]
    if (!pal) return
    allSubjectIds.forEach((id) => {
      updateSubject(id, { color: pal })
    })
    setEditingColorKey(null)
    addNotification({
      title: 'Subject Color Updated',
      message: `Color signature refreshed across curriculum and timetable views.`,
      type: 'info',
    })
  }

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    const pal = SUBJECT_PALETTE[newColorKey] || SUBJECT_PALETTE.blue
    const targetGrades = newGradeIds.length > 0 ? newGradeIds : classes.map((c) => c.id)

    addSubject({
      name: newName.trim(),
      code: newCode.trim() || newName.slice(0, 4).toUpperCase(),
      category: 'core',
      gradeIds: targetGrades,
      weeklyPeriodsRequired: newPeriods,
      maxPeriodsPerDay: 2,
      isDoublePeriodAllowed: false,
      color: pal,
    })
    setNewName('')
    setNewCode('')
    setNewGradeIds([])
    setShowAddForm(false)
    addNotification({
      title: 'Subject Created',
      message: `${newName} allocated to ${targetGrades.length} standard(s).`,
      type: 'success',
    })
  }

  const handleDeleteSubjectGroup = (allSubjectIds: string[], name: string) => {
    allSubjectIds.forEach((id) => removeSubject(id))
    addNotification({
      title: 'Subject Removed',
      message: `${name} was removed from the curriculum.`,
      type: 'info',
    })
  }

  // Toggle teacher qualification across all matching grade-level instances of this subject
  const toggleTeacherQualificationGroup = (teacherId: string, allSubjectIds: string[], subjectName: string) => {
    const teacher = teachers.find((t) => t.id === teacherId)
    if (!teacher) return

    const isAssigned = allSubjectIds.some((id) => teacher.qualifiedSubjectIds.includes(id))
    let newSubjectIds: string[]
    if (isAssigned) {
      newSubjectIds = teacher.qualifiedSubjectIds.filter((id) => !allSubjectIds.includes(id))
    } else {
      newSubjectIds = Array.from(new Set([...teacher.qualifiedSubjectIds, ...allSubjectIds]))
    }

    updateTeacher(teacher.id, { qualifiedSubjectIds: newSubjectIds })
    addNotification({
      title: isAssigned ? 'Faculty Unassigned' : 'Faculty Qualified',
      message: `${teacher.name} ${isAssigned ? 'unassigned from' : 'assigned to'} ${subjectName}.`,
      type: 'info',
    })
  }

  // Filtered view items
  const isAllStandards = selectedGradeFilter === 'all'

  const filteredCurriculum = useMemo(() => {
    if (!isAllStandards) return []
    return uniqueCurriculumSubjects.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [isAllStandards, uniqueCurriculumSubjects, searchQuery])

  const filteredGradeSubjects = useMemo(() => {
    if (isAllStandards) return []
    return subjects.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGrade = s.gradeIds.includes(selectedGradeFilter)
      return matchesSearch && matchesGrade
    })
  }, [isAllStandards, subjects, selectedGradeFilter, searchQuery])

  return (
    <div className="p-4 sm:p-5 max-w-6xl mx-auto space-y-4 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80 dark:border-zinc-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center border border-purple-100 dark:border-purple-900/40 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Curriculum & Subjects
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Configure curriculum subjects, weekly periods, and assign qualified teaching faculty
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Filter and Standard Tabs Strip */}
      <div className="p-2.5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search subjects by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700 rounded-xl text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Grade Selector Tabs (Clean distinct count!) */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-zinc-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-zinc-700 flex-wrap">
            <button
              onClick={() => setSelectedGradeFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedGradeFilter === 'all'
                  ? 'bg-white text-slate-900 dark:bg-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Standards ({uniqueCurriculumSubjects.length})
            </button>
            {classes.map((cls) => {
              const count = subjects.filter((s) => s.gradeIds.includes(cls.id)).length
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedGradeFilter(cls.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedGradeFilter === cls.id
                      ? 'bg-white text-slate-900 dark:bg-zinc-900 dark:text-zinc-100 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cls.name} ({count})
                </button>
              )
            })}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-medium">
          Showing {isAllStandards ? filteredCurriculum.length : filteredGradeSubjects.length} of{' '}
          {isAllStandards ? uniqueCurriculumSubjects.length : subjects.length} subjects
        </div>
      </div>

      {/* Inline Create Subject Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateSubject}
          className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-3.5 text-xs animate-in fade-in duration-150"
        >
          <div className="font-bold text-slate-900 dark:text-zinc-100 pb-1 border-b border-slate-100 dark:border-zinc-800">
            Define Subject & Assign Applicable Standards
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                Subject Name
              </label>
              <input
                type="text"
                placeholder="e.g. Physics, Hindi, Civics"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                Subject Code
              </label>
              <input
                type="text"
                placeholder="e.g. PHY, HIN"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-mono text-slate-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                Periods Required / Week
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={newPeriods}
                onChange={(e) => setNewPeriods(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-medium text-slate-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
              Applicable Standards (Select all grades that take this subject)
            </label>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {classes.map((c) => {
                const isSelected = newGradeIds.includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleNewGrade(c.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-700 shadow-2xs'
                        : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    {c.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 text-[11px] font-medium mr-1">Color:</span>
              {Object.entries(SUBJECT_PALETTE).map(([key, pal]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setNewColorKey(key)}
                  style={{ backgroundColor: pal.indicator }}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    newColorKey === key ? 'scale-125 ring-2 ring-purple-600 ring-offset-1' : ''
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-2xs"
              >
                Save Subject
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Grid: ALL STANDARDS (Distinct Curriculum Subjects - NO DUPLICATES!) */}
      {isAllStandards && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {filteredCurriculum.map((sub) => {
            const isEditingColor = editingColorKey === sub.key
            const isAssigningFaculty = assigningFacultyKey === sub.key

            const gradeNames = classes
              .filter((c) => sub.gradeIds.includes(c.id))
              .map((c) => c.name)

            // Faculty qualified for this curriculum subject
            const qualifiedFaculty = teachers.filter((t) =>
              sub.allSubjectIds.some((id) => t.qualifiedSubjectIds.includes(id))
            )

            const periodsLabel =
              sub.minPeriods === sub.maxPeriods
                ? `${sub.minPeriods} periods / week required`
                : `${sub.minPeriods}–${sub.maxPeriods} periods / week required`

            return (
              <div
                key={sub.key}
                className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs space-y-3.5 transition-all hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: sub.color.indicator }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                          {sub.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-mono bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-semibold">
                          {sub.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {periodsLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingColorKey(isEditingColor ? null : sub.key)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-medium transition-all"
                      title="Change Color Signature"
                    >
                      <Palette className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteSubjectGroup(sub.allSubjectIds, sub.name)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                      title="Remove Subject from Curriculum"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Color Swatch Picker */}
                {isEditingColor && (
                  <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700 flex items-center justify-between animate-in fade-in duration-100">
                    <div className="flex items-center space-x-1.5">
                      {Object.entries(SUBJECT_PALETTE).map(([paletteName, pal]) => (
                        <button
                          key={paletteName}
                          onClick={() => handleColorChange(sub.allSubjectIds, paletteName)}
                          style={{ backgroundColor: pal.indicator }}
                          className="w-4 h-4 rounded-full border border-white dark:border-zinc-900 shadow-2xs hover:scale-125 transition-transform"
                          title={`Select Soft ${paletteName}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setEditingColorKey(null)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 font-medium"
                    >
                      Close
                    </button>
                  </div>
                )}

                {/* Applicable Standards Badges */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Applies to Standards ({gradeNames.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {gradeNames.length > 0 ? (
                      gradeNames.map((gName, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 text-[10px] font-semibold text-slate-700 dark:text-zinc-300"
                        >
                          {gName}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">All Standards</span>
                    )}
                  </div>
                </div>

                {/* Qualified Faculty */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Qualified Faculty ({qualifiedFaculty.length})
                    </div>
                    <button
                      onClick={() => setAssigningFacultyKey(isAssigningFaculty ? null : sub.key)}
                      className={`text-[11px] px-2 py-0.5 rounded-lg font-semibold transition-all ${
                        isAssigningFaculty
                          ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
                      }`}
                    >
                      {isAssigningFaculty ? 'Done' : '+ Assign Faculty'}
                    </button>
                  </div>

                  {isAssigningFaculty ? (
                    <div className="p-2 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700 flex flex-wrap gap-1.5 animate-in fade-in duration-100 max-h-40 overflow-y-auto">
                      {teachers.map((t) => {
                        const isAssigned = sub.allSubjectIds.some((id) =>
                          t.qualifiedSubjectIds.includes(id)
                        )
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() =>
                              toggleTeacherQualificationGroup(t.id, sub.allSubjectIds, sub.name)
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-all ${
                              isAssigned
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs font-bold'
                                : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500 opacity-60 hover:opacity-100'
                            }`}
                          >
                            {isAssigned && <Check className="w-3 h-3" />}
                            <span>{t.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 min-h-[30px] items-center">
                      {qualifiedFaculty.length > 0 ? (
                        qualifiedFaculty.map((t) => (
                          <span
                            key={t.id}
                            className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold border border-indigo-100 dark:border-indigo-900/40"
                          >
                            <Users className="w-3 h-3 text-indigo-500" />
                            <span>{t.name}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          No faculty qualified yet. Click "+ Assign Faculty".
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

      {/* Grid: SPECIFIC GRADE VIEW (Shows subjects specifically for this standard) */}
      {!isAllStandards && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {filteredGradeSubjects.map((sub) => {
            const isEditingColor = editingColorKey === sub.id
            const isAssigningFaculty = assigningFacultyKey === sub.id

            const qualifiedFaculty = teachers.filter((t) =>
              t.qualifiedSubjectIds.includes(sub.id)
            )

            return (
              <div
                key={sub.id}
                className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs space-y-3.5 transition-all hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: sub.color.indicator }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                          {sub.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-mono bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-semibold">
                          {sub.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {sub.weeklyPeriodsRequired} periods / week required
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingColorKey(isEditingColor ? null : sub.id)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-medium transition-all"
                      title="Change Color Signature"
                    >
                      <Palette className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => removeSubject(sub.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                      title="Remove Subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Color Swatch Picker */}
                {isEditingColor && (
                  <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700 flex items-center justify-between animate-in fade-in duration-100">
                    <div className="flex items-center space-x-1.5">
                      {Object.entries(SUBJECT_PALETTE).map(([paletteName, pal]) => (
                        <button
                          key={paletteName}
                          onClick={() => handleColorChange([sub.id], paletteName)}
                          style={{ backgroundColor: pal.indicator }}
                          className="w-4 h-4 rounded-full border border-white dark:border-zinc-900 shadow-2xs hover:scale-125 transition-transform"
                          title={`Select Soft ${paletteName}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setEditingColorKey(null)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 font-medium"
                    >
                      Close
                    </button>
                  </div>
                )}

                {/* Qualified Faculty */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Qualified Faculty ({qualifiedFaculty.length})
                    </div>
                    <button
                      onClick={() => setAssigningFacultyKey(isAssigningFaculty ? null : sub.id)}
                      className={`text-[11px] px-2 py-0.5 rounded-lg font-semibold transition-all ${
                        isAssigningFaculty
                          ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
                      }`}
                    >
                      {isAssigningFaculty ? 'Done' : '+ Assign Faculty'}
                    </button>
                  </div>

                  {isAssigningFaculty ? (
                    <div className="p-2 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200/80 dark:border-zinc-700 flex flex-wrap gap-1.5 animate-in fade-in duration-100 max-h-40 overflow-y-auto">
                      {teachers.map((t) => {
                        const isAssigned = t.qualifiedSubjectIds.includes(sub.id)
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() =>
                              toggleTeacherQualificationGroup(t.id, [sub.id], sub.name)
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-all ${
                              isAssigned
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs font-bold'
                                : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500 opacity-60 hover:opacity-100'
                            }`}
                          >
                            {isAssigned && <Check className="w-3 h-3" />}
                            <span>{t.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 min-h-[30px] items-center">
                      {qualifiedFaculty.length > 0 ? (
                        qualifiedFaculty.map((t) => (
                          <span
                            key={t.id}
                            className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold border border-indigo-100 dark:border-indigo-900/40"
                          >
                            <Users className="w-3 h-3 text-indigo-500" />
                            <span>{t.name}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          No faculty qualified yet. Click "+ Assign Faculty".
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
    </div>
  )
}
