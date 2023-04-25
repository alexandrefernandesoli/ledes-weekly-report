import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { HomeLeft } from './login';

type Inputs = {
  name: string;
  email: string;
  confirmPassword: string;
  password: string;
};

const Register = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const supabase = useSupabaseClient();

  const handleSignupSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);

    if (data.password !== data.confirmPassword) {
      console.log('senhas diferentes');

      setLoading(false);
      return;
    }

    await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    setLoading(false);
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Ledes Weekly Report - Cadastro</title>
      </Head>
      <main className="h-screen grid md:grid-cols-2 md:grid-flow-col">
        <HomeLeft />

        <div className="bg-primary flex flex-col items-center justify-center text-gray-200">
          <form
            className="mt-4 md:mt-0 flex flex-col md:w-[350px] gap-2"
            onSubmit={handleSubmit(handleSignupSubmit)}
          >
            <h2 className="text-xl mb-2">Cadastre-se</h2>

            <label htmlFor="name">
              <span>Nome completo</span>
              <TextInput.Root>
                <TextInput.Input
                  type="text"
                  id="name"
                  placeholder="Digite seu nome"
                  register={register('name', { required: true })}
                />
              </TextInput.Root>
            </label>

            <label htmlFor="email">
              <span>Email</span>
              <TextInput.Root>
                <TextInput.Input
                  type="text"
                  id="email"
                  placeholder="Digite seu email"
                  register={register('email', { required: true })}
                />
              </TextInput.Root>
            </label>
            <label htmlFor="password">
              <span>Senha</span>
              <TextInput.Root>
                <TextInput.Input
                  type="password"
                  id="password"
                  placeholder="******"
                  register={register('password', { required: true })}
                />
              </TextInput.Root>
            </label>
            <label htmlFor="confirmPassword">
              <span>Confirme sua senha</span>
              <TextInput.Root>
                <TextInput.Input
                  type="password"
                  id="confirmPassword"
                  placeholder="******"
                  register={register('confirmPassword', { required: true })}
                />
              </TextInput.Root>
            </label>

            <Button className="mt-2" type="submit">
              Criar minha conta
            </Button>
          </form>
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

export default Register;
