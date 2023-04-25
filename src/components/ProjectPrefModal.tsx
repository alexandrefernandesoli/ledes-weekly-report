import { Cog8ToothIcon } from '@heroicons/react/24/solid';
import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import { useState } from 'react';
import { FaCog, FaPlus } from 'react-icons/fa';
import { HiOutlineX } from 'react-icons/hi';
import { KeyedMutator } from 'swr';
import { ProjectType } from '../lib/useProject';
import { Button } from './Button';
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
        <Button className=" bg-rose-700 text-sm hover:bg-rose-600">
          <Cog8ToothIcon className="w-5" />
          Preferências do projeto
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-gray-900 bg-opacity-10" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4">
          <Dialog.Title className="text-xl text-gray-900">
            Preferências
          </Dialog.Title>
          <label htmlFor="name">
            <div className="mt-2 text-sm text-gray-900">Nome do projeto</div>
            <TextInput.Root>
              <TextInput.Input
                id="name"
                onChange={(ev) => setProjectName(ev.target.value)}
                defaultValue={projectName}
              />
            </TextInput.Root>
          </label>
          <label htmlFor="description">
            <div className="mt-2 text-sm text-gray-900">
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
          <div className="mt-2 text-sm text-gray-900">Membros do projeto</div>
          <div className="flex w-full flex-wrap items-center gap-1 text-gray-800">
            {project.users.map((user: any) => (
              <div
                key={user.id}
                className="w-fit rounded-lg bg-gray-100 py-1 px-2 text-xs"
              >
                {user.name.split(' ')[0]}
              </div>
            ))}

            <button className="flex h-6 w-6 items-center justify-center rounded-full px-0 py-0 text-xs">
              <FaPlus />
            </button>
          </div>

          <div className="mt-4 flex w-full justify-end">
            <button
              className="w-fit rounded-md bg-green-600 py-1 px-2 text-sm text-gray-50 hover:bg-green-500 disabled:bg-gray-200 disabled:text-gray-300"
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
              className="absolute top-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-3xl text-red-700 hover:text-red-600"
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
