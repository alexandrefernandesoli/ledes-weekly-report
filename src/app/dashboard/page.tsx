import { NewProjectModal } from '@/components/NewProjectModal'
import prisma from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import clsx from 'clsx'
import { FolderGit2Icon } from 'lucide-react'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LastReportTooltip } from './LastReportTooltip'

const Page = async () => {
  const supabase = createServerComponentSupabaseClient({ headers, cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const userData = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      projects: {
        include: {
          project: {
            include: {
              reports: {
                where: {
                  userId: session.user.id,
                },
                orderBy: {
                  createdAt: 'desc',
                },
                take: 1,
                select: {
                  createdAt: true,
                },
              },
            },
          },
        },
      },
    },
  })
  await prisma.$disconnect()

  if (!userData) {
    throw new Error('User data not found')
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl">Meus projetos</h1>
        {userData.role === UserRole.ADMIN ||
        userData.role === UserRole.SUPERVISOR ? (
          <NewProjectModal />
        ) : (
          ''
        )}
      </div>

      <div className="flex flex-col">
        {userData?.projects.map(({ project }, arrayId) => (
          <div
            key={project.id}
            className={clsx(
              'grid w-full grid-cols-[1fr,18px] items-center  px-3 py-2 md:px-4 md:py-3 md:text-2xl',
              arrayId % 2 === 1 && 'bg-zinc-200/50',
            )}
          >
            <div className="flex items-center gap-2">
              <FolderGit2Icon className="h-4 w-4 md:h-8 md:w-8" />
              <Link
                className="hover:text-zinc-700 hover:underline"
                href={`/dashboard/project/${project.id}`}
              >
                {project.name}
              </Link>
            </div>
            <LastReportTooltip reports={project.reports} />
          </div>
        ))}
      </div>

      {/* <ProjectsList
        projects={userData?.projects.map((project) => project.project) ?? []}
      /> */}

      {/* <div className="my-4 w-full border-b-2 border-dotted" /> */}

      {/* <ReportsList reports={userData?.reports ?? []} isLoading={false} /> */}
    </>
  )
}

export default Page
