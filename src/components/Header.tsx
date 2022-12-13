import { mauve, violet } from '@radix-ui/colors';
import * as Avatar from '@radix-ui/react-avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { keyframes } from '@stitches/react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import { BiCalendar, BiMessage } from 'react-icons/bi';
import { CgLogOut, CgOptions } from 'react-icons/cg';
import { FaMailBulk, FaRegBell } from 'react-icons/fa';
import { styled } from '../stitches.config';

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
  backgroundColor: 'rgba(0,0,0,0.03)',
  color: '#3fb0ac',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
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
  justifyContent: 'space-between',

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
  const router = useRouter();

  const signOutHandler = async () => {
    await supabaseClient.auth.signOut();

    router.replace('/login');
  };

  return (
    <div className="flex bg-gray-50 justify-between items-center px-4 h-16 text-lg">
      <div
        className="flex gap-2 cursor-pointer items-center leading-5"
        onClick={() => router.push('/')}
      >
        <FaMailBulk size={48} color="#3fb0ac" />
        Ledes Weekly <br /> Report
      </div>

      <div className="flex flex-column items-center justify-center gap-3 text-primary">
        <BiCalendar
          size={30}
          className="cursor-pointer  transition-colors hover:text-gray-700"
        />
        <FaRegBell
          size={30}
          className="cursor-pointer  transition-colors hover:text-gray-700"
        />
        <BiMessage
          size={30}
          className="cursor-pointer  transition-colors hover:text-gray-700"
        />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <StyledAvatar>
              <StyledImage />
              <StyledFallback>AF</StyledFallback>
            </StyledAvatar>
          </DropdownMenu.Trigger>

          <StyledContent className="bg-gray-50 rounded-lg p-2">
            <DropdownMenu.Item
              className="text-red-800 cursor-pointer flex text-sm justify-between gap-1 items-center"
              onClick={signOutHandler}
            >
              Sair
              <CgLogOut size={24} />
            </DropdownMenu.Item>
          </StyledContent>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};
