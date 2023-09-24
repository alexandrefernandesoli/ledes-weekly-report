import { NewProjectModal } from '@/components/NewProjectModal'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import clsx from 'clsx'
import { FolderGit2Icon } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LastReportTooltip } from './LastReportTooltip'
import { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'
const Page = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const { data: userData } = await supabase
    .from('profile')
    .select('*, project(report(created_at), *)')
    .eq('id', session.user.id)
    .limit(1)
    .single()

  if (!userData) {
    throw new Error('User data not found')
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between px-2">
        <h1 className="text-xl md:text-3xl">Meus projetos</h1>
        {userData.role === 'ADMIN' || userData.role === 'SUPERVISOR' ? (
          <NewProjectModal />
        ) : (
          ''
        )}
      </div>

      <div className="flex flex-col">
        {userData?.project.map((project, arrayId) => (
          <div
            key={project.id}
            className={clsx(
              'grid w-full grid-cols-[1fr,18px] items-center  px-3 py-2 md:px-4 md:py-3 md:text-xl',
              arrayId % 2 === 1 && 'bg-zinc-200/50',
            )}
          >
            <div className="flex items-center gap-2">
              <FolderGit2Icon className="h-4 w-4 md:h-6 md:w-6" />
              <Link
                className="hover:text-zinc-700 hover:underline"
                href={`/dashboard/project/${project.id}`}
              >
                {project.name}
              </Link>
            </div>
            <LastReportTooltip reports={project.report} />
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
