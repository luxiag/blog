import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
  className?: string
}

// Neutral button style that matches existing design system (no gradients)
export const NeutralButton: React.FC<Props> = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-md px-4 py-1.5 text-xs font-mono text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-md ${className}`}
    >
      {children}
    </button>
  )
}

export default NeutralButton
