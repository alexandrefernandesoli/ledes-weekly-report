import { FolderIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export const ProjectsList = ({ projects }: { projects: any[] }) => {
  return (
    <>
      <h1 className="mb-2 flex cursor-pointer items-center gap-1 text-2xl">
        Meus projetos
      </h1>

      <div className="flex flex-col gap-1">
        {projects.map((project, arrayId) => (
          <div
            key={project.id}
            className="flex w-full items-center bg-neutral-200 px-4 py-3 text-2xl"
          >
            <div className="flex items-center gap-1">
              <FolderIcon className="w-8" />
              <Link href={`/dashboard/project/${project.id}`}>
                {project.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
