import { NewProjectModal } from '@/components/NewProjectModal'
import { ProjectsList } from '@/components/ProjectsList'
import { ReportsList } from '@/components/ReportsList'
import prisma from '@/lib/prisma'
import { ProjectRole } from '@prisma/client'
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import MainLayout from '../components/MainLayout'

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
        select: {
          role: true,
          project: {
            include: {
              members: {
                where: {
                  role: ProjectRole.SUPERVISOR,
                },
                include: {
                  member: true,
                },
              },
            },
          },
        },
      },
      reports: {
        include: {
          project: true,
        },
      },
    },
  })

  return (
    <MainLayout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className=" text-3xl">Bem vindo {userData?.name.split(' ')[0]}</h1>
        {['ADMIN', 'SUPERVISOR'].includes(userData?.role!) ? (
          <NewProjectModal />
        ) : (
          ''
        )}
      </div>

      <ProjectsList
        projects={userData?.projects.map((project) => project.project) ?? []}
        isLoading={false}
      />

      <div className="my-4 w-full border-b-2 border-dotted" />

      <ReportsList reports={userData?.reports ?? []} isLoading={false} />
    </MainLayout>
  )
}

export default Page
