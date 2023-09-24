import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'
import { InputHTMLAttributes, ReactNode } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface TextInputRootProps {
  children: ReactNode
  className?: string
  invalid?: boolean
}

function TextInputRoot({ children, className, invalid }: TextInputRootProps) {
  return (
    <div
      className={clsx(
        'flex h-11 w-full items-center gap-3 rounded-lg border  px-3 py-4 focus-within:ring-1  focus:outline-none',
        invalid
          ? 'border-red-400 focus-within:ring-red-400'
          : 'border-zinc-300 focus-within:ring-zinc-300',
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
        'flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none',
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
  return <Slot className="h-5 w-5 text-zinc-600">{props.children}</Slot>
}

export const TextInput = {
  Root: TextInputRoot,
  Input: TextInputInput,
  Icon: TextInputIcon,
}
