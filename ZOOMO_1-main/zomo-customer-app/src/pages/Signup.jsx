import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiPhone } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { name: "name", label: "Full Name", type: "text", icon: FiUser, placeholder: "Your full name" },
    { name: "email", label: "Email", type: "email", icon: FiMail, placeholder: "you@example.com" },
    { name: "password", label: "Password", type: "password", icon: FiLock, placeholder: "Create a strong password" },
    { name: "phone", label: "Phone (optional)", type: "tel", icon: FiPhone, placeholder: "Your phone number" },
  ];

  return (
    <div className="min-h-screen bg-z-page flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/zoomo-mascot.png" alt="Zoomo" className="w-20 h-20 mx-auto mb-3 animate-float" />
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="text-gray-500 text-sm mt-1">Join Zoomo Eats and start ordering!</p>
        </div>

        <div className="bg-z-card border border-white/10 rounded-3xl p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(f => (
              <div key={f.name} className="space-y-1.5">
                <label className="text-sm text-gray-400">{f.label}</label>
                <div className="relative">
                  <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                  <input
                    name={f.name} type={f.type} value={form[f.name]} onChange={change}
                    required={f.name !== "phone"} placeholder={f.placeholder}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-z-accent text-sm"
                  />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-z-primary hover:bg-z-hover text-white font-semibold transition disabled:opacity-50 mt-2">
              {loading ? "Creating account..." : "Sign Up 🎉"}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-z-accent hover:underline font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}