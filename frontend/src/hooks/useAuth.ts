import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/context/AuthProvider';

function useAuth(): AuthContextType {
  const authContext = useContext(AuthContext);
  if (authContext === undefined || authContext === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContext;
}

export default useAuth;
