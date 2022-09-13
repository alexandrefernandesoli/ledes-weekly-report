import { useEffect } from 'react';
import Head from 'next/head';
import { FaArchive } from 'react-icons/fa';
import {
  Header,
  LateralMenu,
  ContentContainer,
  MainContainer,
  Flex,
} from '../../components';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/AuthContext';
import Link from 'next/link';
import { useDataContext } from '../../lib/DataContext';
import { Button } from '../../components/Button';

const Main = () => {
  const { authUser, loading } = useAuth();
  const { projects } = useDataContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) router.push('/');
  }, [authUser, loading]);

  return (
    <>
      <Head>
        <title>Ledes Weekly Report - Inicio</title>
      </Head>
      <Header />

      <MainContainer>
        <LateralMenu />

        <ContentContainer>
          <Flex
            css={{
              color: 'white',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <h1>Meus Projetos</h1>

            {projects.map((project, arrayId) => (
              <Flex
                key={project.id}
                css={{
                  backgroundColor: `rgba(255,255,255, ${
                    arrayId % 2 == 0 ? '0.1' : '0.05'
                  })`,
                  padding: '12px 24px',
                  width: '100%',
                  fontSize: '1.2rem',
                  textTransform: 'uppercase',
                  alignItems: 'center',
                }}
              >
                <FaArchive />
                <Link href={`/projects/${project.id}`}>{project.name}</Link>
              </Flex>
            ))}
          </Flex>

          <Flex>
            {authUser?.role === 'SUPERVISOR' ? (
              <Button css={{ marginTop: '12px' }} uppercase>
                Novo Projeto
              </Button>
            ) : (
              <></>
            )}
          </Flex>
        </ContentContainer>
      </MainContainer>
    </>
  );
};

export default Main;
