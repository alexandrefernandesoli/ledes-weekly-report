'use client'

import Head from 'next/head'
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
    <>
      <Head>
        <title>Ledes Weekly Report - Cadastro</title>
      </Head>
      <main className="grid h-screen md:grid-flow-col md:grid-cols-2">
        <HomeLeft />

        <div className="flex flex-col items-center justify-center bg-primary text-gray-200">
          <form
            className="mt-4 flex flex-col gap-2 md:mt-0 md:w-[350px]"
            onSubmit={handleSubmit(handleSignupSubmit)}
          >
            <h2 className="mb-2 text-xl">Cadastre-se</h2>

            <label htmlFor="name">
              <span>Nome completo</span>
              <TextInput.Root>
                <TextInput.Input
                  type="text"
                  id="name"
                  placeholder="Digite seu nome"
                  register={register('name', { required: true })}
                />
              </TextInput.Root>
            </label>

            <label htmlFor="email">
              <span>Email</span>
              <TextInput.Root>
                <TextInput.Input
                  type="text"
                  id="email"
                  placeholder="Digite seu email"
                  register={register('email', { required: true })}
                />
              </TextInput.Root>
            </label>
            <label htmlFor="password">
              <span>Senha</span>
              <TextInput.Root>
                <TextInput.Input
                  type="password"
                  id="password"
                  placeholder="******"
                  register={register('password', { required: true })}
                />
              </TextInput.Root>
            </label>
            <label htmlFor="confirmPassword">
              <span>Confirme sua senha</span>
              <TextInput.Root>
                <TextInput.Input
                  type="password"
                  id="confirmPassword"
                  placeholder="******"
                  register={register('confirmPassword', { required: true })}
                />
              </TextInput.Root>
            </label>

            <Button
              disabled={loading}
              className="mt-2 disabled:cursor-wait disabled:bg-gray-500"
              type="submit"
            >
              Criar minha conta
            </Button>
          </form>
        </div>
      </main>
    </>
  )
}

export default Register
