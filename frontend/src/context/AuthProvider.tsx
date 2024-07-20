import {
  createContext, useEffect, useMemo, useState,
} from 'react';
import { authUser, logOut, createGuest } from '@/lib/auth';
import { AuthResponse, MessageResponse, User } from '@/types';

interface Props {
  children: React.ReactNode
}

export interface AuthContextType {
  auth: User
  setAuth: React.Dispatch<React.SetStateAction<User>>
  logOut: () => Promise<MessageResponse>
  loading: boolean
  createGuest: ({ username }: { username: string }) => Promise<AuthResponse>
}

const initialAuthState = {
  id: null,
  username: null,
  role: null,
  confirmed: false,
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: Props) {
  const [auth, setAuth] = useState<User>(initialAuthState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAuth = async () => {
      try {
        setLoading(true);
        const newAuth = await authUser();
        setAuth(newAuth.data);
      } catch (error: any) {
        throw new Error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getAuth();
  }, []);

  /*   const checkAuth = async () => {
    try {
      setLoading(true);
      const newAuth = await authUser();
      setAuth(newAuth.data);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  }; */

  const contextValue = useMemo<AuthContextType>(() => ({
    auth,
    loading,
    setAuth,
    createGuest,
    logOut,
  }), [auth, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
