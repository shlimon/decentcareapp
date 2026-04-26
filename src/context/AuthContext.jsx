import { useQueryClient } from '@tanstack/react-query';
import { useSession } from "../lib/auth-client";
import { AuthContext } from './auth';

const AuthProvider = ({ children }) => {
  const { data: session, isPending } = useSession();
  const queryClient = useQueryClient();

  const isLoggedIn = !!session?.user;
  const userData = session?.user || null;
  const loading = isPending;

  // better-auth handles logout via signOut method, 
  // but if components expect a 'logout' function from context:
  const logout = async () => {
    const { signOut } = await import("../lib/auth-client");
    queryClient.clear();
    await signOut();
  };

  // Components might still expect 'login' function, but with Better Auth 
  // login is handled by the signIn method which updates the session state automatically.
  const login = () => {
    // No-op or handle specific logic if needed
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        isLoggedIn,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
