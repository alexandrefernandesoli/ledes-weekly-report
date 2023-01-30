import Head from 'next/head';
import { Header, LateralMenu } from '../../components';

import {
  getUser,
  supabaseServerClient,
  User,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { Button } from '../../components/Button';
import moment from 'moment';

const Main = ({ user, users }: { user: User; users: any[] }) => {
  return (
    <>
      <Head>
        <title>Ledes Weekly Report - Inicio</title>
      </Head>
      <Header />

      <main className="flex w-full min-h-[calc(100%-64px)]">
        <div className="bg-primary flex-1 flex flex-col px-6 text-gray-100">
          <h1 className="text-2xl mt-4 mb-4">Usuários</h1>
          <table>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Função</th>
              <th>Data de Criação</th>
            </tr>
            {users.map((entry) => (
              <tr id={entry.id}>
                <th>{entry.name}</th>
                <th>{entry.email}</th>
                <th>{entry.role}</th>
                <th>{moment(entry.createdAt).format('DD/MM/YYYY')}</th>
              </tr>
            ))}
          </table>
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
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    console.log(users);

    if (error || usersError)
      return { redirect: { permanent: false, destination: '/' } };

    if (data[0].role !== 'SUPERVISOR')
      return { redirect: { permanent: false, destination: '/' } };

    return { props: { user, users } };
  },
});

export default Main;
