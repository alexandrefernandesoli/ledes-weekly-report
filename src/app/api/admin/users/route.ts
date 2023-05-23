import { supabaseAdminClient } from '@/lib/supabaseAdminClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const {
    data: { users },
    error,
  } = await supabaseAdminClient.auth.admin.listUsers()

  if (error) {
    throw error
  }

  return NextResponse.json(users)
}
