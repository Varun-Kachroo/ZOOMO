import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { dark } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });   // ✔ FIXED
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Invalid credentials");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen w-full flex items-center justify-center px-4 transition-colors ${dark ? "bg-black text-white" : "bg-[#f8fffb] text-black"}`}>
      <div className="w-full max-w-md bg-white/80 dark:bg-black/40 
                      backdrop-blur-xl rounded-3xl p-8
                      ring-1 ring-white/10 shadow-[0_20px_60px_-10px_rgba(16,185,129,0.35)] 
                      transition">

        <div className="flex justify-center mb-6">
          <img
            src="/zoomo-logo.png"
            alt="Zoomo Eats"
            className="w-16 h-16 rounded-2xl ring-2 ring-emerald-500/40 shadow-lg"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Welcome Back 👋
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Login to continue your delicious journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/10 
                         text-gray-900 dark:text-white placeholder-gray-500
                         border border-black/10 dark:border-white/10 
                         focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/10 
                         text-gray-900 dark:text-white placeholder-gray-500
                         border border-black/10 dark:border-white/10 
                         focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold
                       hover:brightness-110 active:scale-[.97] transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-emerald-500 hover:underline font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
