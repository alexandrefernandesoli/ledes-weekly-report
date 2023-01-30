import { styled } from '../stitches.config';

export const Flex = styled('div', { display: 'flex' });

export const MainContainer = styled('main', {
  display: 'grid',
  gridTemplateColumns: '230px 1fr',
  minHeight: 'calc(100vh - 65px)',
});

export const LateralMenuContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '12px',
});

export const ContentContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '$primary',
});

export const ReportsContainer = styled('div', {
  display: 'flex',
  gap: '12px',
  flexDirection: 'column',
  width: '100%',
  justifyItems: 'center',
  padding: '0 12px',
  span: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: '12px',
    alignSelf: 'end',
  },
});
