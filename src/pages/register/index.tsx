import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { HomeLeft } from '..';
import { Button } from '../../components/Button';
import {
  Container,
  Input,
  LoginContainer,
  LoginItems,
  LoginTitle,
} from '../../components/HomeComponents';
import { useAuth } from '../../lib/AuthContext';

type Inputs = {
  name: string;
  email: string;
  confirmPassword: string;
  password: string;
};

const Register = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const { signUp } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSignupSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);

    if (data.password !== data.confirmPassword) {
      console.log('senhas diferentes');

      setLoading(false);
      return;
    }

    await signUp(data.name, data.email, data.password).finally(() => {
      setLoading(false);
      router.push('/main');
    });
  };

  return (
    <>
      <Head>
        <title>Ledes Weekly Report - Cadastro</title>
      </Head>
      <Container>
        <HomeLeft />

        <LoginContainer>
          <LoginItems onSubmit={handleSubmit(handleSignupSubmit)}>
            <LoginTitle>Cadastre-se</LoginTitle>

            <Input
              type="text"
              placeholder="Nome completo"
              register={register('name', { required: true })}
            />
            <Input
              type="text"
              placeholder="Email"
              register={register('email', { required: true })}
            />
            <Input
              type="password"
              placeholder="Senha"
              register={register('password', { required: true })}
            />
            <Input
              type="password"
              placeholder="Confirme sua senha"
              register={register('confirmPassword', { required: true })}
            />
            <Button type="submit" uppercase>
              Criar minha conta
            </Button>
          </LoginItems>
        </LoginContainer>
      </Container>
    </>
  );
};

export default Register;
