import React from 'react'
import {
  ShieldCheck,
  Sliders,
  Scale,
  CheckCircle2,
  UserCheck,
  Layers,
  Clock,
} from 'lucide-react'
import { useAcademicStore } from '../../store/useAcademicStore'

export const RulesView: React.FC = () => {
  const { teachers } = useAcademicStore()

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4 select-none text-slate-800 dark:text-zinc-100">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-base font-semibold text-slate-900 dark:text-zinc-50 tracking-tight">
          Scheduling Rules & Limits
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Rules and limits enforced when automatically generating or validating class schedules.
        </p>
      </div>

      {/* Rules Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Mandatory Rules */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
            <span className="font-semibold text-xs text-slate-900 dark:text-zinc-100">
              Mandatory Rules (Clash Prevention)
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-medium rounded-md">
              Zero tolerance
            </span>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-zinc-300">
            <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-lg border border-slate-100 dark:border-zinc-800">
              <span className="font-semibold text-slate-900 dark:text-zinc-100 block">
                No Teacher Double-Booking
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                A teacher cannot be assigned to two classes or divisions at the same time period.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-lg border border-slate-100 dark:border-zinc-800">
              <span className="font-semibold text-slate-900 dark:text-zinc-100 block">
                No Class Overlaps
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                A section cannot have more than one lecture assigned in the same period slot.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-lg border border-slate-100 dark:border-zinc-800">
              <span className="font-semibold text-slate-900 dark:text-zinc-100 block">
                Lab & Facility Capacity Protection
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Simultaneous sessions of subjects requiring dedicated labs (Computer, Physics, Chemistry, Biology) cannot exceed physical lab capacity.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-lg border border-slate-100 dark:border-zinc-800">
              <span className="font-semibold text-slate-900 dark:text-zinc-100 block">
                Break & Lunch Recess Protection
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Classes and double periods never cross morning break or lunch recess slots.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-lg border border-slate-100 dark:border-zinc-800">
              <span className="font-semibold text-slate-900 dark:text-zinc-100 block">
                Preserve Locked Slots
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Lectures manually locked in the studio remain pinned in place during regeneration.
              </p>
            </div>
          </div>
        </div>

        {/* Timing & Distribution Rules */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
            <span className="font-semibold text-xs text-slate-900 dark:text-zinc-100">
              Timing & Distribution Rules
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-medium rounded-md">
              Configurable
            </span>
          </div>

          <div className="space-y-2 text-slate-600 dark:text-zinc-300">
            <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-lg border border-slate-100 dark:border-zinc-800">
              <span className="font-semibold text-slate-900 dark:text-zinc-100 block">
                Consecutive / Double Periods
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Places laboratory or practical subjects in continuous back-to-back periods on the same day.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-lg border border-slate-100 dark:border-zinc-800">
              <span className="font-semibold text-slate-900 dark:text-zinc-100 block">
                Morning-Only Physical Activities
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Keeps Yoga, Sports, and Physical Education before the lunch break.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-lg border border-slate-100 dark:border-zinc-800">
              <span className="font-semibold text-slate-900 dark:text-zinc-100 block">
                Activity Subject Spread
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Limits activity periods per day per section so electives and arts are spread evenly across the week.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-zinc-800/40 rounded-lg border border-slate-100 dark:border-zinc-800">
              <span className="font-semibold text-slate-900 dark:text-zinc-100 block">
                Teacher Workload & Morning Core Priority
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Balances weekly teaching load across days and places core academic subjects in earlier periods.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Workload Limits Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
          <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
            Teacher Workload Limits
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {teachers.length} Active Faculty
          </span>
        </div>

        <div className="border border-slate-100 dark:border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 font-medium border-b border-slate-100 dark:border-zinc-800">
              <tr>
                <th className="px-3.5 py-2">Teacher Name</th>
                <th className="px-3.5 py-2">Max / Day</th>
                <th className="px-3.5 py-2">Max / Week</th>
                <th className="px-3.5 py-2">Max Consecutive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-slate-700 dark:text-zinc-300">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-3.5 py-2 font-medium text-slate-900 dark:text-zinc-100">{t.name}</td>
                  <td className="px-3.5 py-2 font-mono text-slate-600 dark:text-zinc-400">{t.maxPeriodsPerDay} periods</td>
                  <td className="px-3.5 py-2 font-mono text-slate-600 dark:text-zinc-400">{t.maxPeriodsPerWeek} periods</td>
                  <td className="px-3.5 py-2 font-mono text-slate-600 dark:text-zinc-400">{t.maxConsecutivePeriods} consecutive</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
