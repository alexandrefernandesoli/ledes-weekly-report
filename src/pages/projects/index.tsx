import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Projects = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.query.projectId) router.push('/main');
  });

  return <></>;
};

export default Projects;
