import { styled } from '@stitches/react';
import { UseFormRegister, UseFormRegisterReturn } from 'react-hook-form';
import { IconType } from 'react-icons';

export const Container = styled('main', {
  height: '100vh',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  fontSize: '14px',
});

export const HomeContainer = styled('div', {
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
});

export const Title = styled('div', {
  '& h1': {
    marginLeft: '8px',
    fontSize: '36px',
  },
  display: 'flex',
  lineHeight: '1',
});

export const HomeContent = styled('div', {
  marginTop: '48px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  '& h3': {
    fontWeight: '300',
    fontSize: '30px',
    marginBottom: '48px',
  },

  '& ul': {
    listStyle: 'none',

    '& li': {
      '& svg': {
        marginRight: '4px',
      },
      display: 'flex',
      alignItems: 'center',

      marginBottom: '12px',
      fontSize: '16px',
    },
  },
});

export const LoginContainer = styled('div', {
  backgroundColor: '#3fb0ac',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const LinksContainer = styled('div', {
  marginTop: '4px',
  display: 'flex',
  justifyContent: 'space-between',
});

export const LoginTitle = styled('h2', {
  fontSize: '1.5rem',
  fontWeight: '300',
  color: 'white',
  marginBottom: '24px',
});

export const LoginItems = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
});

const InputContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'white',
  borderRadius: '10px',
  marginBottom: '12px',
});

export const InputField = styled('input', {
  backgroundColor: 'white',
  border: 'none',
  outline: 'none',
  width: '100%',
  padding: '12px 12px',
  borderRadius: '10px',
  fontSize: '14px',
});

export const Input = ({
  icon: Icon,
  type,
  placeholder,
  register,
}: {
  icon?: IconType;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
}) => {
  return (
    <InputContainer>
      {Icon ? (
        <Icon size={16} style={{ marginLeft: '12px' }} color={'#00000088'} />
      ) : (
        <></>
      )}
      <InputField type={type} placeholder={placeholder} {...register} />
    </InputContainer>
  );
};

export const Link = styled('a', {
  fontWeight: 'bold',
  opacity: 0.8,
});
