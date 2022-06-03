import { styled } from '@stitches/react';
import Image from 'next/image';
import defaultAvatar from '../../assets/default-avatar-300x300.png';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as Avatar from '@radix-ui/react-avatar';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import {
  FaAngleDown,
  FaAngleUp,
  FaTimes,
  FaPlusCircle,
  FaMailBulk,
} from 'react-icons/fa';
import { Title } from '../../components/HomeComponents';
import SelectDemo from '../../components/Select';

const StyledAvatar = styled(Avatar.Root, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  width: 45,
  height: 45,
  borderRadius: '100%',
});

const StyledImage = styled(Avatar.Image, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 'inherit',
});

const StyledFallback = styled(Avatar.Fallback, {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.02)',
  color: '#3fb0ac',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
});

const Header = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '65px',
  padding: '12px',
  boxShadow: '0 0 1px rgba(0, 0, 0, 0.4)',
});

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

const Flex = styled('div', { display: 'flex' });

const CollapsibleContent = styled(CollapsiblePrimitive.CollapsibleContent, {
  overflow: 'hidden',
});

const StyledForm = styled('form', {
  width: '100%',
});

const List = styled('ul', {
  listStyle: 'inside',
});

const HeaderComponent = () => {
  return (
    <Header>
      <Flex css={{ justifyContent: 'center', gap: 12 }}>
        <FaMailBulk size={48} color="#3fb0ac" />
        Ledes Weekly <br /> Report
      </Flex>
      <StyledAvatar>
        <StyledImage />
        <StyledFallback>AF</StyledFallback>
      </StyledAvatar>
    </Header>
  );
};

const Main = () => {
  const [open, setOpen] = useState(false);
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
      <HeaderComponent />

      <MainContainer>
        <LateralMenuContainer>
          <CollapsiblePrimitive.Collapsible open={open} onOpenChange={setOpen}>
            <Flex>
              <CollapsiblePrimitive.CollapsibleTrigger asChild>
                {open ? <FaAngleUp /> : <FaAngleDown />}
              </CollapsiblePrimitive.CollapsibleTrigger>
              <span>Projetos Associados</span>
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

const LateralMenu = () => {
  return <></>;
};

export default Main;
