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
      <div className="mb-6 flex justify-between">
        <div>
          <Link href={`/dashboard/project/${report.projectId}`}>
            Projeto: {report.project.name}
          </Link>
          <p>Autor: {report.user.name}</p>
          <p>Data: {moment(report.createdAt).format('DD/MM/YYYY')}</p>
        </div>
        <div>
          <MyDocument report={report} />
        </div>
      </div>
      <div>
        <h2>Tarefas realizadas nessa semana:</h2>
        <ul>
          {content.tasksThisWeek.map((task, idx) => (
            <li key={idx}>{task}</li>
          ))}
        </ul>
        <h2>Tarefas planejadas para a próxima semana:</h2>
        <ul>
          {content.tasksNextWeek.map((task, idx) => (
            <li key={idx}>{task}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Report
