import { ProjectPrefModal } from '@/components/ProjectPrefModal'
import { Database } from '@/lib/database.types'
import prisma from '@/lib/prisma'
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline'
import { ProjectRole, Report, User } from '@prisma/client'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Eye, Plus, Users } from 'lucide-react'
import moment from 'moment'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'

const Project = async ({ params }: { params: { id: string } }) => {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const myProject = await prisma.projectMember.findFirst({
    where: {
      projectId: params.id,
      userId: session?.user.id,
    },
  })

  if (!myProject) {
    return null
  }

  let project = null

  if (myProject.role === ProjectRole.SUPERVISOR) {
    project = await prisma.project.findUnique({
      where: {
        id: myProject?.projectId,
      },
      include: {
        members: {
          include: {
            member: true,
          },
        },
        reports: {
          include: {
            user: true,
          },
        },
      },
    })
  } else {
    project = await prisma.project.findUnique({
      where: {
        id: myProject.projectId,
      },
      include: {
        reports: {
          where: {
            userId: session?.user.id,
          },
          include: {
            user: true,
          },
        },
        members: {
          include: {
            member: true,
          },
        },
      },
    })
  }
  await prisma.$disconnect()

  if (!project) {
    return null
  }

  return (
    <>
      <h1 className="mb-1 text-3xl">{project.name}</h1>

      <p className="mb-2">{project.description}</p>

      <div className="flex gap-2">
        <Link
          className="flex items-center gap-1 rounded-lg bg-sky-700 px-3 py-2 text-sm text-gray-50 hover:bg-sky-600"
          href={`/`}
        >
          <Users className="w-4" />
          Membros
        </Link>
        <Link
          className="flex items-center gap-1 rounded-lg bg-green-700 px-3 py-2 text-sm text-gray-50 hover:bg-green-600"
          href={`/dashboard/project/${project.id}/report`}
        >
          <Plus className="w-4" />
          Novo relatório
        </Link>
        {myProject.role === ProjectRole.SUPERVISOR ? (
          <ProjectPrefModal project={project} />
        ) : (
          // <p>Supervisor</p>
          ''
        )}
      </div>

      <div className="my-2 h-[1px] w-full border-b border-dashed"></div>

      {myProject.role === ProjectRole.SUPERVISOR ? (
        <p className="my-2">
          Você é um supervisor neste projeto, portanto irá visualizar todos os
          relatórios nele.
        </p>
      ) : (
        // <p>Supervisor</p>
        ''
      )}

      <h2 className="mb-2 text-2xl">Relatórios</h2>

      {/* {project.myRole === 'SUPERVISOR' ? ( */}
      <ReportsListSupervisor reports={project.reports} />
      {/* ) : ( */}
      {/* <ReportsListMember project={project} />
          )} */}
    </>
  )
}

const ReportsListSupervisor = ({
  reports,
}: {
  reports: (Report & { user: User })[]
}) => {
  return (
    <div className="flex flex-col gap-1">
      {reports.length > 0 ? (
        <>
          <div className="grid grid-cols-3 bg-gray-200 text-left  font-semibold text-gray-900">
            <div className="flex items-center gap-1 px-4 py-3">
              <UserIcon className="h-5" /> Submetido por
            </div>
            <div className="flex items-center gap-1 px-4 py-3">
              <CalendarIcon className="h-5" /> Data de submissão
            </div>
            <div className="px-4 py-3"></div>
          </div>
          {reports.map((report, idx) => (
            <div key={report.id} className="grid grid-cols-3  bg-gray-200">
              <div className="flex items-center gap-1 whitespace-nowrap px-4 py-3 text-sm leading-tight text-gray-900">
                <div>
                  <div className="font-semibold">{report.user.name}</div>
                  <div className="text-gray-700">{report.user.email}</div>
                </div>
              </div>
              <div className="flex flex-col px-4  py-3 text-sm leading-tight text-gray-900">
                <span className="font-semibold">
                  {moment(report.createdAt).format('DD/MM/YYYY')}
                </span>
                <span className="text-gray-700">
                  {moment(report.createdAt).format('HH:mm:ss')}
                </span>
              </div>
              <div className="flex justify-end gap-1 px-4 py-3 text-sm  font-light text-gray-900">
                <Link
                  href={`/dashboard/reports/${report.id}`}
                  className="hover: flex items-center gap-1 rounded-full p-2 text-xs font-semibold uppercase"
                >
                  <Eye className="w-5" />
                  Visualizar relatório
                </Link>
                {/* <Button className="hover: flex items-center gap-1 rounded-full p-2 text-xs font-semibold uppercase">
                  <ArrowDownToLine className="w-5" />
                  Baixar relatório
                </Button> */}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className=" bg-gray-200 px-4 py-3 text-center  font-semibold text-gray-900">
          Você não possui relatórios neste projeto
        </div>
      )}
    </div>
  )
}

export default Project
