import Link from 'next/link'
import { FaCheck, FaMailBulk } from 'react-icons/fa'

export const HomeLeft = () => {
  return (
    <div className="flex flex-col bg-gray-100 px-4 py-6 text-gray-900 md:px-12">
      <Link href={'/login'}>
        <div className="flex cursor-pointer items-center gap-4">
          <FaMailBulk className="text-6xl text-primary md:text-8xl" />
          <h1 className="text-2xl md:text-5xl">
            Ledes Weekly <br /> Report
          </h1>
        </div>
      </Link>

      <div className="self-center justify-self-center md:mt-28">
        <h2 className="mt-8 text-xl md:w-[400px] md:text-2xl">
          Nossa plataforma é o lugar certo para o seu projeto
        </h2>
        <ul className="mt-4 flex flex-col gap-1">
          <li className="flex items-center gap-1 text-lg">
            <FaCheck />
            Gerencie seus alunos e projetos
          </li>
          <li className="flex items-center gap-1 text-lg">
            <FaCheck />
            Mantenha um histórico de atividades
          </li>
          <li className="flex items-center gap-1 text-lg">
            <FaCheck />
            Receba notificações
          </li>
          <li className="flex items-center gap-1 text-lg">
            <FaCheck />
            Exporte seus relatórios
          </li>
        </ul>
      </div>
    </div>
  )
}
