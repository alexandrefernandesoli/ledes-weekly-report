import axios from 'axios';
import useSWR from 'swr';

type Report = {
  id: string;
  content: string;
  projectName: string;
  userId: string;
  projectId: string;
  createdAt: Date;
};

export const useReports = (): {
  reports: Report[];
  error: any;
  isLoading: boolean;
} => {
  const { data, error, isLoading } = useSWR('/api/reports', axios);

  return {
    reports: data?.data.reports,
    error,
    isLoading,
  };
};
