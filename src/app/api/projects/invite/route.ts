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

    if (!myProject) {
      return NextResponse.json({ message: 'Não autorizado.' }, { status: 404 })
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado.' },
        { status: 400 },
      )
    }

    const isAlreadyMember = await prisma.projectMember.findFirst({
      where: {
        userId: user.id,
        projectId,
      },
    })

    if (isAlreadyMember) {
      return NextResponse.json(
        { message: 'Membro já faz parte do projeto.' },
        { status: 400 },
      )
    }

    await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId: myProject.projectId,
      },
    })

    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
