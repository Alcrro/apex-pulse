interface Props {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

export function ModalSection({ icon, title, children }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-bold text-white">{title}</span>
      </div>
      {children}
    </div>
  )
}
