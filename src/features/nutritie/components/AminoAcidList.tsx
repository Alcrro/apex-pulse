import { ESSENTIAL } from '../utils/aminoAcids'
import { AminoRow } from './AminoRow'

interface AminoAcidListProps {
  aminoAcids?: Record<string, number>
}

export function AminoAcidList({ aminoAcids }: AminoAcidListProps) {
  if (!aminoAcids || Object.keys(aminoAcids).length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-8">
        Date despre aminoacizi indisponibile pentru acest aliment.
      </p>
    )
  }

  const allEntries  = Object.entries(aminoAcids).filter(([, v]) => v > 0)
  const maxValue    = Math.max(...allEntries.map(([, v]) => v), 1)
  const essential    = allEntries.filter(([k]) => ESSENTIAL.includes(k))
  const nonEssential = allEntries.filter(([k]) => !ESSENTIAL.includes(k))

  return (
    <div className="space-y-4">
      {essential.length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Esențiali</p>
          {essential.map(([name, value]) => <AminoRow key={name} name={name} value={value} maxValue={maxValue} />)}
        </div>
      )}
      {nonEssential.length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Non-esențiali</p>
          {nonEssential.map(([name, value]) => <AminoRow key={name} name={name} value={value} maxValue={maxValue} />)}
        </div>
      )}
    </div>
  )
}
