'use server'

import { Database } from '@/lib/database.types'
import { createServerClient, CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

async function checkUserPermission(actionData: { projectId: string }) {
  const cookieStore = cookies()

  const supabase = createServerClient<Database>(
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
    return { supabase: null, error: 'Não autorizado.' }
  }

  const { data: myProject } = await supabase
    .from('project_member')
    .select('*')
    .eq('project_id', actionData.projectId)
    .eq('user_id', session.user.id)
    .eq('role', 'SUPERVISOR')
    .limit(1)
    .single()

  if (!myProject) {
    return { supabase: null, error: 'Não autorizado.' }
  }

  return { supabase, error: null }
}

export async function updateProjectAction(actionData: {
  projectId: string
  name: string
  description: string
  type: string
}) {
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
    throw Error('Unauthorized')
  }

  const bodySchema = z.object({
    name: z.string(),
    description: z.string(),
    projectId: z.string(),
    type: z.string(),
  })

  const { name, description, type, projectId } = bodySchema.parse(actionData)

  const { data: myProject, error } = await supabase
    .from('project_member')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('project_id', projectId)
    .eq('role', 'SUPERVISOR')
    .limit(1)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const { error: updateError } = await supabase
    .from('project')
    .update({ name, description, type })
    .eq('id', myProject.project_id)

  if (updateError) {
    console.log('Error', updateError)
    throw new Error(updateError.message)
  }
}

export async function addMemberAction(actionData: {
  projectId: string
  email: string
}) {
  const { supabase, error } = await checkUserPermission({
    projectId: actionData.projectId,
  })

  if (error || !supabase) {
    return { member: null, error }
  }

  const { data: hasUser } = await supabase
    .from('profile')
    .select('*')
    .eq('email', actionData.email)
    .limit(1)
    .single()

  console.log('hasUser', hasUser)

  if (!hasUser) {
    return { member: null, error: 'Usuário não encontrado.' }
  }

  const { data: isAlreadyMember } = await supabase
    .from('project_member')
    .select('*')
    .eq('user_id', hasUser.id)
    .eq('project_id', actionData.projectId)
    .limit(1)
    .single()

  console.log('isAlreadyMember', isAlreadyMember)

  if (isAlreadyMember) {
    return { member: null, error: 'Usuário já é membro do projeto.' }
  }

  await supabase.from('project_member').insert({
    user_id: hasUser.id,
    project_id: actionData.projectId,
  })

  return { member: { ...hasUser, role: 'STUDENT' }, error: null }
}

export async function removeMemberAction(actionData: {
  userId: string
  projectId: string
}) {
  const { supabase, error } = await checkUserPermission({
    projectId: actionData.projectId,
  })

  if (error || !supabase) {
    return { success: false, error }
  }

  const { data: isMember } = await supabase
    .from('project_member')
    .select('*')
    .eq('user_id', actionData.userId)
    .eq('project_id', actionData.projectId)
    .limit(1)
    .single()

  console.log('isMember', isMember)

  if (!isMember) {
    return { success: false, error: 'Usuário não é membro do projeto.' }
  }

  const { error: deleteError, statusText } = await supabase
    .from('project_member')
    .delete()
    .eq('user_id', isMember.user_id)

  console.log({ statusText })

  if (deleteError) {
    return { success: false, error: deleteError.message }
  }

  return { success: true, error: null }
}

export async function addReportAction(actionData: {
  projectId: string
  content: { tasksThisWeek: string[]; tasksNextWeek: string[] }
}) {
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
    return { report: null, error: 'Não autorizado.' }
  }

  const bodySchema = z.object({
    projectId: z.string(),
    content: z.object({
      tasksThisWeek: z.string().array(),
      tasksNextWeek: z.string().array(),
    }),
  })

  const { content, projectId } = bodySchema.parse(actionData)

  const { data, error } = await supabase
    .from('project_member')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('project_id', projectId)
    .limit(1)
    .single()

  if (!data) {
    return { report: null, error: error?.message }
  }

  const { data: report } = await supabase
    .from('report')
    .insert({
      user_id: session.user.id,
      project_id: projectId,
      content,
    })
    .limit(1)
    .select('*')
    .single()

  return { report, error: null }
}
