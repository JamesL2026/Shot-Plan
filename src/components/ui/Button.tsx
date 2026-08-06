import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary'

interface BaseProps {
  variant?: ButtonVariant
  block?: boolean
  children: ReactNode
  className?: string
}

type ButtonAsButton = BaseProps &
  Pick<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'type' | 'disabled' | 'onClick' | 'aria-label'
  >

interface ButtonAsLink extends BaseProps {
  to: string
}

function classes({
  variant = 'primary',
  block,
  className,
}: Pick<BaseProps, 'variant' | 'block' | 'className'>) {
  return [
    'ui-btn',
    `ui-btn--${variant}`,
    block ? 'ui-btn--block' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const classNames = classes(props)

  if ('to' in props) {
    return (
      <Link to={props.to} className={classNames}>
        {props.children}
      </Link>
    )
  }

  return (
    <button
      type={props.type ?? 'button'}
      className={classNames}
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label={props['aria-label']}
    >
      {props.children}
    </button>
  )
}
