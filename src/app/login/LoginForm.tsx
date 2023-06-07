'use client'

import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { LockIcon, MailIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSupabase } from '../supabase-provider'

type Inputs = {
  email: string
  password: string
}

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { handleSubmit, register } = useForm<Inputs>()
  const router = useRouter()
  const { supabase } = useSupabase()

  const handleLoginSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isLoading) return

    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (!error) {
      router.replace('/dashboard')
    }
    setIsLoading(false)
  }

  return (
    <form
      className="flex flex-col gap-2 rounded-lg bg-zinc-100 p-4 text-zinc-900 shadow-lg md:w-[350px]"
      onSubmit={handleSubmit(handleLoginSubmit)}
    >
      <h2 className="mb-2 text-2xl">Você possui uma conta?</h2>

      <div>
        <label className="font-semibold" htmlFor="email">
          Email
        </label>
        <TextInput.Root className="bg-gray-200">
          <MailIcon className="text-gray-600" />
          <TextInput.Input
            type="text"
            id="email"
            placeholder="johndoe@example.com"
            register={register('email')}
          />
        </TextInput.Root>
      </div>

      <div>
        <label className="font-semibold" htmlFor="password">
          Senha
        </label>
        <TextInput.Root className="bg-gray-200">
          <LockIcon className="text-gray-600" />
          <TextInput.Input
            type="password"
            id="password"
            placeholder="********"
            register={register('password')}
          />
        </TextInput.Root>
      </div>

      <Button
        className="mt-2 flex w-full items-center justify-center disabled:cursor-wait disabled:bg-gray-500"
        type="submit"
        disabled={isLoading}
      >
        Entrar na plataforma
      </Button>
    </form>
  )
}
