import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { RedirectType, redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'
export default async function Layout({ children }: { children: ReactNode }) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    },
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login', RedirectType.replace)

  return (
    <>
      <Header />

      <main className="z-10 mt-16 flex w-full  flex-col bg-neutral-100 px-2 py-3 text-gray-800 md:w-11/12 md:p-6 ">
        {children}
      </main>
    </>
  )
}
