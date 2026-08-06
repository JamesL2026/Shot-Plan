import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'md' | 'lg'
  tone?: 'default' | 'soft' | 'sand' | 'accent'
}

export function Card({
  children,
  className,
  padding = 'lg',
  tone = 'default',
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        'ui-card',
        `ui-card--pad-${padding}`,
        `ui-card--${tone}`,
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
