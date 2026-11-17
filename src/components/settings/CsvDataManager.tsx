import React, { useState } from 'react'
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  School,
  Users,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  Trash2,
  SlidersHorizontal,
  Info,
} from 'lucide-react'
import {
  parseCSV,
  detectCsvType,
  downloadCsvTemplate,
  processSchoolCsvImport,
  CsvDataType,
  CsvFileEntry,
} from '../../lib/csvHelper'
import { useAcademicStore } from '../../store/useAcademicStore'
import { useTimetableStore } from '../../store/useTimetableStore'
import { useAppStore } from '../../store/useAppStore'
import { StorageEngine } from '../../lib/storage'

interface ParsedFileSummary extends CsvFileEntry {
  rowCount: number
  headers: string[]
  sampleRows: string[][]
}

const CSV_TYPE_LABELS: Record<CsvDataType, string> = {
  standards: 'Standards & Divisions',
  subjects: 'Curriculum Subjects',
  teachers: 'Faculty & Teachers',
  allocations: 'Teacher Allocations',
  schedule: 'Bell Timings & Schedule',
  unknown: 'Unrecognized CSV Format',
}

export const CsvDataManager: React.FC = () => {
  const { addNotification } = useAppStore()
  const { institution, classes, subjects, teachers } = useAcademicStore()
  const { activeVersionId } = useTimetableStore()

  const [parsedFiles, setParsedFiles] = useState<ParsedFileSummary[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [activePreviewType, setActivePreviewType] = useState<CsvDataType | null>(null)
  const [importLogs, setImportLogs] = useState<string[]>([])

  // Handle CSV file selection (supports multiple files at once)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsProcessing(true)
    const fileList = Array.from(files)
    const results: ParsedFileSummary[] = []

    let loadedCount = 0

    fileList.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string
          const rows = parseCSV(content)
          if (rows.length > 0) {
            const headers = rows[0]
            const type = detectCsvType(headers, rows.slice(1, 10))
            results.push({
              name: file.name,
              type,
              rowCount: Math.max(0, rows.length - 1),
              headers,
              sampleRows: rows.slice(1, 6),
              rawRows: rows.slice(1),
            })
          }
        } catch (err) {
          console.error('Error parsing file', file.name, err)
        } finally {
          loadedCount++
          if (loadedCount === fileList.length) {
            setParsedFiles((prev) => {
              // Combine and replace any duplicates by filename
              const combined = [...prev]
              results.forEach((res) => {
                const idx = combined.findIndex((f) => f.name === res.name)
                if (idx >= 0) combined[idx] = res
                else combined.push(res)
              })
              return combined
            })
            setIsProcessing(false)
            if (results.length > 0) {
              setActivePreviewType(results[0].type)
              addNotification({
                title: 'CSV Files Analyzed',
                message: `Parsed ${results.length} CSV file(s). Review detected types before applying.`,
                type: 'info',
              })
            }
          }
        }
      }
      reader.readAsText(file)
    })

    // Reset input
    e.target.value = ''
  }

  // Allow user to manually adjust/override the detected file type
  const handleTypeChange = (fileName: string, newType: CsvDataType) => {
    setParsedFiles((prev) =>
      prev.map((f) => (f.name === fileName ? { ...f, type: newType } : f))
    )
    setActivePreviewType(newType)
  }

  // Remove a single file from import staging
  const handleRemoveFile = (fileName: string) => {
    setParsedFiles((prev) => {
      const filtered = prev.filter((f) => f.name !== fileName)
      if (filtered.length > 0) {
        setActivePreviewType(filtered[0].type)
      } else {
        setActivePreviewType(null)
      }
      return filtered
    })
  }

  // Apply parsed files into application state
  const handleApplyImportedFiles = () => {
    if (parsedFiles.length === 0) return

    try {
      const result = processSchoolCsvImport(
        parsedFiles,
        classes,
        subjects,
        teachers,
        institution
      )

      // Persist to storage engine
      StorageEngine.saveInstitution(result.institution)
      StorageEngine.saveClasses(result.classes)
      StorageEngine.saveSubjects(result.subjects)
      StorageEngine.saveTeachers(result.teachers)

      if (result.timeSlots && result.timeSlots.length > 0) {
        StorageEngine.saveTimeSlots(result.timeSlots)
      }

      if (result.slots && result.slots.length > 0) {
        StorageEngine.saveSlots(activeVersionId, result.slots)
      }

      // Update in-memory Zustand store states
      useAcademicStore.setState({
        institution: result.institution,
        classes: result.classes,
        subjects: result.subjects,
        teachers: result.teachers,
      })

      useTimetableStore.setState((prev) => ({
        slots: result.slots && result.slots.length > 0 ? result.slots : prev.slots,
        filterSectionId: result.classes[0]?.sections[0]?.id || prev.filterSectionId,
        filterTeacherId: result.teachers[0]?.id || prev.filterTeacherId,
      }))

      setImportLogs(result.logs)

      addNotification({
        title: 'CSV Data Successfully Applied',
        message: `Imported ${result.stats.standardsCount} Standards, ${result.stats.subjectsCount} Subjects, ${result.stats.teachersCount} Faculty, and ${result.stats.allocationsCount} Allocations!`,
        type: 'success',
      })

      setTimeout(() => {
        window.location.reload()
      }, 900)
    } catch (err) {
      console.error(err)
      addNotification({
        title: 'Import Failed',
        message: 'Could not apply CSV data. Please check column formats.',
        type: 'error',
      })
    }
  }

  const activePreview =
    parsedFiles.find((f) => f.type === activePreviewType) || parsedFiles[0]

  return (
    <div className="space-y-4">
      {/* 1. Institutional Summary Banner */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-2xs">
              <School className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 dark:text-zinc-100 text-xs">
                  {institution.name || 'Your School / Institution'}
                </span>
                <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-2 py-0.5 rounded-full">
                  Academic Year {institution.academicYear || 'Current'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Upload your school's CSV files to configure standards, divisions, curriculum subjects, and faculty
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Active Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
          <div className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center space-x-1 text-slate-500 text-[10px]">
              <Layers className="w-3 h-3 text-blue-600" />
              <span>Standards & Sections</span>
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-zinc-100 mt-1">
              {classes.length} Classes
            </div>
            <div className="text-[9.5px] text-slate-400 font-mono">
              {classes.flatMap((c) => c.sections).length} Total Divisions
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center space-x-1 text-slate-500 text-[10px]">
              <BookOpen className="w-3 h-3 text-emerald-600" />
              <span>Curriculum Subjects</span>
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-zinc-100 mt-1">
              {subjects.length} Subjects
            </div>
            <div className="text-[9.5px] text-slate-400 font-mono">Core, Labs & Electives</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center space-x-1 text-slate-500 text-[10px]">
              <Users className="w-3 h-3 text-indigo-600" />
              <span>Teaching Faculty</span>
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-zinc-100 mt-1">
              {teachers.length} Teachers
            </div>
            <div className="text-[9.5px] text-slate-400 font-mono">Active Staff Profiles</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center space-x-1 text-slate-500 text-[10px]">
              <Calendar className="w-3 h-3 text-amber-600" />
              <span>Daily Timing</span>
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-zinc-100 mt-1">
              {institution.startTime} - {institution.endTime}
            </div>
            <div className="text-[9.5px] text-slate-400 font-mono">
              {institution.periodDurationMinutes} min / period
            </div>
          </div>
        </div>
      </div>

      {/* 2. Custom CSV Uploader & Importer */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <div className="font-bold text-slate-900 dark:text-zinc-100">
              Upload School CSV Files
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Multi-File Supported</span>
        </div>

        <p className="text-slate-500 text-[11px] leading-relaxed">
          Upload individual CSV files or select all your school's CSV files together. The engine analyzes column headers to recognize Standards, Subjects, Faculty, Allocations, and Bell Schedule automatically.
        </p>

        {/* Upload Dropzone */}
        <div className="pt-1">
          <label className="border-2 border-dashed border-slate-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-zinc-800/30 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 dark:text-zinc-200 text-xs">
              Click to browse or drop school CSV files here
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Select one or multiple .csv files (Standards, Subjects, Teachers, Allocations, Schedule)
            </span>
            <input
              type="file"
              accept=".csv"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Parsed Files List with Type Overrides */}
        {parsedFiles.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-800 dark:text-zinc-200 text-[11px]">
                  Detected Files ({parsedFiles.length})
                </span>
                <span className="text-[10px] text-slate-400">
                  Verify the detected category for each file:
                </span>
              </div>
              <button
                type="button"
                onClick={handleApplyImportedFiles}
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-bold shadow-2xs transition-all text-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply Imported CSV Data</span>
              </button>
            </div>

            {/* File cards with dropdown to fix/override type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {parsedFiles.map((file) => (
                <div
                  key={file.name}
                  onClick={() => setActivePreviewType(file.type)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                    activePreviewType === file.type
                      ? 'bg-blue-50/60 border-blue-400 dark:bg-blue-950/20 dark:border-blue-700 shadow-2xs'
                      : 'border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-[11px] text-slate-900 dark:text-zinc-100 truncate">
                        {file.name}
                      </div>
                      <div className="text-[9.5px] text-slate-400 font-mono">
                        {file.rowCount} rows &bull; {file.headers.length} columns
                      </div>
                    </div>
                  </div>

                  {/* Type Selector Dropdown */}
                  <div className="flex items-center space-x-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={file.type}
                      onChange={(e) => handleTypeChange(file.name, e.target.value as CsvDataType)}
                      className="text-[10px] font-semibold bg-slate-100 dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-lg px-2 py-1 text-slate-800 dark:text-zinc-200 focus:outline-none"
                    >
                      <option value="standards">Standards & Divisions</option>
                      <option value="subjects">Curriculum Subjects</option>
                      <option value="teachers">Faculty & Teachers</option>
                      <option value="allocations">Teacher Allocations</option>
                      <option value="schedule">Schedule & Bell Timings</option>
                      <option value="unknown">Ignore / Skip</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.name)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview Table */}
            {activePreview && (
              <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-zinc-900">
                <div className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 text-[10px] font-bold text-slate-600 dark:text-zinc-300 flex items-center justify-between">
                  <span>
                    Previewing {activePreview.name} ({activePreview.rowCount} records)
                  </span>
                  <span className="uppercase text-[9px] font-mono tracking-wider bg-white dark:bg-zinc-700 px-2 py-0.5 rounded text-blue-600 dark:text-blue-300 font-bold">
                    {CSV_TYPE_LABELS[activePreview.type]}
                  </span>
                </div>
                <div className="overflow-x-auto max-h-48 custom-scrollbar">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/70 dark:bg-zinc-800/50 font-bold text-slate-700 dark:text-zinc-200">
                        {activePreview.headers.map((h, i) => (
                          <th key={i} className="p-2 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {activePreview.sampleRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-white dark:hover:bg-zinc-800/40">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2 whitespace-nowrap text-slate-600 dark:text-zinc-300 font-mono">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. CSV Template Download Center */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Download className="w-4 h-4 text-purple-600" />
            <div className="font-bold text-slate-900 dark:text-zinc-100">
              Download Standard CSV Templates
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Pre-formatted Columns</span>
        </div>

        <p className="text-slate-500 text-[11px] leading-relaxed">
          Download blank pre-formatted templates. School administrators can populate them in Excel or Google Sheets and import them directly into Smart Timetable Studio.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          <button
            type="button"
            onClick={() => downloadCsvTemplate('standards')}
            className="p-2.5 rounded-xl border border-slate-200/90 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-all text-left flex flex-col justify-between space-y-1 shadow-2xs"
          >
            <span className="font-bold text-[10.5px] text-slate-800 dark:text-zinc-200">
              Standards CSV
            </span>
            <span className="text-[9px] text-slate-400">Classes & Sections</span>
            <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 text-[9.5px] font-bold pt-1">
              <Download className="w-3 h-3" />
              <span>Download</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => downloadCsvTemplate('subjects')}
            className="p-2.5 rounded-xl border border-slate-200/90 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-all text-left flex flex-col justify-between space-y-1 shadow-2xs"
          >
            <span className="font-bold text-[10.5px] text-slate-800 dark:text-zinc-200">
              Subjects CSV
            </span>
            <span className="text-[9px] text-slate-400">Curriculum & Hours</span>
            <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 text-[9.5px] font-bold pt-1">
              <Download className="w-3 h-3" />
              <span>Download</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => downloadCsvTemplate('teachers')}
            className="p-2.5 rounded-xl border border-slate-200/90 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-all text-left flex flex-col justify-between space-y-1 shadow-2xs"
          >
            <span className="font-bold text-[10.5px] text-slate-800 dark:text-zinc-200">
              Teachers CSV
            </span>
            <span className="text-[9px] text-slate-400">Staff & Workload</span>
            <div className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 text-[9.5px] font-bold pt-1">
              <Download className="w-3 h-3" />
              <span>Download</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => downloadCsvTemplate('allocations')}
            className="p-2.5 rounded-xl border border-slate-200/90 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-all text-left flex flex-col justify-between space-y-1 shadow-2xs"
          >
            <span className="font-bold text-[10.5px] text-slate-800 dark:text-zinc-200">
              Allocations CSV
            </span>
            <span className="text-[9px] text-slate-400">Teacher to Subject</span>
            <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 text-[9.5px] font-bold pt-1">
              <Download className="w-3 h-3" />
              <span>Download</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => downloadCsvTemplate('schedule')}
            className="p-2.5 rounded-xl border border-slate-200/90 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-all text-left flex flex-col justify-between space-y-1 shadow-2xs"
          >
            <span className="font-bold text-[10.5px] text-slate-800 dark:text-zinc-200">
              Schedule CSV
            </span>
            <span className="text-[9px] text-slate-400">Bell Timings</span>
            <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 text-[9.5px] font-bold pt-1">
              <Download className="w-3 h-3" />
              <span>Download</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
