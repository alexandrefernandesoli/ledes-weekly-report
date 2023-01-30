import {
  getUser,
  supabaseServerClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { Header } from '../../components';

const Supervisor = () => {
  return (
    <>
      <Header />

      <main className="flex w-full min-h-[calc(100%-64px)]">
        <div className="bg-primary flex-1 flex flex-col px-6 text-gray-100"></div>
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

export default Supervisor;
