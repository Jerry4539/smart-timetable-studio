import React, { useState } from 'react'
import {
  X,
  Copy,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sliders,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react'
import { useTimetableStore } from '../../store/useTimetableStore'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useAppStore } from '../../store/useAppStore'
import { StorageEngine } from '../../lib/storage'
import { TimetableSlot } from '../../lib/types'

interface VersionManagerModalProps {
  isOpen: boolean
  onClose: () => void
}

export const VersionManagerModal: React.FC<VersionManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    versions,
    activeVersionId,
    setActiveVersionId,
    duplicateVersion,
    slots,
  } = useTimetableStore()
  const { teachers, subjects, classes } = useAcademicStore()
  const { addNotification } = useAppStore()

  const [newVersionName, setNewVersionName] = useState('')
  const [isSandbox, setIsSandbox] = useState(true)
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null)

  if (!isOpen) return null

  const activeVer = versions.find((v) => v.id === activeVersionId)
  const compareVer = versions.find((v) => v.id === compareVersionId)

  // Get slots for comparison
  const compareSlots: TimetableSlot[] = compareVersionId
    ? StorageEngine.getSlots(compareVersionId)
    : []

  // Compute differences
  const diffMetrics = compareVer
    ? {
        totalSlotsDiff: slots.length - compareSlots.length,
        changedPositions: slots.filter((s) => {
          const match = compareSlots.find(
            (cs) =>
              cs.sectionId === s.sectionId &&
              cs.day === s.day &&
              cs.periodIndex === s.periodIndex
          )
          return !match || match.subjectId !== s.subjectId || match.teacherId !== s.teacherId
        }).length,
      }
    : null

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVersionName.trim()) return

    duplicateVersion(newVersionName.trim(), isSandbox)
    addNotification({
      title: isSandbox ? 'What-If Sandbox Created' : 'New Version Created',
      message: `Duplicated schedule into "${newVersionName.trim()}".`,
      type: 'success',
    })
    setNewVersionName('')
  }

  const handlePromoteToPublished = (versionId: string) => {
    const updated = versions.map((v) =>
      v.id === versionId
        ? { ...v, status: 'published' as const }
        : v.status === 'published'
        ? { ...v, status: 'reviewed' as const }
        : v
    )
    StorageEngine.saveVersions(updated)
    useTimetableStore.setState({ versions: updated })
    addNotification({
      title: 'Version Published',
      message: 'This schedule is now marked as the Official Institutional Timetable.',
      type: 'success',
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none text-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center border border-purple-100 dark:border-purple-900/50">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-zinc-100 text-sm tracking-tight">
                Timetable Versions &amp; What-If Sandbox
              </h2>
              <p className="text-[10px] text-slate-400">
                Manage official schedules, create sandbox trials, and compare differences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Create New Sandbox / Version */}
          <form
            onSubmit={handleCreateVersion}
            className="p-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/80 rounded-xl space-y-2.5"
          >
            <div className="font-bold text-slate-800 dark:text-zinc-200 text-xs">
              Clone Active Timetable into New Version / Sandbox
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Term 1 Alternate or What-If Trial..."
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                className="flex-1 min-w-[200px] h-8 px-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-slate-800 dark:text-zinc-200 focus:outline-none"
              />

              <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-slate-600 dark:text-zinc-400 px-2">
                <input
                  type="checkbox"
                  checked={isSandbox}
                  onChange={(e) => setIsSandbox(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Sandbox Mode</span>
              </label>

              <button
                type="submit"
                disabled={!newVersionName.trim()}
                className="flex items-center space-x-1 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl font-bold shadow-2xs transition-all active:scale-95 disabled:opacity-50"
              >
                <Copy className="w-3 h-3" />
                <span>Clone Schedule</span>
              </button>
            </div>
          </form>

          {/* Versions List */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
              Existing Versions ({versions.length})
            </div>

            <div className="space-y-1.5">
              {versions.map((ver) => {
                const isActive = ver.id === activeVersionId
                const isComparing = ver.id === compareVersionId

                return (
                  <div
                    key={ver.id}
                    className={`p-3 rounded-xl border transition-all flex flex-wrap items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 shadow-2xs'
                        : 'bg-white dark:bg-zinc-800/40 border-slate-200/80 dark:border-zinc-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 dark:text-zinc-100 text-xs">
                          {ver.name}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.2 bg-purple-600 text-white text-[9px] rounded-full font-bold">
                            Active
                          </span>
                        )}
                        {ver.isSandbox && (
                          <span className="px-2 py-0.2 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[9px] rounded-full font-bold">
                            Sandbox
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase ${
                            ver.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}
                        >
                          {ver.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Created: {new Date(ver.createdAt).toLocaleDateString()} &bull; {ver.slotsCount || slots.length} periods &bull; Health: {ver.healthScore || 100}%
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {!isActive && (
                        <button
                          onClick={() => {
                            setActiveVersionId(ver.id)
                            addNotification({
                              title: 'Switched Version',
                              message: `Switched active timetable to "${ver.name}".`,
                              type: 'info',
                            })
                          }}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-zinc-700 hover:bg-slate-200 text-slate-800 dark:text-zinc-200 rounded-lg font-bold text-[10px] transition-all"
                        >
                          Switch To
                        </button>
                      )}

                      {!isActive && (
                        <button
                          onClick={() =>
                            setCompareVersionId(isComparing ? null : ver.id)
                          }
                          className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${
                            isComparing
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50'
                          }`}
                        >
                          {isComparing ? 'Comparing' : 'Compare'}
                        </button>
                      )}

                      {ver.status !== 'published' && (
                        <button
                          onClick={() => handlePromoteToPublished(ver.id)}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 rounded-lg font-bold text-[10px] transition-all"
                          title="Set as official institutional published schedule"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Comparison Diff Box */}
          {compareVer && diffMetrics && (
            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 rounded-xl space-y-2">
              <div className="font-bold text-blue-900 dark:text-blue-300 text-xs flex items-center justify-between">
                <span>
                  Comparison: &quot;{activeVer?.name}&quot; vs &quot;{compareVer.name}&quot;
                </span>
                <button
                  onClick={() => setCompareVersionId(null)}
                  className="text-blue-500 hover:text-blue-700 text-[10px]"
                >
                  Clear Diff
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-lg border border-blue-100 dark:border-blue-900/40">
                  <span className="text-[10px] text-slate-400 block font-semibold">Total Lecture Difference</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-zinc-100">
                    {diffMetrics.totalSlotsDiff >= 0 ? `+${diffMetrics.totalSlotsDiff}` : diffMetrics.totalSlotsDiff} Slots
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-lg border border-blue-100 dark:border-blue-900/40">
                  <span className="text-[10px] text-slate-400 block font-semibold">Reallocated / Moved Slots</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-zinc-100">
                    {diffMetrics.changedPositions} Modified Slots
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-zinc-800/40 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
