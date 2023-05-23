'use client'

import { Button } from '@/components/Button'
import { Spinner } from '@/components/Spinner'
import { TextInput } from '@/components/TextInput'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaEnvelope, FaLock } from 'react-icons/fa'
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
      router.replace('/')
    }
    setIsLoading(false)
  }

  return (
    <form
      className="flex flex-col gap-2 md:w-[350px]"
      onSubmit={handleSubmit(handleLoginSubmit)}
    >
      <h2 className="mb-2 text-2xl">Você possui uma conta?</h2>

      <label htmlFor="email">
        <span>Email</span>
        <TextInput.Root>
          <TextInput.Icon>
            <FaEnvelope />
          </TextInput.Icon>
          <TextInput.Input
            type="text"
            id="email"
            placeholder="johndoe@example.com"
            register={register('email')}
          />
        </TextInput.Root>
      </label>
      <label htmlFor="password">
        <span>Senha</span>
        <TextInput.Root>
          <TextInput.Icon>
            <FaLock />
          </TextInput.Icon>
          <TextInput.Input
            type="password"
            id="password"
            placeholder="********"
            register={register('password')}
          />
        </TextInput.Root>
      </label>

      <Button
        className="mt-2 flex w-full items-center justify-center"
        type="submit"
        disabled={isLoading}
      >
        Entrar na plataforma
        {isLoading && <Spinner />}
      </Button>
    </form>
  )
}
