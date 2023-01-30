import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { FaAngleDown, FaAngleUp, FaArchive } from 'react-icons/fa';
import { useDataContext } from '../lib/DataContext';
import Link from 'next/link';

export const LateralMenu = () => {
  const { projects, isLateralMenuOpen, setIsLateralMenuOpen } =
    useDataContext();

  return (
    <div className="bg-gray-50 flex flex-col py-4 px-6 text-gray-800 text-md border-t-2 border-dotted">
      <CollapsiblePrimitive.Collapsible
        open={isLateralMenuOpen}
        onOpenChange={setIsLateralMenuOpen}
      >
        <CollapsiblePrimitive.CollapsibleTrigger asChild>
          <div className="flex items-center gap-1 cursor-pointer">
            {isLateralMenuOpen ? <FaAngleUp /> : <FaAngleDown />}
            Projetos Associados
          </div>
        </CollapsiblePrimitive.CollapsibleTrigger>

        <CollapsiblePrimitive.CollapsibleContent>
          <ul className="pl-2">
            {projects.map((project) => (
              <li className="flex gap-1 items-center" key={project.id}>
                <FaArchive />
                <Link href={`/projects/${project.id}`}>{project.name}</Link>
              </li>
            ))}
          </ul>
        </CollapsiblePrimitive.CollapsibleContent>
      </CollapsiblePrimitive.Collapsible>
    </div>
  );
};
