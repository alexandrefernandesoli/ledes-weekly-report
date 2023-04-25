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
        'flex h-fit w-fit cursor-pointer items-center gap-1 rounded-lg bg-gray-900 py-2 px-3 text-white transition-colors hover:bg-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
