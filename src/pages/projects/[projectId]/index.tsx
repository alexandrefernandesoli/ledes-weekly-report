import { useMemo } from 'react';
import Head from 'next/head';
import {
  Header,
  LateralMenu,
  ContentContainer,
  Flex,
  MainContainer,
  ReportsContainer,
} from '../../../components';
import { useRouter } from 'next/router';
import { FaCalendar, FaPlus, FaPlusCircle } from 'react-icons/fa';
import Link from 'next/link';
import { ProjectType, useDataContext } from '../../../lib/DataContext';
import moment from 'moment';
import {
  getUser,
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { Button } from '../../../components/Button';

type ReportType = {
  id: string;
  content: string;
  submittedAt: Date;
  userId: string;
  projectId: string;
};

const Project = ({ reports }: { reports: ReportType[] }) => {
  const { projects } = useDataContext();
  const { query } = useRouter();
  const { projectId } = query;

  const router = useRouter();

  const project = useMemo(
    () =>
      projects.find((project) => project.id === projectId) ||
      ({} as ProjectType),
    [projectId]
  );

  return (
    <>
      <Head>
        <title>Ledes Weekly Report - Inicio</title>
      </Head>
      <Header />

      <main className="flex w-full min-h-[calc(100%-64px)]">
        <LateralMenu />

        <div className="flex flex-col flex-1 bg-primary text-gray-100 px-6">
          <div className="flex items-center gap-4 mt-4 mb-1 justify-between">
            <h1 className="text-2xl">{project.name}</h1>
            <Button className="w-max flex items-center gap-1 text-xs">
              <FaPlus />
              Novo membro
            </Button>
          </div>
          <p className="mb-4 text-sm">
            Membros: Alexandre F..., Joao da S..., Kelly A...
          </p>
          <div className="flex flex-col gap-2">
            {reports.map((report, index) => (
              <div
                key={report.id}
                className="bg-gray-100 text-gray-900 flex flex-col rounded-lg px-4 py-3 text-sm leading-2"
              >
                <p>{report.content}</p>
                <span className="flex items-center text-xs text-gray-500 justify-between self-end gap-1">
                  <span className="w-30">
                    {moment(report.submittedAt).format('DD/MM/YY hh:mm:ss')}
                  </span>
                  <FaCalendar />
                </span>
              </div>
            ))}
            <Button
              onClick={() => router.push(`/projects/${projectId}/new-report`)}
            >
              Novo relatório
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);

    const supabase = supabaseServerClient(ctx);

    const { data: reports } = await supabase
      .from('reports')
      .select()
      .eq('projectId', ctx.params?.projectId)
      .eq('userId', user.id);

    console.log(reports);

    return { props: { user, reports } };
  },
});

export default Project;
