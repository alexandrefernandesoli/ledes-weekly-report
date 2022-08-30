import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Container,
  HomeContainer,
  LoginContainer,
  LoginItems,
  Input,
  LoginTitle,
  Link,
  Title,
  HomeContent,
  LinksContainer,
} from '../components/HomeComponents';
import { Button } from '../components/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { FaCheck, FaEnvelope, FaLock, FaMailBulk } from 'react-icons/fa';

type Inputs = {
  email: string;
  password: string;
};

export const HomeLeft = () => {
  return (
    <HomeContainer>
      <Title>
        <FaMailBulk color={'#3fb0ac'} size={64} />
        <h1>
          Ledes Weekly <br /> Report
        </h1>
      </Title>
      <HomeContent>
        <h3>
          Nossa plataforma é o lugar <br /> certo para o seu projeto
        </h3>
        <ul>
          <li>
            <FaCheck />
            Gerencie seus alunos e projetos
          </li>
          <li>
            <FaCheck />
            Mantenha um histórico de atividades
          </li>
          <li>
            <FaCheck />
            Receba notificações
          </li>
          <li>
            <FaCheck />
            Exporte seus relatórios
          </li>
        </ul>
      </HomeContent>
    </HomeContainer>
  );
};

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const { handleSubmit, register } = useForm<Inputs>();
  const router = useRouter();
  const { signIn, authUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && authUser) router.push('/main');
  }, [authUser, authLoading]);

  const handleLoginSubmit: SubmitHandler<Inputs> = async (data) => {
    if (loading) return;

    setLoading(true);

    await signIn(data.email, data.password).finally(() => setLoading(false));

    router.push('/main');
  };

  return (
    <>
      <Head>
        <title>Ledes Weekly Report</title>
      </Head>

      <Container>
        <HomeLeft />

        <LoginContainer>
          <LoginItems onSubmit={handleSubmit(handleLoginSubmit)}>
            <LoginTitle>Entrar</LoginTitle>

            <Input
              icon={FaEnvelope}
              type="text"
              placeholder="Email"
              register={register('email', { required: true })}
            />
            <Input
              icon={FaLock}
              type="password"
              placeholder="Senha"
              register={register('password', { required: true })}
            />
            <Button type="submit">Acessar</Button>
            <LinksContainer>
              <Link href="#">Esqueceu sua senha?</Link>
              <Link href="/register">Criar conta</Link>
            </LinksContainer>
          </LoginItems>
        </LoginContainer>
      </Container>
    </>
  );
};

export default Home;
