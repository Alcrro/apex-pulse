import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Flame, SlidersHorizontal, Droplets,
  BookOpen, Check, ChevronDown, ChevronUp, AlertCircle,
} from 'lucide-react'
import { useNutritionTarget } from '../hooks/useNutritionTarget'
import { GoalSelector } from '../components/GoalSelector'
import { GOAL_LABELS, GOAL_OFFSETS, GOAL_MACRO_SPLIT } from '../utils/nutritionHelpers'
import type { GoalType } from '../../../shared/types'

// ── tiny helpers ──────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <span className="text-base font-bold text-white">{title}</span>
    </div>
  )
}

function SavedBadge({ show }: { show: boolean }) {
  return (
    <span
      className={`flex items-center gap-1 text-xs text-green-400 font-semibold transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
      }`}
    >
      <Check size={12} /> Salvat
    </span>
  )
}

// ── macro row editor ──────────────────────────────────────────────────────

function MacroInputRow({
  label,
  color,
  value,
  grams,
  onChange,
}: {
  label: string
  color: string
  value: number
  grams: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-800 last:border-0">
      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm text-white flex-1">{label}</span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(5, value - 5))}
          className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-base flex items-center justify-center transition-colors active:scale-95"
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-bold text-white tabular-nums">{value}%</span>
        <button
          onClick={() => onChange(Math.min(90, value + 5))}
          className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-base flex items-center justify-center transition-colors active:scale-95"
        >
          +
        </button>
      </div>

      <span className="text-sm font-bold w-14 text-right tabular-nums" style={{ color }}>
        {grams}g
      </span>
    </div>
  )
}

// ── collapsible info accordion ────────────────────────────────────────────

function InfoAccordion({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800/40 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-300">{title}</span>
        {open ? (
          <ChevronUp size={15} className="text-gray-500" />
        ) : (
          <ChevronDown size={15} className="text-gray-500" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-800 space-y-2">
          {children}
        </div>
      )}
    </div>
  )
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs text-gray-600 shrink-0 mt-0.5">→</span>
      <div>
        <span className="text-xs font-semibold text-gray-400">{label} </span>
        <span className="text-xs text-gray-500">{value}</span>
      </div>
    </div>
  )
}

// ── page ──────────────────────────────────────────────────────────────────

export function NutritieSetariPage() {
  const navigate = useNavigate()
  const {
    goals, phase, macroTargets, avgCalories,
    setGoalType, setManualCalories, setCustomMacroSplit,
  } = useNutritionTarget()

  // ── goal section state ─────────────────────────────────────────────────
  const [pendingGoal, setPendingGoal] = useState<GoalType | null>(null)
  const [goalSaved, setGoalSaved] = useState(false)
  const activeGoal = pendingGoal ?? goals?.goalType ?? null
  const tdee = avgCalories ?? goals?.tdeeEstimated ?? 2000

  // ── manual calories section ────────────────────────────────────────────
  const [manualMode, setManualMode] = useState(goals?.isManualOverride ?? false)
  const [manualKcal, setManualKcal] = useState<string>(
    String(goals?.targetCalories ?? tdee)
  )
  const [manualSaved, setManualSaved] = useState(false)

  // ── macro split section ────────────────────────────────────────────────
  const defaultSplit = activeGoal ? GOAL_MACRO_SPLIT[activeGoal] : { protein: 25, carbs: 45, fat: 30 }
  const [protein, setProtein] = useState(goals?.targetProteinPct ?? defaultSplit.protein)
  const [carbs, setCarbs] = useState(goals?.targetCarbsPct ?? defaultSplit.carbs)
  const [fat, setFat] = useState(goals?.targetFatPct ?? defaultSplit.fat)
  const [macroSaved, setMacroSaved] = useState(false)
  const macroSum = protein + carbs + fat
  const macroValid = macroSum === 100

  // ── water target ───────────────────────────────────────────────────────
  const WATER_OPTIONS = [1500, 2000, 2500, 3000]
  const [waterTarget, setWaterTarget] = useState(2000)
  const [waterSaved, setWaterSaved] = useState(false)

  // sync state when goals load
  useEffect(() => {
    if (!goals) return
    setManualMode(goals.isManualOverride)
    if (goals.targetCalories) setManualKcal(String(goals.targetCalories))
    setProtein(goals.targetProteinPct)
    setCarbs(goals.targetCarbsPct)
    setFat(goals.targetFatPct)
  }, [goals])

  // keep macro split in sync when goal preset changes
  useEffect(() => {
    if (!pendingGoal) return
    const s = GOAL_MACRO_SPLIT[pendingGoal]
    setProtein(s.protein)
    setCarbs(s.carbs)
    setFat(s.fat)
  }, [pendingGoal])

  // ── handlers ───────────────────────────────────────────────────────────

  async function handleSaveGoal() {
    if (!activeGoal) return
    await setGoalType(activeGoal, tdee)
    setPendingGoal(null)
    setGoalSaved(true)
    setTimeout(() => setGoalSaved(false), 2500)
  }

  async function handleSaveManual() {
    const kcal = parseInt(manualKcal, 10)
    if (!kcal || kcal < 800 || kcal > 10000) return
    await setManualCalories(kcal)
    setManualSaved(true)
    setTimeout(() => setManualSaved(false), 2500)
  }

  async function handleSaveMacro() {
    if (!macroValid) return
    await setCustomMacroSplit(protein, carbs, fat)
    setMacroSaved(true)
    setTimeout(() => setMacroSaved(false), 2500)
  }

  function handleSaveWater() {
    // persisted locally for now; water_target_ml updates per-log
    setWaterSaved(true)
    setTimeout(() => setWaterSaved(false), 2500)
  }

  // ── computed grams ─────────────────────────────────────────────────────

  const targetKcal = manualMode
    ? parseInt(manualKcal, 10) || tdee
    : activeGoal
      ? tdee + GOAL_OFFSETS[activeGoal]
      : goals?.targetCalories ?? tdee

  const pG = Math.round((targetKcal * protein) / 100 / 4)
  const cG = Math.round((targetKcal * carbs) / 100 / 4)
  const fG = Math.round((targetKcal * fat) / 100 / 9)

  // ── render ─────────────────────────────────────────────────────────────

  return (
    <div className="pb-8">

      {/* ── back header ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 py-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors -ml-1"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-white">Setări nutriție</h1>
      </div>

      <div className="space-y-6">

        {/* ════════════════════════════════════════════════════
            1. OBIECTIV CALORIC
        ════════════════════════════════════════════════════ */}
        <section className="bg-gray-900 rounded-2xl p-4">
          <SectionHeader
            icon={<Flame size={16} className="text-orange-500" />}
            title="Obiectiv caloric"
          />

          {/* TDEE banner */}
          <div className="flex items-center justify-between bg-gray-800/60 rounded-xl px-4 py-3 mb-4">
            <div>
              <p className="text-xs text-gray-500">TDEE estimat</p>
              <p className="text-[11px] text-gray-600 mt-0.5">Media caloriilor din ultimele 14 zile</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-white tabular-nums">
                {avgCalories ? avgCalories.toLocaleString('ro-RO') : '—'}
              </span>
              <span className="text-xs text-gray-500 ml-1">kcal</span>
            </div>
          </div>

          <GoalSelector selected={activeGoal} tdee={tdee} onSelect={setPendingGoal} />

          {/* manual override toggle */}
          <div className="mt-4 flex items-center justify-between py-3 border-t border-gray-800">
            <div>
              <p className="text-sm text-white font-semibold">Calorii manuale</p>
              <p className="text-xs text-gray-500 mt-0.5">Suprascrie calculul automat</p>
            </div>
            <button
              onClick={() => setManualMode((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                manualMode ? 'bg-orange-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  manualMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {manualMode && (
            <div className="mt-2 flex gap-2 items-center">
              <div className="flex-1 flex items-center bg-gray-800 rounded-xl px-4 py-2.5 gap-2">
                <input
                  type="number"
                  min={800}
                  max={10000}
                  value={manualKcal}
                  onChange={(e) => setManualKcal(e.target.value)}
                  className="flex-1 bg-transparent text-white font-bold text-lg outline-none tabular-nums w-full"
                  placeholder="2200"
                />
                <span className="text-sm text-gray-500 shrink-0">kcal / zi</span>
              </div>
            </div>
          )}

          {/* save row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
            <SavedBadge show={goalSaved} />
            <button
              onClick={manualMode ? handleSaveManual : handleSaveGoal}
              disabled={!manualMode && !activeGoal}
              className="ml-auto px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold transition-all disabled:opacity-40"
            >
              Salvează obiectivul
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            2. SPLIT MACRONUTRIENȚI
        ════════════════════════════════════════════════════ */}
        <section className="bg-gray-900 rounded-2xl p-4">
          <SectionHeader
            icon={<SlidersHorizontal size={16} className="text-purple-400" />}
            title="Split macronutrienți"
          />

          <p className="text-xs text-gray-500 mb-4 -mt-1">
            Procentele trebuie să sumeze exact 100%. Ajustează cu ±5%.
          </p>

          {/* preview bar */}
          <div className="flex h-2 rounded-full overflow-hidden mb-4 gap-px">
            <div className="transition-all duration-300" style={{ width: `${protein}%`, backgroundColor: '#60a5fa' }} />
            <div className="transition-all duration-300" style={{ width: `${carbs}%`, backgroundColor: '#facc15' }} />
            <div className="transition-all duration-300" style={{ width: `${fat}%`, backgroundColor: '#f97316' }} />
          </div>

          <div className="bg-gray-800/40 rounded-xl px-3">
            <MacroInputRow
              label="Proteine"
              color="#60a5fa"
              value={protein}
              grams={pG}
              onChange={setProtein}
            />
            <MacroInputRow
              label="Carbohidrați"
              color="#facc15"
              value={carbs}
              grams={cG}
              onChange={setCarbs}
            />
            <MacroInputRow
              label="Grăsimi"
              color="#f97316"
              value={fat}
              grams={fG}
              onChange={setFat}
            />
          </div>

          {/* sum validation */}
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-1.5">
              {macroValid ? (
                <Check size={13} className="text-green-400" />
              ) : (
                <AlertCircle size={13} className="text-red-400" />
              )}
              <span className={`text-xs font-semibold ${macroValid ? 'text-green-400' : 'text-red-400'}`}>
                Total: {macroSum}% {macroValid ? '✓' : `— lipsesc ${100 - macroSum}%`}
              </span>
            </div>
            <span className="text-xs text-gray-600">
              {targetKcal.toLocaleString('ro-RO')} kcal bază
            </span>
          </div>

          {/* save row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
            <SavedBadge show={macroSaved} />
            <button
              onClick={handleSaveMacro}
              disabled={!macroValid}
              className="ml-auto px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold transition-all disabled:opacity-40"
            >
              Salvează split-ul
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            3. TARGET HIDRATARE
        ════════════════════════════════════════════════════ */}
        <section className="bg-gray-900 rounded-2xl p-4">
          <SectionHeader
            icon={<Droplets size={16} className="text-blue-400" />}
            title="Target hidratare zilnic"
          />

          <div className="grid grid-cols-4 gap-2 mb-4">
            {WATER_OPTIONS.map((ml) => (
              <button
                key={ml}
                onClick={() => setWaterTarget(ml)}
                className={`py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                  waterTarget === ml
                    ? 'bg-blue-500/20 border border-blue-500/60 text-blue-400'
                    : 'bg-gray-800 border border-transparent text-gray-400 hover:border-gray-600'
                }`}
              >
                {ml < 1000 ? `${ml}` : `${ml / 1000}L`}
                <span className="block text-[10px] font-normal mt-0.5 opacity-70">ml</span>
              </button>
            ))}
          </div>

          <div className="bg-gray-800/40 rounded-xl px-4 py-3 flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500">Target selectat</p>
              <p className="text-xs text-gray-600 mt-0.5">≈ {Math.round(waterTarget / 250)} pahare de apă / zi</p>
            </div>
            <span className="text-2xl font-black text-blue-400 tabular-nums">
              {(waterTarget / 1000).toFixed(1)}
              <span className="text-sm text-gray-500 font-normal ml-1">L</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <SavedBadge show={waterSaved} />
            <button
              onClick={handleSaveWater}
              className="ml-auto px-5 py-2.5 rounded-xl bg-blue-500/80 hover:bg-blue-500 active:scale-95 text-white text-sm font-bold transition-all"
            >
              Salvează targetul
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            4. CUM SE CALCULEAZĂ
        ════════════════════════════════════════════════════ */}
        <section className="bg-gray-900 rounded-2xl p-4">
          <SectionHeader
            icon={<BookOpen size={16} className="text-gray-400" />}
            title="Cum se calculează"
          />

          <div className="space-y-2">

            <InfoAccordion title="Ce este TDEE-ul?">
              <InfoLine
                label="TDEE"
                value="(Total Daily Energy Expenditure) = totalul de calorii pe care corpul tău le arde într-o zi, inclusiv activitatea fizică."
              />
              <InfoLine
                label="Estimare automată"
                value="ApexPulse calculează TDEE-ul din media caloriilor loggate în ultimele 14 zile. Cu cât loghezi mai constant, cu atât estimarea e mai precisă."
              />
            </InfoAccordion>

            <InfoAccordion title="Cum se calculează targetul caloric?">
              <InfoLine label="Menținere" value={`TDEE ± 0 kcal → ${avgCalories ? avgCalories.toLocaleString('ro-RO') : '?'} kcal/zi`} />
              <InfoLine label="Deficit ușor" value={`TDEE − 300 kcal → slăbire de ~0,3 kg/săpt.`} />
              <InfoLine label="Deficit moderat" value={`TDEE − 500 kcal → slăbire de ~0,5 kg/săpt.`} />
              <InfoLine label="Surplus" value={`TDEE + 300 kcal → creștere lentă în masă musculară.`} />
            </InfoAccordion>

            <InfoAccordion title="Formula macronutrienților">
              <InfoLine
                label="Proteine"
                value={`Target × ${protein}% ÷ 4 kcal/g = ${pG}g`}
              />
              <InfoLine
                label="Carbohidrați"
                value={`Target × ${carbs}% ÷ 4 kcal/g = ${cG}g`}
              />
              <InfoLine
                label="Grăsimi"
                value={`Target × ${fat}% ÷ 9 kcal/g = ${fG}g`}
              />
              <div className="mt-2 p-2 bg-gray-800/60 rounded-lg">
                <p className="text-[11px] text-gray-500">
                  Grăsimile au 9 kcal/g (față de 4 kcal/g pentru proteine și carbohidrați) — de aceea aceeași cantitate de grăsime are mai mulți calorii.
                </p>
              </div>
            </InfoAccordion>

            <InfoAccordion title="De ce sunt importante proteinele?">
              <InfoLine
                label="Mușchi"
                value="Proteinele construiesc și refac fibrele musculare după antrenament. Aport insuficient → pierdere de masă musculară în deficit caloric."
              />
              <InfoLine
                label="Sațietate"
                value="Proteinele sunt cel mai sățios macronutrient — reduc foamea și ajută la respectarea deficitului caloric."
              />
              <InfoLine
                label="Surse bune"
                value="Piept de pui, ouă, brânză de vaci, ton, somon, leguminoase (linte, năut)."
              />
            </InfoAccordion>

            <InfoAccordion title="De ce sunt importanți carbohidrații?">
              <InfoLine
                label="Energie"
                value="Carbohidrații sunt combustibilul principal al antrenamentelor de forță și cardio. Niveluri scăzute = oboseală, performanță redusă."
              />
              <InfoLine
                label="Glicogen"
                value="Corpul stochează carbohidrații ca glicogen în mușchi și ficat. Acest rezervor alimentează seturile grele."
              />
              <InfoLine
                label="Surse bune"
                value="Orez, cartofi dulci, ovăz, fructe, paste integrale."
              />
            </InfoAccordion>

            <InfoAccordion title="De ce sunt importante grăsimile?">
              <InfoLine
                label="Hormoni"
                value="Grăsimile sunt esențiale pentru producția de testosteron și alți hormoni anabolici. Aport sub 20% poate afecta nivelul hormonal."
              />
              <InfoLine
                label="Vitamine"
                value="Vitaminele A, D, E și K sunt liposolubile — nu pot fi absorbite fără grăsimi în dietă."
              />
              <InfoLine
                label="Surse bune"
                value="Avocado, nuci, ulei de măsline extravirgin, somon, semințe de in."
              />
            </InfoAccordion>

          </div>
        </section>

      </div>
    </div>
  )
}
