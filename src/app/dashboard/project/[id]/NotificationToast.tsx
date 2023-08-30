import * as Toast from '@radix-ui/react-toast'
import clsx from 'clsx'
import { CheckIcon, XCircleIcon } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

const NotificationToast = ({
  text,
  title,
  open,
  type = 'success',
  setOpen,
}: {
  text: string
  title: string
  open: boolean
  type?: 'error' | 'success'
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="flex flex-col flex-wrap justify-center rounded-md bg-gray-50 p-3 shadow data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title
          className={clsx(
            'mb-1 flex items-center gap-1 font-medium',
            type === 'success' ? 'text-green-700' : 'text-red-700',
          )}
        >
          {type === 'success' ? <CheckIcon /> : <XCircleIcon />}
          {title}
        </Toast.Title>
        <Toast.Description className="text-sm">{text}</Toast.Description>
      </Toast.Root>

      <Toast.Viewport className="fixed bottom-0 right-0 z-50 m-0 flex w-[390px] max-w-full list-none flex-col gap-2 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  )
}

export default NotificationToast
