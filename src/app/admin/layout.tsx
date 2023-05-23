import MainLayout from '@/components/MainLayout'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children?: ReactNode }) {
  return (
    <MainLayout>
      <div className="flex">
        <div className="h-full border-r border-dotted">
          <ul>
            <li className="px-4">
              <Link href="/admin">Visão geral</Link>
            </li>
            <li className="px-4">
              <Link href="/admin/users">Usuários</Link>
            </li>
            <li className="px-4">
              <Link href="/admin/projects">Projetos</Link>
            </li>
            <li className="px-4">
              <Link href="/admin/reports">Relatórios</Link>
            </li>
          </ul>
        </div>
        <div>{children}</div>
      </div>
    </MainLayout>
  )
}
