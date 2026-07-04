const ESSENTIAL = ['leucina', 'izoleucina', 'valina', 'lizina', 'metionina', 'fenilalanina', 'treonina', 'triptofan', 'histidina']

const AMINO_LABELS: Record<string, string> = {
  leucina: 'Leucină',
  izoleucina: 'Izoleucină',
  valina: 'Valină',
  lizina: 'Lizină',
  metionina: 'Metionină',
  fenilalanina: 'Fenilalanină',
  treonina: 'Treonină',
  triptofan: 'Triptofan',
  histidina: 'Histidină',
  alanina: 'Alanină',
  arginina: 'Arginină',
  'acid aspartic': 'Acid aspartic',
  cistina: 'Cistină',
  'acid glutamic': 'Acid glutamic',
  glicina: 'Glicină',
  prolina: 'Prolină',
  serina: 'Serină',
  tirozina: 'Tirozină',
}

interface AminoRowProps {
  name: string
  value: number
  maxValue: number
}

function AminoRow({ name, value, maxValue }: AminoRowProps) {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-xs text-gray-300 w-28 shrink-0">{AMINO_LABELS[name] ?? name}</span>
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-purple-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-white font-semibold w-16 text-right shrink-0">
        {value.toFixed(1)} mg
      </span>
    </div>
  )
}

interface AminoAcidListProps {
  aminoAcids?: Record<string, number>
}

export function AminoAcidList({ aminoAcids }: AminoAcidListProps) {
  if (!aminoAcids || Object.keys(aminoAcids).length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-8">
        Date despre aminoacizi indisponibile pentru acest aliment.
      </p>
    )
  }

  const allEntries = Object.entries(aminoAcids).filter(([, v]) => v > 0)
  const maxValue = Math.max(...allEntries.map(([, v]) => v), 1)

  const essential = allEntries.filter(([k]) => ESSENTIAL.includes(k))
  const nonEssential = allEntries.filter(([k]) => !ESSENTIAL.includes(k))

  return (
    <div className="space-y-4">
      {essential.length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Esențiali</p>
          {essential.map(([name, value]) => (
            <AminoRow key={name} name={name} value={value} maxValue={maxValue} />
          ))}
        </div>
      )}
      {nonEssential.length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Non-esențiali</p>
          {nonEssential.map(([name, value]) => (
            <AminoRow key={name} name={name} value={value} maxValue={maxValue} />
          ))}
        </div>
      )}
    </div>
  )
}
