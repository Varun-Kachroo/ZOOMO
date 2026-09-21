import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const C = {
  page:"#F4F7F5", surface:"#FFFFFF", primary:"#0F3D2D", hover:"#164A39",
  accent:"#1F7A52", textMain:"#0C1612", textSub:"#6B7280", textMuted:"#9CA3AF",
  border:"#DCE6E0", borderSoft:"#EEF3F0",
};

const Icon = {
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
  ),
};

function Field({ label, value, onChange, placeholder, disabled }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:13, fontWeight:500, color:C.textSub, marginBottom:6, display:"block" }}>{label}</label>
      <input
        value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
        style={{ width:"100%", padding:"12px 14px", borderRadius:12,
          border:`1.5px solid ${C.border}`, background: disabled ? C.borderSoft : C.surface,
          color:C.textMain, fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
      />
    </div>
  );
}

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setError("");
    setSaving(true);
    try {
      await api.patch("/users/me", { name, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:C.page, paddingBottom:40,
      fontFamily:"'Satoshi', system-ui, sans-serif" }}>
      <style>{`@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');`}</style>

      <div style={{ maxWidth:560, margin:"0 auto", padding:"28px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
          <button onClick={() => navigate(-1)}
            style={{ width:38, height:38, borderRadius:12, border:`1.5px solid ${C.border}`,
              background:C.surface, display:"flex", alignItems:"center", justifyContent:"center",
              color:C.textSub, cursor:"pointer" }}>
            <Icon.ArrowLeft />
          </button>
          <h1 style={{ fontSize:24, fontWeight:700, color:C.textMain, letterSpacing:"-0.015em" }}>Account Settings</h1>
        </div>

        {saved && (
          <div style={{ marginBottom:16, padding:"11px 16px", borderRadius:12,
            background:"#DCFCE7", color:"#15803D", fontSize:13, fontWeight:600 }}>
            ✓ Changes saved
          </div>
        )}
        {error && (
          <div style={{ marginBottom:16, padding:"11px 16px", borderRadius:12,
            background:"#FEE2E2", color:"#DC2626", fontSize:13 }}>
            {error}
          </div>
        )}

        {/* Editable profile info */}
        <div style={{ padding:20, borderRadius:16, background:C.surface, border:`1px solid ${C.border}`, marginBottom:16 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:C.textMain, marginBottom:14 }}>Profile</h3>
          <Field label="Full name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          <Field label="Email" value={user?.email || ""} disabled />
          <Field label="Phone number" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
          <button onClick={save} disabled={saving}
            style={{ padding:"11px 22px", borderRadius:12, border:"none", background:C.primary,
              color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>

        {/* Not-yet-available settings — shown honestly, not faked as functional */}
        <div style={{ padding:20, borderRadius:16, background:C.surface, border:`1px solid ${C.border}`, marginBottom:16 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:C.textMain, marginBottom:4 }}>Preferences</h3>
          <p style={{ fontSize:12, color:C.textMuted, marginBottom:14 }}>Coming soon</p>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {["Veg mode", "Saved payment methods", "Notification preferences"].map(label => (
              <div key={label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"10px 14px", borderRadius:10, background:C.borderSoft, opacity:0.6 }}>
                <span style={{ fontSize:13, color:C.textSub }}>{label}</span>
                <span style={{ fontSize:11, color:C.textMuted, fontWeight:600 }}>Coming soon</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={logout}
          style={{ width:"100%", padding:"13px", borderRadius:14, border:"1.5px solid #FECACA",
            background:"#FFF5F5", color:"#DC2626", fontSize:14, fontWeight:600,
            cursor:"pointer", fontFamily:"inherit" }}>
          Logout
        </button>
      </div>
    </div>
  );
}
