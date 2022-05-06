import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@stitches/react';

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
  height: '100%',
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

export const LoginItems = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
});

export const LoginTitle = styled('h2', {
  fontSize: '36px',
  fontWeight: 'bold',
  color: 'white',
  marginBottom: '24px',
});

const InputContainer = styled('div', {
  display: 'flex',
  backgroundColor: 'white',
  borderRadius: '10px',
  marginBottom: '12px',
  paddingLeft: '12px',
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

export const Input = (props: any) => {
  return (
    <InputContainer>
      <FontAwesomeIcon color="#00000088" width={14} icon={props.icon} />
      <InputField
        type={props.type}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
      />
    </InputContainer>
  );
};

export const Button = styled('button', {
  fontWeight: 'lighter',
  cursor: 'pointer',
  fontSize: '24px',
  border: 'none',
  backgroundColor: 'black',
  color: 'white',
  padding: '4px',
  borderRadius: '10px',
  margin: '12px 0',
});

export const Link = styled('a', {
  fontWeight: 'bold',
  opacity: 0.8,
});
