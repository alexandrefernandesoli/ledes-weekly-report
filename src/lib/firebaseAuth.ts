import { useState, useEffect } from 'react';
import { database } from './firebaseConfig';
import {
  getAuth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

export type FormattedUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: string;
};

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

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    const auth = getAuth();

    await createUserWithEmailAndPassword(auth, email, password);

    if (auth.currentUser) {
      updateProfile(auth.currentUser, {
        displayName: name,
      }).then(() => {
        setDoc(doc(database, 'users', auth.currentUser!.uid), {
          name: auth.currentUser?.displayName,
          email: auth.currentUser?.email,
          role: 'STUDENT',
          createdAt: serverTimestamp(),
        });
      });
    }
  };

  const signOut = async (): Promise<void> => getAuth().signOut().then(clear);

  const authStateChanged = async (user: User) => {
    if (!user) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    let formattedUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: 'STUDENT',
    };

    setLoading(true);

    const userRef = doc(database, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      formattedUser.displayName = userSnap.data().name;
      formattedUser.role = userSnap.data().role;
    } else {
      console.log('Sem dados de usuário no database');
    }

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
