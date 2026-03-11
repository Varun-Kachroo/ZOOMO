import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) setAdmin(token);
    setLoading(false);
  }, []);

  async function login(email, password) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin/auth/login`,
        { email, password }
      );
      const token = res.data.accessToken;
      localStorage.setItem('adminToken', token);
      setAdmin(token);
      return true;
    } catch {
      return false;
    }
  }

  function logout() {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  }

  if (loading) return null;

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
