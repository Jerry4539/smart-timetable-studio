import React, { useEffect } from 'react'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { useAppStore, ToastNotification } from '../../store/useAppStore'

const ToastItem: React.FC<{
  item: ToastNotification
  onDismiss: (id: string) => void
}> = ({ item, onDismiss }) => {
  useEffect(() => {
    // Auto-hide in 1.35 seconds (within user's requested 1 to 1.5 sec)
    const timer = setTimeout(() => {
      onDismiss(item.id)
    }, 1350)
    return () => clearTimeout(timer)
  }, [item.id, onDismiss])

  const isSuccess = item.type === 'success'
  const isWarning = item.type === 'warning'
  const isError = item.type === 'error'

  return (
    <div className="pointer-events-auto flex items-start space-x-2.5 p-3 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border border-slate-200/90 dark:border-zinc-700 rounded-xl shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-150 select-none min-w-[260px] max-w-sm">
      <div className="shrink-0 mt-0.5">
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        {isWarning && <AlertTriangle className="w-4 h-4 text-amber-500" />}
        {isError && <AlertCircle className="w-4 h-4 text-rose-500" />}
        {!isSuccess && !isWarning && !isError && <Info className="w-4 h-4 text-blue-500" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-slate-800 dark:text-zinc-100 flex items-center justify-between">
          <span className="truncate">{item.title}</span>
          <span className="text-[10px] font-mono text-slate-400 font-normal ml-2 shrink-0">
            {item.timestamp}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug line-clamp-2">
          {item.message}
        </p>
      </div>

      <button
        onClick={() => onDismiss(item.id)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-0.5 rounded transition-colors ml-1 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useAppStore()

  if (notifications.length === 0) return null

  // Show at most the 3 latest toasts to prevent clutter
  const activeToasts = notifications.slice(0, 3)

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none select-none">
      {activeToasts.map((item) => (
        <ToastItem key={item.id} item={item} onDismiss={removeNotification} />
      ))}
    </div>
  )
}

