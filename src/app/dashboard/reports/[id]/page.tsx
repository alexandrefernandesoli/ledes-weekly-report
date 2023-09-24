import 'moment/locale/pt-br'
import moment from 'moment'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { cookies } from 'next/headers'
import { DownloadReportButton } from '@/app/dashboard/reports/[id]/DownloadReportButton'
import { DownloadIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'
const Report = async ({ params }: { params: { id: string } }) => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: report, error } = await supabase
    .from('report')
    .select('*, project(*), profile(*)')
    .eq('id', params.id)
    .limit(1)
    .single()

  if (error) {
    redirect('/')
  }

  const content = report?.content as {
    tasksThisWeek: string[]
    tasksNextWeek: string[]
  }

  moment.locale('pt-br')

  return (
    <>
      <div className="mb-2 flex justify-between text-base md:text-xl">
        <div>
          <Link href={`/dashboard/project/${report.project_id}`}>
            <strong>Projeto: </strong>
            {report.project!.name}
          </Link>
          <div>
            <strong>Autor: </strong>
            {report.profile!.name}
          </div>
          <div>
            <strong>Data de submissão: </strong>
            {moment(report.created_at).format('LLLL')}
          </div>
        </div>
        <div>
          <DownloadReportButton
            className="flex h-fit w-fit items-center justify-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-sm text-gray-50 hover:bg-gray-800 md:text-base"
            report={report}
          >
            <DownloadIcon />
            <span className="hidden md:block">Baixar Relatório</span>
          </DownloadReportButton>
        </div>
      </div>

      <div className="my-2 h-[1px] w-full border-b border-dashed"></div>

      <div>
        <h2 className="text-lg font-semibold">
          Tarefas realizadas nessa semana:
        </h2>
        <ul className="mb-4">
          {content.tasksThisWeek.map((task, idx) => (
            <li key={idx}>
              {idx + 1}. {task}
            </li>
          ))}
        </ul>
        <h2 className="text-lg font-semibold">
          Tarefas planejadas para a próxima semana:
        </h2>
        <ul>
          {content.tasksNextWeek.map((task, idx) => (
            <li key={idx}>
              {idx + 1}. {task}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Report
