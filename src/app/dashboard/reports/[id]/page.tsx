import prisma from '@/lib/prisma'
import 'moment/locale/pt-br'
import moment from 'moment'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { MyDocument } from './pdfView'

const Report = async ({ params }: { params: { id: string } }) => {
  const report = await prisma.report.findUnique({
    where: {
      id: params.id,
    },
    include: {
      project: true,
      user: true,
    },
  })
  await prisma.$disconnect()

  if (!report) {
    redirect('/')
  }

  const content = report?.content as {
    tasksThisWeek: string[]
    tasksNextWeek: string[]
  }

  moment.locale('pt-br')

  return (
    <>
      <div className="mb-2 text-base md:text-xl">
        <Link href={`/dashboard/project/${report.projectId}`}>
          <strong>Projeto: </strong>
          {report.project.name}
        </Link>
        <div>
          <strong>Autor: </strong>
          {report.user.name}
        </div>
        <div>
          <strong>Data de submissão: </strong>
          {moment(report.createdAt).format('LLLL')}
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        <Link
          href={'/'}
          className="rounded-lg bg-gray-900 px-3 py-2 text-white"
        >
          Ir ao projeto
        </Link>
        <MyDocument report={report} />
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
