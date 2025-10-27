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
    // remove data
    removeStoredData('user_data');
    setStoredData('loggedIn', false);

    // reset value
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
