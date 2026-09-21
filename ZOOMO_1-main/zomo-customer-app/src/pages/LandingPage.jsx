import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export function MascotLoader({ text = "Loading..." }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:999, background:"#F4F7F5",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <div style={{ width:56, height:56, borderRadius:14, background:"#0F3D2D",
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path d="M6 10H22" stroke="#1F7A52" strokeWidth="2.8" strokeLinecap="round"/>
          <path d="M22 10L10 22" stroke="#1F7A52" strokeWidth="2.8" strokeLinecap="round"/>
          <path d="M10 22H26" stroke="#1F7A52" strokeWidth="2.8" strokeLinecap="round"/>
        </svg>
      </div>
      <p style={{ color:"#0F3D2D", fontWeight:600, fontSize:14, fontFamily:"'Satoshi', system-ui, sans-serif" }}>{text}</p>
    </div>
  );
}

// ── DESIGN TOKENS ─────────────────────────────────────
const C = {
  bg:       "#F4F7F5",
  surface:  "#FFFFFF",
  dark:     "#0F3D2D",
  darkHov:  "#164A39",
  accent:   "#1F7A52",
  accentLt: "#1F7A52",
  text:     "#0C1612",
  sub:      "#6B7280",
  muted:    "#9CA3AF",
  border:   "#DCE6E0",
};

const LOGO = "https://res.cloudinary.com/dx2qaarhy/image/upload/v1789420327/2bb606dc-2292-40ba-a4e8-df6720a3b700.png";

// ── ICONS ─────────────────────────────────────────────
const MapPinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const CartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#0F3D2D" stroke="#0F3D2D" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const HeartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const BoltIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F7A52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const PersonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F7A52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F7A52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const ArrowUpRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
  </svg>
);
const LogOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// ── CATEGORY DATA ──────────────────────────────────────
const CRAVINGS = [
  { label:"Pizza",    img:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop" },
  { label:"Burgers",  img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop" },
  { label:"Indian",   img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop" },
  { label:"Chinese",  img:"https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&h=200&fit=crop" },
  { label:"Healthy",  img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop" },
  { label:"Desserts", img:"https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop" },
];

const OFFERS = [
  { badge:"₹80 OFF",        timing:"WEDNESDAYS",     title:"Wed: ₹80 off pizza",   desc:"Buy 1 get 1 vibe on medium pies.",    restaurant:"I Love Pizza",   code:"BOGO",       img:"https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=240&fit=crop" },
  { badge:"50% OFF",        timing:"EXPIRES SUNDAY", title:"50% off your pizza",   desc:"On any Pizza Palace pie. Max ₹120.",  restaurant:"Pizza Palace",   code:"ZOOMO50",    img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=240&fit=crop" },
  { badge:"FREE DELIVERY",  timing:"THIS WEEK",      title:"Free delivery",        desc:"On orders above ₹199. Any restaurant.", restaurant:"All restaurants", code:"FREESHIP",  img:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=240&fit=crop" },
  { badge:"20% OFF",        timing:"EXPIRES SUNDAY", title:"20% off bowls",        desc:"Healthy Bites salads and smoothies.",  restaurant:"Healthy Bites",  code:"HEALTHY20",  img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=240&fit=crop" },
];

const HOW_IT_WORKS = [
  { icon:<BoltIcon />,  num:"01", title:"One town. That's it.", desc:"Zoomo only cooks for your city. No other city, no thin routes, no cold bags." },
  { icon:<PersonIcon />,num:"02", title:"Hot at the gate",       desc:"The ride is short. Food doesn't go grey on a highway." },
  { icon:<ShieldIcon />,num:"03", title:"Restaurants you know",  desc:"Neighbours. Ratings from people who actually live here." },
];

const AREAS = ["Downtown","Riverside","Old Town","Hillview","Central","Eastgate","Westside","Lakeview","Greenwood"];

// ── ADDRESS MODAL ──────────────────────────────────────
function AddressModal({ onConfirm, onSkip }) {
  const [val, setVal] = useState("");
  return (
    <div style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(28,58,42,0.6)",
      backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ width:"100%", maxWidth:420, background:C.surface, borderRadius:24,
        padding:32, boxShadow:"0 24px 80px rgba(0,0,0,0.2)" }}>
        <div style={{ width:44, height:44, borderRadius:12, background:C.dark,
          display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18, color:C.accentLt }}>
          <MapPinIcon />
        </div>
        <h2 style={{ fontSize:22, fontWeight:700, color:C.text, marginBottom:6 }}>Where should we deliver?</h2>
        <p style={{ color:C.sub, fontSize:14, marginBottom:20 }}>Set your street to see restaurants near you</p>
        <input value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && val.trim() && onConfirm(val.trim())}
          placeholder="e.g. MG Road, Bengaluru"
          style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:`1.5px solid ${C.border}`,
            fontSize:14, color:C.text, outline:"none", fontFamily:"inherit", boxSizing:"border-box",
            marginBottom:10, transition:"border-color 120ms" }}
          onFocus={e => e.target.style.borderColor = C.dark}
          onBlur={e => e.target.style.borderColor = C.border} />
        <button onClick={() => val.trim() && onConfirm(val.trim())}
          style={{ width:"100%", padding:"13px", borderRadius:12, border:"none",
            background:C.dark, color:"#fff", fontWeight:700, fontSize:14,
            cursor:"pointer", fontFamily:"inherit", marginBottom:8 }}>
          Find Restaurants
        </button>
        <button onClick={onSkip}
          style={{ width:"100%", padding:"11px", borderRadius:12, border:`1px solid ${C.border}`,
            background:"transparent", color:C.sub, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
          Set later
        </button>
      </div>
    </div>
  );
}

// ── NAVBAR ─────────────────────────────────────────────
function Navbar({ address, onAddressClick, cartCount, user, navigate, onLogout, onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header style={{
      position:"sticky", top:0, zIndex:40, width:"100%",
      background: scrolled ? "rgba(255,255,255,0.97)" : "#fff",
      backdropFilter:"blur(12px)",
      borderBottom:`1px solid ${scrolled ? C.border : "transparent"}`,
      boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      transition:"all 200ms ease",
      fontFamily:"'Satoshi', system-ui, sans-serif",
    }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", height:60,
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>

        {/* Logo */}
        <div style={{ cursor:"pointer", flexShrink:0 }} onClick={() => navigate("/")}>
          <img src={LOGO} alt="Zoomo Eats" style={{ height:34, width:"auto", display:"block" }} />
        </div>

        {/* Address pill — center */}
        <button onClick={onAddressClick}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 18px",
            borderRadius:999, border:`1.5px solid ${C.border}`, background:C.surface,
            fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all 120ms",
            flex:"0 0 auto", maxWidth:280 }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.dark}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
        >
          <span style={{ color:C.accent, display:"inline-flex", alignItems:"center" }}><MapPinIcon /></span>
          <div style={{ textAlign:"left", minWidth:0 }}>
            {address && <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.08em", color:C.muted, lineHeight:1 }}>
              {address.toUpperCase()}
            </div>}
            <div style={{ fontWeight:600, fontSize:13, color:C.text, overflow:"hidden",
              textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {address || "Set location"}
            </div>
          </div>
        </button>

        {/* Right */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          {user ? (
            <>
              <button onClick={() => navigate("/orders")}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
                  borderRadius:999, border:`1.5px solid ${C.border}`, background:"transparent",
                  color:C.text, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit",
                  transition:"all 120ms" }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <UserIcon /> {user.name?.split(" ")[0]}
              </button>
              <button onClick={onLogout} title="Logout"
                style={{ width:36, height:36, borderRadius:999, border:"1.5px solid #FECACA",
                  background:"#FFF5F5", color:"#DC2626", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", transition:"all 120ms" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FEE2E2"}
                onMouseLeave={e => e.currentTarget.style.background = "#FFF5F5"}
              ><LogOutIcon /></button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")}
                style={{ padding:"8px 16px", borderRadius:999, border:`1.5px solid ${C.border}`,
                  background:"transparent", color:C.text, fontSize:13, fontWeight:500,
                  cursor:"pointer", fontFamily:"inherit", transition:"all 120ms" }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >Login</button>
              <button onClick={() => navigate("/signup")}
                style={{ padding:"9px 18px", borderRadius:999, border:"none",
                  background:C.dark, color:"#fff", fontSize:13, fontWeight:600,
                  cursor:"pointer", fontFamily:"inherit", transition:"opacity 120ms" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >Sign up</button>
            </>
          )}
          <button onClick={() => navigate("/bag")}
            style={{ position:"relative", width:36, height:36, borderRadius:999,
              border:`1.5px solid ${C.border}`, background:"transparent",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:C.sub, cursor:"pointer", transition:"all 120ms" }}
            onMouseEnter={e => e.currentTarget.style.background = C.bg}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span style={{ position:"absolute", top:-5, right:-5, width:17, height:17,
                background:C.dark, color:"#fff", fontSize:9, fontWeight:700,
                borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                border:"2px solid #fff" }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

// ── SEARCH OVERLAY ─────────────────────────────────────
function SearchOverlay({ restaurants, onClose, navigate }) {
  const [q, setQ] = useState("");
  const [closing, setClosing] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 80); }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  const results = q.trim()
    ? restaurants.filter(r =>
        r.name.toLowerCase().includes(q.toLowerCase()) ||
        r.cuisine?.toLowerCase().includes(q.toLowerCase()))
    : restaurants;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(17,24,39,0.4)",
      backdropFilter:"blur(4px)", display:"flex", flexDirection:"column",
      animation:`${closing ? "ze-fade-out" : "ze-fade-in"} 200ms ease forwards` }}
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <style>{`
        @keyframes ze-fade-in { from { opacity:0 } to { opacity:1 } }
        @keyframes ze-fade-out { from { opacity:1 } to { opacity:0 } }
        @keyframes ze-panel-in { from { opacity:0; transform:translateY(-18px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes ze-panel-out { from { opacity:1; transform:translateY(0) scale(1) } to { opacity:0; transform:translateY(-18px) scale(0.98) } }
      `}</style>
      <div style={{ background:C.surface, borderBottomLeftRadius:20, borderBottomRightRadius:20,
        boxShadow:"0 16px 48px rgba(0,0,0,0.15)", maxHeight:"85vh", display:"flex", flexDirection:"column",
        transformOrigin:"top center",
        animation:`${closing ? "ze-panel-out" : "ze-panel-in"} 260ms cubic-bezier(0.16, 1, 0.3, 1) forwards` }}>

        {/* Input */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 20px",
          borderBottom:`1px solid ${C.border}` }}>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, padding:"10px 16px",
            borderRadius:999, background:C.bg, border:`1.5px solid ${C.border}` }}>
            <span style={{ color:C.muted, display:"inline-flex" }}><SearchIcon /></span>
            <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search food or restaurants"
              style={{ border:"none", outline:"none", background:"transparent", flex:1,
                fontSize:15, color:C.text, fontFamily:"'Satoshi', system-ui, sans-serif" }} />
          </div>
          <button onClick={handleClose} aria-label="Close search"
            style={{ width:38, height:38, flexShrink:0, borderRadius:"50%",
              border:`1.5px solid ${C.border}`, background:C.bg, color:C.sub,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", transition:"all 120ms" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.dark; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = C.dark; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.color = C.sub; e.currentTarget.style.borderColor = C.border; }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Results */}
        <div style={{ overflowY:"auto", padding:"8px 0" }}>
          {q.trim() && results.length === 0 ? (
            <div style={{ padding:"40px 20px", textAlign:"center" }}>
              <p style={{ fontSize:32, marginBottom:8 }}>🔍</p>
              <p style={{ fontWeight:600, color:C.text, marginBottom:4 }}>No results for "{q}"</p>
              <p style={{ color:C.sub, fontSize:13 }}>Try a different name or cuisine</p>
            </div>
          ) : (
            <>
              {q.trim() && <p style={{ padding:"4px 20px 8px", fontSize:11, fontWeight:700,
                letterSpacing:"0.08em", color:C.accent }}>
                {results.length} RESULT{results.length !== 1 ? "S" : ""}
              </p>}
              {!q.trim() && <p style={{ padding:"4px 20px 8px", fontSize:11, fontWeight:700,
                letterSpacing:"0.08em", color:C.accent }}>ALL RESTAURANTS</p>}
              {results.map(r => (
                <div key={r.id} onClick={() => { handleClose(); navigate(`/restaurant/${r.id}`); }}
                  style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 20px",
                    cursor:"pointer", transition:"background 100ms" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <img src={r.img} alt={r.name}
                    style={{ width:48, height:48, borderRadius:10, objectFit:"cover", flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:14, color:C.text }}>{r.name}</div>
                    <div style={{ fontSize:12, color:C.sub, marginTop:1 }}>{r.cuisine} · {r.eta}</div>
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:C.dark }}>₹{r.cost}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN LANDING ───────────────────────────────────────
export default function LandingPage() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(() => localStorage.getItem("ze_address") || "");
  const [showAddressModal, setShowAddressModal] = useState(!localStorage.getItem("ze_address") && !user);
  const [searchOpen, setSearchOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activatedOffer, setActivatedOffer] = useState(() => localStorage.getItem("ze_active_offer") || null);
  const restaurantRef = useRef(null);

  function toggleOffer(code) {
    if (activatedOffer === code) {
      // Deactivate — remove so nothing auto-applies at checkout
      setActivatedOffer(null);
      localStorage.removeItem("ze_active_offer");
    } else {
      // Only one offer can be active at a time — it auto-applies at checkout
      setActivatedOffer(code);
      localStorage.setItem("ze_active_offer", code);
    }
  }

  useEffect(() => {
    api.get("/restaurants").then(res => {
      const list = Array.isArray(res) ? res : [];
      setRestaurants(list.map(r => ({
        id: r.id, name: r.name,
        img: r.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
        cuisine: r.cuisineType || "Various",
        rating: r.rating?.toFixed(1) ?? "4.5",
        eta: "20–35 min", cost: r.priceRange === "$" ? 200 : r.priceRange === "$$$" ? 500 : 350,
        coupon: r.coupon || null,
      })));
    }).catch(() => setRestaurants([])).finally(() => setLoading(false));
  }, []);

  const cartCount = cart?.items?.reduce((t, i) => t + i.quantity, 0) ?? 0;

  function confirmAddress(addr) {
    setAddress(addr);
    localStorage.setItem("ze_address", addr);
    setShowAddressModal(false);
  }

  return (
    <div className="ze-landing-root" style={{ minHeight:"100vh", background:C.bg,
      fontFamily:"'Satoshi', system-ui, sans-serif", color:C.text, overflowX:"hidden" }}>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg} !important; overflow-x: hidden; }
        html { overflow-x: hidden; }
        html.dark body { background: ${C.bg} !important; color: ${C.text} !important; }
        input::placeholder { color: #9CA3AF; }
        @media (max-width: 860px) {
          .ze-landing-root { padding-bottom: 68px; }
        }
        .no-scroll { scrollbar-width: none; }
        .no-scroll::-webkit-scrollbar { display: none; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.5s ease-out both; }
        @keyframes fadeUp2 { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up-2 { animation: fadeUp2 0.5s 0.1s ease-out both; }
        @keyframes fadeUp3 { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up-3 { animation: fadeUp3 0.5s 0.2s ease-out both; }
      `}</style>

      {showAddressModal && <AddressModal onConfirm={confirmAddress} onSkip={() => setShowAddressModal(false)} />}
      {searchOpen && <SearchOverlay restaurants={restaurants} onClose={() => setSearchOpen(false)} navigate={navigate} />}

      {/* ── NAVBAR ── */}
      <Navbar
        address={address}
        onAddressClick={() => setShowAddressModal(true)}
        cartCount={cartCount}
        user={user}
        navigate={navigate}
        onLogout={logout}
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* ── HERO ── */}
      <section style={{ position:"relative", height:"calc(100vh - 60px)", minHeight:520,
        maxHeight:760, overflow:"hidden", display:"flex", alignItems:"flex-end" }}>

        {/* Video background */}
        <video autoPlay muted loop playsInline
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }}>
          <source src="https://res.cloudinary.com/dx2qaarhy/video/upload/v1789214802/5899705-uhd_2160_4096_30fps_1.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div style={{ position:"absolute", inset:0, zIndex:1,
          background:"linear-gradient(to top, rgba(15,25,18,0.88) 0%, rgba(15,25,18,0.45) 50%, rgba(15,25,18,0.25) 100%)" }} />

        {/* Content */}
        <div style={{ position:"relative", zIndex:2, width:"100%",
          maxWidth:1200, margin:"0 auto", padding:"0 24px 64px" }}>

          {/* Location badge */}
          {address && (
            <div className="fade-up" style={{ display:"inline-flex", alignItems:"center", gap:6,
              background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)",
              border:"1px solid rgba(255,255,255,0.25)", borderRadius:999,
              padding:"5px 14px", marginBottom:24, color:"rgba(255,255,255,0.9)",
              fontSize:12, fontWeight:600, letterSpacing:"0.05em" }}>
              LIVE IN {address.toUpperCase()}
            </div>
          )}

          {/* Headline */}
          <h1 className="fade-up-2" style={{ fontSize:"clamp(44px,7vw,88px)", fontWeight:800,
            lineHeight:1.05, letterSpacing:"-0.03em", marginBottom:0, color:"#fff" }}>
            Whatever<br />you're craving.
          </h1>
          <h1 className="fade-up-2" style={{ fontSize:"clamp(44px,7vw,88px)", fontWeight:800,
            lineHeight:1.05, letterSpacing:"-0.03em", marginBottom:20,
            color:"rgba(255,255,255,0.35)" }}>
            At the door.
          </h1>

          <p className="fade-up-3" style={{ fontSize:18, fontWeight:600, color:"#fff", marginBottom:4 }}>
            Zoom it. Eat it. Love it.
          </p>
          <p className="fade-up-3" style={{ fontSize:14, color:"rgba(255,255,255,0.6)", marginBottom:28 }}>
            Set your street, pick a restaurant, watch the bag move.
          </p>

          {/* Search bar */}
          <div className="fade-up-3" style={{ maxWidth:520 }}>
            <button onClick={() => setSearchOpen(true)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:12,
                padding:"16px 22px", borderRadius:999, background:"#fff",
                border:"none", cursor:"pointer", fontFamily:"inherit",
                boxShadow:"0 8px 32px rgba(0,0,0,0.2)", transition:"transform 120ms" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <span style={{ color:C.muted, display:"inline-flex" }}><SearchIcon /></span>
              <span style={{ color:C.muted, fontSize:15 }}>Search food or restaurants</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── CRAVINGS ── */}
      <section style={{ padding:"52px 24px 40px", maxWidth:1200, margin:"0 auto" }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:C.accent, marginBottom:20 }}>CRAVINGS</p>
        <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
          {CRAVINGS.map(cat => (
            <div key={cat.label}
              onClick={() => setSearchOpen(true)}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, cursor:"pointer" }}
            >
              <div style={{ width:88, height:88, borderRadius:"50%", overflow:"hidden",
                border:`3px solid ${C.surface}`,
                boxShadow:"0 2px 12px rgba(0,0,0,0.10)", transition:"transform 180ms, box-shadow 180ms" }}
                onMouseEnter={e => { e.currentTarget.style.transform="scale(1.07)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.18)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.10)"; }}
              >
                <img src={cat.img} alt={cat.label} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
              <span style={{ fontSize:13, fontWeight:500, color:C.text }}>{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TONIGHT'S USUALS (Popular dishes) ── */}
      <section style={{ padding:"0 0 52px", maxWidth:1200, margin:"0 auto", paddingLeft:24, paddingRight:0 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:C.accent, marginBottom:6 }}>TONIGHT'S USUALS</p>
        <h2 style={{ fontSize:26, fontWeight:700, color:C.text, marginBottom:24, letterSpacing:"-0.02em" }}>
          Popular in {address || "your area"}
        </h2>
        <div className="no-scroll" style={{ display:"flex", gap:14, overflowX:"auto", paddingRight:24 }}>
          {[
            { name:"Farm House",          rest:"I Love Pizza",   price:199, veg:true,  img:"https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=300&h=200&fit=crop" },
            { name:"Cheese Burst",        rest:"I Love Pizza",   price:229, veg:true,  img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop" },
            { name:"Barn Smash",          rest:"Burger Barn",    price:249, veg:false, img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop" },
            { name:"Hyderabadi Dum Biryani",rest:"Spice Route",  price:349, veg:false, img:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop" },
            { name:"Prawn Dumplings",     rest:"Dragon Wok",     price:269, veg:false, img:"https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&h=200&fit=crop" },
          ].map((dish, i) => (
            <div key={i} onClick={() => setSearchOpen(true)}
              style={{ flexShrink:0, width:210, background:C.surface, borderRadius:16,
                overflow:"hidden", cursor:"pointer", border:`1px solid ${C.border}`,
                transition:"box-shadow 180ms, transform 180ms" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.12)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              <div style={{ height:140, overflow:"hidden" }}>
                <img src={dish.img} alt={dish.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
              <div style={{ padding:"12px 14px" }}>
                <p style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:2 }}>{dish.name}</p>
                <p style={{ fontSize:11, color:C.sub, marginBottom:8 }}>{dish.rest}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontWeight:700, fontSize:13, color:C.text }}>₹{dish.price}</span>
                  <span style={{ fontSize:10, fontWeight:600, color: dish.veg ? "#16A34A" : "#DC2626",
                    padding:"2px 8px", borderRadius:4,
                    border:`1px solid ${dish.veg ? "#16A34A" : "#DC2626"}` }}>
                    {dish.veg ? "Veg" : "Non-veg"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OFFERS ── */}
      <section style={{ padding:"0 0 52px", maxWidth:1200, margin:"0 auto", paddingLeft:24, paddingRight:0 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:C.accent, marginBottom:6, paddingRight:24 }}>FOR YOU THIS WEEK</p>
        <h2 style={{ fontSize:26, fontWeight:700, color:C.text, marginBottom:24, letterSpacing:"-0.02em", paddingRight:24 }}>Offers</h2>
        <div className="no-scroll" style={{ display:"flex", gap:14, overflowX:"auto", paddingRight:24 }}>
          {OFFERS.map((o, i) => {
            const isOn = activatedOffer === o.code;
            return (
              <div key={i} style={{ flexShrink:0, width:280, background:C.surface,
                borderRadius:16, overflow:"hidden", border:`1px solid ${isOn ? C.accent : C.border}`,
                boxShadow: isOn ? `0 0 0 2px ${C.accent}30` : "none", transition:"all 180ms" }}>
                <div style={{ position:"relative", height:168 }}>
                  <img src={o.img} alt={o.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  <div style={{ position:"absolute", bottom:10, left:10,
                    background:"rgba(0,0,0,0.75)", backdropFilter:"blur(4px)",
                    color:"#fff", fontSize:10, fontWeight:700, padding:"4px 10px",
                    borderRadius:6, letterSpacing:"0.05em" }}>
                    {o.badge}
                  </div>
                  {isOn && (
                    <div style={{ position:"absolute", top:10, right:10, display:"flex", alignItems:"center", gap:4,
                      background:C.accentLt, color:C.dark, fontSize:10, fontWeight:700, padding:"4px 10px",
                      borderRadius:999, letterSpacing:"0.03em" }}>
                      <CheckIcon /> ON
                    </div>
                  )}
                </div>
                <div style={{ padding:"16px 16px 18px" }}>
                  <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em",
                    color:C.muted, marginBottom:6 }}>{o.timing}</p>
                  <p style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:4 }}>{o.title}</p>
                  <p style={{ fontSize:12, color:C.sub, marginBottom:4 }}>{o.desc}</p>
                  <p style={{ fontSize:11, color:C.accent, fontWeight:600, marginBottom:14 }}>{o.restaurant}</p>
                  <button
                    onClick={() => toggleOffer(o.code)}
                    style={{ width:"100%", padding:"11px", borderRadius:10, border:"none",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                      background: isOn ? "#DCFCE7" : C.dark,
                      color: isOn ? "#15803D" : "#fff",
                      fontSize:13, fontWeight:700,
                      cursor:"pointer", fontFamily:"inherit", transition:"all 160ms" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    {isOn ? (<><CheckIcon /> Activated</>) : "Activate"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ paddingRight:24, fontSize:12, color:C.muted, marginTop:12 }}>
          One offer at a time. It applies automatically at checkout.
        </p>
      </section>

      {/* ── RESTAURANTS NEARBY ── */}
      <section ref={restaurantRef} style={{ padding:"0 24px 60px", maxWidth:1200, margin:"0 auto" }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:C.accent, marginBottom:6 }}>OPEN NOW</p>
        <h2 style={{ fontSize:26, fontWeight:700, color:C.text, marginBottom:24, letterSpacing:"-0.02em" }}>Restaurants nearby</h2>

        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background:C.surface, borderRadius:16, overflow:"hidden", border:`1px solid ${C.border}` }}>
                <div style={{ height:200, background:"#DCE6E0" }} />
                <div style={{ padding:16 }}>
                  <div style={{ height:16, background:"#DCE6E0", borderRadius:6, width:"60%", marginBottom:8 }} />
                  <div style={{ height:12, background:"#DCE6E0", borderRadius:6, width:"40%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <p style={{ fontSize:40, marginBottom:10 }}>🍽️</p>
            <p style={{ fontWeight:600, color:C.text, marginBottom:4 }}>No restaurants yet</p>
            <p style={{ color:C.sub, fontSize:13 }}>Check back soon — we're growing fast.</p>
          </div>
        ) : (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
              {restaurants.map(r => (
                <div key={r.id} onClick={() => navigate(`/restaurant/${r.id}`)}
                  style={{ background:C.surface, borderRadius:16, overflow:"hidden",
                    border:`1px solid ${C.border}`, cursor:"pointer",
                    transition:"box-shadow 180ms, transform 180ms" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow="0 10px 32px rgba(0,0,0,0.12)"; e.currentTarget.style.transform="translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}
                >
                  <div style={{ position:"relative", height:200, overflow:"hidden" }}>
                    <img src={r.img} alt={r.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    {/* Rating badge */}
                    <div style={{ position:"absolute", top:10, left:10,
                      display:"flex", alignItems:"center", gap:4,
                      background:"rgba(255,255,255,0.95)", backdropFilter:"blur(4px)",
                      padding:"4px 8px", borderRadius:999, fontSize:12, fontWeight:700, color:C.dark }}>
                      <StarIcon /> {r.rating}
                    </div>
                    {/* Coupon badge */}
                    {r.coupon && (
                      <div style={{ position:"absolute", top:10, right:10,
                        background:C.dark, color:"#fff", fontSize:9, fontWeight:700,
                        padding:"4px 8px", borderRadius:6, letterSpacing:"0.05em" }}>
                        {r.coupon}
                      </div>
                    )}
                    {/* Heart */}
                    <div style={{ position:"absolute", bottom:10, right:10,
                      width:30, height:30, borderRadius:"50%", background:"rgba(255,255,255,0.9)",
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <HeartIcon />
                    </div>
                  </div>
                  <div style={{ padding:"14px 16px 16px" }}>
                    <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em",
                      color:C.muted, marginBottom:4 }}>
                      {r.cuisine?.toUpperCase()} · {(address || "YOUR AREA").toUpperCase()}
                    </p>
                    <p style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:6 }}>{r.name}</p>
                    <p style={{ fontSize:13, color:C.sub, display:"flex", alignItems:"center", gap:4 }}>
                      <ClockIcon /> {r.eta} · ₹{r.cost} for two
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {restaurants.length > 4 && (
              <div style={{ textAlign:"center", marginTop:24 }}>
                <button onClick={() => navigate("/restaurants")}
                  style={{ padding:"13px 32px", borderRadius:12, border:`1.5px solid ${C.border}`,
                    background:C.surface, color:C.text, fontSize:14, fontWeight:600,
                    cursor:"pointer", fontFamily:"inherit", transition:"all 120ms" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.background = C.bg; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}
                >
                  View more restaurants
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:"60px 24px", maxWidth:1200, margin:"0 auto" }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:C.accent, marginBottom:10 }}>HOW ZOOMO WORKS HERE</p>
        <h2 style={{ fontSize:clamp("28px","4vw","42px"), fontWeight:700, color:C.text,
          marginBottom:36, letterSpacing:"-0.02em" }}>
          Three taps. Then your gate.
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
          {HOW_IT_WORKS.map((h, i) => (
            <div key={i} style={{ background:C.surface, borderRadius:16, padding:24,
              border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
                <div style={{ width:40, height:40, borderRadius:10,
                  background:"#EBF3EE", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {h.icon}
                </div>
                <span style={{ fontSize:12, fontWeight:700, color:C.muted, letterSpacing:"0.05em" }}>{h.num}</span>
              </div>
              <p style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:8 }}>{h.title}</p>
              <p style={{ fontSize:13, color:C.sub, lineHeight:"19px" }}>{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding:"0 24px 60px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ background:C.dark, borderRadius:20, padding:"36px 40px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:20 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em",
              color:"rgba(255,255,255,0.45)", marginBottom:6 }}>ZOOM IT. EAT IT. LOVE IT.</p>
            <p style={{ fontSize:28, fontWeight:700, color:"#fff", letterSpacing:"-0.02em" }}>
              Dinner at the door in {address || "your city"}.
            </p>
          </div>
          <button
            onClick={() => user ? restaurantRef.current?.scrollIntoView({ behavior:"smooth" }) : navigate("/signup")}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"14px 24px",
              borderRadius:999, background:"#fff", color:C.dark, fontSize:14, fontWeight:700,
              border:"none", cursor:"pointer", fontFamily:"inherit",
              boxShadow:"0 4px 16px rgba(0,0,0,0.2)", transition:"transform 120ms" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Order now <ArrowUpRightIcon />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:C.dark, padding:"52px 24px 28px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          {/* 4-col grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:36, marginBottom:44 }}>
            {/* Brand */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <img src={LOGO} alt="Zoomo Eats" style={{ height:30, width:"auto" }} />
              </div>
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, lineHeight:"19px" }}>
                Fast delivery from restaurants near you, in every neighbourhood we serve.
              </p>
            </div>
            {/* Company */}
            <div>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:"rgba(255,255,255,0.35)",
                marginBottom:16 }}>COMPANY</p>
              {["Home","Restaurants","Search","Track order"].map(l => (
                <a key={l} href="#" style={{ display:"block", color:"rgba(255,255,255,0.65)", fontSize:14,
                  textDecoration:"none", marginBottom:10, transition:"color 120ms" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.65)"}
                >{l}</a>
              ))}
            </div>
            {/* Get Help */}
            <div>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:"rgba(255,255,255,0.35)",
                marginBottom:16 }}>GET HELP</p>
              {["Login","Create account","Account","Your bags"].map(l => (
                <a key={l} href="#" style={{ display:"block", color:"rgba(255,255,255,0.65)", fontSize:14,
                  textDecoration:"none", marginBottom:10, transition:"color 120ms" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.65)"}
                >{l}</a>
              ))}
            </div>
            {/* For Restaurants */}
            <div>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:"rgba(255,255,255,0.35)",
                marginBottom:16 }}>FOR RESTAURANTS</p>
              {["Partner with Zoomo","Rider sign-up","support@zoomo.eats"].map(l => (
                <a key={l} href="#" style={{ display:"block", color:"rgba(255,255,255,0.65)", fontSize:14,
                  textDecoration:"none", marginBottom:10, transition:"color 120ms" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.65)"}
                >{l}</a>
              ))}
            </div>
          </div>

          {/* Areas */}
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:24, marginBottom:24 }}>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em",
              color:"rgba(255,255,255,0.35)", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
              <MapPinIcon /> AREAS WE RIDE
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {AREAS.map(a => (
                <span key={a} style={{ padding:"5px 14px", borderRadius:999,
                  border:"1px solid rgba(255,255,255,0.18)",
                  color:"rgba(255,255,255,0.65)", fontSize:12 }}>
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:20,
            display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <p style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>
              © {new Date().getFullYear()} Zoomo Eats. All rights reserved.
            </p>
            <p style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>
              Zoom it. Eat it. Love it.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function clamp(min, val, max) {
  return `clamp(${min}, ${val}, ${max})`;
}
