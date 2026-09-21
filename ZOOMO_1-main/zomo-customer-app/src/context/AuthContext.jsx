import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================================
     RESTORE SESSION ON REFRESH
  ========================================= */
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
          logout();
          return;
        }
        setUser(res);
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  /* =========================================
     LOGIN (CUSTOMER ONLY)
  ========================================= */
  // ✅ FIX: accepts (email, password) as two args — matches how Login.jsx calls it
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    // ✅ FIX: backend returns "accesstoken" not "access_token"
    const token = res.accesstoken ?? res.access_token;
    const userData = res.user;

    // ✅ FIX: api.js never throws on 4xx/5xx — it just resolves with the
    // error body NestJS sends back ({ message, statusCode, error }).
    // Surface that real message instead of a generic one whenever we
    // don't get a token back, so e.g. "Invalid email or password" or
    // "This account uses Google Sign-In" actually reaches the person.
    if (!token || !userData) throw new Error(res.message || "Invalid login response from server");
    if (userData.role !== "USER") throw new Error("Please login from the Merchant app.");

    localStorage.setItem("access_token", token);
    setUser(userData);
    return userData;
  };

  /* =========================================
     SIGNUP → auto-login
  ========================================= */
  const signup = async (form) => {
    const res = await api.post("/auth/signup", form);

    // ✅ FIX: backend returns "accesstoken" not "access_token"
    const token = res.accesstoken ?? res.access_token;
    const userData = res.user;

    if (!token || !userData) throw new Error(res.message || "Signup failed — please try again.");

    localStorage.setItem("access_token", token);
    setUser(userData);
    return userData;
  };

  /* =========================================
     GOOGLE SIGN-IN — used by both Login and Signup pages.
     `credential` is the ID token string Google's button hands back.
  ========================================= */
  const loginWithGoogle = async (credential) => {
    const res = await api.post("/auth/google", { credential });

    const token = res.accesstoken ?? res.access_token;
    const userData = res.user;

    if (!token || !userData) throw new Error(res.message || "Google sign-in failed — please try again.");
    if (userData.role !== "USER") throw new Error("This email belongs to a merchant/staff account.");

    localStorage.setItem("access_token", token);
    setUser(userData);
    return userData;
  };

  /* =========================================
     LOGOUT
  ========================================= */
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
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
