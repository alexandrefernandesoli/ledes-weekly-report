import Head from 'next/head';
import { Header, LateralMenu } from '../../components';


import { getUser, User, withPageAuth } from '@supabase/auth-helpers-nextjs';

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
