'use client'

import { createProjectAction } from '@/app/dashboard/actions'
import { PlusIcon } from '@heroicons/react/24/outline'
import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { HiOutlineX } from 'react-icons/hi'
import { TextInput } from './TextInput'

export const NewProjectModal = () => {
  const [open, setOpen] = useState(false)
  const { push } = useRouter()

  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectType, setProjectType] = useState('')

  const newProject = async () => {
    if (projectName.trim() === '' || projectDescription.trim() === '') return

    const { project, error } = await createProjectAction({
      name: projectName,
      description: projectDescription,
      type: projectType,
    })

    if (error) {
      console.log(error)
      return
    }

    setOpen(false)

    push(`/dashboard/project/${project?.id}`)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="align-center flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-50">
          <PlusIcon className="h-5" />
          Novo projeto
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-gray-900 bg-opacity-10 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 data-[state=open]:animate-contentShow">
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

          <div className="mt-4 flex w-full justify-end">
            <button
              className="w-fit rounded-md bg-green-600 px-2 py-1 text-sm text-gray-50 hover:bg-green-500 disabled:bg-gray-200 disabled:text-gray-300"
              onClick={() => newProject()}
            >
              Salvar
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-3xl text-red-700 hover:text-red-600"
              aria-label="Close"
            >
              <HiOutlineX />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
