'use client'

import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { Project, ProjectMember, User } from '@prisma/client'
import * as Dialog from '@radix-ui/react-dialog'
import axios, { AxiosError } from 'axios'
import { UsersIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import NotificationToast from './NotificationToast'

export const MembersModal = ({
  project,
  isSupervisor,
}: {
  project: Project & { members?: (ProjectMember & { member: User })[] }
  isSupervisor: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'error'>(
    'success',
  )
  const [memberEmail, setMemberEmail] = useState('')
  const [members, setMembers] = useState(
    project.members?.map((member) => member.member),
  )

  const addNewMember = async () => {
    try {
      const response = await axios.post('/api/projects/invite', {
        projectId: project.id,
        email: memberEmail,
      })

      setNotificationTitle('Sucesso')
      setNotificationMessage('Membro adicionado com sucesso!')
      setNotificationType('success')

      setIsNotificationOpen(true)

      setMembers((members) => [...members!, response.data])
    } catch (err) {
      if (err instanceof AxiosError) {
        setNotificationTitle('Erro')
        setNotificationMessage(
          err.response?.data.message ||
            'Ocorreu um erro, tente novamente mais tarde.',
        )
        setNotificationType('error')

        setIsNotificationOpen(true)
        console.log(err)
      }
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="align-center flex items-center gap-1 rounded-lg bg-sky-800 px-2 py-1 text-xs text-zinc-50 hover:bg-sky-700 md:gap-2 md:px-3 md:py-2 md:text-sm">
          <UsersIcon className="w-4 md:w-5" />
          Membros
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-gray-900 bg-opacity-10 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex w-[95vw] -translate-x-1/2 -translate-y-1/2 flex-col gap-2 rounded-lg bg-gray-50 p-3 data-[state=open]:animate-contentShow md:w-[660px] md:p-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-2xl text-gray-900">
              Membros
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

          {isSupervisor ? (
            <div className="mb-2 flex flex-col gap-1">
              <label htmlFor="newUserEmail" className="text-lg">
                Adicionar novo membro
              </label>
              <div className="flex gap-1">
                <TextInput.Root>
                  <TextInput.Input
                    id="newUserEmail"
                    placeholder="Ex.: johndoe@email.com"
                    onChange={(ev) => setMemberEmail(ev.target.value)}
                  />
                </TextInput.Root>
                <Button className="text-sm" onClick={addNewMember}>
                  Adicionar
                </Button>
              </div>
            </div>
          ) : null}

          <div className="w-full">
            <div className="text-lg text-gray-900">Membros do projeto</div>
            {members?.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-1 text-sm md:grid-cols-2"
              >
                <div className="truncate">{member.name}</div>
                <div className="hidden truncate md:block">{member.email}</div>
              </div>
            ))}
          </div>
        </Dialog.Content>
        <NotificationToast
          open={isNotificationOpen}
          setOpen={setIsNotificationOpen}
          text={notificationMessage}
          title={notificationTitle}
          type={notificationType}
        />
      </Dialog.Portal>
    </Dialog.Root>
  )
}
