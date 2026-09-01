import styles from './Button.module.css'

interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'default' | 'primary' | 'secondary' | 'danger'
  className?: string
  disabled?: boolean
}

export const Button = ({
  label,
  onClick,
  variant = 'default',
  className = '',
  disabled = false,
}: ButtonProps) => {
  const variantClass = styles[variant]
  const classes = [styles.button, variantClass, className].filter(Boolean).join(' ')

  return (
    <button type="button" className={classes} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

export default Button
