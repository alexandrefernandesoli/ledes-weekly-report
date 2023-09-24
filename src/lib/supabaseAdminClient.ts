import { createClient } from '@supabase/supabase-js'

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

// Só vai funcionar no backend!
const supabaseServiceRoleKey: string =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

export const supabaseAdminClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)
