import { createServerClient } from '@supabase/ssr'
import clsx from 'clsx'
import { CalendarIcon, EyeIcon, FolderGitIcon } from 'lucide-react'
import moment from 'moment'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export default async function Reports() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: reports, error } = await supabase
    .from('report')
    .select('*, project(*)')
    .eq('user_id', user!.id)

  if (error) {
    return null
  }

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
              href={`/dashboard/project/${report.project!.id}`}
            >
              {report.project!.name}
            </Link>
            <div className="flex flex-col justify-center leading-none">
              <span className="font-semibold">
                {moment(report.created_at).format('DD/MM/YYYY')}
              </span>
              <span className="text-sm">
                {moment(report.created_at).format('hh:mm:ss')}
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
