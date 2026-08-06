import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BackLinkProps {
  to: string
  children: string
}

export function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link to={to} className="back-link">
      <ArrowLeft size={18} strokeWidth={2.25} aria-hidden="true" />
      <span>{children}</span>
    </Link>
  )
}
