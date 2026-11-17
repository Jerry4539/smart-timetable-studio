import React, { useState, useEffect } from 'react'
import { Sun, Moon, RotateCcw, Columns, Rows, Check, School, Clock, Save, ShieldCheck, Download, Upload, FolderArchive, Cpu, Zap, Activity, FileSpreadsheet, Sliders, FlaskConical } from 'lucide-react'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useTimetableStore } from '../../store/useTimetableStore'
import { useAppStore } from '../../store/useAppStore'
import { StorageEngine } from '../../lib/storage'
import { StudioOrientation } from '../../lib/types'
import { TauriNative, NativeSystemInfo, NativeBenchmarkResult } from '../../lib/tauriNative'
import { CsvDataManager } from './CsvDataManager'
import { LabSettingsManager } from './LabSettingsManager'

export const SettingsView: React.FC = () => {
  const { theme, setTheme, addNotification } = useAppStore()
  const { layoutOrientation, setLayoutOrientation } = useTimetableStore()
  const { institution, updateInstitution } = useAcademicStore()

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'csv' | 'labs' | 'general'>('csv')

  // School profile state 
  const [schoolName, setSchoolName] = useState(institution.name)
  const [campusName, setCampusName] = useState(institution.campusName)
  const [academicYear, setAcademicYear] = useState(institution.academicYear)
  const [startTime, setStartTime] = useState(institution.startTime)
  const [endTime, setEndTime] = useState(institution.endTime)
  const [periodDuration, setPeriodDuration] = useState(institution.periodDurationMinutes)
  const [lunchBreak, setLunchBreak] = useState(institution.lunchBreakMinutes)

  // Native Diagnostics States
  const [systemInfo, setSystemInfo] = useState<NativeSystemInfo | null>(null)
  const [benchmarkResult, setBenchmarkResult] = useState<NativeBenchmarkResult | null>(null)
  const [isBenchmarking, setIsBenchmarking] = useState(false)

  useEffect(() => {
    TauriNative.getSystemInfo().then(setSystemInfo)
  }, [])

  const handleRunBenchmark = async () => {
    setIsBenchmarking(true)
    try {
      const res = await TauriNative.benchmarkNative()
      setBenchmarkResult(res)
      addNotification({
        title: 'Native Benchmark Complete',
        message: `Processed ${res.iterations.toLocaleString()} states in ${res.execution_time_micros} µs (${(res.execution_time_micros / 1000).toFixed(2)} ms).`,
        type: 'success',
      })
    } finally {
      setIsBenchmarking(false)
    }
  }

  const handleSaveSchoolProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateInstitution({
      name: schoolName,
      campusName,
      academicYear,
      startTime,
      endTime,
      periodDurationMinutes: periodDuration,
      lunchBreakMinutes: lunchBreak,
    })
    addNotification({
      title: 'School Profile Saved',
      message: 'Institutional parameters and bell schedules updated.',
      type: 'success',
    })
  }

  const handleOrientationChange = (orientation: StudioOrientation) => {
    setLayoutOrientation(orientation)
    updateInstitution({ defaultOrientation: orientation })
    addNotification({
      title: 'Default Layout Updated',
      message:
        orientation === 'periods-on-top'
          ? 'Timetable Studio set to Periods on Columns / Days in Rows.'
          : 'Timetable Studio set to Days on Columns / Periods in Rows.',
      type: 'success',
    })
  }

  const handleExportWorkspace = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      institution: StorageEngine.getInstitution(),
      classes: StorageEngine.getClasses(),
      subjects: StorageEngine.getSubjects(),
      teachers: StorageEngine.getTeachers(),
      timeSlots: StorageEngine.getTimeSlots(),
      versions: StorageEngine.getVersions(),
      activeVersionId: StorageEngine.getActiveVersionId(),
      slots: StorageEngine.getSlots(StorageEngine.getActiveVersionId()),
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `smart-timetable-${institution.code || 'workspace'}-${Date.now()}.stt`
    a.click()

    addNotification({
      title: 'Workspace Backup Exported',
      message: 'Saved complete institutional database snapshot (.stt file).',
      type: 'success',
    })
  }

  const handleImportWorkspace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        if (!data.institution || !data.classes || !data.teachers) {
          throw new Error('Invalid project file format')
        }

        StorageEngine.saveInstitution(data.institution)
        StorageEngine.saveClasses(data.classes)
        StorageEngine.saveSubjects(data.subjects)
        StorageEngine.saveTeachers(data.teachers)
        if (data.timeSlots) StorageEngine.saveTimeSlots(data.timeSlots)
        if (data.versions) StorageEngine.saveVersions(data.versions)
        if (data.activeVersionId) StorageEngine.saveActiveVersionId(data.activeVersionId)
        if (data.slots && data.activeVersionId) StorageEngine.saveSlots(data.activeVersionId, data.slots)

        addNotification({
          title: 'Workspace Restored Successfully',
          message: 'Loaded institutional database from .stt project file.',
          type: 'success',
        })

        setTimeout(() => window.location.reload(), 600)
      } catch (err) {
        addNotification({
          title: 'Restore Failed',
          message: 'The selected file is not a valid Smart Timetable (.stt) snapshot.',
          type: 'error',
        })
      }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    if (window.confirm('Reset local storage to official seed dataset? All manual edits will reset.')) {
      StorageEngine.resetToDefaults()
      addNotification({
        title: 'Reset Completed',
        message: 'Loaded clean default sample data.',
        type: 'info',
      })
      window.location.reload()
    }
  }

  return (
    <div className="p-5 max-w-4xl mx-auto space-y-4 select-none text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            Settings & Data Management
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">
            Manage school datasets, import CSV files, configure bell timings, and set application defaults
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl border border-slate-200 dark:border-zinc-700/80 shrink-0 flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('csv')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'csv'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV Data Import</span>
            <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-blue-700 text-blue-100 font-mono">
              Upload
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('labs')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'labs'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Lab & Room Limits</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'general'
                ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-2xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>General Preferences</span>
          </button>
        </div>
      </div>

      {activeTab === 'csv' ? (
        <CsvDataManager />
      ) : activeTab === 'labs' ? (
        <LabSettingsManager />
      ) : (
        <>
          {/* School Setup Bento Tile */}
      <form
        onSubmit={handleSaveSchoolProfile}
        className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-3.5"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center space-x-2">
            <School className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900 dark:text-zinc-100">
              School Profile & Campus Details
            </span>
          </div>
          <button
            type="submit"
            className="flex items-center space-x-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl font-semibold shadow-2xs transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save School Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
              School / Institution Name
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
              className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
              Campus Name
            </label>
            <input
              type="text"
              value={campusName}
              onChange={(e) => setCampusName(e.target.value)}
              className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
              Academic Year
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Timings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div>
            <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
              School Starts
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
              School Ends
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full h-8 px-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
              Period Duration
            </label>
            <div className="relative">
              <input
                type="number"
                value={periodDuration}
                onChange={(e) => setPeriodDuration(Number(e.target.value))}
                min={30}
                max={90}
                className="w-full h-8 px-2.5 pr-8 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 font-mono focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 absolute right-2.5 top-2">min</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
              Lunch Duration
            </label>
            <div className="relative">
              <input
                type="number"
                value={lunchBreak}
                onChange={(e) => setLunchBreak(Number(e.target.value))}
                min={20}
                max={60}
                className="w-full h-8 px-2.5 pr-8 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 font-mono focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 absolute right-2.5 top-2">min</span>
            </div>
          </div>
        </div>
      </form>

      {/* Timetable Studio Default Layout Bento Card */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-3">
        <div>
          <div className="font-bold text-slate-900 dark:text-zinc-100 text-xs">
            Timetable Studio Default Layout Orientation
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Choose your preferred default grid orientation for viewing, editing, and planning schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Option 1 */}
          <button
            type="button"
            onClick={() => handleOrientationChange('periods-on-top')}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${layoutOrientation === 'periods-on-top'
              ? 'bg-blue-50/60 border-blue-400 dark:bg-blue-950/20 dark:border-blue-700 shadow-2xs'
              : 'border-slate-200/80 dark:border-zinc-800 hover:bg-slate-50/70'
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Columns className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-slate-900 dark:text-zinc-100">
                  Periods on Columns (Default)
                </span>
              </div>
              {layoutOrientation === 'periods-on-top' && (
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Periods 1 to 7 span horizontally across the top columns, with Monday through Friday stacked along the rows.
            </p>
          </button>

          {/* Option 2 */}
          <button
            type="button"
            onClick={() => handleOrientationChange('days-on-top')}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${layoutOrientation === 'days-on-top'
              ? 'bg-indigo-50/60 border-indigo-400 dark:bg-indigo-950/20 dark:border-indigo-700 shadow-2xs'
              : 'border-slate-200/80 dark:border-zinc-800 hover:bg-slate-50/70'
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Rows className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-slate-900 dark:text-zinc-100">
                  Days on Columns
                </span>
              </div>
              {layoutOrientation === 'days-on-top' && (
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Monday through Friday span horizontally across the top columns, with Periods 1 to 7 descending vertically in rows.
            </p>
          </button>
        </div>
      </div>

      {/* Theme Appearance Bento Card */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-3">
        <div className="font-bold text-slate-900 dark:text-zinc-100">
          Color Scheme & Theme
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border transition-all ${theme === 'light'
              ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-bold shadow-2xs'
              : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50'
              }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light Mode (Default)</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border transition-all ${theme === 'dark'
              ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-bold shadow-2xs'
              : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50'
              }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Local Storage & Engine */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-3">
        <div className="font-bold text-slate-900 dark:text-zinc-100">
          Offline Storage & Engine
        </div>
        <p className="text-slate-500 leading-relaxed text-[11px]">
          Smart Timetable Studio operates 100% offline. All schedule matrix assignments, faculty workload limits, and curriculum configurations persist in local storage.
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px]">
          <span className="text-slate-600 dark:text-zinc-400">Database Engine State</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Active &bull; Client Offline Sync</span>
          </span>
        </div>
      </div>

      {/* Workspace Snapshot Backup & Restore (.stt) */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderArchive className="w-4 h-4 text-purple-600" />
            <div className="font-bold text-slate-900 dark:text-zinc-100">
              Portable Workspace Snapshot (.stt)
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400">JSON Archive Specification</span>
        </div>
        <p className="text-slate-500 leading-relaxed text-[11px]">
          Export the entire institutional database (standards, divisions, qualified teachers, timetable versions, and rules) into a single portable project file to back up or migrate between computers.
        </p>

        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportWorkspace}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl font-semibold shadow-2xs transition-all active:scale-95 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Snapshot (.stt)</span>
          </button>

          <label className="flex items-center space-x-1.5 px-3.5 py-1.5 border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 rounded-xl font-semibold shadow-2xs transition-all active:scale-95 text-xs cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Restore Snapshot (.stt)</span>
            <input
              type="file"
              accept=".stt,.json"
              onChange={handleImportWorkspace}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Reset */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs flex items-center justify-between">
        <div>
          <div className="font-bold text-slate-900 dark:text-zinc-100">
            Reset to Sample Dataset
          </div>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Restores initial classes, faculty, grade-specific curriculum, and clean master timetable.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center space-x-1 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl font-semibold transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Data</span>
        </button>
      </div>
        </>
      )}
    </div>
  )
}
