'use server'

import { Database } from '@/lib/database.types'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

export async function updateProjectAction(actionData: {
  projectId: string
  name: string
  description: string
  type: string
}) {
  const supabase = createRouteHandlerClient<Database>({
    cookies,
  })

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
  const supabase = createRouteHandlerClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw Error('Unauthorized')
  }

  const { data: myProject } = await supabase
    .from('project_member')
    .select('*')
    .eq('project_id', actionData.projectId)
    .eq('role', 'SUPERVISOR')
    .eq('user_id', session.user.id)
    .limit(1)
    .single()

  console.log('myProject', myProject)

  if (!myProject) {
    return { member: null, error: 'Não autorizado.' }
  }

  const { data: hasUser } = await supabase
    .from('profile')
    .select('*')
    .eq('email', actionData.email)
    .limit(1)
    .single()

  if (!hasUser) {
    return { member: null, error: 'Usuário não encontrado.' }
  }

  const { data: isAlreadyMember } = await supabase
    .from('project_member')
    .select('*')
    .eq('userId', hasUser.id)
    .eq('project_id', actionData.projectId)
    .limit(1)
    .single()

  if (isAlreadyMember) {
    return { member: null, error: 'Usuário já é membro do projeto.' }
  }

  await supabase.from('project_member').insert({
    user_id: hasUser.id,
    project_id: actionData.projectId,
  })

  return { member: hasUser, error: null }
}

export async function addReportAction(actionData: {
  projectId: string
  content: { tasksThisWeek: string[]; tasksNextWeek: string[] }
}) {
  const supabase = createRouteHandlerClient<Database>({
    cookies,
  })

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
    return { report: null, error: error.message }
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
