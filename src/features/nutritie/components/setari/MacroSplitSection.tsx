import { SlidersHorizontal, Percent, Weight, Flame, Check, AlertCircle } from 'lucide-react'
import { useMacroSplitSection } from '../../stores/nutritieSetariStore'
import { SectionHeader } from './SectionHeader'
import { SavedBadge } from './SavedBadge'
import { MacroInputRow } from './MacroInputRow'
import { MacroGramRow } from './MacroGramRow'

export function MacroSplitSection() {
  const {
    protein, carbs, fat, macroSaved, gramMode,
    gramP, gramC, gramF, gramKcal, gramPPct, gramCPct, gramFPct, gramValid,
    gP, gC, gF, targetKcal,
    setProtein, setCarbs, setFat, setGramP, setGramC, setGramF,
    switchToGrams, switchToPct, saveMacro,
  } = useMacroSplitSection()

  const macroSum = protein + carbs + fat
  const macroValid = macroSum === 100

  return (
    <section className="bg-gray-900 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <SectionHeader
          icon={<SlidersHorizontal size={16} className="text-purple-400" />}
          title="Split macronutrienți"
        />
        <div className="flex gap-0.5 bg-gray-800 rounded-lg p-0.5 -mt-4">
          <button
            onClick={switchToPct}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
              !gramMode ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Percent size={11} /> %
          </button>
          <button
            onClick={switchToGrams}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
              gramMode ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Weight size={11} /> g
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-4 -mt-2">
        {gramMode
          ? 'Introdu gramele dorite. Procentele și caloriile se calculează automat.'
          : 'Procentele trebuie să sumeze exact 100%. Ajustează cu ±5%.'}
      </p>

      <div className="flex h-2 rounded-full overflow-hidden mb-4 gap-px">
        <div className="transition-all duration-300" style={{ width: `${gramMode ? gramPPct : protein}%`, backgroundColor: '#60a5fa' }} />
        <div className="transition-all duration-300" style={{ width: `${gramMode ? gramCPct : carbs}%`, backgroundColor: '#facc15' }} />
        <div className="transition-all duration-300" style={{ width: `${gramMode ? gramFPct : fat}%`, backgroundColor: '#f97316' }} />
      </div>

      <div className="bg-gray-800/40 rounded-xl px-3">
        {gramMode ? (
          <>
            <MacroGramRow label="Proteine"     color="#60a5fa" value={gramP} onChange={setGramP} pct={gramPPct} kcal={gP * 4} />
            <MacroGramRow label="Carbohidrați" color="#facc15" value={gramC} onChange={setGramC} pct={gramCPct} kcal={gC * 4} />
            <MacroGramRow label="Grăsimi"      color="#f97316" value={gramF} onChange={setGramF} pct={gramFPct} kcal={gF * 9} />
          </>
        ) : (
          <>
            <MacroInputRow label="Proteine"     color="#60a5fa" value={protein} grams={gP} onChange={setProtein} />
            <MacroInputRow label="Carbohidrați" color="#facc15" value={carbs}   grams={cG} onChange={setCarbs} />
            <MacroInputRow label="Grăsimi"      color="#f97316" value={fat}     grams={fG} onChange={setFat} />
          </>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 px-1">
        {gramMode ? (
          <>
            <div className="flex items-center gap-1.5">
              {gramValid
                ? <Flame size={13} className="text-orange-400" />
                : <AlertCircle size={13} className="text-gray-600" />}
              <span className={`text-xs font-semibold ${gramValid ? 'text-orange-400' : 'text-gray-600'}`}>
                {gramValid ? `${gramKcal.toLocaleString('ro-RO')} kcal calculate din macros` : 'Introdu gramele'}
              </span>
            </div>
            <span className="text-xs text-gray-600">P {gramPPct}% · C {gramCPct}% · G {gramFPct}%</span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              {macroValid
                ? <Check size={13} className="text-green-400" />
                : <AlertCircle size={13} className="text-red-400" />}
              <span className={`text-xs font-semibold ${macroValid ? 'text-green-400' : 'text-red-400'}`}>
                Total: {macroSum}% {macroValid ? '✓' : `— lipsesc ${100 - macroSum}%`}
              </span>
            </div>
            <span className="text-xs text-gray-600">{targetKcal.toLocaleString('ro-RO')} kcal bază</span>
          </>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
        <SavedBadge show={macroSaved} />
        <button
          onClick={saveMacro}
          disabled={gramMode ? !gramValid : !macroValid}
          className="ml-auto px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold transition-all disabled:opacity-40"
        >
          Salvează split-ul
        </button>
      </div>
    </section>
  )
}
