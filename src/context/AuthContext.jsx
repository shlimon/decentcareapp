import { getStoredData } from "../utils/manageLocalData";
import { AuthContext } from "./auth";

const AuthProvider = ({ children }) => {
  const isLoggedIn = getStoredData("loggedIn");
  const token = getStoredData("token");
  return (
    <AuthContext.Provider value={{ isLoggedIn, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
