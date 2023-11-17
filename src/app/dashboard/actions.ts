'use server'

import { CookieOptions, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const createProjectAction = async (actionData: {
  name: string
  description: string
  type: string
}) => {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    },
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { project: null, error: 'Unauthorized' }
  }

  const bodySchema = z.object({
    name: z.string(),
    description: z.string(),
    type: z.string(),
  })

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', session.user.id)
    .limit(1)
    .single()

  if (profileError) {
    return { project: null, error: profileError.message }
  }

  if (profile.role !== 'SUPERVISOR' && profile.role !== 'ADMIN') {
    return { project: null, error: 'Unauthorized' }
  }

  const { name, description, type } = bodySchema.parse(actionData)

  const { data: project, error } = await supabase
    .from('project')
    .insert({ name, description, type })
    .select('*')
    .limit(1)
    .single()

  if (error) {
    return { project: null, error: error.message }
  }

  const { error: memberError } = await supabase.from('project_member').insert({
    user_id: session.user.id,
    project_id: project.id,
    role: 'SUPERVISOR',
  })

  if (memberError) {
    return { project: null, error: memberError.message }
  }

  return { project, error: null }
}
