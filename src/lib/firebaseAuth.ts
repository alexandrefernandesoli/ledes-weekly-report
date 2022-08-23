import { useState, useEffect } from 'react';
import {
  getAuth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import './firebaseConfig';

export type FormattedUser = {
  uid: string;
  email: string | null;
};

const formatAuthUser = (user: User): FormattedUser => ({
  uid: user.uid,
  email: user.email,
});

export function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<FormattedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(getAuth(), email, password);
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(getAuth(), email, password);
  };

  const signOut = async (): Promise<void> => getAuth().signOut().then(clear);

  const authStateChanged = async (authState: User) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    var formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(authStateChanged as any);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
