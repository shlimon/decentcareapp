import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSession } from '../lib/auth-client';
import { AuthContext } from './auth';

const AuthProvider = ({ children }) => {
  const { data: session, isPending } = useSession();
  const queryClient = useQueryClient();

  const [cachedUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user_data');
      return stored ? JSON.parse(stored).user : null;
    } catch {
      return null;
    }
  });

  const [hasResolved, setHasResolved] = useState(false);

  // ✅ Correct path for Better Auth
  const userData = session?.response?.data?.user || null;

  useEffect(() => {
    if (!isPending) setHasResolved(true);
  }, [isPending]);

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

  // Use cached user while first session fetch is in flight
  const effectiveUser = hasResolved ? userData : (cachedUser ?? userData);

  // Only block render on very first load with no cache
  const loading = isPending && !hasResolved && !cachedUser;

  return (
    <AuthContext.Provider
      value={{
        userData: effectiveUser,
        isLoggedIn: !!effectiveUser,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
