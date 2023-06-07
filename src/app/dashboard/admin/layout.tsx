import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { ReactNode } from 'react'
import { headers, cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export default async function AdminLayout({
  children,
}: {
  children?: ReactNode
}) {
  const supabase = createServerComponentSupabaseClient({ headers, cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  })
  await prisma.$disconnect()

  if (user?.role !== UserRole.ADMIN) {
    notFound()
  }

  return (
    <div className="flex">
      <div className="h-full border-r border-dotted">
        <ul>
          <li className="px-4">
            <Link href="/dashboard/admin">Visão geral</Link>
          </li>
          <li className="px-4">
            <Link href="/dashboard/admin/users">Usuários</Link>
          </li>
          <li className="px-4">
            <Link href="/dashboard/admin/projects">Projetos</Link>
          </li>
          <li className="px-4">
            <Link href="/dashboard/admin/reports">Relatórios</Link>
          </li>
        </ul>
      </div>
      <div>{children}</div>
    </div>
  )
}
