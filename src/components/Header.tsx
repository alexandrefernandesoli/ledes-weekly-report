'use client'

import {
  AcademicCapIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/24/solid'
import * as Avatar from '@radix-ui/react-avatar'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../app/supabase-provider'

export const Header = () => {
  const { supabase } = useSupabase()
  const { push } = useRouter()

  const signOutHandler = async () => {
    await supabase.auth.signOut()

    push('/login')
  }

  return (
    <div className="fixed z-20 flex h-16 w-full items-center justify-between bg-gray-100 px-4 shadow-lg">
      <Link href="/">
        <div className="flex w-48 cursor-pointer items-center gap-1 text-xl leading-none">
          <AcademicCapIcon className="w-16 text-primary" />
          Ledes Weekly Report
        </div>
      </Link>

      <div className="flex-column flex items-center justify-center gap-2 text-primary">
        <Link href="/admin">
          <ShieldCheckIcon className="w-8 cursor-pointer  text-red-700 transition-colors hover:text-red-500" />
        </Link>

        {/* <CalendarIcon className="w-8  cursor-pointer transition-colors hover:text-gray-700" />
        <BellAlertIcon className="w-8  cursor-pointer transition-colors hover:text-gray-700" />
        <ChatBubbleLeftIcon className="w-8  cursor-pointer transition-colors hover:text-gray-700" /> */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Avatar.Root className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-200">
              <Avatar.AvatarImage />
              <Avatar.AvatarFallback>AF</Avatar.AvatarFallback>
            </Avatar.Root>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className="w-48 border-2 bg-gray-100 text-gray-900">
            <DropdownMenu.Item
              className="flex cursor-pointer gap-2 p-2  outline-none hover:bg-sky-600 hover:text-white"
              onClick={signOutHandler}
            >
              <UserIcon className="w-6" />
              Perfil
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="flex cursor-pointer gap-2 px-2 py-1 outline-none hover:bg-sky-600 hover:text-white"
              onClick={signOutHandler}
            >
              <ArrowLeftOnRectangleIcon className="w-6" />
              Sair
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  )
}
