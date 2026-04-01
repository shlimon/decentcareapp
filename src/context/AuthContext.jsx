import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  getStoredData,
  removeStoredData,
  setStoredData,
} from '../utils/manageLocalData';
import { AuthContext } from './auth';

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const queryClient = useQueryClient();

  useEffect(() => {
    const loggedInStatus = getStoredData('loggedIn');
    const userData = getStoredData('user_data');

    // set values
    setIsLoggedIn(JSON.parse(loggedInStatus));
    setUserData(userData);
    setLoading(false);
  }, []);

  const login = (response) => {
    // store local storage
    setStoredData('user_data', response);
    setStoredData('loggedIn', true);

    // set value
    setIsLoggedIn(true);
    setUserData(response);
  };

  const logout = () => {
    // Clear React Query cache
    queryClient.clear();

    // remove stored data
    removeStoredData('user_data');
    setStoredData('loggedIn', false);

    // reset state
    setIsLoggedIn(false);
    setUserData({});
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
