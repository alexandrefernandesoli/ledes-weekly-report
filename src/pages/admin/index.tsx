import Head from 'next/head';
import { Header, LateralMenu } from '../../components';

import {
  getUser,
  supabaseServerClient,
  User,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { Button } from '../../components/Button';

const Main = ({ user }: { user: User }) => {
  return (
    <>
      <Head>
        <title>Ledes Weekly Report - Inicio</title>
      </Head>
      <Header />

      <main className="flex w-full min-h-[calc(100%-64px)]">
        <div className="bg-primary flex-1 flex flex-col px-6 text-gray-100">
          <h1 className="text-2xl mt-4 mb-4">Admin</h1>
          <div>
            <Button>Usuários</Button>
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

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id);

    if (error) return { redirect: { permanent: false, destination: '/' } };

    if (data[0].role !== 'SUPERVISOR')
      return { redirect: { permanent: false, destination: '/' } };

    return { props: { user } };
  },
});

export default Main;
