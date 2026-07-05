export type DayType = 'upper' | 'lower' | 'push' | 'pull' | 'legs' | 'full' | 'rest'

export type WeekDays = [DayType, DayType, DayType, DayType, DayType, DayType, DayType]

export interface SplitConfig {
  days: WeekDays
  level: 'incepator' | 'intermediar' | 'avansat'
}

export const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export const DAY_TYPE_CONFIG: Record<DayType, { label: string; color: string }> = {
  upper: { label: 'Upper',  color: '#D4B96A' },
  lower: { label: 'Lower',  color: '#8BAE6A' },
  push:  { label: 'Push',   color: '#B97070' },
  pull:  { label: 'Pull',   color: '#7091B9' },
  legs:  { label: 'Legs',   color: '#8B70B9' },
  full:  { label: 'Full',   color: '#70B9B9' },
  rest:  { label: 'Pauză',  color: '#4A4A4A' },
}

// cycle order when tapping a day
export const DAY_TYPE_CYCLE: DayType[] = ['rest', 'upper', 'lower', 'push', 'pull', 'legs', 'full']

export const SPLIT_TEMPLATES: {
  id: string
  name: string
  subtitle: string
  days: WeekDays
}[] = [
  {
    id: 'upper_lower_4',
    name: 'Upper / Lower',
    subtitle: '4 zile / săpt.',
    days: ['upper', 'lower', 'rest', 'upper', 'lower', 'rest', 'rest'],
  },
  {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    subtitle: '6 zile / săpt.',
    days: ['push', 'pull', 'legs', 'rest', 'push', 'pull', 'legs'],
  },
  {
    id: 'full_body',
    name: 'Full Body',
    subtitle: '3 zile / săpt.',
    days: ['full', 'rest', 'full', 'rest', 'full', 'rest', 'rest'],
  },
  {
    id: 'upper_lower_2',
    name: 'Upper / Lower',
    subtitle: '2 zile / săpt.',
    days: ['upper', 'rest', 'rest', 'lower', 'rest', 'rest', 'rest'],
  },
]
