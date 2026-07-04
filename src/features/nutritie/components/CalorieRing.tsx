interface CalorieRingProps {
  consumed: number
  target: number
  burned?: number
  compact?: boolean
}

export function CalorieRing({ consumed, target, burned = 0, compact = false }: CalorieRingProps) {
  const size = compact ? 100 : 132
  const r = compact ? 40 : 54
  const circ = 2 * Math.PI * r
  const cx = size / 2
  const net = consumed - burned
  const progress = Math.min(net / target, 1)
  const offset = circ * (1 - progress)
  const over = net > target
  const remaining = target - net

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="#1a1f2e" strokeWidth={compact ? 8 : 10} />
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={over ? '#e05200' : '#FF5C00'}
            strokeWidth={compact ? 8 : 10}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cx})`}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-black text-white ${compact ? 'text-lg' : 'text-2xl'}`}>
            {consumed.toLocaleString('ro-RO')}
          </span>
          <span className={`text-gray-400 ${compact ? 'text-[9px]' : 'text-xs'}`}>
            / {target.toLocaleString('ro-RO')}
          </span>
        </div>
      </div>

      {!compact && (
        <div className="flex gap-5 text-xs text-center">
          <div>
            <p className="text-orange-500 font-bold">{consumed.toLocaleString('ro-RO')}</p>
            <p className="text-gray-500">consumate</p>
          </div>
          {burned > 0 && (
            <div>
              <p className="text-blue-400 font-bold">-{burned}</p>
              <p className="text-gray-500">arse</p>
            </div>
          )}
          <div>
            <p className={`font-bold ${remaining < 0 ? 'text-orange-600' : 'text-green-400'}`}>
              {Math.abs(remaining).toLocaleString('ro-RO')}
            </p>
            <p className="text-gray-500">{remaining < 0 ? 'depășite' : 'rămase'}</p>
          </div>
        </div>
      )}

      {compact && (
        <span className={`text-[10px] font-semibold ${remaining < 0 ? 'text-orange-500' : 'text-gray-400'}`}>
          {remaining < 0 ? `+${Math.abs(remaining)} depășite` : `${remaining} rămase`}
        </span>
      )}
    </div>
  )
}
