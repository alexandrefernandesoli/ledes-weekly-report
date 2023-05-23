import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'
import { InputHTMLAttributes, ReactNode } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface TextInputRootProps {
  children: ReactNode
  className?: string
}

function TextInputRoot({ children, className }: TextInputRootProps) {
  return (
    <div
      className={clsx(
        'flex h-11 w-full items-center gap-3 rounded-lg bg-gray-100 px-3 py-4 outline-none ring-white focus-within:ring-2',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface TextInputInputProps extends InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegisterReturn
}

function TextInputInput({
  register,
  className,
  ...props
}: TextInputInputProps) {
  return (
    <input
      className={clsx(
        'flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none',
        className,
      )}
      {...register}
      {...props}
    />
  )
}

interface TextInputIconProps {
  children: ReactNode
}

function TextInputIcon(props: TextInputIconProps) {
  return <Slot className="h-5 w-5 text-gray-600">{props.children}</Slot>
}

export const TextInput = {
  Root: TextInputRoot,
  Input: TextInputInput,
  Icon: TextInputIcon,
}
