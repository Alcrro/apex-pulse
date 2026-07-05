import { useState } from 'react'
import { Sparkles, Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import {
  DAY_LABELS, DAY_TYPE_CONFIG, DAY_TYPE_CYCLE,
  SPLIT_TEMPLATES, type DayType, type WeekDays, type SplitConfig,
} from '../utils/splitTypes'
import { useGenerateWorkouts } from '../hooks/useGenerateWorkouts'
import { useTheme } from '../../../shared/context/ThemeContext'

const GOLD = '#D4B96A'

const LEVEL_OPTIONS: { id: SplitConfig['level']; label: string; desc: string }[] = [
  { id: 'incepator',   label: 'Începător',   desc: '< 1 an experiență' },
  { id: 'intermediar', label: 'Intermediar', desc: '1–3 ani experiență' },
  { id: 'avansat',     label: 'Avansat',     desc: '3+ ani experiență' },
]

const DEFAULT_DAYS: WeekDays = ['rest', 'rest', 'rest', 'rest', 'rest', 'rest', 'rest']

const LEVEL_LABELS: Record<SplitConfig['level'], string> = {
  incepator: 'Începător',
  intermediar: 'Intermediar',
  avansat: 'Avansat',
}

function buildDefaultProgramName(templateId: string | null, level: SplitConfig['level']): string {
  if (!templateId) return ''
  const tpl = SPLIT_TEMPLATES.find(t => t.id === templateId)
  if (!tpl) return ''
  return `${tpl.name} - ${LEVEL_LABELS[level]}`
}

export function SplitConfigurator({ onGenerated }: { onGenerated: () => void }) {
  const [open, setOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [days, setDays] = useState<WeekDays>(DEFAULT_DAYS)
  const [level, setLevel] = useState<SplitConfig['level']>('intermediar')
  const [programName, setProgramName] = useState('')
  const [done, setDone] = useState(false)

  const { generate, loading, error } = useGenerateWorkouts()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const goldText = isDark ? GOLD : '#8B6200'
  const goldBg = isDark ? GOLD + '12' : GOLD + '25'
  const goldBorder = isDark ? GOLD + '60' : GOLD + '80'

  const unselectedBtn = isDark
    ? { borderColor: '#2A3040', color: '#9ca3af' }
    : { borderColor: '#e2e8f0', color: '#475569' }

  const restDayBtn = isDark
    ? { borderColor: '#2A3040', backgroundColor: '#1a1f2e' }
    : { borderColor: '#e2e8f0', backgroundColor: '#f1f5f9' }

  const restDayText = isDark ? '#6b7280' : '#94a3b8'

  function applyTemplate(templateId: string) {
    const tpl = SPLIT_TEMPLATES.find(t => t.id === templateId)
    if (!tpl) return
    setSelectedTemplate(templateId)
    setDays([...tpl.days] as WeekDays)
    setProgramName(buildDefaultProgramName(templateId, level))
  }

  function cycleDay(idx: number) {
    const current = days[idx]
    const nextIdx = (DAY_TYPE_CYCLE.indexOf(current) + 1) % DAY_TYPE_CYCLE.length
    const next = DAY_TYPE_CYCLE[nextIdx]
    const newDays = [...days] as WeekDays
    newDays[idx] = next
    setDays(newDays)
    setSelectedTemplate(null) // custom mode
  }

  const workoutCount = days.filter(d => d !== 'rest').length
  const uniqueTypes = [...new Set(days.filter(d => d !== 'rest'))] as DayType[]

  async function handleGenerate() {
    setDone(false)
    const ok = await generate({ days, level, programName: programName.trim() || undefined })
    if (ok) {
      setDone(true)
      onGenerated()
      setTimeout(() => setDone(false), 3000)
    }
  }

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      {/* header row – toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles size={15} style={{ color: GOLD }} />
          <span className="text-sm font-semibold text-white">Generare automată cu AI</span>
        </div>
        {open
          ? <ChevronUp size={15} className="text-gray-500" />
          : <ChevronDown size={15} className="text-gray-500" />}
      </button>

      {open && (
        <div className="px-4 pb-5 space-y-5 border-t border-gray-800/60">

          {/* ── 1. Template-uri ── */}
          <div className="pt-4">
            <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-3">
              Template split
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SPLIT_TEMPLATES.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => applyTemplate(tpl.id)}
                  className="text-left px-3 py-2.5 rounded-xl border transition-all"
                  style={
                    selectedTemplate === tpl.id
                      ? { borderColor: goldBorder, backgroundColor: goldBg, color: goldText }
                      : { ...unselectedBtn, backgroundColor: 'transparent' }
                  }
                >
                  <div className="text-xs font-semibold leading-tight">{tpl.name}</div>
                  <div className="text-[11px] opacity-70 mt-0.5">{tpl.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── 2. Zi cu zi ── */}
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-3">
              Zi cu zi <span className="normal-case text-gray-600 tracking-normal font-normal">(apasă să modifici)</span>
            </p>
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((day, idx) => {
                const cfg = DAY_TYPE_CONFIG[day]
                const isRest = day === 'rest'
                return (
                  <button
                    key={idx}
                    onClick={() => cycleDay(idx)}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all active:scale-95"
                    style={isRest
                      ? restDayBtn
                      : { borderColor: cfg.color + '50', backgroundColor: cfg.color + '15' }
                    }
                  >
                    <span className="text-[10px] text-gray-500 font-semibold">{DAY_LABELS[idx]}</span>
                    <span
                      className="text-[9px] font-bold leading-tight text-center"
                      style={{ color: isRest ? restDayText : cfg.color }}
                    >
                      {cfg.label}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] text-gray-600 mt-2">
              {workoutCount} zile antrenament · {7 - workoutCount} pauze
            </p>
          </div>

          {/* ── 3. Nivel ── */}
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-3">
              Nivel experiență
            </p>
            <div className="flex gap-2">
              {LEVEL_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setLevel(opt.id)
                    if (selectedTemplate) setProgramName(buildDefaultProgramName(selectedTemplate, opt.id))
                  }}
                  className="flex-1 py-2.5 px-2 rounded-xl border text-center transition-all"
                  style={
                    level === opt.id
                      ? { borderColor: goldBorder, backgroundColor: goldBg, color: goldText }
                      : unselectedBtn
                  }
                >
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[10px] opacity-60 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Planuri ce vor fi generate ── */}
          {uniqueTypes.length > 0 && (
            <div className="bg-gray-900/60 rounded-xl px-3 py-2.5">
              <p className="text-[11px] text-gray-500 mb-2">Se vor genera {uniqueTypes.length} planuri:</p>
              <div className="flex flex-wrap gap-1.5">
                {uniqueTypes.map(type => (
                  <span
                    key={type}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: DAY_TYPE_CONFIG[type].color + '20', color: DAY_TYPE_CONFIG[type].color }}
                  >
                    {DAY_TYPE_CONFIG[type].label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Nume program ── */}
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-2">
              Numele programului
            </p>
            <input
              type="text"
              value={programName}
              onChange={e => setProgramName(e.target.value)}
              placeholder="ex: PPL - Intermediar"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: isDark ? '#111827' : '#f8fafc',
                border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                color: isDark ? '#f9fafb' : '#0f172a',
              }}
            />
            <p className="text-[10px] text-gray-600 mt-1.5">
              {programName.trim()
                ? 'Planurile vor fi grupate într-un program cu rotație automată.'
                : 'Lasă gol pentru planuri independente.'}
            </p>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="flex items-start gap-2 text-red-400 bg-red-400/10 rounded-xl px-3 py-2.5">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <p className="text-xs">{error}</p>
            </div>
          )}

          {/* ── Generate button ── */}
          <button
            onClick={handleGenerate}
            disabled={loading || uniqueTypes.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-40"
            style={{
              backgroundColor: done ? '#4ade8020' : goldBg,
              color: done ? '#4ade80' : goldText,
              border: `1px solid ${done ? '#4ade8040' : goldBorder}`,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Se generează…
              </>
            ) : done ? (
              <>
                <CheckCircle2 size={15} />
                Planuri create!
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Generează planuri cu AI
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
