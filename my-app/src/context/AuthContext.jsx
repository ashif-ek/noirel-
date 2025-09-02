// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // this will be userId

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (userId) => {
    localStorage.setItem("userId", userId);
    setUser(userId);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
