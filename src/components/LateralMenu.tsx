import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useDataContext } from '../lib/DataContext';
import { styled } from '../stitches.config';
import { Flex, LateralMenuContainer } from './Containers';
import Link from 'next/link';

const CollapsibleContent = styled(CollapsiblePrimitive.CollapsibleContent, {
  overflow: 'hidden',
});

const List = styled('ul', {
  listStyle: 'inside',
});

export const LateralMenu = () => {
  const { projects, isLateralMenuOpen, setIsLateralMenuOpen } =
    useDataContext();

  return (
    <LateralMenuContainer>
      <CollapsiblePrimitive.Collapsible
        open={isLateralMenuOpen}
        onOpenChange={setIsLateralMenuOpen}
      >
        <Flex css={{ alignItems: 'center' }}>
          <CollapsiblePrimitive.CollapsibleTrigger asChild>
            <Flex
              css={{
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              {isLateralMenuOpen ? <FaAngleUp /> : <FaAngleDown />}
              Projetos Associados
            </Flex>
          </CollapsiblePrimitive.CollapsibleTrigger>
        </Flex>

        <CollapsibleContent>
          <List css={{ paddingLeft: 20 }}>
            {projects.map((project) => (
              <li key={project.id}>
                <Link href={`/projects/${project.id}`}>{project.name}</Link>
              </li>
            ))}
          </List>
        </CollapsibleContent>
      </CollapsiblePrimitive.Collapsible>
    </LateralMenuContainer>
  );
};
