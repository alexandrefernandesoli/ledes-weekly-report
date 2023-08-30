import prisma from '@/lib/prisma'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import clsx from 'clsx'
import { CalendarIcon, EyeIcon, FolderGitIcon } from 'lucide-react'
import moment from 'moment'
import { headers, cookies } from 'next/headers'
import Link from 'next/link'

export default async function Reports() {
  const supabase = createServerComponentSupabaseClient({ headers, cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const reports = await prisma.report.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      project: true,
    },
  })
  await prisma.$disconnect()

  return (
    <div>
      <h1 className="mb-2 px-2 text-xl md:mb-4 md:text-3xl">
        Meu histórico de relatórios
      </h1>

      <div className="text-sm md:text-base">
        <div className="grid grid-cols-[1fr,1fr,20px] bg-zinc-200/50 px-3 py-2 font-semibold md:grid-cols-[1fr,1fr,180px] md:px-4 md:py-3">
          <div className="flex w-fit items-center justify-center gap-1">
            <FolderGitIcon />
            Nome do projeto
          </div>
          <div className="flex w-fit items-center justify-center gap-1">
            <CalendarIcon />
            Data de submissão
          </div>
          <div></div>
        </div>
        {reports.map((report, index) => (
          <div
            key={report.id}
            className={clsx(
              'grid grid-cols-[1fr,1fr,20px] px-4 py-3 md:grid-cols-[1fr,1fr,180px]',
              index % 2 === 1 && 'bg-zinc-200/50',
            )}
          >
            <Link
              className="flex w-fit items-center justify-center hover:underline"
              href={`/dashboard/project/${report.project.id}`}
            >
              {report.project.name}
            </Link>
            <div className="flex flex-col justify-center leading-none">
              <span className="font-semibold">
                {moment(report.createdAt).format('DD/MM/YYYY')}
              </span>
              <span className="text-sm">
                {moment(report.createdAt).format('hh:mm:ss')}
              </span>
            </div>
            <Link
              className="flex w-fit items-center justify-center gap-1 rounded-lg px-1 leading-none transition-all hover:bg-black/5"
              href={`/dashboard/reports/${report.id}`}
            >
              <EyeIcon />
              <div className="hidden md:inline-block">Visualizar relatório</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
