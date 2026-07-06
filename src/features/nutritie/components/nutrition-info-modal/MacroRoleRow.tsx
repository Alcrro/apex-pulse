interface Props {
  color: string
  name: string
  nameColor: string
  description: string
}

export function MacroRoleRow({ color, name, nameColor, description }: Props) {
  return (
    <div className="flex gap-3 bg-gray-800/40 rounded-xl p-3">
      <div className="w-2 h-2 shrink-0 rounded-full mt-1" style={{ backgroundColor: color }} />
      <div>
        <p className={`text-xs font-semibold ${nameColor}`}>{name}</p>
        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
