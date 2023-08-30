import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { ReactNode } from 'react'
import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'

export default async function Layout({ children }: { children: ReactNode }) {
  const supabase = createServerComponentSupabaseClient({ headers, cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  return (
    <>
      <Header />

      <main className="z-10 mt-16 flex w-full  flex-col bg-neutral-100 px-2 py-3 text-gray-800 md:w-11/12 md:p-6 ">
        {children}
      </main>
    </>
  )
}
