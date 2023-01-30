import { useUser } from '@supabase/auth-helpers-react';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

export type ProjectType = {
  id: string;
  name: string;
  description: string;
  users: {
    [key: string]: 'STUDENT' | 'SUPERVISOR';
  };
  createdAt: Date;
};

const DataContext = createContext({
  projects: [] as ProjectType[],
  isLateralMenuOpen: false,
  setIsLateralMenuOpen: null as any,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false);
  const [projects, setProjects] = useState([] as ProjectType[]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const getUserProjects = async () => {
      const { data } = await axios.get('/api/projects');

      setProjects(data.projects);
    };

    getUserProjects();
  }, [user]);

  return (
    <DataContext.Provider
      value={{
        projects,
        isLateralMenuOpen,
        setIsLateralMenuOpen,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useDataContext = () => useContext(DataContext);
