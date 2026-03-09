// src/pages/Signup.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone || !form.password)
      return setError("All fields are required");

    if (form.phone.length < 10)
      return setError("Enter a valid phone number");

    try {
      setLoading(true);
      await signup(form);
      navigate("/dashboard");
    } catch {
      setError("Signup failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

      {/* Full-screen background */}
      <div className="absolute inset-0 bg-white dark:bg-black" />

      {/* Soft gradient sides */}
      <div className="absolute left-0 top-0 w-1/4 h-full bg-gradient-to-r from-rose-50 dark:from-[#1a1a1a] to-transparent" />
      <div className="absolute right-0 top-0 w-1/4 h-full bg-gradient-to-l from-rose-50 dark:from-[#1a1a1a] to-transparent" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md
        p-8 rounded-3xl
        bg-white/95 dark:bg-[#141414]
        border border-black/5 dark:border-white/10
        shadow-xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <img src="/zoomo-logo.png" alt="Zoomo" className="w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Merchant Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Start managing your restaurant on Zoomo
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-300 px-4 py-2 rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {[
            { label: "Full Name", key: "name" },
            { label: "Email Address", key: "email", type: "email" },
            { label: "Phone Number", key: "phone", type: "tel" },
            { label: "Password", key: "password", type: "password" },
          ].map(({ label, key, type = "text" }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
              </label>
              <input
                type={type}
                className="input-zoomo"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}

          <button
            type="submit"
            className="btn-zoomo w-full mt-1 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
          Already have a merchant account?{" "}
          <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
