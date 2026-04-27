import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSession } from '../lib/auth-client';
import { AuthContext } from './auth';

const AuthProvider = ({ children }) => {
  const { data: session, isPending } = useSession();
  const queryClient = useQueryClient();

  const data = session?.response?.data;

  const isLoggedIn = !!data?.user;
  const userData = data?.user || null;

  useEffect(() => {
    if (isPending) return;

    try {
      if (userData) {
        localStorage.setItem('user_data', JSON.stringify({ user: userData }));
      } else {
        localStorage.removeItem('user_data');
      }
    } catch (e) {
      console.error('localStorage error:', e);
    }
  }, [userData, isPending]);

  const logout = async () => {
    const { signOut } = await import('../lib/auth-client');
    queryClient.clear();
    localStorage.removeItem('user_data');
    await signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        isLoggedIn,
        loading: isPending,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
