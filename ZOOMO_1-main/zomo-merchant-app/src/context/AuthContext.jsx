// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Logout (shared)
  const logout = () => {
    localStorage.removeItem("zomo_token");
    setUser(null);
  };

  // ✅ Load merchant user (lightweight)
  const loadUser = async () => {
    try {
      const token = localStorage.getItem("zomo_token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Since merchant backend does not expose /me,
      // we trust token existence + role enforcement on backend
      setUser({ role: "MERCHANT" });
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ✅ MERCHANT LOGIN
  const login = async (data) => {
    const res = await api.post("/merchant/auth/login", data);
    localStorage.setItem("zomo_token", res.data.access_token);
    await loadUser();
  };

  // ✅ MERCHANT SIGNUP
  const signup = async (data) => {
    const res = await api.post("/merchant/auth/signup", {
      name: data.name,
      email: data.email,
      phone: data.phone, // REQUIRED for merchant
      password: data.password,
    });

    localStorage.setItem("zomo_token", res.data.access_token);
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
