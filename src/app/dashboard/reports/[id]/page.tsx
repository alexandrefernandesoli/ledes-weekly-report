import prisma from '@/lib/prisma'
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

  return (
    <>
      <div className="flex justify-between">
        <div className="text-xl font-semibold">
          <Link href={`/dashboard/project/${report.projectId}`}>
            Projeto: {report.project.name}
          </Link>
          <div>Autor: {report.user.name}</div>
          <div>
            Data de submissão:{' '}
            {moment(report.createdAt).format('DD/MM/YYYY HH:mm:ss')}
          </div>
        </div>
        <div>
          <MyDocument report={report} />
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
