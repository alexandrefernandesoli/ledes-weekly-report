import { styled } from '@stitches/react';

export const Button = styled('button', {
  fontWeight: 500,
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'black',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '10px',

  variants: {
    uppercase: {
      true: {
        textTransform: 'uppercase',
      },
    },
  },
});
