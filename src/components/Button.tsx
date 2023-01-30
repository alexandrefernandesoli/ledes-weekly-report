import clsx from 'clsx';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  uppercase?: boolean;
  children: ReactNode;
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
        'w-full cursor-pointer bg-gray-900 text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
