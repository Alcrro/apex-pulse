export function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <span className="text-base font-bold text-white">{title}</span>
    </div>
  )
}
