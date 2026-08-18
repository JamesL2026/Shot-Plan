import { Flag, Home, LineChart, Target } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/play', label: 'Play', icon: Flag, end: false },
  { to: '/practice', label: 'Practice', icon: Target, end: false },
  { to: '/progress', label: 'Progress', icon: LineChart, end: false },
] as const

export function NavBar() {
  return (
    <nav className="sp-nav" aria-label="Main">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            isActive ? 'sp-nav__item sp-nav__item--on' : 'sp-nav__item'
          }
        >
          <item.icon size={20} strokeWidth={2.25} aria-hidden="true" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
