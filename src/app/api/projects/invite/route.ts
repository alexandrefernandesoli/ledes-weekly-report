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

  try {
    if (!session) {
      throw Error('Unauthorized')
    }

    const bodySchema = z.object({
      email: z.string().email(),
      projectId: z.string(),
    })

    const { email, projectId } = bodySchema.parse(await request.json())

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

    if (user) {
      await prisma.projectMember.create({
        data: {
          userId: user.id,
          projectId: myProject.projectId,
        },
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
