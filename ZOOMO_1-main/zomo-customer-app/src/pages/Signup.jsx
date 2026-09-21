import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleButton from "../components/GoogleButton";

const C = {
  page:"#F4F7F5", surface:"#FFFFFF", primary:"#0F3D2D", hover:"#164A39",
  accent:"#1F7A52", textMain:"#0C1612", textSub:"#6B7280", textMuted:"#9CA3AF",
  border:"#DCE6E0", borderSoft:"#EEF3F0", error:"#DC2626",
};

const LOGO_URL = "https://res.cloudinary.com/dx2qaarhy/image/upload/v1789420327/2bb606dc-2292-40ba-a4e8-df6720a3b700.png";

function ZMark() {
  return (
    <img
      src={LOGO_URL}
      alt="Zoomo Eats"
      style={{ width:48, height:48, borderRadius:16, objectFit:"contain", flexShrink:0 }}
    />
  );
}

function InputField({ label, type="text", value, onChange, placeholder, icon: Icon, required, name }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ color:C.textSub, fontSize:13, fontWeight:500 }}>{label}</label>
      <div style={{ position:"relative", display:"flex", alignItems:"center",
        border:`1.5px solid ${focused ? C.primary : C.border}`,
        borderRadius:12, background:C.surface,
        boxShadow: focused ? `0 0 0 3px ${C.primary}18` : "none",
        transition:"border-color 120ms, box-shadow 120ms" }}>
        {Icon && (
          <div style={{ position:"absolute", left:14, color: focused ? C.primary : C.textMuted,
            display:"flex", alignItems:"center", pointerEvents:"none",
            transition:"color 120ms" }}>
            <Icon />
          </div>
        )}
        <input
          name={name} type={type} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          required={required} placeholder={placeholder}
          style={{ width:"100%", height:48, paddingLeft: Icon ? 42 : 14, paddingRight:14,
            border:"none", outline:"none", background:"transparent",
            color:C.textMain, fontSize:15, fontFamily:"inherit" }}
        />
      </div>
    </div>
  );
}

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const EyeIcon = ({ open }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
    }
  </svg>
);

export default function Signup() {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Signup failed. That email may already be in use.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleCredential(credential) {
    setError("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle(credential);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:C.page,
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"24px 16px", fontFamily:"'Satoshi', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');
        * { box-sizing: border-box; }
        body { background: ${C.page} !important; }
        html.dark body { background: ${C.page} !important; }
        input::placeholder { color: #9CA3AF; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .signup-card { animation: fadeUp 0.35s ease-out both; }
      `}</style>

      <div style={{ width:"100%", maxWidth:440 }}>
        <div className="signup-card" style={{ background:C.surface, borderRadius:28,
          boxShadow:"0 10px 48px rgba(15,61,46,0.10)",
          border:`1px solid ${C.borderSoft}`, overflow:"hidden" }}>

          {/* Header strip */}
          <div style={{ background:`linear-gradient(135deg, ${C.primary} 0%, ${C.hover} 100%)`,
            padding:"32px 32px 28px", textAlign:"center" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:18 }}>
              <ZMark />
            </div>
            <h1 style={{ color:"#fff", fontSize:26, fontWeight:700, lineHeight:"34px",
              letterSpacing:"-0.015em", marginBottom:6 }}>
              Create your account
            </h1>
            <p style={{ color:"rgba(255,255,255,0.62)", fontSize:14 }}>
              Join thousands ordering smarter every day
            </p>
          </div>

          {/* Form */}
          <div style={{ padding:"28px 32px 32px" }}>
            {error && (
              <div style={{ marginBottom:16, padding:"12px 16px", borderRadius:12,
                background:`${C.error}10`, border:`1px solid ${C.error}30`,
                color:C.error, fontSize:13, display:"flex", alignItems:"center", gap:8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <InputField label="Full name" name="name" value={form.name}
                onChange={change} placeholder="Your full name"
                icon={UserIcon} required />

              <InputField label="Email address" type="email" name="email" value={form.email}
                onChange={change} placeholder="you@example.com"
                icon={MailIcon} required />

              <InputField label="Phone number" type="tel" name="phone" value={form.phone}
                onChange={change} placeholder="+91 98765 43210"
                icon={PhoneIcon} />

              {/* Password with show/hide */}
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <label style={{ color:C.textSub, fontSize:13, fontWeight:500 }}>Password</label>
                <div style={{ position:"relative", display:"flex", alignItems:"center",
                  border:`1.5px solid ${C.border}`, borderRadius:12, background:C.surface,
                  transition:"border-color 120ms, box-shadow 120ms" }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primary}18`; }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ position:"absolute", left:14, color:C.textMuted, display:"flex", pointerEvents:"none" }}>
                    <LockIcon />
                  </div>
                  <input
                    name="password"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={change}
                    required
                    placeholder="Create a password"
                    style={{ width:"100%", height:48, paddingLeft:42, paddingRight:44,
                      border:"none", outline:"none", background:"transparent",
                      color:C.textMain, fontSize:15, fontFamily:"inherit" }}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position:"absolute", right:12, background:"none", border:"none",
                      color:C.textMuted, cursor:"pointer", display:"flex", alignItems:"center",
                      padding:4 }}>
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{ width:"100%", height:50, borderRadius:12, border:"none",
                  background: loading ? C.textMuted : `linear-gradient(135deg, ${C.primary} 0%, ${C.hover} 100%)`,
                  color:"#fff", fontWeight:700, fontSize:15, cursor: loading ? "not-allowed" : "pointer",
                  fontFamily:"inherit", marginTop:4, display:"flex", alignItems:"center",
                  justifyContent:"center", gap:8,
                  boxShadow: loading ? "none" : "0 4px 16px rgba(15,61,46,0.25)",
                  transition:"all 120ms" }}
                onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = "0 6px 24px rgba(15,61,46,0.35)")}
                onMouseLeave={e => !loading && (e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,61,46,0.25)")}
              >
                {loading ? (
                  <span style={{ display:"flex", gap:5 }}>
                    {[0, 0.15, 0.3].map((d, i) => (
                      <span key={i} style={{ width:7, height:7, background:"#fff", borderRadius:"50%",
                        display:"inline-block", animation:"bounce 0.8s ease-in-out infinite",
                        animationDelay:`${d}s` }} />
                    ))}
                  </span>
                ) : "Create my account"}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0 16px" }}>
              <div style={{ flex:1, height:1, background:C.border }} />
              <span style={{ color:C.textMuted, fontSize:12 }}>or</span>
              <div style={{ flex:1, height:1, background:C.border }} />
            </div>

            {/* Google Sign-In */}
            {googleLoading ? (
              <div style={{ height:44, display:"flex", alignItems:"center", justifyContent:"center",
                gap:8, color:C.textSub, fontSize:13 }}>
                <span style={{ display:"flex", gap:4 }}>
                  {[0, 0.15, 0.3].map((d, i) => (
                    <span key={i} style={{ width:6, height:6, background:C.primary, borderRadius:"50%",
                      display:"inline-block", animation:"bounce 0.8s ease-in-out infinite", animationDelay:`${d}s` }} />
                  ))}
                </span>
                Signing you in...
              </div>
            ) : (
              <GoogleButton
                onCredential={handleGoogleCredential}
                onError={msg => setError(msg)}
              />
            )}

            {/* Login link */}
            <p style={{ textAlign:"center", marginTop:20, color:C.textSub, fontSize:14 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color:C.primary, fontWeight:700, textDecoration:"none" }}
                onMouseEnter={e => e.target.style.textDecoration = "underline"}
                onMouseLeave={e => e.target.style.textDecoration = "none"}
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Trust pills */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
          gap:8, marginTop:16, flexWrap:"wrap" }}>
          {["Free delivery on signup","4.8★ rated","Secure login"].map(t => (
            <span key={t} style={{ display:"flex", alignItems:"center", gap:5,
              padding:"5px 12px", borderRadius:999, background:C.surface,
              border:`1px solid ${C.border}`, fontSize:11, color:C.textSub }}>
              <span style={{ color:C.accent, fontWeight:700 }}>✓</span> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
