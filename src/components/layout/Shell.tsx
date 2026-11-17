import React, { useEffect } from 'react'
import { TopNavigation } from './TopNavigation'
import { Sidebar } from './Sidebar'
import { CommandPalette } from './CommandPalette'
import { ToastContainer } from './ToastContainer'
import { InstitutionModal } from '../modals/InstitutionModal'
import { QuickAddModal } from '../modals/QuickAddModal'
import { ConflictDetailModal } from '../modals/ConflictDetailModal'
import { VersionManagerModal } from '../modals/VersionManagerModal'

import { useAppStore } from '../../store/useAppStore'
import { DashboardView } from '../dashboard/DashboardView'
import { TimetableStudioView } from '../studio/TimetableStudioView'
import { MasterTimetableMatrixView } from '../master/MasterTimetableMatrixView'
import { GenerateView } from '../generate/GenerateView'
import { TeachersView } from '../academic/TeachersView'
import { ClassesView } from '../academic/ClassesView'
import { SubjectsView } from '../academic/SubjectsView'
import { SubstitutionsView } from '../substitution/SubstitutionsView'
import { RulesView } from '../rules/RulesView'
import { ExportView } from '../export/ExportView'
import { SettingsView } from '../settings/SettingsView'

export const Shell: React.FC = () => {
  const { activeView, theme, versionModalOpen, setVersionModalOpen } = useAppStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />
      case 'studio':
        return <TimetableStudioView />
      case 'master':
        return <MasterTimetableMatrixView />
      case 'generate':
        return <GenerateView />
      case 'substitutions':
        return <SubstitutionsView />
      case 'teachers':
        return <TeachersView />
      case 'classes':
        return <ClassesView />
      case 'subjects':
        return <SubjectsView />
      case 'rules':
        return <RulesView />
      case 'export':
        return <ExportView />
      case 'settings':
        return <SettingsView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="h-full w-full max-h-screen flex flex-col overflow-hidden bg-[#f4f5f8] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 font-sans selection:bg-slate-200 dark:selection:bg-zinc-800">
      {/* Top Navigation Bar */}
      <TopNavigation />

      {/* Main Container: Sidebar + Active View Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto min-w-0 bg-[#f4f5f8] dark:bg-[#09090b]">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <CommandPalette />
      <InstitutionModal />
      <QuickAddModal />
      <ConflictDetailModal />
      <VersionManagerModal
        isOpen={versionModalOpen}
        onClose={() => setVersionModalOpen(false)}
      />
      <ToastContainer />
    </div>
  )
}
