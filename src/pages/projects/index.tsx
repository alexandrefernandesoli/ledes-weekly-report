import { GetServerSidePropsContext } from 'next';

const Projects = () => {
  return <></>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  if (!ctx.params?.projectId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default Projects;
