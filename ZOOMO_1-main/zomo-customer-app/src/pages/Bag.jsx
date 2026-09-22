import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenLine } from "lucide-react";
import { useCart } from "../context/CartContext";
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
  Minus: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Plus: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Trash: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
  ),
  Store: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1-6h16l1 6"/><path d="M4 9h16v11H4z"/><path d="M9 21V13h6v8"/></svg>
  ),
  Bag: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  ),
};

export default function Bag() {
  const navigate = useNavigate();
  const { cart, loading, increaseQuantity, decreaseQuantity, removeItem, updateNote, getRestaurantGroups } = useCart();
  const [openNoteFor, setOpenNoteFor] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");

  if (loading) return <MascotLoader text="Loading your bag..." />;

  const groups = getRestaurantGroups();

  if (!cart || cart.items.length === 0) return (
    <div style={{ minHeight:"100vh", background:C.page, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", textAlign:"center", padding:"0 20px",
      fontFamily:"'Satoshi', system-ui, sans-serif" }}>
      <div style={{ fontSize:56, marginBottom:16, opacity:0.6 }}>🛍️</div>
      <h2 style={{ fontSize:22, fontWeight:700, color:C.textMain, marginBottom:6 }}>Your bag is empty</h2>
      <p style={{ color:C.textSub, fontSize:14, marginBottom:24 }}>Add food from any restaurant to get started!</p>
      <button onClick={() => navigate("/restaurants")}
        style={{ padding:"13px 26px", borderRadius:16, border:"none",
          background:`linear-gradient(135deg, ${C.primary} 0%, ${C.hover} 100%)`,
          color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit",
          boxShadow:"0 4px 16px rgba(15,61,45,0.25)" }}>
        Browse Restaurants
      </button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.page, paddingBottom:100,
      fontFamily:"'Satoshi', system-ui, sans-serif" }}>
      <style>{`@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');`}</style>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"28px 20px" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
          <button onClick={() => navigate(-1)}
            style={{ width:38, height:38, borderRadius:12, border:`1.5px solid ${C.border}`,
              background:C.surface, display:"flex", alignItems:"center", justifyContent:"center",
              color:C.textSub, cursor:"pointer", transition:"all 120ms" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}>
            <Icon.ArrowLeft />
          </button>
          <h1 style={{ fontSize:24, fontWeight:700, color:C.textMain, letterSpacing:"-0.015em" }}>Your Bag</h1>
        </div>
        <p style={{ fontSize:13, color:C.textMuted, marginBottom:24, marginLeft:50 }}>
          {groups.length} restaurant{groups.length !== 1 ? "s" : ""} · pick one to check out at a time
        </p>

        {/* Restaurant groups */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {groups.map(group => (
            <div key={group.restaurantId} style={{ borderRadius:20, background:C.surface,
              border:`1px solid ${C.border}`, overflow:"hidden" }}>

              {/* Restaurant header */}
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 18px",
                borderBottom:`1px solid ${C.borderSoft}`, background:C.page }}>
                {group.restaurantImage ? (
                  <img src={group.restaurantImage} alt={group.restaurantName}
                    style={{ width:40, height:40, borderRadius:10, objectFit:"cover", flexShrink:0 }} />
                ) : (
                  <div style={{ width:40, height:40, borderRadius:10, background:C.primary,
                    display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 }}>
                    <Icon.Store />
                  </div>
                )}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, fontSize:15, color:C.textMain,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {group.restaurantName}
                  </p>
                  <p style={{ fontSize:12, color:C.textMuted }}>
                    {group.itemCount} item{group.itemCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div style={{ padding:"12px 18px", display:"flex", flexDirection:"column", gap:10 }}>
                {group.items.map(item => (
                  <div key={item.id}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <img src={item.dish?.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop"}
                        alt={item.dish?.name} style={{ width:46, height:46, borderRadius:10, objectFit:"cover", flexShrink:0 }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontWeight:600, fontSize:13, color:C.textMain,
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {item.dish?.name}
                        </p>
                        <p style={{ color:C.primary, fontWeight:700, fontSize:13 }}>
                          ₹{(item.dish?.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                        <button onClick={() => decreaseQuantity(item)}
                          style={{ width:24, height:24, borderRadius:7, background:C.page, border:`1px solid ${C.border}`,
                            display:"flex", alignItems:"center", justifyContent:"center", color:C.textMain, cursor:"pointer" }}>
                          <Icon.Minus />
                        </button>
                        <span style={{ fontWeight:700, fontSize:12, color:C.textMain, width:14, textAlign:"center" }}>{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item)}
                          style={{ width:24, height:24, borderRadius:7, background:C.primary, border:"none",
                            display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", cursor:"pointer" }}>
                          <Icon.Plus />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)}
                        style={{ padding:6, background:"none", border:"none", color:C.textMuted,
                          cursor:"pointer", flexShrink:0, transition:"color 120ms" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#DC2626"}
                        onMouseLeave={e => e.currentTarget.style.color = C.textMuted}>
                        <Icon.Trash />
                      </button>
                    </div>

                    {/* Note — matches the reference site's per-item note */}
                    <div style={{ marginLeft:58, marginTop:4 }}>
                      {openNoteFor === item.id ? (
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <input autoFocus value={noteDraft} onChange={e => setNoteDraft(e.target.value)}
                            placeholder="e.g. no onions"
                            onKeyDown={e => e.key === "Enter" && (updateNote(item, noteDraft), setOpenNoteFor(null))}
                            style={{ flex:1, fontSize:12, padding:"6px 10px", borderRadius:8,
                              border:`1px solid ${C.border}`, outline:"none", fontFamily:"inherit", color:C.textMain }} />
                          <button onClick={() => { updateNote(item, noteDraft); setOpenNoteFor(null); }}
                            style={{ fontSize:12, fontWeight:600, color:C.accent, background:"none", border:"none", cursor:"pointer" }}>
                            Save
                          </button>
                        </div>
                      ) : item.specialInstructions ? (
                        <button onClick={() => { setOpenNoteFor(item.id); setNoteDraft(item.specialInstructions || ""); }}
                          style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:C.textSub,
                            background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:"inherit" }}>
                          <PenLine size={11} /> {item.specialInstructions}
                        </button>
                      ) : (
                        <button onClick={() => { setOpenNoteFor(item.id); setNoteDraft(""); }}
                          style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:C.textMuted,
                            background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:"inherit" }}>
                          <PenLine size={11} /> Add a note
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout with this restaurant */}
              <div style={{ padding:"14px 18px", borderTop:`1px solid ${C.borderSoft}` }}>
                <button onClick={() => navigate(`/checkout/${group.restaurantId}`)}
                  style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"13px 18px", borderRadius:14, border:"none",
                    background:`linear-gradient(135deg, ${C.primary} 0%, ${C.hover} 100%)`,
                    color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit",
                    boxShadow:"0 4px 14px rgba(15,61,45,0.22)", transition:"box-shadow 120ms" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,61,45,0.32)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(15,61,45,0.22)"}>
                  <span>Checkout with {group.restaurantName}</span>
                  <span>₹{group.subtotal.toFixed(0)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize:12, color:C.textMuted, textAlign:"center", marginTop:20, lineHeight:"18px" }}>
          Each restaurant checks out separately — items from other<br/>restaurants stay in your bag until you're ready for them.
        </p>
      </div>
    </div>
  );
}
