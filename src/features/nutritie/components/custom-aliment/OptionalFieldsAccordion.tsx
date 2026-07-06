import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { NutritionInput } from './NutritionInput'

interface Props {
  fiber: string;   onFiberChange: (v: string) => void
  sodium: string;  onSodiumChange: (v: string) => void
  nameRo: string;  onNameRoChange: (v: string) => void
}

export function OptionalFieldsAccordion({ fiber, onFiberChange, sodium, onSodiumChange, nameRo, onNameRoChange }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5"
      >
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Informații opționale</p>
        {open ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-800">
          <div className="pt-4 grid grid-cols-2 gap-3">
            <NutritionInput label="Fibre / 100g"       value={fiber}  onChange={onFiberChange} />
            <NutritionInput label="Sodiu / 100g (mg)"  value={sodium} onChange={onSodiumChange} />
          </div>
          <NutritionInput
            label="Denumire în română (opțional)"
            type="text"
            value={nameRo}
            onChange={onNameRoChange}
            placeholder="ex: Piept de pui"
          />
        </div>
      )}
    </div>
  )
}
