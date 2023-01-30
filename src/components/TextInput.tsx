import { InputHTMLAttributes, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import { UseFormRegister, UseFormRegisterReturn } from 'react-hook-form';

interface TextInputRootProps {
  children: ReactNode;
  className?: string;
}

function TextInputRoot({ children, className }: TextInputRootProps) {
  return (
    <div
      className={clsx(
        'flex items-center h-11 gap-3 py-4 px-3 rounded-lg bg-gray-100 w-full outline-none focus-within:ring-2 ring-white',
        className
      )}
    >
      {children}
    </div>
  );
}

interface TextInputInputProps extends InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegisterReturn;
}

function TextInputInput({
  register,
  className,
  ...props
}: TextInputInputProps) {
  return (
    <input
      className={clsx(
        'bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none flex-1',
        className
      )}
      {...register}
      {...props}
    />
  );
}

interface TextInputIconProps {
  children: ReactNode;
}

function TextInputIcon(props: TextInputIconProps) {
  return <Slot className="w-5 h-5 text-gray-600">{props.children}</Slot>;
}

export const TextInput = {
  Root: TextInputRoot,
  Input: TextInputInput,
  Icon: TextInputIcon,
};
