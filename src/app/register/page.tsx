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
  const { register, handleSubmit } = useForm<Inputs>()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const { supabase } = useSupabase()

  const handleSignupSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true)

    if (data.password !== data.confirmPassword) {
      console.log('senhas diferentes')

      setLoading(false)
      return
    }

    console.log(data)

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    })

    if (error) {
      console.log(error)
    }

    setLoading(false)
    router.push('/')
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

          <div>
            <label htmlFor="name">Nome completo</label>
            <TextInput.Root className="bg-zinc-200">
              <TextInput.Input
                type="text"
                id="name"
                placeholder="Digite seu nome"
                register={register('name', { required: true })}
              />
            </TextInput.Root>
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <TextInput.Root className="bg-zinc-200">
              <TextInput.Input
                type="text"
                id="email"
                placeholder="Digite seu email"
                register={register('email', { required: true })}
              />
            </TextInput.Root>
          </div>

          <div>
            <label htmlFor="password">Senha</label>
            <TextInput.Root className="bg-zinc-200">
              <TextInput.Input
                type="password"
                id="password"
                placeholder="******"
                register={register('password', { required: true })}
              />
            </TextInput.Root>
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirme sua senha</label>
            <TextInput.Root className="bg-zinc-200">
              <TextInput.Input
                type="password"
                id="confirmPassword"
                placeholder="******"
                register={register('confirmPassword', { required: true })}
              />
            </TextInput.Root>
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
