import React, { useState } from 'react'
import { History, Copy, Check, Calendar, ArrowRight, ShieldCheck, Plus, GitBranch } from 'lucide-react'
import { useTimetableStore } from '../../store/useTimetableStore'
import { useAppStore } from '../../store/useAppStore'

export const VersionsView: React.FC = () => {
  const { versions, activeVersionId, setActiveVersionId, duplicateVersion } = useTimetableStore()
  const { addNotification, setActiveView } = useAppStore()

  const [sandboxName, setSandboxName] = useState('')
  const [showSandboxForm, setShowSandboxForm] = useState(false)

  const handleCreateSandbox = (e: React.FormEvent) => {
    e.preventDefault()
    const name = sandboxName.trim() || `Sandbox Experiment (v${versions.length + 1})`
    duplicateVersion(name, true)
    setSandboxName('')
    setShowSandboxForm(false)
    addNotification({
      title: 'Sandbox Created',
      message: `Switched to ${name}. Experiment freely without affecting published master schedule.`,
      type: 'success',
    })
    setActiveView('studio')
  }

  const handleActivate = (id: string, name: string) => {
    setActiveVersionId(id)
    addNotification({
      title: 'Active Schedule Switched',
      message: `Now viewing and editing: ${name}.`,
      type: 'info',
    })
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Timetable Version History & Sandbox
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable version snapshots, branch revisions, and risk-free sandbox experimentation.
          </p>
        </div>
        <button
          onClick={() => setShowSandboxForm(!showSandboxForm)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Branch Sandbox Copy</span>
        </button>
      </div>

      {/* Sandbox Creation Inline Form */}
      {showSandboxForm && (
        <form
          onSubmit={handleCreateSandbox}
          className="p-5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl space-y-3"
        >
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-zinc-100">
            <GitBranch className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Create Sandbox Experiment Branch</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Clones all current lecture allocations, division schedules, and hard locks into an isolated sandbox environment.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="e.g. Trial: Shift Math to Morning Block"
              value={sandboxName}
              onChange={(e) => setSandboxName(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg shadow-xs"
            >
              Spawn Branch
            </button>
          </div>
        </form>
      )}

      {/* Versions List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-soft-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Saved Revisions & Snapshots ({versions.length})
        </h2>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          {versions.map((ver) => {
            const isActive = ver.id === activeVersionId

            return (
              <div
                key={ver.id}
                className={`p-4 flex items-center justify-between transition-colors ${
                  isActive ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    v{ver.versionNumber}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {ver.name}
                      </span>
                      {isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                          Active Master
                        </span>
                      )}
                      {ver.isSandbox && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                          Sandbox
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {ver.academicYear} &bull; {ver.slotsCount} periods mapped &bull; Updated {new Date(ver.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <div className="text-right hidden sm:block">
                    <span className="text-slate-700 dark:text-slate-300 font-bold block">
                      {ver.healthScore}% Health
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{ver.status}</span>
                  </div>

                  {!isActive && (
                    <button
                      onClick={() => handleActivate(ver.id, ver.name)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
                    >
                      Switch to this
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
