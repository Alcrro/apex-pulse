// viewBox: 0 0 100 160  — scaled down via size prop
// BASE = body silhouette, HL = highlighted muscle (orange)

const BASE = '#374151'
const HL   = '#f97316'
const LINE = '#111827'  // separation lines between muscle groups

/* ── reusable body part paths ──────────────────────────────── */
const P = {
  head:        'M50 1 a11 12 0 0 1 0 24 a11 12 0 0 1 0-24Z',
  neck:        'M44 25 L56 25 L54 33 L46 33Z',
  leftDelt:    'M22 36 Q10 40 12 62 Q16 65 22 64 Q23 48 26 40Z',
  rightDelt:   'M78 36 Q90 40 88 62 Q84 65 78 64 Q77 48 74 40Z',
  chestUpper:  'M26 36 Q23 42 24 62 Q35 68 50 68 Q65 68 76 62 Q77 42 74 36 Q66 30 50 30 Q34 30 26 36Z',
  abs:         'M24 62 Q22 76 23 96 Q35 102 50 102 Q65 102 77 96 Q78 76 76 62 Q65 68 50 68 Q35 68 24 62Z',
  leftBicep:   'M12 62 Q7 76 9 90 L18 90 Q19 76 22 64Z',
  rightBicep:  'M88 62 Q93 76 91 90 L82 90 Q81 76 78 64Z',
  leftFore:    'M9 90 Q7 104 9 114 L18 114 Q18 104 18 90Z',
  rightFore:   'M91 90 Q93 104 91 114 L82 114 Q82 104 82 90Z',
  leftThigh:   'M28 102 Q24 120 25 140 L38 140 Q42 122 47 116 L44 102Z',
  rightThigh:  'M72 102 Q76 120 75 140 L62 140 Q58 122 53 116 L56 102Z',
  leftCalf:    'M25 140 Q22 152 24 162 L36 162 Q37 152 38 140Z',
  rightCalf:   'M75 140 Q78 152 76 162 L64 162 Q63 152 62 140Z',
}

// muscle definition / separation lines
const LINES = {
  chestSplit: 'M50 36 L50 68',
  absSplit:   'M50 68 L50 100',
  absH1:      'M26 76 Q50 79 74 76',
  absH2:      'M25 88 Q50 91 75 88',
  pec1:       'M26 53 Q35 58 50 58 Q65 58 74 53',
}

function SeparationLines() {
  const style = { stroke: LINE, strokeWidth: 1, fill: 'none', opacity: 0.5 }
  return (
    <>
      <path d={LINES.chestSplit} style={style} />
      <path d={LINES.absSplit}   style={style} />
      <path d={LINES.pec1}       style={style} />
      <path d={LINES.absH1}      style={style} />
      <path d={LINES.absH2}      style={style} />
    </>
  )
}

type FC = () => JSX.Element

function base(highlighted: (keyof typeof P)[], back = false) {
  const hlSet = new Set(highlighted)
  const parts = Object.entries(P) as [keyof typeof P, string][]
  // for back view, swap chest+abs highlight into the full back shape
  return (
    <>
      {parts.map(([key, d]) => (
        <path key={key} d={d} fill={hlSet.has(key) ? HL : BASE} />
      ))}
      {/* Neck always base */}
      {back
        ? <path d={P.neck} fill={BASE} />
        : <SeparationLines />}
    </>
  )
}

const IconPiept: FC = () => (
  <>
    {base(['chestUpper'])}
    {/* extra pec definition */}
    <path d={P.chestUpper} fill={HL} />
    <path d={LINES.chestSplit} stroke={LINE} strokeWidth={1.2} fill="none" opacity={0.7} />
    <path d={LINES.pec1} stroke={LINE} strokeWidth={1.2} fill="none" opacity={0.7} />
  </>
)

const IconSpate: FC = () => (
  // back view — full torso highlighted
  <>
    <path d={P.head}       fill={BASE} />
    <path d={P.neck}       fill={BASE} />
    <path d={P.leftDelt}   fill={HL} />
    <path d={P.rightDelt}  fill={HL} />
    <path d={P.chestUpper} fill={HL} />
    <path d={P.abs}        fill={HL} />
    <path d={P.leftBicep}  fill={BASE} />
    <path d={P.rightBicep} fill={BASE} />
    <path d={P.leftFore}   fill={BASE} />
    <path d={P.rightFore}  fill={BASE} />
    <path d={P.leftThigh}  fill={BASE} />
    <path d={P.rightThigh} fill={BASE} />
    <path d={P.leftCalf}   fill={BASE} />
    <path d={P.rightCalf}  fill={BASE} />
    {/* lats / back definition lines */}
    <path d="M30 38 Q26 70 28 96" stroke={LINE} strokeWidth={1.2} fill="none" opacity={0.5} />
    <path d="M70 38 Q74 70 72 96" stroke={LINE} strokeWidth={1.2} fill="none" opacity={0.5} />
    <path d="M34 36 Q50 32 66 36" stroke={LINE} strokeWidth={1.2} fill="none" opacity={0.5} />
  </>
)

const IconUmeri: FC = () => (
  <>
    {base(['leftDelt', 'rightDelt'])}
  </>
)

const IconBiceps: FC = () => (
  <>
    {base(['leftBicep', 'rightBicep'])}
  </>
)

const IconTriceps: FC = () => (
  // back of arms — shown on back view
  <>
    <path d={P.head}       fill={BASE} />
    <path d={P.neck}       fill={BASE} />
    <path d={P.leftDelt}   fill={BASE} />
    <path d={P.rightDelt}  fill={BASE} />
    <path d={P.chestUpper} fill={BASE} />
    <path d={P.abs}        fill={BASE} />
    <path d={P.leftBicep}  fill={HL} />
    <path d={P.rightBicep} fill={HL} />
    <path d={P.leftFore}   fill={BASE} />
    <path d={P.rightFore}  fill={BASE} />
    <path d={P.leftThigh}  fill={BASE} />
    <path d={P.rightThigh} fill={BASE} />
    <path d={P.leftCalf}   fill={BASE} />
    <path d={P.rightCalf}  fill={BASE} />
  </>
)

const IconAbdomen: FC = () => (
  <>
    {base(['abs'])}
  </>
)

const IconPicioare: FC = () => (
  <>
    {base(['leftThigh', 'rightThigh', 'leftCalf', 'rightCalf'])}
  </>
)

const IconFullBody: FC = () => (
  <>
    {Object.values(P).map((d, i) => <path key={i} d={d} fill={HL} />)}
  </>
)

const IconCardio: FC = () => (
  <>
    {base([])}
    {/* ECG / heartbeat on chest */}
    <path
      d="M18 54 L24 54 L27 44 L30 64 L33 50 L36 58 L40 54 L50 54 L54 54 L57 44 L60 64 L63 50 L66 58 L70 54 L76 54"
      stroke={HL} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
    />
  </>
)

const ICONS: Record<string, FC> = {
  Piept:       IconPiept,
  Spate:       IconSpate,
  Picioare:    IconPicioare,
  Umeri:       IconUmeri,
  Biceps:      IconBiceps,
  Triceps:     IconTriceps,
  Abdomen:     IconAbdomen,
  'Full Body': IconFullBody,
  Cardio:      IconCardio,
}

interface Props { group: string; size?: number }

export function MuscleGroupIcon({ group, size = 56 }: Props) {
  const Icon = ICONS[group]
  if (!Icon) return null
  const h = Math.round(size * 1.6)
  return (
    <svg width={size} height={h} viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Icon />
    </svg>
  )
}
