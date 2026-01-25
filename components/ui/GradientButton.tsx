import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
  className?: string
}

// A small, reusable gradient button to keep design language consistent across UI
export const GradientButton: React.FC<Props> = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-500 shadow-md hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300 ${className}`}
    >
      {children}
    </button>
  )
}

export default GradientButton
