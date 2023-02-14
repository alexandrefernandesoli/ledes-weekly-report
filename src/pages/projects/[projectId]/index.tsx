import { Header, ReportsList } from '../../../components';
import { useRouter } from 'next/router';
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';
import moment from 'moment';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '../../../components/Button';
import { GetServerSidePropsContext } from 'next';
import { ProjectPrefModal } from '../../../components/ProjectPrefModal';
import { useProject } from '../../../lib/useProject';
import MainLayout from '../../../components/MainLayout';

const Project = () => {
  const {
    query: { projectId },
  } = useRouter();

  const router = useRouter();

  const { project, isLoading, mutate } = useProject(projectId as string);

  return (
    <MainLayout>
      {isLoading ? (
        <div className="h-full flex items-center justify-center" role="status">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-zinc-900"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center mt-3 justify-between">
            <h1 className="text-2xl">{project.name}</h1>
            {project.myRole === 'SUPERVISOR' ? (
              <ProjectPrefModal project={project} mutate={mutate} />
            ) : (
              <Button
                className="w-max flex items-center gap-1 text-xs"
                onClick={() => router.push(`/projects/${projectId}/new-report`)}
              >
                <FaPlus />
                Novo relatório
              </Button>
            )}
          </div>
          <p className="mt-1 text-sm">Descrição: {project.description}</p>
          <p className="mt-1 mb-2 text-xs">
            Membros:{' '}
            {project.users.map((user: any) => (
              <span key={user.id}>{user.name}</span>
            ))}
          </p>
          <div className="flex flex-col gap-2">
            {project.reports.map((report: any) => (
              <div
                key={report.id}
                className="bg-gray-100 text-gray-900 flex flex-col rounded-lg px-4 py-3 text-sm leading-2"
              >
                <span className="flex items-center text-sm text-gray-500 gap-1">
                  Relatório de
                  <span className="w-30">
                    {moment(report.submittedAt).format('DD/MM/YY hh:mm:ss')}
                  </span>
                  <FaCalendarAlt />
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </MainLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};

export default Project;
