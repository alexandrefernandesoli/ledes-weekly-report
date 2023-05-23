import { Database } from '@/lib/database.types'
import prisma from '@/lib/prisma'
import { ProjectRole } from '@prisma/client'
import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(
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
    type: z.string(),
  })

  const { name, description, type } = bodySchema.parse(await request.json())

  const myProject = await prisma.project.create({
    data: {
      name,
      description,
      type,
      members: {
        create: {
          role: ProjectRole.SUPERVISOR,
          userId: session.user.id,
        },
      },
    },
  })

  revalidatePath(`/`)

  return NextResponse.json(myProject)
}
