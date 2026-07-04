import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Tag } from 'lucide-react'
import { useFoodDetail } from '../hooks/useFoodDetail'
import { MacroDonut } from '../components/MacroDonut'
import { NutrientTable } from '../components/NutrientTable'
import { AminoAcidList } from '../components/AminoAcidList'

type Tab = 'macro' | 'micro' | 'aminoacizi'

const TAB_LABELS: Record<Tab, string> = {
  macro: 'Macro',
  micro: 'Micro',
  aminoacizi: 'Aminoacizi',
}

export function AlimentDetailPage() {
  const { fdcId } = useParams<{ fdcId: string }>()
  const navigate = useNavigate()
  const { food, isLoading } = useFoodDetail(fdcId)
  const [grams, setGrams] = useState('100')
  const [tab, setTab] = useState<Tab>('macro')

  const gramsNum = Math.max(parseFloat(grams) || 0, 0)

  const portion = food
    ? {
        calories: Math.round(food.caloriesPerG * gramsNum),
        protein: Math.round(food.proteinG * gramsNum * 10) / 10,
        carbs: Math.round(food.carbsG * gramsNum * 10) / 10,
        fat: Math.round(food.fatG * gramsNum * 10) / 10,
      }
    : null

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-950">
        <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
            <ArrowLeft size={20} />
          </button>
          <div className="h-5 w-40 bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!food) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-950">
        <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-white">Aliment</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <p className="text-gray-500 text-sm">Date indisponibile pentru acest aliment.</p>
        </div>
      </div>
    )
  }

  const name = food.nameRo || food.name

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      {/* header */}
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-white text-base truncate">{name}</h1>
          {food.brand && (
            <div className="flex items-center gap-1 mt-0.5">
              <Tag size={10} className="text-gray-500" />
              <span className="text-xs text-gray-500 truncate">{food.brand}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* portion selector */}
          <div className="bg-gray-900 rounded-2xl p-4">
            <label className="text-xs text-gray-400 block mb-2">Porție (grame)</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={grams}
                onChange={(e) => setGrams(e.target.value)}
                min="1"
                className="flex-1 bg-gray-800 rounded-xl px-4 py-3 text-white font-semibold text-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex gap-2">
                {[50, 100, 200].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrams(String(g))}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      grams === String(g)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {g}g
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* tabs */}
          <div className="flex border-b border-gray-800">
            {(['macro', 'micro', 'aminoacizi'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-xs font-semibold transition-colors border-b-2 ${
                  tab === t
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-500 hover:text-white'
                }`}
              >
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>

          {/* tab content */}
          {tab === 'macro' && portion && (
            <div className="space-y-4">
              <div className="flex justify-center py-2">
                <MacroDonut
                  proteinG={portion.protein}
                  carbsG={portion.carbs}
                  fatG={portion.fat}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-900 rounded-2xl p-4 text-center col-span-2">
                  <p className="text-4xl font-black text-orange-500 tabular-nums">{portion.calories}</p>
                  <p className="text-xs text-gray-400 mt-1">kcal per {gramsNum}g</p>
                </div>
                <div className="bg-gray-900 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black text-blue-400 tabular-nums">{portion.protein}g</p>
                  <p className="text-xs text-gray-400 mt-1">Proteine</p>
                </div>
                <div className="bg-gray-900 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black text-yellow-400 tabular-nums">{portion.carbs}g</p>
                  <p className="text-xs text-gray-400 mt-1">Carbohidrați</p>
                </div>
                <div className="bg-gray-900 rounded-2xl p-4 text-center col-span-2">
                  <p className="text-2xl font-black text-red-400 tabular-nums">{portion.fat}g</p>
                  <p className="text-xs text-gray-400 mt-1">Grăsimi</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'micro' && (
            <NutrientTable vitamins={food.vitamins} minerals={food.minerals} />
          )}

          {tab === 'aminoacizi' && (
            <AminoAcidList aminoAcids={food.aminoAcids} />
          )}
        </div>
      </div>
    </div>
  )
}
