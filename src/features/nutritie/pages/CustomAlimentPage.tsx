import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { useCustomFood } from '../hooks/useCustomFood'

export function CustomAlimentPage() {
  const navigate = useNavigate()
  const { createCustomFood, isLoading } = useCustomFood()

  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [fiber, setFiber] = useState('')
  const [sodium, setSodium] = useState('')
  const [nameRo, setNameRo] = useState('')
  const [optionalOpen, setOptionalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calNum = parseFloat(calories) || 0
  const protNum = parseFloat(protein) || 0
  const carbNum = parseFloat(carbs) || 0
  const fatNum = parseFloat(fat) || 0

  const isValid =
    name.trim().length > 0 &&
    calNum > 0 &&
    protNum >= 0 &&
    carbNum >= 0 &&
    fatNum >= 0

  async function handleSubmit() {
    if (!isValid) return
    setError(null)
    const result = await createCustomFood({
      name: name.trim(),
      nameRo: nameRo.trim() || undefined,
      caloriesPerG: calNum / 100,
      proteinG: protNum / 100,
      carbsG: carbNum / 100,
      fatG: fatNum / 100,
      fiberG: fiber ? parseFloat(fiber) / 100 : undefined,
      sodiumMg: sodium ? parseFloat(sodium) / 100 : undefined,
    })
    if (result) {
      navigate(-1)
    } else {
      setError('Nu s-a putut salva alimentul. Încearcă din nou.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      {/* header */}
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-white flex-1">Aliment nou</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* live preview */}
          {isValid && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
              <p className="text-xs text-gray-400 mb-1">Per 100g</p>
              <p className="text-white font-semibold text-sm">
                {calNum} kcal
                <span className="text-gray-400 font-normal"> | </span>
                <span className="text-blue-400">P {protNum}g</span>
                <span className="text-gray-400 font-normal"> | </span>
                <span className="text-yellow-400">C {carbNum}g</span>
                <span className="text-gray-400 font-normal"> | </span>
                <span className="text-red-400">G {fatNum}g</span>
              </p>
            </div>
          )}

          {/* required fields */}
          <div className="bg-gray-900 rounded-2xl p-4 space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Informații obligatorii</p>

            <div>
              <label className="text-xs text-gray-400 block mb-2">Nume aliment</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Piept de pui gătit"
                className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-2">Calorii / 100g</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-blue-400 block mb-2">Proteine / 100g</label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-yellow-400 block mb-2">Carbohidrați / 100g</label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-red-400 block mb-2">Grăsimi / 100g</label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* optional fields */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <button
              onClick={() => setOptionalOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3.5"
            >
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Informații opționale</p>
              {optionalOpen ? (
                <ChevronUp size={16} className="text-gray-500" />
              ) : (
                <ChevronDown size={16} className="text-gray-500" />
              )}
            </button>

            {optionalOpen && (
              <div className="px-4 pb-4 space-y-4 border-t border-gray-800">
                <div className="pt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Fibre / 100g</label>
                    <input
                      type="number"
                      value={fiber}
                      onChange={(e) => setFiber(e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Sodiu / 100g (mg)</label>
                    <input
                      type="number"
                      value={sodium}
                      onChange={(e) => setSodium(e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-2">Denumire în română (opțional)</label>
                  <input
                    type="text"
                    value={nameRo}
                    onChange={(e) => setNameRo(e.target.value)}
                    placeholder="ex: Piept de pui"
                    className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}
        </div>
      </div>

      <div className="px-4 pb-safe pb-6 pt-3 border-t border-gray-800 shrink-0">
        <button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base disabled:opacity-40 transition-colors"
        >
          {isLoading ? 'Se salvează...' : 'Salvează aliment'}
        </button>
      </div>
    </div>
  )
}
