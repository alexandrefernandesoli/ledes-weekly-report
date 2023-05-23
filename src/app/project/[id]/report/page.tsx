'use client'

import { Button } from '@/components/Button'
import MainLayout from '@/components/MainLayout'
import { TextInput } from '@/components/TextInput'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import { FaTimes } from 'react-icons/fa'

const NewReport = ({ params }: { params: { id: string } }) => {
  const router = useRouter()

  const [tasksThisWeek, setTasksThisWeek] = useState([''])
  const [tasksNextWeek, setTasksNextWeek] = useState([''])

  const removeTaskThisWeek = (i: number) => {
    if (tasksThisWeek.length <= 1) return

    setTasksThisWeek((tasks) => tasks.filter((task, index) => index !== i))

    console.log(tasksThisWeek)
  }

  const newTaskThisWeek = () => {
    setTasksThisWeek([...tasksThisWeek, ''])
  }

  const removeTaskNextWeek = (i: number) => {
    if (tasksNextWeek.length <= 1) return

    setTasksNextWeek((tasks) => tasks.filter((task, index) => index !== i))
  }

  const newTaskNextWeek = () => {
    setTasksNextWeek([...tasksNextWeek, ''])
  }

  const changeInputValueHandle = (
    inputIndex: number,
    event: ChangeEvent<HTMLInputElement>,
    inputType: 'thisWeek' | 'nextWeek',
  ) => {
    if (inputType === 'thisWeek') {
      setTasksThisWeek((tasks) => {
        const newTasks = [...tasks]
        newTasks[inputIndex] = event.target.value
        return newTasks
      })
    } else if (inputType === 'nextWeek') {
      setTasksNextWeek((tasks) => {
        const newTasks = [...tasks]
        newTasks[inputIndex] = event.target.value
        return newTasks
      })
    }
  }

  const onSubmitForm = async (event: any) => {
    event.preventDefault()

    await axios.post('/api/reports', {
      projectId: params.id,
      content: JSON.stringify({
        tasksThisWeek,
        tasksNextWeek,
      }),
    })

    router.back()
  }

  return (
    <MainLayout>
      <form className="flex w-full flex-col" onSubmit={onSubmitForm}>
        <div className="flex items-center justify-between">
          <h1 className="mb-4 mt-4 text-2xl">Novo relatório</h1>
          <Button
            className="flex w-fit items-center gap-2 bg-emerald-600"
            type="submit"
          >
            Enviar
            <PaperAirplaneIcon className="w-6" />
          </Button>
        </div>

        <p>Digite suas tarefas realizadas</p>

        <div className="mt-2 flex flex-col gap-2">
          {tasksThisWeek.map((task, inputIndex) => (
            <TextInput.Root key={inputIndex} className="bg-gray-200">
              <label htmlFor={'taskThisWeek' + inputIndex}>
                {inputIndex + 1}.
              </label>
              <TextInput.Input
                className="flex-1"
                value={task}
                name={'taskThisWeek' + inputIndex}
                onChange={(event) =>
                  changeInputValueHandle(inputIndex, event, 'thisWeek')
                }
              />
              <FaTimes onClick={() => removeTaskThisWeek(inputIndex)} />
            </TextInput.Root>
          ))}
          <div
            className="mb-4 flex w-fit cursor-pointer items-center justify-center self-center rounded-full bg-gray-200 p-2"
            onClick={() => newTaskThisWeek()}
          >
            <PlusCircleIcon className="h-8" />
          </div>
        </div>

        <p>Digite as tarefas planejadas para a próxima semana</p>

        <div className="mt-2 flex flex-col gap-2">
          {tasksNextWeek.map((task, inputIndex) => (
            <TextInput.Root key={inputIndex} className="bg-gray-200">
              <label htmlFor={'taskNextWeek' + inputIndex}>
                {inputIndex + 1}.
              </label>
              <TextInput.Input
                className="flex-1"
                value={task}
                name={'taskNextWeek' + inputIndex}
                onChange={(event) =>
                  changeInputValueHandle(inputIndex, event, 'nextWeek')
                }
              />
              <FaTimes onClick={() => removeTaskNextWeek(inputIndex)} />
            </TextInput.Root>
          ))}
          <div
            className="mb-4 flex w-fit cursor-pointer items-center justify-center self-center rounded-full bg-gray-200 p-2"
            onClick={() => newTaskNextWeek()}
          >
            <PlusCircleIcon className="h-8" />
          </div>
        </div>
      </form>
    </MainLayout>
  )
}

export default NewReport
