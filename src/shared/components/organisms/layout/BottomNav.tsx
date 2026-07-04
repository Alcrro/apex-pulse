import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, UtensilsCrossed, TrendingUp, User, LucideProps } from 'lucide-react'
import { FC } from 'react'

interface NavItem {
  to: string
  label: string
  icon: FC<LucideProps>
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/antrenamente', label: 'Antrenamente', icon: Dumbbell },
  { to: '/nutritie', label: 'Nutriție', icon: UtensilsCrossed },
  { to: '/progres', label: 'Progres', icon: TrendingUp },
  { to: '/profil', label: 'Profil', icon: User },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur-md border-t border-gray-800/50">
      <div className="max-w-2xl mx-auto flex">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                isActive ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            <Icon size={22} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
