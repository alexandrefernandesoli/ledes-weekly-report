'use client'

import clsx from 'clsx'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  uppercase?: boolean
  children: ReactNode
}

export function Button({
  uppercase,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'flex cursor-pointer items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-white transition-colors hover:bg-gray-800',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
