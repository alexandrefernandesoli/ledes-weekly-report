import {
  collection,
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  where,
  WithFieldValue,
} from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { database } from './firebaseConfig';

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

const projectConverter = {
  toFirestore: (project: WithFieldValue<ProjectType>): DocumentData => {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      users: project.users,
      createdAt: Date,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      description: data.description,
      users: data.users,
      createdAt: data.createdAt.toDate(),
    } as ProjectType;
  },
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isLateralMenuOpen, setIsLateralMenuOpen] = useState(false);
  const [projects, setProjects] = useState([] as ProjectType[]);
  const { authUser } = useAuth();

  useEffect(() => {
    const getUserProjects = async () => {
      const newProjects = [] as ProjectType[];

      if (authUser) {
        const q = query(
          collection(database, 'projects'),
          where(`users.${authUser!.uid}`, 'in', ['SUPERVISOR', 'STUDENT'])
        ).withConverter(projectConverter);

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          newProjects.push(doc.data());
        });

        newProjects.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );

        setProjects(newProjects);
      }
    };

    getUserProjects();
  }, [authUser]);

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
