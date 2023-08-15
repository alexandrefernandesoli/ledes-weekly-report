'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '../../components/Button'
import { TextInput } from '../../components/TextInput'
import { HomeLeft } from '@/app/login/HomeLeft'
import { useSupabase } from '../supabase-provider'

type Inputs = {
  name: string
  email: string
  confirmPassword: string
  password: string
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { supabase } = useSupabase()

  const handleSignupSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true)

    if (data.password !== data.confirmPassword) {
      console.log('senhas diferentes')

      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    })

    if (!error) {
      router.push('/')
    } else {
      if (error.status === 400) {
        setErrorMessage(
          'Email já cadastrado. Tente novamente com um novo email.',
        )
      } else {
        setErrorMessage('Algo deu errado. Tente novamente mais tarde.')
      }
    }

    setLoading(false)
  }

  return (
    <main className="grid h-screen w-full md:grid-flow-col md:grid-cols-2">
      <HomeLeft />

      <div className="flex flex-col items-center justify-center bg-primary py-4">
        <form
          className="flex flex-col gap-2 rounded-lg bg-zinc-100 p-4 shadow-lg md:mt-0 md:w-[350px]"
          onSubmit={handleSubmit(handleSignupSubmit)}
        >
          <h2 className="mb-2 text-2xl">Cadastre-se na nossa plataforma</h2>

          {errorMessage ? (
            <div className="rounded-lg bg-red-200 p-2 text-center font-semibold text-red-600">
              {errorMessage}
            </div>
          ) : null}

          <div>
            <label className="font-semibold" htmlFor="name">
              Nome completo
            </label>
            <TextInput.Root invalid={!!errors.name}>
              <TextInput.Input
                type="text"
                id="name"
                name="name"
                placeholder="Digite seu nome"
                register={register('name', {
                  required: 'O campo nome é necessário.',
                })}
              />
            </TextInput.Root>
            {errors.name ? (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <label className="font-semibold" htmlFor="email">
              Email
            </label>
            <TextInput.Root invalid={!!errors.email}>
              <TextInput.Input
                type="text"
                id="email"
                name="email"
                placeholder="Digite seu email"
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
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="font-semibold" htmlFor="password">
              Senha
            </label>
            <TextInput.Root invalid={!!errors.password}>
              <TextInput.Input
                type="password"
                id="password"
                name="password"
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
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="font-semibold" htmlFor="confirmPassword">
              Confirme sua senha
            </label>
            <TextInput.Root invalid={!!errors.confirmPassword}>
              <TextInput.Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="********"
                register={register('confirmPassword', {
                  required: 'O campo confirmar senha é necessário.',
                  validate: (value, formValues) =>
                    value !== formValues.password
                      ? 'As duas senhas devem ser iguais.'
                      : undefined,
                })}
              />
            </TextInput.Root>
            {errors.confirmPassword ? (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <Button
            disabled={loading}
            className="mt-2 flex items-center justify-center  disabled:cursor-wait disabled:bg-gray-500"
            type="submit"
          >
            Criar minha conta
          </Button>
        </form>
      </div>
    </main>
  )
}

export default Register
