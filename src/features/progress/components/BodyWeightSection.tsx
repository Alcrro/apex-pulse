import { useState } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Card } from '../../../shared/components/atoms/Card'
import { useBodyWeight } from '../hooks/useBodyWeight'
import { ChartTooltip } from './ChartTooltip'
import { formatDateShort } from '../utils/formatters'

export function BodyWeightSection() {
  const { entries, loading, addEntry } = useBodyWeight()
  const [bwInput, setBwInput] = useState('')
  const [bwDate, setBwDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)

  const chartData = entries.map(e => ({
    date: formatDateShort(e.recorded_at),
    'Greutate (kg)': Number(e.weight),
  }))

  const lastBw = chartData[chartData.length - 1]?.['Greutate (kg)']
  const firstBw = chartData[0]?.['Greutate (kg)']
  const bwDiff = lastBw !== undefined && firstBw !== undefined ? lastBw - firstBw : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!bwInput) return
    setSaving(true)
    await addEntry(Number(bwInput), bwDate)
    setSaving(false)
    setBwInput('')
  }

  return (
    <div>
      <h3 className="text-white font-bold mb-3 flex items-center gap-2">
        <span className="text-orange-500 text-lg font-black">⚖</span>
        Greutate corporală
      </h3>
      <Card className="p-4 space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="number" step="0.1" min="30" max="300"
            placeholder="kg"
            value={bwInput}
            onChange={e => setBwInput(e.target.value)}
            className="w-24 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="date"
            value={bwDate}
            onChange={e => setBwDate(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={saving || !bwInput}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            {saving ? '...' : 'Adaugă'}
          </button>
        </form>

        {loading ? (
          <div className="h-32 flex items-center justify-center text-gray-500">Se încarcă...</div>
        ) : chartData.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
            Adaugă prima înregistrare
          </div>
        ) : (
          <>
            <div className="flex gap-4">
              {lastBw !== undefined && (
                <div className="text-center">
                  <div className="text-xl font-black text-white">{lastBw} kg</div>
                  <div className="text-xs text-gray-400">Curentă</div>
                </div>
              )}
              {bwDiff !== null && chartData.length > 1 && (
                <div className="text-center">
                  <div className={`text-xl font-black ${bwDiff <= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                    {bwDiff > 0 ? '+' : ''}{bwDiff.toFixed(1)} kg
                  </div>
                  <div className="text-xs text-gray-400">Față de start</div>
                </div>
              )}
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} domain={['auto', 'auto']} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="Greutate (kg)" stroke="#FF5C00" strokeWidth={2} dot={{ fill: '#FF5C00', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </Card>
    </div>
  )
}
