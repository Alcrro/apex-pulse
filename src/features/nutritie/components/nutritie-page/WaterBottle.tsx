interface Props {
  pct: number
}

export function WaterBottle({ pct }: Props) {
  return (
    <div className="relative flex-1 w-full flex items-center justify-center py-1">
      <div className="relative" style={{ width: 52, height: 88 }}>
        <div className="absolute inset-0 rounded-b-3xl rounded-t-2xl border border-blue-500/25 bg-gray-800 overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
            style={{ height: `${pct}%` }}
          >
            <div
              className="absolute -top-2 left-0 h-4"
              style={{
                width: '200%',
                background: 'rgba(59,130,246,0.55)',
                borderRadius: '40% 60% 60% 40% / 30%',
                animation: 'waveMove 1.8s linear infinite',
              }}
            />
            <div className="absolute inset-0 top-2 bg-blue-500/40" />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[11px] font-black text-white drop-shadow">{Math.round(pct)}%</span>
        </div>
      </div>
    </div>
  )
}
