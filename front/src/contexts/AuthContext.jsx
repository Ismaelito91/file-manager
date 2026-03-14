import { createContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useLocalStorage("auth_user", null);
  const [loading, setLoading] = useState(false);

  const login = (credentials) => {};

  const logout = () => {
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
