import Head from 'next/head';
import { FaArchive } from 'react-icons/fa';
import { Header, LateralMenu } from '../components';
import Link from 'next/link';
import { useDataContext } from '../lib/DataContext';
import { Button } from '../components/Button';
import { getUser, User, withPageAuth } from '@supabase/auth-helpers-nextjs';

const Main = ({ user }: { user: User }) => {
  const { projects } = useDataContext();

  return (
    <>
      <Head>
        <title>Ledes Weekly Report - Inicio</title>
      </Head>
      <Header />

      <main className="flex w-full min-h-[calc(100%-64px)]">
        <LateralMenu />

        <div className="bg-primary flex-1 flex flex-col px-6 text-gray-100">
          <h1 className="text-2xl mt-4 mb-4">Meus Projetos</h1>

          {projects.map((project, arrayId) => (
            <div
              key={project.id}
              className="rounded-lg mb-2 bg-gray-100 bg-opacity-10 w-full flex px-6 py-4 text-xl items-center gap-3 uppercase"
            >
              <FaArchive />
              <Link href={`/projects/${project.id}`}>{project.name}</Link>
            </div>
          ))}

          <div className="mt-8">
            {false ? <Button uppercase>Novo Projeto</Button> : <></>}
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

    return { props: { user } };
  },
});

export default Main;
