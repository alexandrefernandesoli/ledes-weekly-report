import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import { Database } from '../../types/supabase';
import { ProjectsList, ReportsList } from '../components';
import MainLayout from '../components/MainLayout';
import { NewProjectModal } from '../components/NewProjectModal';

type UserProfileType = Database['public']['Tables']['users']['Row'];

const Main = ({ userProfile }: { userProfile: UserProfileType }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();

  const getProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(
        '*, users!inner(*, projects_users(role, projectId, users(name))), myRole:projects_users(role), reports(*)'
      )
      .eq('users.id', userProfile!.id);

    setProjects(data!);
  };

  const getReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*, projects ( name )')
      .eq('userId', userProfile!.id);

    if (error) return;

    const reports = data.map((report) => {
      const project = report.projects as { name: string };

      return {
        projectName: project.name,
        ...report,
      };
    });

    setReports(reports);
  };

  const getData = async () => {
    setIsLoading(true);
    await Promise.all([getProjects(), getReports()]);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <MainLayout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className=" text-3xl">
          Bem vindo {userProfile.name.split(' ')[0]}
        </h1>
        {['ADMIN', 'SUPERVISOR'].includes(userProfile.role) ? (
          <NewProjectModal mutate={getProjects} />
        ) : (
          ''
        )}
      </div>

      <ProjectsList projects={projects} isLoading={isLoading} />

      <div className="my-4 w-full border-b-2 border-dotted" />

      <ReportsList reports={reports} isLoading={isLoading} />
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

  const { data: userProfile, error: profileQueryError } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .limit(1)
    .single();

  if (profileQueryError) {
    await supabase.auth.signOut();

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userProfile,
    },
  };
};

export default Main;
