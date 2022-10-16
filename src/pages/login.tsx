import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '../components/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { FaCheck, FaEnvelope, FaLock, FaMailBulk } from 'react-icons/fa';
import {
  getUser,
  supabaseClient,
  withPageAuth,
} from '@supabase/auth-helpers-nextjs';
import { TextInput } from '../components/TextInput';

type Inputs = {
  email: string;
  password: string;
};

export const HomeLeft = () => {
  const router = useRouter();

  return (
    <div className="px-4 md:px-12 py-6 bg-gray-100 text-gray-900">
      <div
        className="flex gap-4 items-center cursor-pointer"
        onClick={() => router.replace('/')}
      >
        <FaMailBulk className="text-primary text-6xl md:text-8xl" />
        <h1 className="text-2xl md:text-4xl">
          Ledes Weekly <br /> Report
        </h1>
      </div>
      <div className="flex flex-col md:mt-16">
        <h2 className="mt-8 text-xl md:text-2xl md:w-[400px]">
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

  const handleLoginSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log('dasdasdsa', data);

    const { error } = await supabaseClient.auth.signIn({
      email: data.email,
      password: data.password,
    });

    if (!error) {
      router.push('/');
    } else {
      alert(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Ledes Weekly Report</title>
      </Head>

      <main className="h-screen grid md:grid-cols-2 md:grid-flow-col">
        <HomeLeft />

        <div className="bg-primary flex flex-col items-center justify-center text-gray-200">
          <form
            className="flex flex-col md:w-[350px] gap-2"
            onSubmit={handleSubmit(handleLoginSubmit)}
          >
            <h2 className="text-2xl mb-2">Você possui uma conta?</h2>

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
                  placeholder="********"
                  register={register('password')}
                />
              </TextInput.Root>
            </label>

            <Button className="mt-2" type="submit">
              Entrar na plataforma
            </Button>
            <div className="flex flex-col items-center mt-3">
              <Link href="/register">
                <a className="underline">Esqueceu sua senha?</a>
              </Link>
              <Link href="/register">
                <a className="mt-2 underline">
                  Não possui conta? Crie uma agora!
                </a>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = withPageAuth({
  authRequired: false,
  redirectTo: '/',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);

    if (user) {
      console.log(user);
      return { redirect: { permanent: false, destination: '/' } };
    }

    return { props: { user } };
  },
});

export default Home;
