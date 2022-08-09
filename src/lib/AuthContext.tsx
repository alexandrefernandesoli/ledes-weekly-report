import { Auth, withSSRContext } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { useEffect } from 'react';
import { createContext, Dispatch, useContext, useState } from 'react';
import Router, { useRouter } from 'next/router';

type AuthContextType = {
  user: CognitoUser | null;
  setUser: Dispatch<CognitoUser>;
  signIn: (email: string, password: string) => Promise<CognitoUser>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<CognitoUser | null>(null);

  const signOut = async () => {
    await Auth.signOut();
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<CognitoUser> => {
    const user = await Auth.signIn(email, password);

    setUser(user);

    return user;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
