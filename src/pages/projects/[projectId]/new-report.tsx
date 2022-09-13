import { styled } from '@stitches/react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/Button';
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import { FaTimes, FaPlusCircle } from 'react-icons/fa';
import {
  ContentContainer,
  Flex,
  Header,
  LateralMenu,
  MainContainer,
} from '../../../components';
import { useRouter } from 'next/router';
import { useAuth } from '../../../lib/AuthContext';
import { database } from '../../../lib/firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const TaskLabel = styled('label', {
  color: '$primary',
  width: '16px',
});

const StyledForm = styled('form', {
  width: '100%',
  padding: '0 12px',
});

const NewReport = () => {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) router.push('/');

    console.log(router.query);
  }, [authUser, loading]);

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

  const onSubmitForm = async (data: any) => {
    let content = '';

    for (let key in data) {
      content = content + data[key] + '\n';
    }

    const docRef = await addDoc(collection(database, 'reports'), {
      content,
      submittedAt: serverTimestamp(),
      userId: authUser?.uid,
      projectId: router.query.projectId,
    });

    router.back();

    console.log('Relatório adicionado no id: ', docRef.id);
  };

  return (
    <>
      <Head>
        <title>Ledes Weekly Report - Inicio</title>
      </Head>
      <Header />

      <MainContainer>
        <LateralMenu />

        <ContentContainer>
          <StyledForm onSubmit={handleSubmit(onSubmitForm)}>
            <Flex css={{ color: 'white', justifyContent: 'center' }}>
              <h1>Novo relatório</h1>
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
                      background: 'white',
                      alignItems: 'center',
                      borderRadius: 6,
                      justifyContent: 'center',
                      padding: '4px 8px',
                      flex: 1,
                    }}
                  >
                    <TaskLabel htmlFor={'targetInput' + task.id}>
                      {i + 1}.
                    </TaskLabel>
                    <input
                      style={{
                        borderRadius: 6,
                        backgroundColor: 'rgba(63, 176, 172, 0.1)',
                        padding: '4px 8px',
                        margin: '0 4px',
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        resize: 'none',
                        width: '100%',
                      }}
                      type="text"
                      {...register('input-' + task.id)}
                    />
                    <FaTimes
                      color="rgba(63, 176, 172, 0.7)"
                      style={{ cursor: 'pointer' }}
                      onClick={() => removeTask(i)}
                      size={16}
                    />
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

export default NewReport;
