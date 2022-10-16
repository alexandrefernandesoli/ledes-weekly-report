import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { HomeLeft } from './login';
import { Button } from '../components/Button';
import { Container } from '../components/HomeComponents';
import { TextInput } from '../components/TextInput';

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

  const handleSignupSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);

    if (data.password !== data.confirmPassword) {
      console.log('senhas diferentes');

      setLoading(false);
      return;
    }

    await supabaseClient.auth.signUp(
      {
        email: data.email,
        password: data.password,
      },
      {
        data: {
          name: data.name,
        },
      }
    );

    setLoading(false);
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Ledes Weekly Report - Cadastro</title>
      </Head>
      <Container>
        <HomeLeft />

        <div className="bg-primary flex flex-col items-center justify-center text-gray-200">
          <form
            className="mt-4 flex flex-col md:w-[350px] gap-1"
            onSubmit={handleSubmit(handleSignupSubmit)}
          >
            <h2 className="text-xl mb-2">Cadastre-se</h2>

            <label htmlFor="name">
              <span>Nome completo</span>
              <TextInput.Root>
                <TextInput.Input
                  type="text"
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
                  placeholder="Digite seu email"
                  register={register('email', { required: true })}
                />
              </TextInput.Root>
            </label>
            <label htmlFor="name">
              <span>Senha</span>
              <TextInput.Root>
                <TextInput.Input
                  type="password"
                  placeholder="******"
                  register={register('password', { required: true })}
                />
              </TextInput.Root>
            </label>
            <label htmlFor="name">
              <span>Confirme sua senha</span>
              <TextInput.Root>
                <TextInput.Input
                  type="password"
                  placeholder="******"
                  register={register('confirmPassword', { required: true })}
                />
              </TextInput.Root>
            </label>

            <Button type="submit">Criar minha conta</Button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default Register;
