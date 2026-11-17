import React from 'react'
import {
  LayoutDashboard,
  Calendar,
  Cpu,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  Printer,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  GitBranch,
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useTimetableStore } from '../../store/useTimetableStore'
import { ActiveView } from '../../lib/types'

interface NavItem {
  id: ActiveView
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, sidebarCollapsed, toggleSidebar, setVersionModalOpen } = useAppStore()
  const { versions, activeVersionId } = useTimetableStore()

  const activeVersion = versions.find((v) => v.id === activeVersionId)

  // Clean core navigation modules
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'studio', label: 'Timetable Studio', icon: Calendar },
    { id: 'generate', label: 'Schedule Engine', icon: Cpu },
    { id: 'substitutions', label: 'Substitutions', icon: UserCheck },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'classes', label: 'Classes', icon: GraduationCap },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'export', label: 'Export & Print', icon: Printer },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside
      className={`h-full bg-white dark:bg-[#121215] border-r border-slate-200/80 dark:border-zinc-800/80 flex flex-col justify-between transition-all duration-150 ease-in-out select-none shrink-0 ${
        sidebarCollapsed ? 'w-14' : 'w-48 lg:w-52'
      }`}
    >
      {/* 1. Navigation List */}
      <nav className="p-2.5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center px-0' : 'px-3'
              } h-8.5 rounded-xl text-[13px] transition-all ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800/70 font-medium'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive
                    ? 'text-white dark:text-zinc-900'
                    : 'text-slate-400 dark:text-zinc-500'
                }`}
              />
              {!sidebarCollapsed && <span className="ml-2.5 truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* 2. Lower Area: Compact Version Status & Collapse Footer */}
      <div className="p-2.5 space-y-1.5 border-t border-slate-100 dark:border-zinc-800/70">
        {!sidebarCollapsed && activeVersion && (
          <button
            onClick={() => setVersionModalOpen(true)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800 text-[11px] text-slate-500 dark:text-zinc-400 transition-colors"
            title="Manage Timetable Versions & Sandbox"
          >
            <div className="flex items-center space-x-1.5 truncate">
              <GitBranch className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-zinc-300 truncate">
                {activeVersion.name}
              </span>
            </div>
            <span className="font-mono text-[10px] text-emerald-600 font-bold shrink-0">v{activeVersion.versionNumber}.0</span>
          </button>
        )}

        <button
          onClick={toggleSidebar}
          className={`w-full flex items-center ${
            sidebarCollapsed ? 'justify-center' : 'justify-between px-2.5'
          } h-7 rounded-lg text-xs text-slate-400 hover:text-slate-700 dark:hover:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors`}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {!sidebarCollapsed && <span className="text-[11px] font-medium">Collapse Menu</span>}
          {sidebarCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </aside>
  )
}
