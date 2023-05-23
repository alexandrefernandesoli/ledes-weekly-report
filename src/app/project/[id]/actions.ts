'use server'

import prisma from '@/lib/prisma'
import { Database } from '@/lib/database.types'
import { ProjectRole } from '@prisma/client'
import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { z } from 'zod'

export async function updateProjectAction(actionData: {
  projectId: string
  name: string
  description: string
}) {
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
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
  })

  const { name, description, projectId } = bodySchema.parse(actionData)

  const myProject = await prisma.projectMember.findFirstOrThrow({
    where: {
      userId: session.user.id,
      projectId,
      role: ProjectRole.SUPERVISOR,
    },
  })

  const project = await prisma.project.update({
    where: {
      id: myProject.projectId,
    },
    data: {
      name,
      description,
    },
  })

  revalidatePath(`/project/${projectId}`)
  revalidatePath(`/`)

  return project
}
