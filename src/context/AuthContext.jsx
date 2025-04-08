import { useEffect, useState } from "react";
import { removeStoredData, setStoredData } from "../utils/manageLocalData";
import { AuthContext } from "./auth";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const loggedInStatus = localStorage.getItem("loggedIn");

    setToken(storedToken);
    setIsLoggedIn(JSON.parse(loggedInStatus));

    setLoading(false);
  }, []);

  const login = (token) => {
    setStoredData("token", token);
    setStoredData("loggedIn", true);
    setToken(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    removeStoredData("token");
    removeStoredData("loggedIn");
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
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
