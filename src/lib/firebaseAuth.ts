import { useState, useEffect } from 'react';
import {
  getAuth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  child,
  get,
  ref, set
} from 'firebase/database'
import './firebaseConfig';
import { database } from './firebaseConfig';

export type FormattedUser = {
  uid: string;
  email: string | null;
  displayName: string | null,
};

const formatAuthUser = (user: User): FormattedUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
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

  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    const auth = getAuth()

    await createUserWithEmailAndPassword(auth, email, password)

    if(auth.currentUser){
      updateProfile(auth.currentUser, {
        displayName: name
      }).then(() => {
        set(ref(database, 'users/' + auth.currentUser!.uid + "/profile"), {
          name: auth.currentUser?.displayName,
          email: auth.currentUser?.email,
          role: 0
        })
      })
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
      displayName: user.displayName
    };

    setLoading(true);

    get(child(ref(database), `users/${user.uid}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());

        formattedUser.displayName = snapshot.val().profile.name
      } else {
        console.log('Sem dados');
      }
    })
    .catch((err) => {
      console.log("erro aqui", err);
    });
    
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
