'use client'

import { updateProjectAction } from '@/app/dashboard/project/[id]/actions'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { Project, ProjectMember, User } from '@prisma/client'
import * as Dialog from '@radix-ui/react-dialog'
import { Cog, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import NotificationToast from './NotificationToast'

type Inputs = {
  projectName: string
  projectDescription: string
  projectType: string
}

export const ProjectPrefModal = ({
  project,
}: {
  project: Project & { members?: (ProjectMember & { member: User })[] }
}) => {
  const [open, setOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      projectName: project.name,
      projectDescription: project.description,
      projectType: project.type,
    },
  })

  const router = useRouter()

  const handleFormSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true)
    setIsNotificationOpen(false)

    try {
      await updateProjectAction({
        name: data.projectName,
        description: data.projectDescription,
        type: data.projectType,
        projectId: project.id,
      })

      router.refresh()

      setIsNotificationOpen(true)
      setOpen(false)
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="align-center flex items-center gap-1 rounded-lg bg-red-800 px-2 py-1 text-xs text-zinc-50 hover:bg-red-700 md:gap-2 md:px-3 md:py-2 md:text-sm">
          <Cog className="w-4 md:w-5" />
          Preferências
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-gray-900 bg-opacity-10 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex w-[95vw] -translate-x-1/2 -translate-y-1/2 flex-col rounded-lg bg-gray-50 p-3 data-[state=open]:animate-contentShow md:w-[460px] md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-xl text-gray-900  md:text-2xl">
              Preferências do projeto
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="items-center justify-center rounded-full text-3xl text-red-700 hover:text-red-600"
                aria-label="Close"
              >
                <XIcon className="h-8 w-8" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mb-2 flex flex-col">
              <label htmlFor="name">Nome do projeto</label>
              <TextInput.Root>
                <TextInput.Input id="name" register={register('projectName')} />
              </TextInput.Root>
            </div>
            <div className="mb-2 flex flex-col">
              <label htmlFor="description">Descrição do projeto</label>
              <TextInput.Root>
                <TextInput.Input
                  id="description"
                  register={register('projectDescription')}
                />
              </TextInput.Root>
            </div>

            <div className="mb-4 flex flex-col">
              <label htmlFor="description">Tipo de projeto</label>
              <TextInput.Root>
                <TextInput.Input id="type" register={register('projectType')} />
              </TextInput.Root>
            </div>

            <div className=" flex w-full justify-end">
              <Button
                className="w-fit rounded-md bg-green-600 px-2 text-gray-50 hover:bg-green-500 disabled:cursor-auto disabled:bg-gray-200 disabled:text-gray-300"
                type="submit"
                disabled={isLoading}
              >
                Salvar
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
      <NotificationToast
        title="Sucesso"
        text={`Projeto atualizado com sucesso.`}
        open={isNotificationOpen}
        setOpen={setIsNotificationOpen}
      />
    </Dialog.Root>
  )
}
