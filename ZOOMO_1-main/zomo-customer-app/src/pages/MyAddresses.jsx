import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { MascotLoader } from "./LandingPage";

const C = {
  page:"#F4F7F5", surface:"#FFFFFF", primary:"#0F3D2D", hover:"#164A39",
  accent:"#1F7A52", textMain:"#0C1612", textSub:"#6B7280", textMuted:"#9CA3AF",
  border:"#DCE6E0", borderSoft:"#EEF3F0",
};

const Icon = {
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
  ),
  MapPin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Trash: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
  ),
};

export default function MyAddresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ street:"", city:"", state:"", zipCode:"", country:"India" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await api.get("/addresses");
      setAddresses(Array.isArray(res) ? res : res?.data ?? []);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }

  async function saveAddress() {
    setError("");
    if (!form.street || !form.city || !form.state || !form.zipCode) {
      setError("Please fill in all fields.");
      return;
    }
    setSaving(true);
    try {
      await api.post("/addresses", form);
      setForm({ street:"", city:"", state:"", zipCode:"", country:"India" });
      setShowForm(false);
      await load();
    } catch {
      setError("Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAddress(id) {
    if (!confirm("Remove this address?")) return;
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch {
      alert("Failed to delete address.");
    }
  }

  const inputStyle = {
    width:"100%", padding:"12px 14px", borderRadius:12, border:`1.5px solid ${C.border}`,
    background:C.surface, color:C.textMain, fontSize:14, outline:"none", fontFamily:"inherit",
    boxSizing:"border-box",
  };

  if (loading) return <MascotLoader text="Loading your addresses..." />;

  return (
    <div style={{ minHeight:"100vh", background:C.page, paddingBottom:40,
      fontFamily:"'Satoshi', system-ui, sans-serif" }}>
      <style>{`@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');`}</style>

      <div style={{ maxWidth:600, margin:"0 auto", padding:"28px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
          <button onClick={() => navigate(-1)}
            style={{ width:38, height:38, borderRadius:12, border:`1.5px solid ${C.border}`,
              background:C.surface, display:"flex", alignItems:"center", justifyContent:"center",
              color:C.textSub, cursor:"pointer" }}>
            <Icon.ArrowLeft />
          </button>
          <h1 style={{ fontSize:24, fontWeight:700, color:C.textMain, letterSpacing:"-0.015em" }}>My Addresses</h1>
        </div>

        {addresses.length === 0 && !showForm && (
          <div style={{ textAlign:"center", padding:"48px 20px" }}>
            <div style={{ fontSize:44, marginBottom:12, opacity:0.5 }}>📍</div>
            <p style={{ color:C.textSub, fontSize:14, marginBottom:20 }}>No saved addresses yet</p>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
          {addresses.map(a => (
            <div key={a.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:16,
              borderRadius:16, background:C.surface, border:`1px solid ${C.border}` }}>
              <span style={{ color:C.accent, marginTop:2 }}><Icon.MapPin /></span>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontWeight:600, fontSize:14, color:C.textMain }}>{a.street}</p>
                <p style={{ fontSize:13, color:C.textSub, marginTop:2 }}>{a.city}, {a.state} - {a.zipCode}</p>
              </div>
              <button onClick={() => deleteAddress(a.id)}
                style={{ padding:6, background:"none", border:"none", color:C.textMuted,
                  cursor:"pointer", transition:"color 120ms" }}
                onMouseEnter={e => e.currentTarget.style.color = "#DC2626"}
                onMouseLeave={e => e.currentTarget.style.color = C.textMuted}>
                <Icon.Trash />
              </button>
            </div>
          ))}
        </div>

        {showForm ? (
          <div style={{ padding:20, borderRadius:16, background:C.surface, border:`1.5px solid ${C.primary}` }}>
            {error && <p style={{ color:"#DC2626", fontSize:12, marginBottom:10 }}>{error}</p>}
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
              {["street","city","state","zipCode"].map(f => (
                <input key={f} placeholder={f[0].toUpperCase() + f.slice(1)} value={form[f]}
                  onChange={e => setForm({ ...form, [f]: e.target.value })}
                  style={inputStyle} />
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={saveAddress} disabled={saving}
                style={{ flex:1, padding:"12px", borderRadius:12, border:"none", background:C.primary,
                  color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                  opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving..." : "Save Address"}
              </button>
              <button onClick={() => { setShowForm(false); setError(""); }}
                style={{ flex:1, padding:"12px", borderRadius:12, border:`1.5px solid ${C.border}`,
                  background:"transparent", color:C.textSub, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)}
            style={{ width:"100%", padding:"13px", borderRadius:14, border:`1.5px dashed ${C.border}`,
              background:"transparent", color:C.primary, fontSize:14, fontWeight:600,
              cursor:"pointer", fontFamily:"inherit" }}>
            + Add new address
          </button>
        )}
      </div>
    </div>
  );
}
