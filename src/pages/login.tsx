import type { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '../components/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { FaCheck, FaEnvelope, FaLock, FaMailBulk } from 'react-icons/fa';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { TextInput } from '../components/TextInput';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FcGoogle } from 'react-icons/fc';

type Inputs = {
  email: string;
  password: string;
};

export const HomeLeft = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col bg-gray-100 px-4 py-6 text-gray-900 md:px-12">
      <div
        className="flex cursor-pointer items-center gap-4"
        onClick={() => router.replace('/')}
      >
        <FaMailBulk className="text-6xl text-primary md:text-8xl" />
        <h1 className="text-2xl md:text-5xl">
          Ledes Weekly <br /> Report
        </h1>
      </div>
      <div className="self-center justify-self-center md:mt-28">
        <h2 className="mt-8 text-xl md:w-[400px] md:text-2xl">
          Nossa plataforma é o lugar certo para o seu projeto
        </h2>
        <ul className="mt-4 flex flex-col gap-1">
          <li className="flex items-center gap-1 text-lg">
            <FaCheck />
            Gerencie seus alunos e projetos
          </li>
          <li className="flex items-center gap-1 text-lg">
            <FaCheck />
            Mantenha um histórico de atividades
          </li>
          <li className="flex items-center gap-1 text-lg">
            <FaCheck />
            Receba notificações
          </li>
          <li className="flex items-center gap-1 text-lg">
            <FaCheck />
            Exporte seus relatórios
          </li>
        </ul>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { handleSubmit, register } = useForm<Inputs>();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  const handleLoginSubmit: SubmitHandler<Inputs> = async (data) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (!error) {
      router.push('/');
    } else {
      alert(error.message);
    }
  };

  const loginWithGoogle = async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
    });

    if (!error) {
      router.push('/');
    }
  };

  return (
    <>
      <Head>
        <title>Ledes Weekly Report</title>
      </Head>

      <main className="grid h-screen md:grid-flow-col md:grid-cols-2">
        <HomeLeft />

        <div className="flex flex-col items-center justify-center bg-primary text-gray-200">
          <form
            className="flex flex-col gap-2 md:w-[350px]"
            onSubmit={handleSubmit(handleLoginSubmit)}
          >
            <h2 className="mb-2 text-2xl">Você possui uma conta?</h2>

            <label htmlFor="email">
              <span>Email</span>
              <TextInput.Root>
                <TextInput.Icon>
                  <FaEnvelope />
                </TextInput.Icon>
                <TextInput.Input
                  type="text"
                  id="email"
                  placeholder="johndoe@example.com"
                  register={register('email')}
                />
              </TextInput.Root>
            </label>
            <label htmlFor="password">
              <span>Senha</span>
              <TextInput.Root>
                <TextInput.Icon>
                  <FaLock />
                </TextInput.Icon>
                <TextInput.Input
                  type="password"
                  id="password"
                  placeholder="********"
                  register={register('password')}
                />
              </TextInput.Root>
            </label>

            <Button
              className="mt-2 flex w-full items-center justify-center"
              type="submit"
            >
              Entrar na plataforma
            </Button>
          </form>
          {/* <Button onClick={loginWithGoogle} className='bg-white border hover:bg-slate-50 border-black text-gray-900 flex items-center justify-center gap-2'>
            <FcGoogle className='w-6 h-6' />
          </Button> */}
          <div className="mt-3 flex flex-col items-center">
            <Link href="/register" className="mb-2 underline">
              Esqueceu sua senha?
            </Link>
            <Link className="underline" href="/register">
              Não possui conta? Crie uma agora!
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: '/',
        permanent: true,
        initialSession: session,
        user: session.user,
      },
    };

  return {
    props: {
      initialSession: session,
    },
  };
};

export default Home;
