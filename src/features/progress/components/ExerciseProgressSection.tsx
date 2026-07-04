import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Card } from '../../../shared/components/atoms/Card'
import { useExercises } from '../../exercises/hooks/useExercises'
import { useExerciseProgress } from '../hooks/useExerciseProgress'
import { ChartTooltip } from './ChartTooltip'
import { formatDateShort } from '../utils/formatters'

export function ExerciseProgressSection() {
  const { exercises } = useExercises()
  const [selectedExId, setSelectedExId] = useState('')
  const { data: progressData, loading } = useExerciseProgress(selectedExId)

  const chartData = progressData.map(d => ({
    date: formatDateShort(d.date),
    '1RM estimat': d.orm,
    'Greutate max': d.weight,
  }))

  const lastOrm = chartData[chartData.length - 1]?.['1RM estimat']
  const firstOrm = chartData[0]?.['1RM estimat']
  const ormDiff = lastOrm !== undefined && firstOrm !== undefined ? lastOrm - firstOrm : null

  return (
    <div>
      <h3 className="text-white font-bold mb-3 flex items-center gap-2">
        <TrendingUp size={18} className="text-orange-500" />
        Progres exercițiu
      </h3>
      <Card className="p-4 space-y-4">
        <select
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={selectedExId}
          onChange={e => setSelectedExId(e.target.value)}
        >
          <option value="">Alege exercițiu...</option>
          {exercises.map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>

        {selectedExId && (
          loading ? (
            <div className="h-48 flex items-center justify-center text-gray-500">Se încarcă...</div>
          ) : chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-500">
              Nu ai date pentru acest exercițiu
            </div>
          ) : (
            <div>
              <div className="flex gap-4 mb-3">
                {lastOrm !== undefined && (
                  <div className="text-center">
                    <div className="text-xl font-black text-orange-500">{lastOrm} kg</div>
                    <div className="text-xs text-gray-400">1RM curent</div>
                  </div>
                )}
                {ormDiff !== null && chartData.length > 1 && (
                  <div className="text-center">
                    <div className={`text-xl font-black ${ormDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {ormDiff >= 0 ? '+' : ''}{ormDiff} kg
                    </div>
                    <div className="text-xs text-gray-400">Față de prima sesiune</div>
                  </div>
                )}
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="ormGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF5C00" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF5C00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="1RM estimat" stroke="#FF5C00" fill="url(#ormGrad)" strokeWidth={2} dot={{ fill: '#FF5C00', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )
        )}
      </Card>
    </div>
  )
}
