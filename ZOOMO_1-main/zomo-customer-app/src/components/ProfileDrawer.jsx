import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const C = {
  surface:"#FFFFFF", primary:"#0F3D2D", hover:"#164A39", accent:"#1F7A52",
  textMain:"#0C1612", textSub:"#6B7280", textMuted:"#9CA3AF", border:"#DCE6E0",
  sage:"#D7E6DE",
};

const LOGO_URL = "https://res.cloudinary.com/dx2qaarhy/image/upload/v1789420327/2bb606dc-2292-40ba-a4e8-df6720a3b700.png";

const Icon = {
  X: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
  ),
  ChevronRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  ),
  Box: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
  MapPin: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Heart: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  ),
  Tag: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill={C.primary}/></svg>
  ),
  Bag: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  ),
  Settings: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
};

function Row({ icon, title, subtitle, onClick }) {
  return (
    <button onClick={onClick} style={{
      width:"100%", display:"flex", alignItems:"center", gap:14,
      padding:"13px 4px", background:"none", border:"none", cursor:"pointer",
      textAlign:"left", fontFamily:"inherit", borderBottom:`1px solid ${C.border}30`,
    }}>
      <div style={{ width:38, height:38, borderRadius:12, background:C.sage,
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        {icon}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontWeight:600, fontSize:14, color:C.textMain }}>{title}</p>
        <p style={{ fontSize:12, color:C.textMuted, marginTop:1 }}>{subtitle}</p>
      </div>
      <span style={{ color:C.textMuted, flexShrink:0 }}><Icon.ChevronRight /></span>
    </button>
  );
}

/**
 * Bottom-sheet profile drawer, opened from the "You" tab in BottomNav.
 * Matches the reference: logo-mark avatar, name/email, Edit profile pill,
 * then a list of destinations with live subtitle counts where available.
 */
export default function ProfileDrawer({ onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getTotalItemCount } = useCart();

  const [ordersCount, setOrdersCount] = useState(null);
  const [addressesCount, setAddressesCount] = useState(null);

  useEffect(() => {
    api.get("/orders/mine")
      .then(res => setOrdersCount(Array.isArray(res) ? res.length : res?.data?.length ?? 0))
      .catch(() => setOrdersCount(null));
    api.get("/addresses")
      .then(res => setAddressesCount(Array.isArray(res) ? res.length : res?.data?.length ?? 0))
      .catch(() => setAddressesCount(null));
  }, []);

  function go(path) {
    onClose();
    navigate(path);
  }

  const bagCount = getTotalItemCount();

  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex", flexDirection:"column",
      justifyContent:"flex-end", fontFamily:"'Satoshi', system-ui, sans-serif" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div style={{ position:"absolute", inset:0, background:"rgba(12,22,18,0.55)",
        backdropFilter:"blur(4px)" }} onClick={onClose} />

      <style>{`
        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .ze-profile-sheet { animation: sheetUp 280ms cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      {/* Sheet */}
      <div className="ze-profile-sheet" style={{ position:"relative", zIndex:1,
        background:C.surface, borderTopLeftRadius:28, borderTopRightRadius:28,
        maxWidth:480, width:"100%", margin:"0 auto", maxHeight:"85vh",
        overflowY:"auto", boxShadow:"0 -8px 40px rgba(0,0,0,0.2)" }}>

        {/* Header */}
        <div style={{ background:`linear-gradient(135deg, ${C.primary} 0%, ${C.hover} 100%)`,
          borderTopLeftRadius:28, borderTopRightRadius:28, padding:"24px 22px 22px", position:"relative" }}>

          <button onClick={onClose}
            style={{ position:"absolute", top:16, right:16, width:30, height:30, borderRadius:9,
              background:"rgba(255,255,255,0.15)", border:"none", color:"#fff",
              display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <Icon.X />
          </button>

          <img src={LOGO_URL} alt="" style={{ width:52, height:52, borderRadius:16,
            objectFit:"contain", marginBottom:12, background:"#fff", padding:4 }} />

          <h2 style={{ color:"#fff", fontSize:19, fontWeight:700, letterSpacing:"-0.01em" }}>
            {user?.name || "Guest"}
          </h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:13, marginTop:2, marginBottom:16 }}>
            {user?.email}
          </p>

          <button onClick={() => go("/account")}
            style={{ padding:"9px 20px", borderRadius:999, border:"none",
              background:"#fff", color:C.primary, fontSize:13, fontWeight:700,
              cursor:"pointer", fontFamily:"inherit" }}>
            Edit profile
          </button>
        </div>

        {/* List */}
        <div style={{ padding:"8px 20px 28px" }}>
          <Row icon={<Icon.Box />} title="My Orders"
            subtitle={ordersCount === null ? "View your orders" : `${ordersCount} placed`}
            onClick={() => go("/orders")} />

          <Row icon={<Icon.MapPin />} title="My Addresses"
            subtitle={addressesCount === null ? "Manage addresses" : `${addressesCount} saved`}
            onClick={() => go("/addresses")} />

          <Row icon={<Icon.Heart />} title="Saved restaurants"
            subtitle="None yet"
            onClick={() => go("/")} />

          <Row icon={<Icon.Tag />} title="Offers"
            subtitle="Activate this week's deals"
            onClick={() => go("/")} />

          <Row icon={<Icon.Bag />} title="My Bag"
            subtitle={`${bagCount} item${bagCount === 1 ? "" : "s"}`}
            onClick={() => go("/bag")} />

          <Row icon={<Icon.Settings />} title="Account settings"
            subtitle="Phone, veg mode, payment"
            onClick={() => go("/account")} />

          <button onClick={() => { onClose(); logout(); navigate("/"); }}
            style={{ width:"100%", marginTop:16, padding:"12px", borderRadius:14,
              border:"1.5px solid #FECACA", background:"#FFF5F5", color:"#DC2626",
              fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
