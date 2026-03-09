import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDriverAuth } from "../context/DriverAuthContext";
import { driverLogin } from "../services/driverApi";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useDriverAuth();
  const { isDark, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      setLoading(true);
      const data = await driverLogin(email, password);
      login(data);
      navigate("/home");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gray-50 dark:bg-black">
      {/* Subtle background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-sm">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="absolute right-0 -top-12 p-2 rounded-full
                     border border-black/10 dark:border-white/10
                     bg-white/80 dark:bg-white/10 backdrop-blur"
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Card */}
        <div
          className="rounded-3xl p-6
                     bg-white/90 dark:bg-[#121212]
                     border border-black/5 dark:border-white/10
                     shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]
                     backdrop-blur"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/zoomo-logo.png"
              alt="Zoomo"
              className="h-10 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold">
              Driver Login
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Start delivering with Zoomo
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent mb-6" />

          {/* Form */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />

            {error && (
              <p className="text-sm text-red-600 text-center">
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold
                         bg-emerald-600 text-white
                         hover:bg-emerald-700 transition
                         active:scale-[0.98]
                         disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
          Use your registered driver credentials
        </p>
      </div>
    </div>
  );
}
