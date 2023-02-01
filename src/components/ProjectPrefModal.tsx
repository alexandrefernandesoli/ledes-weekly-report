import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import { useState } from 'react';
import { FaCog, FaPlus } from 'react-icons/fa';
import { HiOutlineX } from 'react-icons/hi';
import { KeyedMutator } from 'swr';
import { ProjectType } from '../lib/useProject';
import { TextInput } from './TextInput';

export const ProjectPrefModal = ({
  project,
  mutate,
}: {
  project: ProjectType;
  mutate: KeyedMutator<any>;
}) => {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(
    project.description
  );

  const updateProject = async () => {
    if (
      projectName === project.name &&
      projectDescription === project.description
    )
      return;

    try {
      await axios.put('/api/projects', {
        id: project.id,
        name: projectName,
        description: projectDescription,
      });

      await mutate();

      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="w-max flex items-center gap-1 text-xs">
          <FaCog />
          Preferências do projeto
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-900 bg-opacity-10 fixed inset-0" />
        <Dialog.Content className="bg-white rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[450px] max-h-[85vh] p-4">
          <Dialog.Title className="text-gray-900 text-xl">
            Preferências
          </Dialog.Title>
          <label htmlFor="name">
            <div className="text-sm text-gray-900 mt-2">Nome do projeto</div>
            <TextInput.Root>
              <TextInput.Input
                id="name"
                onChange={(ev) => setProjectName(ev.target.value)}
                defaultValue={projectName}
              />
            </TextInput.Root>
          </label>
          <label htmlFor="description">
            <div className="text-sm text-gray-900 mt-2">
              Descrição do projeto
            </div>
            <TextInput.Root>
              <TextInput.Input
                id="description"
                onChange={(ev) => setProjectDescription(ev.target.value)}
                defaultValue={projectDescription}
              />
            </TextInput.Root>
          </label>
          <div className="text-sm mt-2 text-gray-900">Membros do projeto</div>
          <div className="flex flex-wrap items-center gap-1 text-gray-800 w-full">
            {project.users.map((user: any) => (
              <div
                key={user.id}
                className="text-xs bg-gray-100 rounded-lg w-fit py-1 px-2"
              >
                {user.name.split(' ')[0]}
              </div>
            ))}

            <button className="px-0 py-0 flex items-center justify-center text-xs rounded-full w-6 h-6">
              <FaPlus />
            </button>
          </div>

          <div className="mt-4 w-full flex justify-end">
            <button
              className="w-fit rounded-md py-1 px-2 text-gray-50 bg-green-600 hover:bg-green-500 text-sm disabled:bg-gray-200 disabled:text-gray-300"
              onClick={() => updateProject()}
              disabled={
                projectName === project.name &&
                projectDescription === project.description
              }
            >
              Salvar
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="rounded-full text-red-700 hover:text-red-600 text-3xl h-7 w-7 inline-flex items-center justify-center absolute top-3 right-3"
              aria-label="Close"
            >
              <HiOutlineX />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
