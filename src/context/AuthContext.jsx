import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useSession } from '../lib/auth-client';
import { AuthContext } from './auth';

const AuthProvider = ({ children }) => {
  const { data: session, isPending } = useSession();
  const queryClient = useQueryClient();

  const [hasResolved, setHasResolved] = useState(false);

  const [stableUser, setStableUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user_data');
      return stored ? JSON.parse(stored).user : null;
    } catch {
      return null;
    }
  });

  const userData = session?.response?.data?.user || null;
  const nullTimerRef = useRef(null);

  useEffect(() => {
    if (!isPending) {
      setHasResolved(true);
    }
  }, [isPending]);

  useEffect(() => {
    if (userData) {
      // User appeared — cancel any pending null and update immediately
      if (nullTimerRef.current) {
        clearTimeout(nullTimerRef.current);
        nullTimerRef.current = null;
      }
      setStableUser(userData);
    } else {
      // User disappeared — wait briefly to see if it's just a refetch flicker
      nullTimerRef.current = setTimeout(() => {
        setStableUser(null);
      }, 500);
    }

    return () => {
      if (nullTimerRef.current) {
        clearTimeout(nullTimerRef.current);
      }
    };
  }, [userData]);

  useEffect(() => {
    if (!hasResolved) return;
    try {
      if (stableUser) {
        localStorage.setItem('user_data', JSON.stringify({ user: stableUser }));
      } else {
        localStorage.removeItem('user_data');
      }
    } catch (e) {
      console.error('localStorage error:', e);
    }
  }, [stableUser, hasResolved]);

  const logout = async () => {
    const { signOut } = await import('../lib/auth-client');
    queryClient.clear();
    localStorage.removeItem('user_data');
    if (nullTimerRef.current) clearTimeout(nullTimerRef.current);
    setStableUser(null);
    await signOut();
  };

  const loading = !hasResolved && !stableUser;

  return (
    <AuthContext.Provider
      value={{
        userData: stableUser,
        isLoggedIn: !!stableUser,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
