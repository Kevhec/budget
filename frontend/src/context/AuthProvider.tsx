import {
  createContext, useEffect, useMemo, useReducer,
} from 'react';
import {
  AuthContextType,
  AuthLoginGuest,
  AuthReducer,
  type AuthLoginUser,
} from '@/types';
import { authReducer, initialAuthState } from '@/reducers/auth/authReducer';
import {
  login as loginAction,
  logout as logoutAction,
  checkAuth as checkAuthAction,
  loginGuest as loginGuestAction,
} from '@/reducers/auth/authActions';

interface Props {
  children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer<AuthReducer>(authReducer, initialAuthState);

  useEffect(() => {
    checkAuthAction(dispatch);
  }, []);

  const login = (credentials: AuthLoginUser) => {
    loginAction(dispatch, credentials);
  };

  const logout = () => {
    logoutAction(dispatch);
  };

  const loginGuest = (credentials: AuthLoginGuest) => {
    loginGuestAction(dispatch, credentials);
  };

  const contextValue = useMemo<AuthContextType>(() => ({
    state,
    loginGuest,
    login,
    logout,
  }), [state]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
