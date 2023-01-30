import Head from 'next/head';
import { Header } from '../../../components';
import { useRouter } from 'next/router';
import { FaCalendar, FaCalendarAlt, FaCog, FaPlus } from 'react-icons/fa';
import moment from 'moment';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '../../../components/Button';
import useSWR from 'swr';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { ProjectPrefModal } from '../../../components/ProjectPrefModal';

type ReportType = {
  id: string;
  content: string;
  submittedAt: Date;
  userId: string;
  projectId: string;
};

const Project = () => {
  const { query } = useRouter();
  const { projectId } = query;

  const { data, isLoading } = useSWR(
    `/api/projects?projectId=${projectId}`,
    axios
  );

  const router = useRouter();

  const project = data?.data.project;

  // if (!isLoading && project.myRole === 'SUPERVISOR') alert('você é supervisor');

  return (
    <>
      <Head>
        <title>Ledes Weekly Report - {!isLoading && project.name}</title>
      </Head>
      <Header />

      <main className="flex w-full min-h-[calc(100%-64px)]">
        <div className="flex flex-col flex-1 bg-primary text-gray-100 px-6">
          <div className="flex items-center gap-4 mt-4 mb-1 justify-between">
            {!isLoading && project.name ? (
              <h1 className="text-2xl">{project.name}</h1>
            ) : (
              <h1 className="text-2xl">Carregando...</h1>
            )}
            {!isLoading && project.myRole === 'SUPERVISOR' ? (
              <ProjectPrefModal project={project} />
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
          <p className="mb-4 text-sm">
            Membros:{' '}
            {!isLoading && project.users.map((user: any) => <>{user.name}</>)}
          </p>
          <div className="flex flex-col gap-2">
            {!isLoading &&
              project.reports.map((report: any) => (
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
        </div>
      </main>
    </>
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
