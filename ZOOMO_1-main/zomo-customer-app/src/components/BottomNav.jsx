import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProfileDrawer from "./ProfileDrawer";

const C = {
  surface:"#FFFFFF", primary:"#0F3D2D", accent:"#1F7A52",
  textMain:"#0C1612", textSub:"#6B7280", textMuted:"#9CA3AF", border:"#DCE6E0",
};

const Icon = {
  Home: ({ active }) => (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? C.primary : C.textMuted} strokeWidth={active ? 2.4 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7"/><path d="M9 22V12h6v10"/><path d="M21 22H3V9"/>
    </svg>
  ),
  Bag: ({ active }) => (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? C.primary : C.textMuted} strokeWidth={active ? 2.4 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  User: ({ active }) => (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? C.primary : C.textMuted} strokeWidth={active ? 2.4 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

/**
 * Fixed bottom tab bar with a dark-green circular outline that glides
 * smoothly between tabs as the active one changes. Also owns and renders
 * the ProfileDrawer — tapping "You" opens it rather than navigating.
 *
 * Drop <BottomNav /> once near the bottom of any page that should show it
 * (Landing, MainLayout). It hides itself above tablet width via CSS,
 * since the top Navbar already covers desktop navigation.
 */
export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTotalItemCount } = useCart();
  const [profileOpen, setProfileOpen] = useState(false);

  // ✅ Now mounted once globally (see App.jsx), so it would otherwise show
  // on every route including auth/legal pages that shouldn't have it.
  const HIDDEN_ON = ["/login", "/signup", "/privacy"];
  if (HIDDEN_ON.includes(location.pathname)) return null;

  const bagCount = user ? getTotalItemCount() : 0;

  // Which of the 3 tabs is "active" right now
  let activeIndex = -1;
  if (profileOpen) activeIndex = 2;
  else if (location.pathname === "/") activeIndex = 0;
  else if (location.pathname.startsWith("/bag") || location.pathname.startsWith("/checkout") || location.pathname.startsWith("/cart")) activeIndex = 1;

  function goHome() { setProfileOpen(false); navigate("/"); }
  function goBag() {
    setProfileOpen(false);
    if (!user) { navigate("/login"); return; }
    navigate("/bag");
  }
  function openYou() {
    if (!user) { navigate("/login"); return; }
    setProfileOpen(true);
  }

  return (
    <>
      <style>{`
        .ze-bottomnav { display: none; }
        @media (max-width: 860px) {
          .ze-bottomnav { display: flex !important; }
        }
      `}</style>

      <nav className="ze-bottomnav" style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:60,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)",
        borderTop:`1px solid ${C.border}`,
        boxShadow:"0 -4px 20px rgba(0,0,0,0.06)",
        padding:"8px 0 max(8px, env(safe-area-inset-bottom))",
      }}>
        <div style={{ position:"relative", display:"flex", width:"100%", maxWidth:420, margin:"0 auto" }}>

          {/* Sliding indicator — one circle, glides via transform */}
          <div style={{
            position:"absolute", top:-6, left:0, width:"33.3333%", height:60,
            display:"flex", alignItems:"center", justifyContent:"center",
            transform:`translateX(${activeIndex >= 0 ? activeIndex * 100 : 0}%)`,
            opacity: activeIndex >= 0 ? 1 : 0,
            transition:"transform 320ms cubic-bezier(0.34, 1.2, 0.64, 1), opacity 200ms",
            pointerEvents:"none",
          }}>
            <div style={{
              width:60, height:60, borderRadius:"50%",
              border:`2.5px solid ${C.primary}`,
              background:`${C.primary}0D`,
            }} />
          </div>

          {/* Home */}
          <button onClick={goHome} style={tabBtnStyle}>
            <div style={iconWrapStyle}><Icon.Home active={activeIndex === 0} /></div>
            <span style={{ ...labelStyle, color: activeIndex === 0 ? C.primary : C.textMuted, fontWeight: activeIndex === 0 ? 700 : 500 }}>Home</span>
          </button>

          {/* Bag */}
          <button onClick={goBag} style={tabBtnStyle}>
            <div style={{ ...iconWrapStyle, position:"relative" }}>
              <Icon.Bag active={activeIndex === 1} />
              {bagCount > 0 && (
                <span style={{ position:"absolute", top:-4, right:-8, minWidth:16, height:16, padding:"0 3px",
                  background:C.accent, color:"#fff", fontSize:9, fontWeight:700, borderRadius:999,
                  display:"flex", alignItems:"center", justifyContent:"center", border:"1.5px solid #fff" }}>
                  {bagCount}
                </span>
              )}
            </div>
            <span style={{ ...labelStyle, color: activeIndex === 1 ? C.primary : C.textMuted, fontWeight: activeIndex === 1 ? 700 : 500 }}>Bag</span>
          </button>

          {/* You */}
          <button onClick={openYou} style={tabBtnStyle}>
            <div style={iconWrapStyle}><Icon.User active={activeIndex === 2} /></div>
            <span style={{ ...labelStyle, color: activeIndex === 2 ? C.primary : C.textMuted, fontWeight: activeIndex === 2 ? 700 : 500 }}>You</span>
          </button>
        </div>
      </nav>

      {profileOpen && <ProfileDrawer onClose={() => setProfileOpen(false)} />}
    </>
  );
}

const tabBtnStyle = {
  flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3,
  padding:"6px 0", background:"none", border:"none", cursor:"pointer",
  fontFamily:"inherit", position:"relative", zIndex:1,
};
const iconWrapStyle = { display:"flex", alignItems:"center", justifyContent:"center", height:22 };
const labelStyle = { fontSize:11, letterSpacing:"0.01em", transition:"color 200ms, font-weight 200ms" };
