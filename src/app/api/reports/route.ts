import { Database } from '@/lib/database.types'
import prisma from '@/lib/prisma'
import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
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
    projectId: z.string(),
    content: z.string(),
  })

  const { content, projectId } = bodySchema.parse(await request.json())

  await prisma.projectMember.findFirstOrThrow({
    where: {
      projectId,
      userId: session.user.id,
    },
  })

  const report = await prisma.report.create({
    data: {
      content,
      projectId,
      userId: session.user.id,
    },
  })

  return NextResponse.json(report)
}
