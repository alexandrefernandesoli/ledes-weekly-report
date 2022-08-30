import { mauve, violet } from '@radix-ui/colors';
import * as Avatar from '@radix-ui/react-avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { keyframes } from '@stitches/react';
import { useRouter } from 'next/router';
import { CgLogOut } from 'react-icons/cg';
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
  cursor: 'pointer',
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

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const contentStyles = {
  minWidth: 60,
  backgroundColor: 'white',
  borderRadius: 6,
  padding: 5,
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform, opacity',
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
};

const StyledContent = styled(DropdownMenu.Content, {
  ...contentStyles,
});

const itemStyles = {
  all: 'unset',
  fontSize: 14,
  lineHeight: 1,
  color: '$primary',
  borderRadius: 3,
  display: 'flex',
  alignItems: 'center',
  height: 25,
  padding: '0 5px',
  position: 'relative',
  userSelect: 'none',
  cursor: 'pointer',

  '&[data-disabled]': {
    color: mauve.mauve8,
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    backgroundColor: violet.violet9,
    color: violet.violet1,
  },
};

const StyledItem = styled(DropdownMenu.Item, { ...itemStyles });

export const Header = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const signOutHandler = async () => {
    await signOut();

    router.push('/');
  };

  return (
    <StyledHeader>
      <Flex
        css={{ justifyContent: 'center', gap: 12, cursor: 'pointer' }}
        onClick={() => router.push('/main')}
      >
        <FaMailBulk size={48} color="#3fb0ac" />
        Ledes Weekly <br /> Report
      </Flex>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <StyledAvatar>
            <StyledImage />
            <StyledFallback>AF</StyledFallback>
          </StyledAvatar>
        </DropdownMenu.Trigger>

        <StyledContent>
          <StyledItem onClick={signOutHandler}>
            <CgLogOut size={24} />
            Sair
          </StyledItem>
        </StyledContent>
      </DropdownMenu.Root>
    </StyledHeader>
  );
};
