import React, { useState, useEffect } from 'react'
import {
  Search,
  X,
  Calendar,
  Grid,
  Users,
  GraduationCap,
  BookOpen,
  Sliders,
  Cpu,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useTimetableStore } from '../../store/useTimetableStore'
import { ActiveView } from '../../lib/types'

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveView } = useAppStore()
  const { teachers, classes, subjects } = useAcademicStore()
  const { setFilterSectionId, setFilterTeacherId, setViewMode } = useTimetableStore()

  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  if (!commandPaletteOpen) return null

  const navigateTo = (view: ActiveView) => {
    setActiveView(view)
    setCommandPaletteOpen(false)
    setQuery('')
  }

  const navigateToSection = (sectionId: string) => {
    setFilterSectionId(sectionId)
    setViewMode('class')
    setActiveView('studio')
    setCommandPaletteOpen(false)
    setQuery('')
  }

  const navigateToTeacher = (teacherId: string) => {
    setFilterTeacherId(teacherId)
    setViewMode('teacher')
    setActiveView('studio')
    setCommandPaletteOpen(false)
    setQuery('')
  }

  // Filter items
  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  )

  const filteredSections = classes
    .flatMap((c) => c.sections)
    .filter((s) => s.fullName.toLowerCase().includes(query.toLowerCase()))

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.code.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 dark:bg-black/60 backdrop-blur-2xs flex items-start justify-center pt-20 p-4 select-none">
      <div className="w-full max-w-lg bg-white dark:bg-[#18181b] border border-slate-200/90 dark:border-[#27272a] rounded-2xl shadow-popover overflow-hidden flex flex-col max-h-[70vh]">
        {/* Input Bar */}
        <div className="flex items-center px-3.5 py-2.5 border-b border-slate-200/80 dark:border-[#27272a]">
          <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teachers, classes, subjects..."
            className="w-full bg-transparent text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-0.5 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3 text-xs">
          {query === '' && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-1 mt-0.5">
                <button
                  onClick={() => navigateTo('studio')}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Timetable Studio</span>
                </button>
                <button
                  onClick={() => navigateTo('master')}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <Grid className="w-3.5 h-3.5 text-blue-500" />
                  <span>Master Grid</span>
                </button>
                <button
                  onClick={() => navigateTo('generate')}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <Cpu className="w-3.5 h-3.5 text-slate-500" />
                  <span>Generate Timetable</span>
                </button>
                <button
                  onClick={() => navigateTo('teachers')}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Teachers</span>
                </button>
                <button
                  onClick={() => navigateTo('classes')}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  <span>Classes</span>
                </button>
                <button
                  onClick={() => navigateTo('subjects')}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>Subjects</span>
                </button>
                <button
                  onClick={() => navigateTo('rules')}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>Rules</span>
                </button>
              </div>
            </div>
          )}

          {/* Filtered Sections */}
          {filteredSections.length > 0 && (
            <div>
              <div className="px-2 py-0.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Sections ({filteredSections.length})
              </div>
              <div className="space-y-0.5 mt-0.5">
                {filteredSections.slice(0, 4).map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => navigateToSection(sec.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium">{sec.fullName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">&rarr;</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Teachers */}
          {filteredTeachers.length > 0 && (
            <div>
              <div className="px-2 py-0.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Teachers ({filteredTeachers.length})
              </div>
              <div className="space-y-0.5 mt-0.5">
                {filteredTeachers.slice(0, 4).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => navigateToTeacher(t.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium">{t.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">&rarr;</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200/80 dark:border-[#27272a] text-[10px] text-slate-400 flex items-center justify-between">
          <span>Press ESC to exit</span>
          <span>Click to select</span>
        </div>
      </div>
    </div>
  )
}
