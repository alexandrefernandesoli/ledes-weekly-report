import { Database } from '@/lib/database.types'
import prisma from '@/lib/prisma'
import { ProjectRole } from '@prisma/client'
import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { headers, cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
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
    email: z.string().email(),
    projectId: z.string(),
  })

  const { email, projectId } = bodySchema.parse(await request.json())

  console.log({ email, projectId })

  const myProject = await prisma.projectMember.findFirstOrThrow({
    where: {
      userId: session.user.id,
      projectId,
      role: ProjectRole.SUPERVISOR,
    },
  })

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  })

  console.log(user)

  let projectMember = null

  if (user) {
    projectMember = await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId: myProject.projectId,
      },
    })
  }

  return NextResponse.json(projectMember)
}
