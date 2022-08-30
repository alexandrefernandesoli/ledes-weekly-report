import { styled } from '@stitches/react';

export const Button = styled('button', {
  fontWeight: 400,
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'black',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '10px',

  variants: {
    uppercase: {
      true: {
        textTransform: 'uppercase',
      },
    },
  },
});
