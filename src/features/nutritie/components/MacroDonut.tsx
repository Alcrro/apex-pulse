import { PieChart, Pie, Cell } from 'recharts'

interface MacroDonutProps {
  proteinG: number
  carbsG: number
  fatG: number
}

const COLORS = {
  protein: '#60a5fa',
  carbs: '#facc15',
  fat: '#f97316',
}

export function MacroDonut({ proteinG, carbsG, fatG }: MacroDonutProps) {
  const total = proteinG + carbsG + fatG

  const data = [
    { name: 'Proteine', value: proteinG, color: COLORS.protein },
    { name: 'Carbohidrați', value: carbsG, color: COLORS.carbs },
    { name: 'Grăsimi', value: fatG, color: COLORS.fat },
  ].filter((d) => d.value > 0)

  if (total <= 0) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-[180px] h-[180px] rounded-full bg-gray-800 flex items-center justify-center">
          <span className="text-xs text-gray-500">Fără date</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <PieChart width={180} height={180}>
          <Pie
            data={data}
            cx={90}
            cy={90}
            innerRadius={60}
            outerRadius={84}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-white">{Math.round(total)}</span>
          <span className="text-[10px] text-gray-400">grame</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.protein }} />
          <span className="text-xs text-gray-300">P <span className="font-bold text-white">{Math.round(proteinG)}g</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.carbs }} />
          <span className="text-xs text-gray-300">C <span className="font-bold text-white">{Math.round(carbsG)}g</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.fat }} />
          <span className="text-xs text-gray-300">G <span className="font-bold text-white">{Math.round(fatG)}g</span></span>
        </div>
      </div>
    </div>
  )
}
