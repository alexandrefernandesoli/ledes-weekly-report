'use client'

import { updateProjectAction } from '@/app/project/[id]/actions'
import { Cog8ToothIcon } from '@heroicons/react/24/solid'
import { Project, ProjectMember, User } from '@prisma/client'
import * as Dialog from '@radix-ui/react-dialog'
import axios from 'axios'
import { XIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './Button'
import { TextInput } from './TextInput'

export const ProjectPrefModal = ({
  project,
}: {
  project: Project & { members: (ProjectMember & { member: User })[] }
}) => {
  const [open, setOpen] = useState(false)
  const [projectName, setProjectName] = useState(project.name)
  const [projectDescription, setProjectDescription] = useState(
    project.description,
  )
  const [memberEmail, setMemberEmail] = useState('')

  const updateProject = async () => {
    if (
      projectName === project.name &&
      projectDescription === project.description
    )
      return

    try {
      // await axios.put(`/api/projects/${project.id}`, {
      //   name: projectName,
      //   description: projectDescription,
      // })

      // project.name = projectName
      // project.description = projectDescription

      await updateProjectAction({
        name: projectName,
        description: projectDescription,
        projectId: project.id,
      })

      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  const addNewMember = async () => {
    const response = await axios.post('/api/projects/invite', {
      projectId: project.id,
      email: memberEmail,
    })

    console.log(response)
  }

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
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex w-[90vw] max-w-[960px] -translate-x-1/2 -translate-y-1/2 flex-col gap-2 rounded-lg bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-2xl text-gray-900">
              Preferências do projeto
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="rounded-fulltext-3xl items-center justify-center text-red-700 hover:text-red-600"
                aria-label="Close"
              >
                <XIcon className="h-8 w-8" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-lg font-bold" htmlFor="name">
              Nome do projeto
            </label>
            <TextInput.Root>
              <TextInput.Input
                id="name"
                onChange={(ev) => setProjectName(ev.target.value)}
                defaultValue={projectName}
              />
            </TextInput.Root>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-lg font-bold" htmlFor="description">
              Descrição do projeto
            </label>
            <TextInput.Root>
              <TextInput.Input
                id="description"
                onChange={(ev) => setProjectDescription(ev.target.value)}
                defaultValue={projectDescription}
              />
            </TextInput.Root>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="newUserEmail" className="text-lg font-bold">
              Cadastrar novo membro
            </label>
            <div className="flex gap-1">
              <TextInput.Root>
                <TextInput.Input
                  id="newUserEmail"
                  placeholder="Ex.: johndoe@email.com"
                  onChange={(ev) => setMemberEmail(ev.target.value)}
                />
              </TextInput.Root>
              <Button onClick={addNewMember}>Adicionar</Button>
            </div>
          </div>

          <div className="w-full">
            <div className="text-lg font-bold text-gray-900">
              Membros do projeto
            </div>
            {project.members.map((member) => (
              <div key={member.member.id} className="grid grid-cols-2 ">
                <div className="truncate">{member.member.name}</div>
                <p className="truncate">{member.member.email}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex w-full justify-end">
            <Button
              className="px-2text-gray-50 w-fit rounded-md bg-green-600 hover:bg-green-500 disabled:cursor-auto disabled:bg-gray-200 disabled:text-gray-300"
              onClick={() => updateProject()}
              disabled={
                projectName === project.name &&
                projectDescription === project.description
              }
            >
              Salvar
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
