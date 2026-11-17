import React from 'react'
import {
  Search,
  Sun,
  Moon,
  ShieldCheck,
  AlertTriangle,
  School,
  GitBranch,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useValidationStore } from '../../store/useValidationStore'
import { useTimetableStore } from '../../store/useTimetableStore'

export const TopNavigation: React.FC = () => {
  const {
    theme,
    toggleTheme,
    setCommandPaletteOpen,
    setInstitutionModalOpen,
    setVersionModalOpen,
    addNotification,
  } = useAppStore()

  const { institution } = useAcademicStore()
  const { health, conflicts, setSelectedConflict } = useValidationStore()
  const { versions, activeVersionId } = useTimetableStore()

  const activeVersion = versions.find((v) => v.id === activeVersionId)

  return (
    <header className="h-12 border-b border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#121215] px-4 flex items-center justify-between z-20 select-none shrink-0">
      {/* Left: Institution Crest & Identity */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={() => setInstitutionModalOpen(true)}
          className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
          title="Edit Institution Profile"
        >
          <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shrink-0">
            <School className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[13px] text-slate-900 dark:text-zinc-100 tracking-tight leading-tight">
              {institution.name || 'Oakridge International Academy'}
            </span>
            <span className="text-[11px] px-1.5 py-0.2 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded font-semibold border border-slate-200 dark:border-zinc-700">
              {institution.academicYear || '2026-2027'}
            </span>
          </div>
        </button>

        {activeVersion && (
          <button
            onClick={() => setVersionModalOpen(true)}
            className="hidden md:flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 text-[11px] font-semibold transition-all active:scale-95"
            title="Switch or compare timetable versions"
          >
            <GitBranch className="w-3 h-3 text-slate-600 dark:text-zinc-400" />
            <span className="truncate max-w-[130px]">{activeVersion.name}</span>
          </button>
        )}
      </div>

      {/* Middle: Centered Search Bar (Ctrl+K) */}
      <div className="flex-1 max-w-sm mx-4 hidden sm:block">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 h-8 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-400 text-xs transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-zinc-400">
              Search teachers, classes, subjects...
            </span>
          </div>
          <kbd className="px-1.5 py-0.2 text-[9px] font-mono font-semibold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded text-slate-400">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Actions: Health Status Pill & Theme Switcher */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            if (conflicts.length > 0) {
              setSelectedConflict(conflicts[0])
            } else {
              addNotification({
                title: 'Schedule Conflict-Free',
                message: 'All hard constraints validated with 0 clashes.',
                type: 'success',
              })
            }
          }}
          className={`flex items-center space-x-1.5 h-8 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            health.hardConflictsCount === 0
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 animate-pulse'
          }`}
          title="Click to view constraint validation details"
        >
          {health.hardConflictsCount === 0 ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Conflict-Free</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>{health.hardConflictsCount} Conflicts</span>
            </>
          )}
        </button>

        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>
    </header>
  )
}
