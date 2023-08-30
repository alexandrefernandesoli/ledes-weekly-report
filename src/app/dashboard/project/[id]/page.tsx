import { ProjectPrefModal } from '@/app/dashboard/project/[id]/ProjectPrefModal'
import { Database } from '@/lib/database.types'
import prisma from '@/lib/prisma'
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline'
import {
  ProjectMember,
  ProjectRole,
  Project as ProjectType,
  Report,
  User,
} from '@prisma/client'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Eye, Plus } from 'lucide-react'
import moment from 'moment'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import { MembersModal } from './MembersModal'

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

  const project = await getProjectDetails(myProject, session)
  await prisma.$disconnect()

  if (!project) {
    return null
  }

  return (
    <div className="truncate">
      <h1 className="mb-1 text-2xl md:text-3xl">{project.name}</h1>

      <p className="mb-2 text-sm md:text-base">{project.description}</p>

      <div className="flex flex-wrap gap-1 md:gap-2">
        <Link
          className="flex w-fit items-center gap-1 rounded-lg bg-green-700 px-2 py-1 text-xs text-gray-50 hover:bg-green-600 md:px-3 md:py-2 md:text-sm"
          href={`/dashboard/project/${project.id}/report`}
        >
          <Plus className="w-4" />
          Novo relatório
        </Link>
        <MembersModal
          isSupervisor={myProject.role === ProjectRole.SUPERVISOR}
          project={project}
        />
        {myProject.role === ProjectRole.SUPERVISOR && (
          <ProjectPrefModal project={project} />
        )}
      </div>

      <div className="my-2 h-[1px] w-full border-b border-dashed"></div>

      <h2 className="mb-2 text-xl md:text-2xl">Relatórios</h2>

      <ReportsListSupervisor reports={project.reports!} />
    </div>
  )
}

const getProjectDetails = async (myProject: ProjectMember, session: any) => {
  let project:
    | (ProjectType & {
        members?: (ProjectMember & { member: User })[]
        reports?: (Report & { user: User })[]
      })
    | null = null

  const includeOptions: any = {
    members: {
      include: {
        member: true,
      },
    },
    reports: {
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    },
  }

  if (myProject.role === ProjectRole.SUPERVISOR) {
    project = await prisma.project.findUnique({
      where: {
        id: myProject.projectId,
      },
      include: includeOptions,
    })
  } else {
    project = await prisma.project.findUnique({
      where: {
        id: myProject.projectId,
      },
      include: {
        ...includeOptions,
        reports: {
          where: {
            userId: session?.user.id,
          },
          ...includeOptions.reports,
        },
      },
    })
  }

  return project
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
          <div className="grid grid-cols-[1fr,1fr,20px] bg-gray-200 text-left font-semibold  text-gray-900 md:grid-cols-3">
            <div className="flex items-center gap-1 px-3 py-2 text-sm md:px-4 md:py-3 md:text-base">
              <UserIcon className="h-5" /> Submetido por
            </div>
            <div className="flex items-center gap-1 truncate px-3 py-2 text-sm md:px-4 md:py-3 md:text-base">
              <CalendarIcon className="h-5" /> Data de submissão
            </div>
            <div className="px-4 py-3"></div>
          </div>
          {reports.map((report, idx) => (
            <div
              key={report.id}
              className="grid grid-cols-[1fr,1fr,20px] bg-gray-200  md:grid-cols-3"
            >
              <div className="flex flex-col justify-center truncate whitespace-nowrap px-3 py-2 text-sm leading-tight  text-gray-900 md:px-4 md:py-3">
                <div className="truncate font-semibold">{report.user.name}</div>
                <div className="truncate text-xs text-gray-700 md:text-sm">
                  {report.user.email}
                </div>
              </div>
              <div className="flex flex-col justify-center px-3 py-2 text-sm leading-tight text-gray-900 md:px-4 md:py-3">
                <span className="font-semibold">
                  {moment(report.createdAt).format('DD/MM/YYYY')}
                </span>
                <span className="text-gray-700">
                  {moment(report.createdAt).format('HH:mm:ss')}
                </span>
              </div>
              <div className="flex justify-end gap-1 px-3 py-2 text-sm  font-light text-gray-900">
                <Link
                  href={`/dashboard/reports/${report.id}`}
                  className="hover: flex items-center gap-1 rounded-full p-2 text-xs font-semibold uppercase"
                >
                  <Eye className="w-5" />
                  <span className="hidden md:inline">Visualizar relatório</span>
                </Link>
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
