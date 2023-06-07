import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

const Page = async () => {
  const supabase = createServerComponentSupabaseClient({ headers, cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return redirect('/login')
  else return redirect('/dashboard')
}

export default Page
