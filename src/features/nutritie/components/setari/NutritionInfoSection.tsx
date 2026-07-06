import { BookOpen } from 'lucide-react'
import { useNutritionInfoSection } from '../../stores/nutritieSetariStore'
import { SectionHeader } from './SectionHeader'
import { InfoAccordion, InfoLine } from './InfoAccordion'

export function NutritionInfoSection() {
  const { avgCalories, protein, carbs, fat, pG, cG, fG } = useNutritionInfoSection()

  return (
    <section className="bg-gray-900 rounded-2xl p-4">
      <SectionHeader icon={<BookOpen size={16} className="text-gray-400" />} title="Cum se calculează" />

      <div className="space-y-2">
        <InfoAccordion title="Ce este TDEE-ul?">
          <InfoLine label="TDEE" value="(Total Daily Energy Expenditure) = totalul de calorii pe care corpul tău le arde într-o zi, inclusiv activitatea fizică." />
          <InfoLine label="Estimare automată" value="ApexPulse calculează TDEE-ul din media caloriilor loggate în ultimele 14 zile. Cu cât loghezi mai constant, cu atât estimarea e mai precisă." />
        </InfoAccordion>

        <InfoAccordion title="Cum se calculează targetul caloric?">
          <InfoLine label="Menținere" value={`TDEE ± 0 kcal → ${avgCalories ? avgCalories.toLocaleString('ro-RO') : '?'} kcal/zi`} />
          <InfoLine label="Deficit ușor" value="TDEE − 300 kcal → slăbire de ~0,3 kg/săpt." />
          <InfoLine label="Deficit moderat" value="TDEE − 500 kcal → slăbire de ~0,5 kg/săpt." />
          <InfoLine label="Surplus" value="TDEE + 300 kcal → creștere lentă în masă musculară." />
        </InfoAccordion>

        <InfoAccordion title="Formula macronutrienților">
          <InfoLine label="Proteine" value={`Target × ${protein}% ÷ 4 kcal/g = ${pG}g`} />
          <InfoLine label="Carbohidrați" value={`Target × ${carbs}% ÷ 4 kcal/g = ${cG}g`} />
          <InfoLine label="Grăsimi" value={`Target × ${fat}% ÷ 9 kcal/g = ${fG}g`} />
          <div className="mt-2 p-2 bg-gray-800/60 rounded-lg">
            <p className="text-[11px] text-gray-500">
              Grăsimile au 9 kcal/g (față de 4 kcal/g pentru proteine și carbohidrați) — de aceea aceeași cantitate de grăsime are mai mulți calorii.
            </p>
          </div>
        </InfoAccordion>

        <InfoAccordion title="De ce sunt importante proteinele?">
          <InfoLine label="Mușchi" value="Proteinele construiesc și refac fibrele musculare după antrenament. Aport insuficient → pierdere de masă musculară în deficit caloric." />
          <InfoLine label="Sațietate" value="Proteinele sunt cel mai sățios macronutrient — reduc foamea și ajută la respectarea deficitului caloric." />
          <InfoLine label="Surse bune" value="Piept de pui, ouă, brânză de vaci, ton, somon, leguminoase (linte, năut)." />
        </InfoAccordion>

        <InfoAccordion title="De ce sunt importanți carbohidrații?">
          <InfoLine label="Energie" value="Carbohidrații sunt combustibilul principal al antrenamentelor de forță și cardio. Niveluri scăzute = oboseală, performanță redusă." />
          <InfoLine label="Glicogen" value="Corpul stochează carbohidrații ca glicogen în mușchi și ficat. Acest rezervor alimentează seturile grele." />
          <InfoLine label="Surse bune" value="Orez, cartofi dulci, ovăz, fructe, paste integrale." />
        </InfoAccordion>

        <InfoAccordion title="De ce sunt importante grăsimile?">
          <InfoLine label="Hormoni" value="Grăsimile sunt esențiale pentru producția de testosteron și alți hormoni anabolici. Aport sub 20% poate afecta nivelul hormonal." />
          <InfoLine label="Vitamine" value="Vitaminele A, D, E și K sunt liposolubile — nu pot fi absorbite fără grăsimi în dietă." />
          <InfoLine label="Surse bune" value="Avocado, nuci, ulei de măsline extravirgin, somon, semințe de in." />
        </InfoAccordion>
      </div>
    </section>
  )
}
