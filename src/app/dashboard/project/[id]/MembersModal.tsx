'use client'

import { ProjectType } from '@/app/dashboard/project/[id]/page'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tooltip from '@radix-ui/react-tooltip'
import { ListXIcon, UsersIcon, XIcon } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import NotificationToast from './NotificationToast'
import { addMemberAction } from './actions'
import clsx from 'clsx'

export const MembersModal = ({
  project,
  isSupervisor,
}: {
  project: ProjectType
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
    project.profile.map((member) => ({
      ...member,
      role: member.project_member.find(
        (projectMember) => projectMember.project_id === project.id,
      )?.role,
    })),
  )

  console.log({ project })

  useEffect(() => {
    if (!open) setIsNotificationOpen(false)
  }, [open])

  const addNewMember = async () => {
    const { member, error } = await addMemberAction({
      projectId: project.id,
      email: memberEmail,
    })

    if (error) {
      setNotificationTitle('Erro')
      console.log(error)
      setNotificationMessage(
        error || 'Ocorreu um erro, tente novamente mais tarde.',
      )
      setNotificationType('error')

      setIsNotificationOpen(true)

      return
    }

    setNotificationTitle('Sucesso')
    setNotificationMessage('Membro adicionado com sucesso!')
    setNotificationType('success')

    setIsNotificationOpen(true)

    setMembers((members) => [...members!, member!])
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
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex w-[95vw] -translate-x-1/2 -translate-y-1/2 flex-col gap-2 rounded-lg bg-gray-50 p-3 data-[state=open]:animate-contentShow md:w-[800px] md:p-6">
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
            <table className="w-full border-separate border-spacing-2 text-sm">
              <thead>
                <tr>
                  <th className="text-left">Nome</th>
                  <th className="hidden text-left sm:table-cell">Email</th>
                  <th className="hidden text-left md:table-cell">
                    Membro Desde
                  </th>
                  <th className="hidden text-left md:table-cell">Cargo</th>
                </tr>
              </thead>
              <tbody>
                {members?.map((member) => (
                  <tr key={member.id}>
                    <td className="py-1">{member.name}</td>
                    <td className="hidden sm:table-cell">{member.email}</td>
                    <td className="hidden md:table-cell">
                      {moment(member.created_at).format('DD/MM/YYYY')}
                    </td>
                    <td className="hidden md:table-cell">
                      <span
                        className={clsx(
                          'rounded-full px-2 py-1 text-sm',
                          member.role === 'STUDENT'
                            ? 'bg-green-100 text-green-700'
                            : member.role === 'SUPERVISOR'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700',
                        )}
                      >
                        {member.role === 'STUDENT'
                          ? 'Estudante'
                          : member.role === 'SUPERVISOR'
                          ? 'Supervisor'
                          : 'Administrador'}
                      </span>
                    </td>
                    {isSupervisor && (
                      <td>
                        <Tooltip.Provider>
                          <Tooltip.Root>
                            <Tooltip.Trigger
                              onClick={() => console.log('xd')}
                              className="flex h-full w-full items-center justify-center"
                            >
                              <ListXIcon className="text-red-800" />
                            </Tooltip.Trigger>
                            <Tooltip.Content className="flex flex-col rounded-lg bg-gray-50 p-2 shadow-md">
                              <span className="text-xs text-red-800">
                                Remover
                              </span>
                              <Tooltip.Arrow className="fill-white" />
                            </Tooltip.Content>
                          </Tooltip.Root>
                        </Tooltip.Provider>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
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
