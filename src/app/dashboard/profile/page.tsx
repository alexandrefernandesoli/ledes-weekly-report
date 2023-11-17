import { Database } from '@/lib/database.types'
import { createServerClient } from '@supabase/ssr'
import clsx from 'clsx'
import { UserIcon } from 'lucide-react'
import { cookies } from 'next/headers'

export default async function Profile() {
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

  if (!session) return null

  const { data: user } = await supabase
    .from('profile')
    .select('*')
    .eq('id', session.user.id)
    .limit(1)
    .single()

  return (
    <>
      <div className="flex items-center gap-4 pb-4">
        <div>
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
            <UserIcon className="h-12 w-12" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl">{session?.user.user_metadata.name}</h1>
            <span
              className={clsx(
                'rounded-full px-2 py-1 text-sm',
                user?.role === 'STUDENT'
                  ? 'bg-green-100 text-green-700'
                  : user?.role === 'SUPERVISOR'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-red-100 text-red-700',
              )}
            >
              {user?.role === 'STUDENT'
                ? 'Estudante'
                : user?.role === 'SUPERVISOR'
                ? 'Supervisor'
                : 'Administrador'}
            </span>
          </div>
          <p className="text-gray-500">{session?.user.email}</p>
        </div>
      </div>
      <div className="w-full border-b border-dotted"></div>
      <div className="pt-4">
        <h1 className="text-2xl">Meus projetos</h1>
      </div>
    </>
  )
}
