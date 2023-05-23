import { Database } from '@/lib/database.types'
import prisma from '@/lib/prisma'
import { ProjectRole } from '@prisma/client'
import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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
  })

  const { name, description } = bodySchema.parse(await request.json())

  const myProject = await prisma.projectMember.findFirstOrThrow({
    where: {
      userId: session.user.id,
      projectId: params.id,
      role: ProjectRole.SUPERVISOR,
    },
  })

  await prisma.project.update({
    where: {
      id: myProject.projectId,
    },
    data: {
      name,
      description,
    },
  })

  revalidatePath(`/project`)

  return NextResponse.json('ok')
}
