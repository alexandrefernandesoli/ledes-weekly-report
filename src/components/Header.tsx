import * as Avatar from '@radix-ui/react-avatar';
import { useRouter } from 'next/router';
import { FaMailBulk } from 'react-icons/fa';
import { useAuth } from '../lib/AuthContext';
import { styled } from '../stitches.config';

const Flex = styled('div', { display: 'flex' });

const StyledAvatar = styled(Avatar.Root, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  width: 45,
  height: 45,
  borderRadius: '100%',
});

const StyledImage = styled(Avatar.Image, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 'inherit',
});

const StyledFallback = styled(Avatar.Fallback, {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.02)',
  color: '#3fb0ac',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
});

const StyledHeader = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '65px',
  padding: '12px',
  boxShadow: '0 0 1px rgba(0, 0, 0, 0.4)',
});

export const Header = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const signOutHandler = async () => {
    await signOut();

    router.push('/');
  };

  return (
    <StyledHeader>
      <Flex css={{ justifyContent: 'center', gap: 12 }}>
        <FaMailBulk size={48} color="#3fb0ac" />
        Ledes Weekly <br /> Report
      </Flex>
      <div>
        <StyledAvatar>
          <StyledImage />
          <StyledFallback>AF</StyledFallback>
        </StyledAvatar>
        <button onClick={signOutHandler}>Sair</button>
      </div>
    </StyledHeader>
  );
};
