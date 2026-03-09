import { useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const { dark } = useContext(ThemeContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signup(form);

      if (res?.statusCode === 400) {
        setError(res.message || "Signup failed");
        setLoading(false);
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center px-4 transition-colors 
        ${dark ? "bg-black text-white" : "bg-[#f8fffb] text-black"}`}
    >
      <div
        className="w-full max-w-md bg-white/80 dark:bg-black/40 backdrop-blur-xl
        rounded-3xl p-8 ring-1 ring-white/10 shadow-[0_20px_60px_-10px_rgba(16,185,129,0.35)]
        transition"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/zoomo-logo.png"
            alt="Zoomo Eats"
            className="w-16 h-16 rounded-2xl ring-2 ring-emerald-500/40 shadow-lg"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Create Account ✨
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Join Zoomo Eats and start your delicious journey!
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/10 
              text-gray-900 dark:text-white border border-black/10 dark:border-white/10 
              focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/10 
              text-gray-900 dark:text-white border border-black/10 dark:border-white/10
              focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/10 
              text-gray-900 dark:text-white border border-black/10 dark:border-white/10
              focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Create a strong password"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Phone (optional)</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/10 
              text-gray-900 dark:text-white border border-black/10 dark:border-white/10
              focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Your phone number"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold
            hover:brightness-110 active:scale-[.97] transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Login redirect */}
        <p className="mt-5 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-500 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
