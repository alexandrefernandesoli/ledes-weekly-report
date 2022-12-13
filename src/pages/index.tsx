import Head from 'next/head';
import {
  FaAngleDown,
  FaAngleUp,
  FaDownload,
  FaFile,
  FaProjectDiagram,
} from 'react-icons/fa';
import { Header } from '../components';
import Link from 'next/link';
import { useDataContext } from '../lib/DataContext';
import { getUser, User, withPageAuth } from '@supabase/auth-helpers-nextjs';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

import moment from 'moment';
import { useState } from 'react';

const Main = ({ user }: { user: User }) => {
  const { projects } = useDataContext();

  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isReportsOpen, setIsReportsOpen] = useState(true);

  return (
    <>
      <Head>
        <title>Ledes Weekly Report - Inicio</title>
      </Head>
      <Header />

      <main className="flex w-full min-h-[calc(100%-64px)]">
        <div className="bg-primary flex-1 flex flex-col px-6 text-gray-100">
          <h1 className="text-2xl mt-6 mb-4">
            Bem vindo {user.user_metadata.name.split(' ')[0]}!
          </h1>

          <CollapsiblePrimitive.Collapsible
            open={isProjectsOpen}
            onOpenChange={setIsProjectsOpen}
          >
            <CollapsiblePrimitive.CollapsibleTrigger asChild>
              <h1 className="text-xl mt-4 mb-4 flex items-center gap-1 cursor-pointer">
                Meus Projetos{' '}
                {isProjectsOpen ? (
                  <FaAngleDown className="text-gray-800" size={24} />
                ) : (
                  <FaAngleUp className="text-gray-800" size={24} />
                )}
              </h1>
            </CollapsiblePrimitive.CollapsibleTrigger>

            <CollapsiblePrimitive.CollapsibleContent>
              {projects.map((project, arrayId) => (
                <div
                  key={project.id}
                  className="rounded-lg mb-2 border-gray-800 border-2 w-full flex px-4 py-2 text-base items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FaProjectDiagram className="text-gray-800" size={30} />
                    <Link href={`/projects/${project.id}`}>{project.name}</Link>
                  </div>

                  <span>Orientador: Hudson</span>
                  <span className="flex items-center gap-1">
                    Membros: -----------{' '}
                    <FaAngleDown
                      size={20}
                      className="cursor-pointer text-gray-800"
                    />
                  </span>
                  <span>Tempo restante: 2 dias</span>
                </div>
              ))}
            </CollapsiblePrimitive.CollapsibleContent>
          </CollapsiblePrimitive.Collapsible>

          <div className="w-full h-[2px] bg-gray-800 mt-8"></div>

          <CollapsiblePrimitive.Collapsible
            open={isReportsOpen}
            onOpenChange={setIsReportsOpen}
          >
            <CollapsiblePrimitive.CollapsibleTrigger asChild>
              <h1 className="text-xl mt-4 mb-4 flex items-center gap-1 cursor-pointer">
                Histórico de Relatórios{' '}
                {isReportsOpen ? (
                  <FaAngleDown className="text-gray-800" size={24} />
                ) : (
                  <FaAngleUp className="text-gray-800" size={24} />
                )}
              </h1>
            </CollapsiblePrimitive.CollapsibleTrigger>

            <CollapsiblePrimitive.CollapsibleContent>
              {projects.map((project, arrayId) => (
                <div
                  key={project.id}
                  className="rounded-lg mb-2 border-gray-800 border-2 w-full grid grid-cols-5 px-4 py-2 text-base items-center"
                >
                  <div className="flex items-center gap-3">
                    <FaFile className="text-gray-800" size={30} />
                    <Link href={`/projects/${project.id}`}>{project.name}</Link>
                  </div>

                  <div className="w-fit justify-self-start">
                    Data de Criação:{' '}
                    {moment(project.createdAt).format('DD/MM/YYYY')}
                  </div>
                  <div className="w-fit justify-self-center">
                    Orientador: Hudson
                  </div>
                  <div className="w-fit justify-self-end">
                    Status: Finalizado
                  </div>

                  <div className="w-fit justify-self-end">
                    <FaDownload className="text-gray-800" size={30} />
                  </div>
                </div>
              ))}
              <div
                key={2}
                className="rounded-lg mb-2 border-gray-800 border-2 w-full grid grid-cols-5 px-4 py-2 text-base items-center"
              >
                <div className="flex items-center gap-3">
                  <FaFile className="text-gray-800" size={30} />
                  <Link href={`/projects/dasdasdsa`}>Relatório 2</Link>
                </div>

                <div className="w-fit justify-self-start">
                  Data de Criação:{' '}
                  {/* {moment(project.createdAt).format('DD/MM/YYYY')} */}
                  12/12/2022
                </div>
                <div className="w-fit justify-self-center">
                  Orientador: Hudson
                </div>
                <div className="w-fit justify-self-end">Status: Finalizado</div>

                <div className="w-fit justify-self-end">
                  <FaDownload className="text-gray-800" size={30} />
                </div>
              </div>
            </CollapsiblePrimitive.CollapsibleContent>
          </CollapsiblePrimitive.Collapsible>

          <div className="w-full h-[2px] bg-gray-800 mt-8"></div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);

    return { props: { user } };
  },
});

export default Main;
