import { PlusIcon } from '@heroicons/react/24/outline';
import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import { useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { Button } from './Button';
import { TextInput } from './TextInput';

export const NewProjectModal = ({ mutate }: any) => {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectType, setProjectType] = useState('');

  const newProject = async () => {
    if (projectName.trim() === '' || projectDescription.trim() === '') return;

    try {
      await axios.post('/api/projects', {
        name: projectName,
        description: projectDescription,
        type: projectType,
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
        <Button className="px-2 py-1 text-sm font-semibold">
          <PlusIcon className="h-5" />
          Novo projeto
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-gray-900 bg-opacity-10 " />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4">
          <Dialog.Title className="text-xl text-gray-900">
            Criar novo projeto
          </Dialog.Title>
          <div className="my-1 w-full border-b-2 border-dotted" />

          <label htmlFor="name">
            <div className="mt-2 text-sm text-gray-900">Título</div>
            <TextInput.Root>
              <TextInput.Input
                id="name"
                placeholder="Ex.: [TCC] Projeto de Conclusão de Curso"
                onChange={(ev) => setProjectName(ev.target.value)}
                defaultValue={projectName}
              />
            </TextInput.Root>
          </label>

          <label htmlFor="description">
            <div className="mt-2 text-sm text-gray-900">Descrição</div>
            <TextInput.Root>
              <TextInput.Input
                id="description"
                placeholder="Ex.: Um projeto realizado na conclusão do curso..."
                onChange={(ev) => setProjectDescription(ev.target.value)}
                defaultValue={projectDescription}
              />
            </TextInput.Root>
          </label>

          <label htmlFor="type">
            <div className="mt-2 text-sm text-gray-900">Tipo</div>
            <TextInput.Root>
              <TextInput.Input
                id="type"
                placeholder="Ex.: Projeto de extensão, Trabalho de conclusão de curso"
                onChange={(ev) => setProjectType(ev.target.value)}
                defaultValue={projectType}
              />
            </TextInput.Root>
          </label>

          <div className="mt-2 flex items-center justify-between text-sm text-gray-900">
            Membros
            <button className="flex items-center justify-center gap-1 rounded-lg bg-gray-200 px-2 py-1 text-xs">
              <PlusIcon className="w-4" />
              Adicionar um membro
            </button>
          </div>
          <div className="flex w-full flex-wrap items-center gap-1 text-gray-800"></div>

          <div className="mt-4 flex w-full justify-end">
            <button
              className="w-fit rounded-md bg-green-600 py-1 px-2 text-sm text-gray-50 hover:bg-green-500 disabled:bg-gray-200 disabled:text-gray-300"
              onClick={() => newProject()}
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
