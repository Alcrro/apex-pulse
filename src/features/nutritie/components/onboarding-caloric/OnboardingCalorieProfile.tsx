interface OnboardingCalorieProfileProps {
  avgCalories: number | null
}

export function OnboardingCalorieProfile({ avgCalories }: OnboardingCalorieProfileProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-2xl p-5 text-center">
        {avgCalories !== null ? (
          <>
            <p className="text-xs text-gray-400 mb-2">Mănânci în medie</p>
            <p className="text-5xl font-black text-orange-500 tabular-nums">
              {avgCalories.toLocaleString('ro-RO')}
            </p>
            <p className="text-sm text-gray-400 mt-1">kcal/zi</p>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Aceasta este media ta calorică bazată pe zilele logate. Vom folosi această valoare
              ca punct de referință pentru a-ți calcula obiectivul.
            </p>
          </>
        ) : (
          <>
            <p className="text-3xl font-black text-gray-600 mb-2">~2000</p>
            <p className="text-sm text-gray-400">kcal/zi (estimare implicită)</p>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Nu avem suficiente date pentru a-ți calcula media calorică. Vom folosi 2000 kcal
              ca estimare. Poți ajusta manual după setarea obiectivului.
            </p>
          </>
        )}
      </div>
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
        <p className="text-xs text-blue-300 leading-relaxed">
          Pe baza acestei valori îți vom sugera un target caloric adaptat obiectivului tău.
          Poți modifica oricând din Setări.
        </p>
      </div>
    </div>
  )
}
