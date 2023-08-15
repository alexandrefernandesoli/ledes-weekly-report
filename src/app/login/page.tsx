import Link from 'next/link'
import { HomeLeft } from './HomeLeft'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from 'next/headers'

async function Login() {
  const supabase = createServerComponentSupabaseClient({ headers, cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/')
  }

  return (
    <main className="grid h-screen w-full md:grid-flow-col md:grid-cols-2">
      <HomeLeft />

      <div className="flex flex-col items-center justify-center bg-primary py-4 text-gray-200">
        <LoginForm />
        <div className="mt-3 flex flex-col items-center">
          {/* <Link href="/register" className="mb-2 underline">
            Esqueceu sua senha?
          </Link> */}
          <Link className="underline" href="/register">
            Não possui conta? Crie uma agora!
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Login
