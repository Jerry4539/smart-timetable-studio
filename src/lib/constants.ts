import { DayOfWeek, TimeSlot, LabRoomCapacity } from './types'

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
]

export const DEFAULT_LAB_CAPACITIES: LabRoomCapacity[] = [
  { id: 'lab-comp', name: 'Computer Lab', subjectName: 'Computer', capacity: 1 },
  { id: 'lab-phy', name: 'Physics Lab', subjectName: 'Physics', capacity: 1 },
  { id: 'lab-chem', name: 'Chemistry Lab', subjectName: 'Chemistry', capacity: 1 },
  { id: 'lab-bio', name: 'Biology Lab', subjectName: 'Biology', capacity: 1 },
]

// Professional, low-saturation, accessible subject color palette
export const SUBJECT_PALETTE: Record<string, { bg: string; text: string; border: string; indicator: string }> = {
  blue: {
    bg: '#f0f6ff',
    text: '#1e3a8a',
    border: '#dbeafe',
    indicator: '#3b82f6',
  },
  purple: {
    bg: '#fbf7ff',
    text: '#581c87',
    border: '#f3e8ff',
    indicator: '#9333ea',
  },
  green: {
    bg: '#f2fbf4',
    text: '#14532d',
    border: '#dcfce7',
    indicator: '#16a34a',
  },
  amber: {
    bg: '#fffdf5',
    text: '#78350f',
    border: '#fef3c7',
    indicator: '#d97706',
  },
  teal: {
    bg: '#f0fdfa',
    text: '#134e4a',
    border: '#ccfbf1',
    indicator: '#0d9488',
  },
  indigo: {
    bg: '#f5f7ff',
    text: '#312e81',
    border: '#e0e7ff',
    indicator: '#4f46e5',
  },
  coral: {
    bg: '#fff8f6',
    text: '#7c2d12',
    border: '#ffedd5',
    indicator: '#ea580c',
  },
  rose: {
    bg: '#fff5f7',
    text: '#881337',
    border: '#ffe4e6',
    indicator: '#e11d48',
  },
  slate: {
    bg: '#f8fafc',
    text: '#1e293b',
    border: '#e2e8f0',
    indicator: '#64748b',
  },
  cyan: {
    bg: '#ecfeff',
    text: '#164e63',
    border: '#cffafe',
    indicator: '#0891b2',
  },
}

export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { index: 1, label: 'Period 1', startTime: '08:00', endTime: '08:45', type: 'regular', isBreak: false },
  { index: 2, label: 'Period 2', startTime: '08:45', endTime: '09:30', type: 'regular', isBreak: false },
  { index: 3, label: 'Morning Break', startTime: '09:30', endTime: '09:45', type: 'short_break', isBreak: true },
  { index: 4, label: 'Period 3', startTime: '09:45', endTime: '10:30', type: 'regular', isBreak: false },
  { index: 5, label: 'Period 4', startTime: '10:30', endTime: '11:15', type: 'regular', isBreak: false },
  { index: 6, label: 'Lunch Break', startTime: '11:15', endTime: '12:00', type: 'lunch', isBreak: true },
  { index: 7, label: 'Period 5', startTime: '12:00', endTime: '12:45', type: 'regular', isBreak: false },
  { index: 8, label: 'Period 6', startTime: '12:45', endTime: '13:30', type: 'regular', isBreak: false },
  { index: 9, label: 'Period 7', startTime: '13:30', endTime: '14:15', type: 'regular', isBreak: false },
]
