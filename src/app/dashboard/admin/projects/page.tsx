import prisma from '@/lib/prisma'

const Projects = async () => {
  const projects = await prisma.project.findMany()
  await prisma.$disconnect()

  return (
    <div className="px-4">
      <div className="flex items-center gap-1">
        <h1 className="text-2xl">Projetos</h1>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
          {projects.length}
        </span>
      </div>
      <div>
        {projects.map((project) => (
          <div key={project.id}>{project.name}</div>
        ))}
      </div>
    </div>
  )
}

export default Projects
