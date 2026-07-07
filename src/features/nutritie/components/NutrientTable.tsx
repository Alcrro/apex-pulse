import { VITAMIN_KEYS, MINERAL_KEYS } from '../utils/nutrientTable'
import { NutrientRow } from './NutrientRow'

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
          {VITAMIN_KEYS.map(k => <NutrientRow key={k} nutrientKey={k} value={vitamins?.[k]} />)}
        </div>
      )}
      {hasMinerals && (
        <div className="bg-gray-800 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Minerale</p>
          {MINERAL_KEYS.map(k => <NutrientRow key={k} nutrientKey={k} value={minerals?.[k]} />)}
        </div>
      )}
    </div>
  )
}
