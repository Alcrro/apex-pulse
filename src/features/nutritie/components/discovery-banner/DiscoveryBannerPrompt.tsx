import { Target } from 'lucide-react'

interface DiscoveryBannerPromptProps {
  avgCalories: number | null
  onShowSelector: () => void
}

export function DiscoveryBannerPrompt({ avgCalories, onShowSelector }: DiscoveryBannerPromptProps) {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
        <Target size={20} className="text-orange-500" />
      </div>
      <div className="flex-1 min-w-0">
        {avgCalories ? (
          <>
            <p className="text-sm text-white font-semibold">Mănânci în medie {avgCalories} kcal/zi</p>
            <p className="text-xs text-gray-400 mt-0.5">Setează un obiectiv pentru a vedea progresul</p>
          </>
        ) : (
          <>
            <p className="text-sm text-white font-semibold">Începe să loghezi alimentele</p>
            <p className="text-xs text-gray-400 mt-0.5">Vom calcula targetul din datele tale reale</p>
          </>
        )}
      </div>
      <button
        onClick={onShowSelector}
        className="shrink-0 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
      >
        Setează
      </button>
    </div>
  )
}
