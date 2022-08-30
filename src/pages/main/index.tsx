import { styled } from '@stitches/react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import { FaAngleDown, FaAngleUp, FaTimes, FaPlusCircle } from 'react-icons/fa';
import SelectDemo from '../../components/Select';
import { Header } from '../../components';
import Router, { useRouter } from 'next/router';
import { useAuth } from '../../lib/AuthContext';
import { child, get, ref } from 'firebase/database';
import { database } from '../../lib/firebaseConfig';
import { auth } from 'firebase-admin';

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

const StyledForm = styled('form', {
  width: '100%',
});

const List = styled('ul', {
  listStyle: 'inside',
});

const Main = () => {
  const { authUser, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !authUser) router.push('/');
  }, [authUser, loading]);

  const [projects, setProjects] = useState([
    'Projeto 1',
    'Projeto 2',
    'Projeto 3',
  ]);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      content: '',
    },
    {
      id: 2,
      content: '',
    },
    {
      id: 3,
      content: '',
    },
  ]);

  const defaultValues = {} as any;

  tasks.forEach((task) => {
    defaultValues['input-' + task.id] = task.content;
  });

  const { register, handleSubmit } = useForm({ defaultValues });

  const removeTask = (i: number) => {
    if (tasks.length <= 3) return;

    setTasks(tasks.filter((task, index) => index != i));
  };

  const newTask = () => {
    setTasks([...tasks, { id: tasks.length + 1, content: '' }]);
  };

  const onSubmitForm = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <Head>
        <title>Ledes Weekly Report - Inicio</title>
      </Head>
      <Header />

      <MainContainer>
        <LateralMenuContainer>
          <CollapsiblePrimitive.Collapsible open={open} onOpenChange={setOpen}>
            <Flex css={{ alignItems: 'center' }}>
              <CollapsiblePrimitive.CollapsibleTrigger asChild>
                {open ? (
                  <Flex css={{ alignItems: 'center' }}>
                    <FaAngleUp />
                  </Flex>
                ) : (
                  <Flex css={{ alignItems: 'center' }}>
                    <FaAngleDown />
                  </Flex>
                )}
              </CollapsiblePrimitive.CollapsibleTrigger>
              Projetos Associados
            </Flex>

            <CollapsibleContent>
              <List css={{ paddingLeft: 20 }}>
                {projects.map((project, i) => (
                  <li key={i}>{project}</li>
                ))}
              </List>
            </CollapsibleContent>
          </CollapsiblePrimitive.Collapsible>
        </LateralMenuContainer>
        <ContentContainer>
          <StyledForm onSubmit={handleSubmit(onSubmitForm)}>
            <Flex css={{ color: 'white', justifyContent: 'center' }}>
              <h1>Novo relatório</h1>
            </Flex>

            <Flex css={{ alignItems: 'center', gap: 12 }}>
              <label htmlFor="targetInput">Para: </label>
              <SelectDemo items={projects} />
            </Flex>

            <p>Tarefas realizadas:</p>

            <Flex
              css={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {tasks.map((task, i) => (
                <Flex
                  css={{
                    marginBottom: '4px',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  key={task.id}
                >
                  <Flex
                    css={{
                      width: '16px',
                      justifyContent: 'start',
                      color: 'black',
                    }}
                  >
                    <label htmlFor={'targetInput' + task.id}>{i + 1}.</label>
                  </Flex>
                  <Flex
                    css={{
                      background: 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                    }}
                  >
                    <input
                      style={{
                        padding: '4px 8px',
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        resize: 'none',
                        width: '100%',
                      }}
                      type="text"
                      {...register('input-' + task.id)}
                    />
                    <FaTimes onClick={() => removeTask(i)} size={16} />
                  </Flex>
                </Flex>
              ))}
              <Flex
                css={{ cursor: 'pointer', padding: 8 }}
                onClick={() => newTask()}
              >
                <FaPlusCircle color="#fff" size={22} />
              </Flex>
              <Button
                type="submit"
                css={{
                  fontSize: '18px',
                  fontWeight: 300,
                  width: '300px',
                }}
              >
                Submeter
              </Button>
            </Flex>
          </StyledForm>
        </ContentContainer>
      </MainContainer>
    </>
  );
};

export default Main;
