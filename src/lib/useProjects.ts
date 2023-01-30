import axios from 'axios';
import useSWR from 'swr';

type Project = {
  id: string;
  name: string;
  description: string;
  users: {
    [key: string]: 'STUDENT' | 'SUPERVISOR';
  };
  createdAt: Date;
};

export const useProjects = (): {
  projects: Project[];
  error: any;
  isLoading: boolean;
} => {
  const { data, error, isLoading } = useSWR('/api/projects', axios);

  return {
    projects: data?.data.projects,
    error,
    isLoading,
  };
};
