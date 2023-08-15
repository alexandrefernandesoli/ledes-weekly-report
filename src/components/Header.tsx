'use client'

import { AcademicCapIcon } from '@heroicons/react/24/solid'
// import { User, UserRole } from '@prisma/client'
import * as Avatar from '@radix-ui/react-avatar'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
// import axios from 'axios'
import {
  FileBoxIcon,
  LogOutIcon,
  // ShieldCheckIcon,
  User2Icon,
  UserCog,
  UserIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'
import { useSupabase } from '../app/supabase-provider'

export const Header = () => {
  const { supabase } = useSupabase()
  const router = useRouter()

  // const [user, setUser] = useState<User | null>(null)

  // async function getUser() {
  //   const response = await axios.get('/api/user')

  //   setUser(response.data)
  // }

  // useEffect(() => {
  //   getUser()
  // }, [])

  const signOutHandler = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      window.alert(error.message)
    } else {
      router.push('/login')
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
        {/* {user && user.role === UserRole.ADMIN ? (
          <Link href="/dashboard/admin">
            <ShieldCheckIcon className="h-8 w-8 cursor-pointer  text-red-700 transition-colors hover:text-red-600" />
          </Link>
        ) : (
          <></>
        )} */}

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
