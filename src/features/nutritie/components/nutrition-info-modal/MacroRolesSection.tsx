import { Dumbbell } from 'lucide-react'
import { ModalSection } from './ModalSection'
import { MacroRoleRow } from './MacroRoleRow'

const MACRO_ROLES = [
  {
    color: '#60a5fa', name: 'Proteine', nameColor: 'text-blue-400',
    description: 'Construiesc și refac masa musculară. Esențiale după antrenament. Surse: pui, ouă, brânză, ton, leguminoase.',
  },
  {
    color: '#facc15', name: 'Carbohidrați', nameColor: 'text-yellow-400',
    description: 'Sursa principală de energie — alimentează antrenamentele. Surse: orez, cartofi, fructe, ovăz.',
  },
  {
    color: '#f97316', name: 'Grăsimi', nameColor: 'text-orange-400',
    description: 'Reglează hormonii și absorb vitaminele liposolubile (A, D, E, K). Surse: avocado, nuci, ulei de măsline, pește gras.',
  },
]

export function MacroRolesSection() {
  return (
    <ModalSection icon={<Dumbbell size={15} className="text-gray-400" />} title="Rolul fiecărui macronutrient">
      <div className="space-y-2">
        {MACRO_ROLES.map((m) => (
          <MacroRoleRow key={m.name} color={m.color} name={m.name} nameColor={m.nameColor} description={m.description} />
        ))}
      </div>
    </ModalSection>
  )
}
