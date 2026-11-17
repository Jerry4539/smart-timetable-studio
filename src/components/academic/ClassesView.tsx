import React, { useState } from 'react'
import { Plus, Trash2, School, UserCheck } from 'lucide-react'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useAppStore } from '../../store/useAppStore'

export const ClassesView: React.FC = () => {
  const { classes, addClass, removeClass, addSection, removeSection, teachers } = useAcademicStore()
  const { addNotification, setQuickAddModalOpen } = useAppStore()

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '')
  const [newSecName, setNewSecName] = useState('')

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0]

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSecName.trim() || !selectedClass) return
    addSection(selectedClass.id, newSecName.toUpperCase())
    setNewSecName('')
    addNotification({
      title: 'Division Created',
      message: `Division ${newSecName.toUpperCase()} added to ${selectedClass.name}.`,
      type: 'success',
    })
  }

  return (
    <div className="p-5 max-w-5xl mx-auto space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
            <School className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Standards & Divisions
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Configure school grades / standards and their respective class divisions
            </p>
          </div>
        </div>

        <button
          onClick={() => setQuickAddModalOpen(true, 'class')}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Standard</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 items-start">
        {/* Grade Selection List */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-2.5 shadow-2xs space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Standards ({classes.length})
          </div>
          {classes.map((cls) => {
            const isSelected = cls.id === selectedClass?.id
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <span>{cls.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? 'bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'
                  }`}
                >
                  {cls.sections.length} div
                </span>
              </button>
            )
          })}
        </div>

        {/* Section Table Bento Box */}
        <div className="md:col-span-3 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                {selectedClass?.name} Divisions
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                ({selectedClass?.sections.length || 0} active divisions)
              </span>
            </div>
            {classes.length > 1 && selectedClass && (
              <button
                onClick={() => removeClass(selectedClass.id)}
                className="text-[11px] text-rose-500 hover:text-rose-600 font-medium flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Standard</span>
              </button>
            )}
          </div>

          <div className="border border-slate-100 dark:border-zinc-800/80 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 font-semibold border-b border-slate-100 dark:border-zinc-800">
                <tr>
                  <th className="px-3.5 py-2.5">Division</th>
                  <th className="px-3.5 py-2.5">Class Teacher / Advisor</th>
                  <th className="px-3.5 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
                {selectedClass?.sections.map((sec) => {
                  const advisor = teachers.find((t) => t.id === sec.classTeacherId)

                  return (
                    <tr key={sec.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-zinc-100">
                        {sec.fullName}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-500">
                        {advisor ? (
                          <span className="inline-flex items-center space-x-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                            <span className="font-medium text-slate-700 dark:text-zinc-200">{advisor.name}</span>
                          </span>
                        ) : (
                          <span className="italic text-slate-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-3.5 py-2.5 text-right">
                        <button
                          onClick={() => removeSection(selectedClass.id, sec.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Remove Division"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Quick Add Division Form */}
          <form onSubmit={handleAddSection} className="flex items-center gap-2 pt-1 text-xs">
            <input
              type="text"
              placeholder="Division letter (e.g. C, D)"
              value={newSecName}
              onChange={(e) => setNewSecName(e.target.value)}
              className="h-8 flex-1 max-w-xs px-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            <button
              type="submit"
              className="h-8 px-3.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl font-semibold transition-all active:scale-95 shadow-2xs"
            >
              Add Division
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
