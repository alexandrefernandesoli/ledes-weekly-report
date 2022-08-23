import { createContext, useContext } from 'react';
import { useFirebaseAuth, FormattedUser } from './firebaseAuth';

type AuthContextType = {
  authUser: FormattedUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  loading: true,
  signIn: async (email: string, password: string) => {},
  signUp: async (email: string, password: string) => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useFirebaseAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
