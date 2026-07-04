const DZR: Record<string, { label: string; unit: string; dzr: number }> = {
  vitaminA_mcg:  { label: 'Vitamina A',   unit: 'mcg', dzr: 800 },
  vitaminC_mg:   { label: 'Vitamina C',   unit: 'mg',  dzr: 80 },
  vitaminD_mcg:  { label: 'Vitamina D',   unit: 'mcg', dzr: 5 },
  vitaminE_mg:   { label: 'Vitamina E',   unit: 'mg',  dzr: 12 },
  vitaminK_mcg:  { label: 'Vitamina K',   unit: 'mcg', dzr: 75 },
  vitaminB1_mg:  { label: 'Vitamina B1',  unit: 'mg',  dzr: 1.1 },
  vitaminB2_mg:  { label: 'Vitamina B2',  unit: 'mg',  dzr: 1.4 },
  vitaminB3_mg:  { label: 'Vitamina B3',  unit: 'mg',  dzr: 16 },
  vitaminB6_mg:  { label: 'Vitamina B6',  unit: 'mg',  dzr: 1.4 },
  vitaminB9_mcg: { label: 'Acid folic',   unit: 'mcg', dzr: 200 },
  vitaminB12_mcg:{ label: 'Vitamina B12', unit: 'mcg', dzr: 2.5 },
  calcium_mg:    { label: 'Calciu',       unit: 'mg',  dzr: 800 },
  iron_mg:       { label: 'Fier',         unit: 'mg',  dzr: 14 },
  magnesium_mg:  { label: 'Magneziu',     unit: 'mg',  dzr: 375 },
  potassium_mg:  { label: 'Potasiu',      unit: 'mg',  dzr: 2000 },
  zinc_mg:       { label: 'Zinc',         unit: 'mg',  dzr: 10 },
  selenium_mcg:  { label: 'Seleniu',      unit: 'mcg', dzr: 55 },
  phosphorus_mg: { label: 'Fosfor',       unit: 'mg',  dzr: 700 },
}

const VITAMIN_KEYS = [
  'vitaminA_mcg','vitaminC_mg','vitaminD_mcg','vitaminE_mg','vitaminK_mcg',
  'vitaminB1_mg','vitaminB2_mg','vitaminB3_mg','vitaminB6_mg','vitaminB9_mcg','vitaminB12_mcg',
]
const MINERAL_KEYS = [
  'calcium_mg','iron_mg','magnesium_mg','potassium_mg','zinc_mg','selenium_mcg','phosphorus_mg',
]

interface NutrientRowProps {
  nutrientKey: string
  value: number | undefined
}

function NutrientRow({ nutrientKey, value }: NutrientRowProps) {
  const meta = DZR[nutrientKey]
  if (!meta) return null

  const hasValue = value !== undefined && value > 0
  const pct = hasValue ? Math.round((value! / meta.dzr) * 100) : 0
  const capped = Math.min(pct, 100)

  let barColor = 'bg-green-400'
  if (pct >= 100) barColor = 'bg-blue-400'
  else if (pct >= 50) barColor = 'bg-orange-400'

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-800/60 last:border-0">
      <span className="text-xs text-gray-300 w-28 shrink-0">{meta.label}</span>
      <span className="text-xs text-white font-semibold w-20 shrink-0 text-right">
        {hasValue ? `${value!.toFixed(1)} ${meta.unit}` : '—'}
      </span>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          {hasValue && (
            <div
              className={`h-full rounded-full ${barColor}`}
              style={{ width: `${capped}%` }}
            />
          )}
        </div>
        <span className={`text-[10px] w-8 text-right shrink-0 ${hasValue ? (pct >= 100 ? 'text-blue-400' : pct >= 50 ? 'text-orange-400' : 'text-green-400') : 'text-gray-600'}`}>
          {hasValue ? `${pct}%` : '—'}
        </span>
      </div>
    </div>
  )
}

interface NutrientTableProps {
  vitamins?: Record<string, number>
  minerals?: Record<string, number>
}

export function NutrientTable({ vitamins, minerals }: NutrientTableProps) {
  const hasVitamins = vitamins && Object.keys(vitamins).length > 0
  const hasMinerals = minerals && Object.keys(minerals).length > 0

  if (!hasVitamins && !hasMinerals) {
    return (
      <p className="text-sm text-gray-500 text-center py-8">
        Date despre micronutrienți indisponibile pentru acest aliment.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {hasVitamins && (
        <div className="bg-gray-800 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vitamine</p>
          {VITAMIN_KEYS.map((k) => (
            <NutrientRow key={k} nutrientKey={k} value={vitamins?.[k]} />
          ))}
        </div>
      )}
      {hasMinerals && (
        <div className="bg-gray-800 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Minerale</p>
          {MINERAL_KEYS.map((k) => (
            <NutrientRow key={k} nutrientKey={k} value={minerals?.[k]} />
          ))}
        </div>
      )}
    </div>
  )
}
