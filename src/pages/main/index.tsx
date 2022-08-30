import { styled } from '@stitches/react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Header } from '../../components';
import Router, { useRouter } from 'next/router';
import { useAuth } from '../../lib/AuthContext';
import { child, set, ref, push } from 'firebase/database';
import { database } from '../../lib/firebaseConfig';
import Link from 'next/link';

const Flex = styled('div', { display: 'flex' });

const MainContainer = styled('main', {
  display: 'grid',
  gridTemplateColumns: '250px 1fr',
  minHeight: 'calc(100vh - 65px)',
});

const LateralMenuContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '12px',
});

const ContentContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#3fb0ac',
  padding: '24px',
});

const CollapsibleContent = styled(CollapsiblePrimitive.CollapsibleContent, {
  overflow: 'hidden',
});

const List = styled('ul', {
  listStyle: 'inside',
});

const LateralMenu = ({ projects }: { projects: string[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <LateralMenuContainer>
      <CollapsiblePrimitive.Collapsible open={open} onOpenChange={setOpen}>
        <Flex css={{ alignItems: 'center' }}>
          <CollapsiblePrimitive.CollapsibleTrigger asChild>
            <Flex css={{ alignItems: 'center' }}>
              {open ? <FaAngleUp /> : <FaAngleDown />}
            </Flex>
          </CollapsiblePrimitive.CollapsibleTrigger>
          Projetos Associados
        </Flex>

        <CollapsibleContent>
          <List css={{ paddingLeft: 20 }}>
            {projects.map((project, i) => (
              <li key={i}>
                <Link href={`/projects/${i}`}>{project}</Link>
              </li>
            ))}
          </List>
        </CollapsibleContent>
      </CollapsiblePrimitive.Collapsible>
    </LateralMenuContainer>
  );
};

const Main = () => {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) router.push('/');
  }, [authUser, loading]);

  const registerNewProject = () => {
    const newProjectKey = push(child(ref(database), 'projects')).key;

    set(ref(database, 'projects/' + newProjectKey), {
      name: 'Projeto 1',
    });
  };

  const [projects, setProjects] = useState([
    'Projeto 1',
    'Projeto 2',
    'Projeto 3',
  ]);

  return (
    <>
      <Head>
        <title>Ledes Weekly Report - Inicio</title>
      </Head>
      <Header />

      <MainContainer>
        <LateralMenu projects={projects} />

        <ContentContainer>
          <Flex css={{ color: 'white', justifyContent: 'center' }}>
            <h1>Meus Projetos</h1>
          </Flex>
        </ContentContainer>
      </MainContainer>
    </>
  );
};

export default Main;
