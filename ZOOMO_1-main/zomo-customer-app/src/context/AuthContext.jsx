import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================================
     RESTORE SESSION ON REFRESH
  ========================================== */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/users/me")
      .then((res) => {
        if (!res || res.role !== "USER") {
          console.warn("🚫 Invalid/merchant token detected → logout");
          return logout();
        }
        setUser(res);
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  /* =========================================
      LOGIN (CUSTOMER ONLY)
  ========================================== */
  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });

    const token = res.access_token;
    const userData = res.user;

    if (!token || !userData) throw new Error("❌ Invalid login response from server");
    if (userData.role !== "USER") throw new Error("🚫 Please login from Merchant app!");

    localStorage.setItem("access_token", token);
    setUser(userData);
    return userData;
  };

  /* =========================================
      SIGNUP → auto-login
  ========================================== */
  const signup = async (form) => {
    const res = await api.post("/auth/signup", form);

    const token = res.access_token;
    const userData = res.user;

    if (!token) throw new Error("❌ Signup didn't return token");

    localStorage.setItem("access_token", token);
    setUser(userData);
    return userData;
  };

  /* =========================================
      LOGOUT
  ========================================== */
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isUser: user?.role === "USER",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
