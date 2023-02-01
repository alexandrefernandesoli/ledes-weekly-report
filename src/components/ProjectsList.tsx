'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import Link from 'next/link';
import { useState } from 'react';
import { FaAngleDown, FaAngleUp, FaProjectDiagram } from 'react-icons/fa';
import { useProjects } from '../lib/useProjects';

export const ProjectsList = () => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const { projects, error, isLoading } = useProjects();

  return (
    <CollapsiblePrimitive.Collapsible
      open={isProjectsOpen}
      onOpenChange={setIsProjectsOpen}
    >
      <CollapsiblePrimitive.CollapsibleTrigger asChild>
        <h1 className="text-xl mt-4 mb-4 flex items-center gap-1 cursor-pointer">
          Meus Projetos{' '}
          {isProjectsOpen ? (
            <FaAngleDown className="text-gray-800" size={24} />
          ) : (
            <FaAngleUp className="text-gray-800" size={24} />
          )}
        </h1>
      </CollapsiblePrimitive.CollapsibleTrigger>

      <CollapsiblePrimitive.CollapsibleContent>
        {!isLoading &&
          !error &&
          projects.map((project, arrayId) => (
            <div
              key={project.id}
              className="rounded-lg mb-2 border-gray-800 border-2 w-full flex px-4 py-2 text-base items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FaProjectDiagram className="text-gray-800" size={30} />
                <Link href={`/projects/${project.id}`}>{project.name}</Link>
              </div>

              <span>Orientador: Hudson</span>
              <span className="flex items-center gap-1">
                Membros: -----------{' '}
                <FaAngleDown
                  size={20}
                  className="cursor-pointer text-gray-800"
                />
              </span>
              <span>Tempo restante: 2 dias</span>
            </div>
          ))}
      </CollapsiblePrimitive.CollapsibleContent>
    </CollapsiblePrimitive.Collapsible>
  );
};
