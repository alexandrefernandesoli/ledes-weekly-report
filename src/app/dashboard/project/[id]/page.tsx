import { ProjectPrefModal } from '@/app/dashboard/project/[id]/ProjectPrefModal'
import { Database } from '@/lib/database.types'
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline'
import { createServerClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import { Eye, Plus } from 'lucide-react'
import moment from 'moment'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { MembersModal } from './MembersModal'

export const dynamic = 'force-dynamic'
const Project = async ({ params }: { params: { id: string } }) => {
  const cookieStore = cookies()

  const supabase = createServerClient<Database>(
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

  const { data: userData } = await supabase
    .from('profile')
    .select('*')
    .eq('id', session!.user.id)
    .limit(1)
    .single()

  const { data: myProject } = await supabase
    .from('project_member')
    .select('*')
    .eq('project_id', params.id)
    .eq('user_id', session!.user.id)
    .limit(1)
    .single()

  if (!myProject) {
    return null
  }

  const project = await getProjectDetails(myProject, userData, supabase)

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
          isSupervisor={
            myProject.role === 'SUPERVISOR' || userData?.role === 'ADMIN'
          }
          project={project}
        />
        {(myProject.role === 'SUPERVISOR' || userData?.role === 'ADMIN') && (
          <ProjectPrefModal project={project} />
        )}
      </div>

      <div className="my-2 h-[1px] w-full border-b border-dashed"></div>

      <h2 className="mb-2 text-xl md:text-2xl">Relatórios</h2>

      <ReportsList reports={project.report} />
    </div>
  )
}

export type ProjectType = Database['public']['Tables']['project']['Row'] & {
  profile: (Database['public']['Tables']['profile']['Row'] & {
    project_member: Database['public']['Tables']['project_member']['Row'][]
  })[]
  report: (Database['public']['Tables']['report']['Row'] & {
    profile: Database['public']['Tables']['profile']['Row'] | null
  })[]
}

const getProjectDetails = async (
  myProject: Database['public']['Tables']['project_member']['Row'],
  userData: Database['public']['Tables']['profile']['Row'] | null,
  supabase: SupabaseClient<Database>,
): Promise<ProjectType | null> => {
  if (myProject.role === 'SUPERVISOR' || userData?.role === 'ADMIN') {
    const { data } = await supabase
      .from('project')
      .select('*, profile(*, project_member(*)), report(*, profile(*))')
      .eq('id', myProject.project_id)
      .limit(1)
      .single()

    data!.report.sort(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
    )

    return data
  }

  const { data } = await supabase
    .from('project')
    .select('*, profile(*, project_member(*)), report(*, profile(*))')
    .eq('id', myProject.project_id)
    .eq('report.user_id', myProject.user_id)
    .limit(1)
    .single()

  data!.report.sort(
    (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
  )

  return data
}

type ReportType = (Database['public']['Tables']['report']['Row'] & {
  profile: Database['public']['Tables']['profile']['Row'] | null
})[]

const ReportsList = ({ reports }: { reports: ReportType }) => {
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
          {reports.map((report) => (
            <div
              key={report.id}
              className="grid grid-cols-[1fr,1fr,20px] bg-gray-200  md:grid-cols-3"
            >
              <div className="flex flex-col justify-center truncate whitespace-nowrap px-3 py-2 text-sm leading-tight  text-gray-900 md:px-4 md:py-3">
                <div className="truncate font-semibold">
                  {report.profile!.name}
                </div>
                <div className="truncate text-xs text-gray-700 md:text-sm">
                  {report.profile!.email}
                </div>
              </div>
              <div className="flex flex-col justify-center px-3 py-2 text-sm leading-tight text-gray-900 md:px-4 md:py-3">
                <span className="font-semibold">
                  {moment(report.created_at).format('DD/MM/YYYY')}
                </span>
                <span className="text-gray-700">
                  {moment(report.created_at).format('HH:mm:ss')}
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
