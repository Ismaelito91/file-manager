import { createContext, useState } from "react";
import { api } from "../services/apiService";
import useLocalStorage from "../hooks/useLocalStorage";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useLocalStorage("auth_user", null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await api.post("/users/login", credentials);
      localStorage.setItem("auth_token", data.token);
      setAuthUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (form) => {
    setLoading(true);
    try {
      await api.post("/users", form);
      await login({ email: form.email, password: form.password });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
