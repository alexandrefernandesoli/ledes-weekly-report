import {
  ArrowDownTrayIcon,
  CalendarIcon,
  EyeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { PlusIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from 'firebase-admin/lib/database/database';
import moment from 'moment';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { Button } from '../../../components/Button';
import MainLayout from '../../../components/MainLayout';
import { ProjectPrefModal } from '../../../components/ProjectPrefModal';
import { ProjectType, useProject } from '../../../lib/useProject';

const Project = () => {
  const {
    query: { projectId },
  } = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();

  const { project, isLoading, mutate } = useProject(projectId as string);

  useEffect(() => {
    console.log({ isLoading, project });
    if (!isLoading && project.myRole === 'SUPERVISOR') {
      supabase
        .from('reports')
        .select('*, users (name, email)')
        .eq('projectId', project.id)
        .then(({ data, error }) => {
          if (!error) {
            setReports(data);
          }
        });
    }
  }, [project]);

  return (
    <MainLayout>
      {isLoading ? (
        <div className="flex h-full items-center justify-center" role="status">
          <svg
            aria-hidden="true"
            className="mr-2 inline h-10 w-10 animate-spin fill-zinc-900 text-gray-200 dark:text-gray-600"
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
          <h1 className="mb-1 text-3xl">{project.name}</h1>

          <p className="mb-2">{project.description}</p>

          <div className="flex gap-2">
            <Button
              className="bg-sky-700 text-sm hover:bg-sky-600"
              onClick={() => router.push(`/projects/${projectId}/members`)}
            >
              <UserGroupIcon className="w-4" />
              Membros
            </Button>
            <Button
              className="bg-green-700 text-sm hover:bg-green-600"
              onClick={() => router.push(`/projects/${projectId}/report`)}
            >
              <PlusIcon className="w-4" />
              Novo relatório
            </Button>
            {project.myRole === 'SUPERVISOR' ? (
              <ProjectPrefModal project={project} mutate={mutate} />
            ) : (
              ''
            )}
          </div>

          <div className="my-2 h-[1px] w-full border-b border-dashed"></div>

          <h2 className="mb-2 text-xl">Relatórios</h2>

          {project.myRole === 'SUPERVISOR' ? (
            <ReportsListSupervisor reports={reports} />
          ) : (
            <ReportsListMember project={project} />
          )}
        </>
      )}
    </MainLayout>
  );
};

const ReportsListSupervisor = ({ reports }: { reports: any[] }) => {
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
                  <div className="font-semibold">{report.users.name}</div>
                  <div className="text-gray-700">{report.users.email}</div>
                </div>
              </div>
              <div className="flex flex-col px-4  py-3 text-sm leading-tight text-gray-900">
                <span className="font-semibold">
                  {moment(report.submittedAt).format('DD/MM/YYYY')}
                </span>
                <span className="text-gray-700">
                  {moment(report.submittedAt).format('HH:mm:ss')}
                </span>
              </div>
              <div className="flex justify-end gap-1 px-4 py-3 text-sm  font-light text-gray-900">
                <Button className="hover: flex items-center gap-1 rounded-full p-2 text-xs font-semibold uppercase">
                  <EyeIcon className="w-5" />
                  Visualizar relatório
                </Button>
                <Button className="hover: flex items-center gap-1 rounded-full p-2 text-xs font-semibold uppercase">
                  <ArrowDownTrayIcon className="w-5" />
                  Baixar relatório
                </Button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className=" bg-gray-200 py-3 px-4 text-center  font-semibold text-gray-900">
          Você não possui relatórios neste projeto
        </div>
      )}
    </div>
  );
};

const ReportsListMember = ({ project }: { project: ProjectType }) => {
  return (
    <div className="flex flex-col gap-2">
      {project.reports.map((report: any) => (
        <div
          key={report.id}
          className="leading-2 flex flex-col rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-900"
        >
          <span className="flex items-center gap-1 text-sm text-gray-500">
            Relatório de
            <span className="w-30">
              {moment(report.submittedAt).format('DD/MM/YY hh:mm:ss')}
            </span>
            <FaCalendarAlt />
          </span>
        </div>
      ))}
    </div>
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

  const { data: userProfile, error: profileQueryError } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .limit(1)
    .single();

  return {
    props: {
      userProfile,
    },
  };
};

export default Project;
