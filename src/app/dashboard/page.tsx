import { NewProjectModal } from '@/components/NewProjectModal'
import { createServerClient } from '@supabase/ssr'
import clsx from 'clsx'
import { FolderGit2Icon } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LastReportTooltip } from './LastReportTooltip'
import { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'
const Page = async () => {
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
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const { data: userData } = await supabase
    .from('profile')
    .select('*')
    .eq('id', session.user.id)
    .limit(1)
    .single()

  let projects: any = []

  if (userData.role === 'ADMIN') {
    const { data: fetchedProjects, error } = await supabase
      .from('project')
      .select('*, report(created_at)')

    projects = fetchedProjects
  } else {
    const { data: fetchedProjects, error } = await supabase
      .from('project_member')
      .select('*, project(report(created_at), *)')
      .eq('user_id', session.user.id)

    projects = fetchedProjects?.map((project) => project.project)
  }

  if (!userData) {
    throw new Error('User data not found')
  }

  console.log(projects)

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
        {projects.length > 0 ? (
          projects.map((project: any, arrayId: any) => (
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
          ))
        ) : (
          <div className="bg-gray-200/50 p-2 text-center">
            {userData.role === 'STUDENT'
              ? 'Você não faz parte de nenhum projeto. Entre em contato com seu supervisor e solicite um convite!'
              : 'Você não possui nenhum projeto. Crie um novo projeto!'}
          </div>
        )}
      </div>
    </>
  )
}

export default Page
