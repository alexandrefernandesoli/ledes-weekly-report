import { Database } from '@/lib/database.types'
import { createRouteHandlerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { headers, cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
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

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  })

  return NextResponse.json(user)
}
