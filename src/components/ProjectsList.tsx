import {
  ChevronDownIcon,
  ChevronUpIcon,
  FolderIcon,
} from '@heroicons/react/24/solid';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import Link from 'next/link';
import { useState } from 'react';

export const ProjectsList = ({
  projects,
  isLoading,
}: {
  projects: any[];
  isLoading: boolean;
}) => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);

  return (
    <CollapsiblePrimitive.Collapsible
      open={isProjectsOpen}
      onOpenChange={setIsProjectsOpen}
    >
      <CollapsiblePrimitive.CollapsibleTrigger asChild>
        <h1 className="mb-2 flex cursor-pointer items-center gap-1 text-2xl">
          Meus projetos{' '}
          {isProjectsOpen ? (
            <ChevronDownIcon className="w-6 text-gray-800" />
          ) : (
            <ChevronUpIcon className="w-6 text-gray-800" />
          )}
        </h1>
      </CollapsiblePrimitive.CollapsibleTrigger>

      <CollapsiblePrimitive.CollapsibleContent className="flex flex-col gap-1">
        {/* <div className="grid w-full grid-cols-3 items-center bg-neutral-200 px-4 py-2 text-base font-semibold">
          <div className="flex items-center gap-1">Título do projeto</div>

          <div>Orientadores</div>

          <div className="flex flex-col leading-none">Ultimo relatório</div>
        </div> */}
        {isLoading &&
          [...Array(3)].map((_, index) => (
            <div
              key={index}
              className="grid w-full animate-pulse grid-cols-3 items-center  bg-neutral-200 px-4 py-2 text-lg"
            >
              <div className="flex items-center gap-1">
                <FolderIcon className="w-6" />
                Carregando...
                {/* <Link href={`/projects/${project.id}`}>{project.name}</Link> */}
              </div>

              <div>
                <span className="rounded-full bg-gray-300 px-2 py-1 text-sm">
                  ...
                </span>
              </div>

              <div className="flex w-fit flex-col font-semibold leading-none">
                <span>.../.../...</span>
                <span className="text-sm text-gray-600">..:..:..</span>
              </div>
            </div>
          ))}
        {!isLoading &&
          projects &&
          projects.map((project, arrayId) => (
            <div
              key={project.id}
              className="grid w-full grid-cols-3 items-center rounded-lg    bg-neutral-200 px-4 py-2 text-lg "
            >
              <div className="flex items-center gap-1">
                <FolderIcon className="w-6" />
                <Link href={`/projects/${project.id}`}>{project.name}</Link>
              </div>

              <div>
                <span className="rounded-full bg-gray-300 px-2 py-1 text-sm">
                  Hudson
                </span>
              </div>

              <div className="flex w-fit flex-col font-semibold leading-none">
                <span>22/03/2023</span>
                <span className="text-sm text-gray-600">11:03:20</span>
              </div>
            </div>
          ))}
      </CollapsiblePrimitive.CollapsibleContent>
    </CollapsiblePrimitive.Collapsible>
  );
};
