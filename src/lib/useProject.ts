import useSWR, { KeyedMutator } from 'swr';
import axios, { AxiosResponse } from 'axios';
import { Database } from '../../types/supabase';

export type ProjectType = Database['public']['Tables']['projects']['Row'] & {
  myRole: 'SUPERVISOR' | 'STUDENT';
  users: Database['public']['Tables']['projects']['Row'][];
  reports: Database['public']['Tables']['projects']['Row'][];
};

export const useProject = (
  projectId: string
): {
  project: ProjectType;
  error: any;
  isLoading: boolean;
  mutate: KeyedMutator<AxiosResponse>;
} => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/projects?projectId=${projectId}`,
    axios
  );

  return { project: data?.data.project, error, isLoading, mutate };
};
