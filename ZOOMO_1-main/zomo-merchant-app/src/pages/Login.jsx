// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) return setError("Email & password required");

    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

      {/* FULL BACKGROUND FIX */}
      <div className="absolute inset-0 bg-white dark:bg-black" />

      {/* OPTIONAL GRADIENT SIDES (like in your screenshot) */}
      <div className="absolute left-0 top-0 w-1/4 h-full bg-gradient-to-r from-rose-50 dark:from-[#1a1a1a] to-transparent" />
      <div className="absolute right-0 top-0 w-1/4 h-full bg-gradient-to-l from-rose-50 dark:from-[#1a1a1a] to-transparent" />

      <div className="relative z-10 w-full max-w-md p-8
        bg-white/95 dark:bg-[#141414] rounded-3xl border border-black/5 dark:border-white/10 shadow-xl">

        <div className="text-center mb-6">
          <img src="/zoomo-logo.png" alt="Zoomo" className="w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Merchant Login</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sign in to manage your restaurant
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-300 px-4 py-2 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="input-zoomo mt-1"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="input-zoomo mt-1"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn-zoomo w-full mt-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
          Don’t have a merchant account?{" "}
          <Link to="/signup" className="text-emerald-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
