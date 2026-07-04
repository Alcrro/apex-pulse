interface WaterGlassProps {
  pct: number // 0-100
}

export function WaterGlass({ pct }: WaterGlassProps) {
  const fill = Math.min(Math.max(pct, 0), 100)

  return (
    <div className="relative w-10 h-28 rounded-b-2xl rounded-t overflow-hidden bg-[#0a0f1a] border border-gray-700/50 shrink-0">
      {/* water fill */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden"
        style={{
          height: `${fill}%`,
          transition: 'height 0.7s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* wave */}
        <svg
          height="14"
          viewBox="0 0 200 14"
          preserveAspectRatio="none"
          className="absolute top-0 left-0"
          style={{ width: '200%', animation: 'waveMove 2.8s linear infinite' }}
        >
          <path
            d="M0,7 C25,1 50,13 75,7 C100,1 125,13 150,7 C175,1 200,13 200,7 L200,14 L0,14 Z"
            fill="rgba(96,165,250,0.8)"
          />
        </svg>
        {/* body */}
        <div className="absolute inset-x-0 bottom-0 top-3" style={{ background: 'linear-gradient(to top, rgba(37,99,235,0.35), rgba(96,165,250,0.15))' }} />
      </div>

      {/* pct label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[10px] font-bold text-blue-300 drop-shadow">{Math.round(fill)}%</span>
      </div>
    </div>
  )
}
