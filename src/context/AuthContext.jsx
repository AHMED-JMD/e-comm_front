import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const rawUser = localStorage.getItem("userData");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(
    () => localStorage.getItem("authToken") || "",
  );

  const login = ({ user: nextUser, token: nextToken }) => {
    if (nextToken) {
      localStorage.setItem("authToken", nextToken);
      setToken(nextToken);
      localStorage.setItem("isLoggedIn", "true");
    }

    if (nextUser) {
      localStorage.setItem("userData", JSON.stringify(nextUser));
      setUser(nextUser);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("isLoggedIn");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoggedIn: Boolean(token && user),
      login,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
