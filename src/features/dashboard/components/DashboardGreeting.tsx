interface DashboardGreetingProps {
  name: string
}

export function DashboardGreeting({ name }: DashboardGreetingProps) {
  return (
    <div className="pt-1">
      <p className="text-forge-muted text-xs tracking-widest uppercase">Bună ziua</p>
      <h2 className="text-2xl font-black text-forge-text tracking-tight mt-0.5">{name}</h2>
    </div>
  )
}
