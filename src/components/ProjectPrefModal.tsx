import * as Dialog from '@radix-ui/react-dialog';
import { FaCog, FaPlus } from 'react-icons/fa';
import { HiOutlineX, HiXCircle } from 'react-icons/hi';
import { Button } from './Button';
import { TextInput } from './TextInput';

export const ProjectPrefModal = ({ project }: any) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className="w-max flex items-center gap-1 text-xs">
          <FaCog />
          Preferências do projeto
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-900 bg-opacity-10 fixed inset-0" />
        <Dialog.Content className="bg-white rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[450px] max-h-[85vh] p-4 ">
          <Dialog.Title className="text-gray-900 text-xl">
            Preferências
          </Dialog.Title>
          <form action="" className="mt-4">
            <label htmlFor="name">
              <div className="text-sm text-gray-900">Nome do projeto</div>
              <TextInput.Root>
                <TextInput.Input id="name" defaultValue={project.name} />
              </TextInput.Root>
            </label>
          </form>
          <div className="text-sm mt-2 mb-1 text-gray-900">
            Membros do projeto
          </div>
          <div className="flex flex-wrap items-center gap-1 text-gray-800 w-full">
            {project.users.map((user: any) => (
              <div
                key={user.id}
                className="text-xs font-black bg-gray-100 rounded-lg w-fit py-1 px-2"
              >
                {user.name.split(' ')[0]}
              </div>
            ))}

            <Button className="px-0 py-0 flex items-center justify-center text-xs rounded-full w-6 h-6">
              <FaPlus />
            </Button>
          </div>

          <div className="mt-4 w-full flex justify-end">
            <Dialog.Close asChild>
              <Button className="w-fit bg-green-600 hover:bg-green-500 text-sm">
                Salvar
              </Button>
            </Dialog.Close>
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
