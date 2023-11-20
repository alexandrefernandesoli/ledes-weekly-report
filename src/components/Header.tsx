'use client'

import { AcademicCapIcon } from '@heroicons/react/24/solid'
import * as Avatar from '@radix-ui/react-avatar'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  FileBoxIcon,
  LogOutIcon,
  User2Icon,
  UserCog,
  UserIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export const Header = () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const router = useRouter()

  const signOutHandler = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      window.alert(error.message)
    } else {
      router.refresh()
    }
  }

  return (
    <header className="fixed z-20 flex h-16 w-full items-center justify-between bg-gray-100 px-4 shadow-lg">
      <Link href="/dashboard">
        <div className="flex w-48 cursor-pointer items-center gap-1 text-xl leading-none">
          <AcademicCapIcon className="w-16 text-primary" />
          Ledes Weekly Report
        </div>
      </Link>

      <div className="flex-column flex items-center justify-center gap-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Avatar.Root className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-200">
              <Avatar.AvatarImage asChild>
                <User2Icon />
              </Avatar.AvatarImage>
              <Avatar.AvatarFallback>
                <UserIcon />
              </Avatar.AvatarFallback>
            </Avatar.Root>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className="w-48  rounded-lg bg-zinc-100 text-gray-900 shadow-lg">
            <DropdownMenu.Item asChild>
              <Link
                className="flex cursor-pointer gap-2 rounded-t-lg px-2 py-3 outline-none hover:bg-gray-200"
                href={'/dashboard/profile'}
              >
                <UserCog className="w-6" />
                Perfil
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link
                className="flex cursor-pointer gap-2 px-2 py-3 outline-none hover:bg-gray-200"
                href={'/dashboard/reports'}
              >
                <FileBoxIcon className="w-6" />
                Relatórios
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="m-1 h-[1px] bg-gray-200" />
            <DropdownMenu.Item
              className="flex cursor-pointer gap-2 rounded-b-lg px-2 py-3 outline-none hover:bg-gray-200"
              onClick={signOutHandler}
            >
              <LogOutIcon className="w-6 text-red-700" />
              Sair
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
