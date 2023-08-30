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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inputs>()
  const router = useRouter()
  const { supabase } = useSupabase()

  const handleLoginSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isLoading) return

    setErrorMessage(null)
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (!error) {
      router.push('/dashboard')
    } else {
      if (error.status === 400) {
        setErrorMessage('Login e/ou senha inválido(s). Tente novamente.')
      } else {
        setErrorMessage('Algo deu errado. Tente novamente mais tarde.')
      }
    }

    setIsLoading(false)
  }

  return (
    <form
      className="flex flex-col gap-2 rounded-lg bg-zinc-100 p-4 text-zinc-900 shadow-lg md:w-[350px]"
      onSubmit={handleSubmit(handleLoginSubmit)}
    >
      <h2 className="text-2xl">Você possui uma conta?</h2>

      {errorMessage ? (
        <div className="rounded-lg bg-red-200 p-2 text-center font-semibold text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <div>
        <label className="font-semibold" htmlFor="email">
          Email
        </label>
        <TextInput.Root invalid={!!errors.email}>
          <MailIcon className="text-gray-600" />
          <TextInput.Input
            type="email"
            id="email"
            placeholder="johndoe@example.com"
            register={register('email', {
              required: 'O campo email é necessário.',
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                message: 'O campo email deve ser um email válido.',
              },
            })}
          />
        </TextInput.Root>
        {errors.email ? (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label className="font-semibold" htmlFor="password">
          Senha
        </label>
        <TextInput.Root invalid={!!errors.password}>
          <LockIcon className="text-gray-600" />
          <TextInput.Input
            type="password"
            id="password"
            placeholder="********"
            register={register('password', {
              required: 'O campo senha é necessário.',
              minLength: {
                value: 8,
                message: 'A senha deve ter no mínimo 8 caracteres.',
              },
            })}
          />
        </TextInput.Root>
        {errors.password ? (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        ) : null}
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
