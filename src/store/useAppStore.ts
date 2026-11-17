import { create } from 'zustand'
import { ActiveView } from '../lib/types'

export interface ToastNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
}

interface AppState {
  activeView: ActiveView
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
  commandPaletteOpen: boolean
  institutionModalOpen: boolean
  notifications: ToastNotification[]
  quickAddModalOpen: boolean
  quickAddType: 'teacher' | 'class' | 'subject' | null
  versionModalOpen: boolean

  // Actions
  setActiveView: (view: ActiveView) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  setCommandPaletteOpen: (open: boolean) => void
  setInstitutionModalOpen: (open: boolean) => void
  setVersionModalOpen: (open: boolean) => void
  setQuickAddModalOpen: (open: boolean, type?: 'teacher' | 'class' | 'subject') => void
  addNotification: (notification: Omit<ToastNotification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
}

const savedTheme = (localStorage.getItem('stt_theme') as 'light' | 'dark') || 'light'
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

export const useAppStore = create<AppState>((set) => ({
  activeView: 'dashboard',
  sidebarCollapsed: false,
  theme: savedTheme,
  commandPaletteOpen: false,
  institutionModalOpen: false,
  notifications: [],
  quickAddModalOpen: false,
  quickAddType: null,
  versionModalOpen: false,

  setActiveView: (view) => set({ activeView: view }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setTheme: (theme) => {
    localStorage.setItem('stt_theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    set({ theme })
  },
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('stt_theme', nextTheme)
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { theme: nextTheme }
    })
  },
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setInstitutionModalOpen: (open) => set({ institutionModalOpen: open }),
  setVersionModalOpen: (open) => set({ versionModalOpen: open }),
  setQuickAddModalOpen: (open, type) => set({ quickAddModalOpen: open, quickAddType: type || null }),
  addNotification: (notif) => {
    const newNotif: ToastNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    set((state) => ({
      notifications: [newNotif, ...state.notifications.slice(0, 19)],
    }))
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))
