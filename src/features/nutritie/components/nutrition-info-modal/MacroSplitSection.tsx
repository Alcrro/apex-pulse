import { TrendingUp } from 'lucide-react'
import { ModalSection } from './ModalSection'
import { FormulaRow } from './FormulaRow'

interface MacroTargets {
  proteinG: number
  carbsG: number
  fatG: number
}

interface Split {
  protein: number
  carbs: number
  fat: number
}

interface Props {
  split: Split
  targetKcal: number
  macroTargets: MacroTargets | null
}

export function MacroSplitSection({ split, targetKcal, macroTargets }: Props) {
  return (
    <ModalSection icon={<TrendingUp size={15} className="text-purple-400" />} title="Split macronutrienți">
      <div className="space-y-2">
        <FormulaRow
          color="#60a5fa" label="Proteine"    pct={split.protein} kcal={targetKcal} divisor={4}
          grams={macroTargets?.proteinG ?? Math.round((targetKcal * split.protein) / 100 / 4)}
        />
        <FormulaRow
          color="#facc15" label="Carbohidrați" pct={split.carbs}  kcal={targetKcal} divisor={4}
          grams={macroTargets?.carbsG ?? Math.round((targetKcal * split.carbs) / 100 / 4)}
        />
        <FormulaRow
          color="#f97316" label="Grăsimi"     pct={split.fat}    kcal={targetKcal} divisor={9}
          grams={macroTargets?.fatG ?? Math.round((targetKcal * split.fat) / 100 / 9)}
        />
      </div>
      <p className="text-[11px] text-gray-600 mt-2.5 px-1">
        Procentele se ajustează automat în funcție de obiectiv. Grăsimile au 9 kcal/g, proteinele și carbohidrații câte 4 kcal/g.
      </p>
    </ModalSection>
  )
}
