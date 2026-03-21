import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiTag, FiX, FiCheck, FiClock, FiHeart } from "react-icons/fi";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { MascotLoader } from "./LandingPage";

/* ─────────────────────────────────────────
   VALID PROMO CODES
───────────────────────────────────────── */
const PROMO_CODES = {
  ZOOMO50: { type: "percent", value: 50, label: "50% off", max: 100 },
  BOGO: { type: "flat", value: 60, label: "₹60 off", max: null },
  FREESHIP: { type: "ship", value: 29, label: "Free delivery", max: null },
  HEALTHY20: { type: "percent", value: 20, label: "20% off", max: 80 },
  NEWUSER: { type: "flat", value: 80, label: "₹80 off", max: null },
};

const TIP_OPTIONS = [0, 10, 20, 30, 50];

/* ─────────────────────────────────────────
   ORDER SUCCESS ANIMATION
───────────────────────────────────────── */
function OrderSuccessAnimation({ onDone }) {
  const [stage, setStage] = useState("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("celebrate"), 600);
    const t2 = setTimeout(() => setStage("exit"), 3200);
    const t3 = setTimeout(() => onDone(), 3800);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div className={`fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center gap-6 transition-opacity duration-500 ${stage === "exit" ? "opacity-0" : "opacity-100"}`}>
      <div className="relative flex items-center justify-center">
        {stage === "celebrate" && (
          <>
            <div className="absolute w-40 h-40 rounded-full border-2 border-emerald-500/30 animate-ping" />
            <div className="absolute w-56 h-56 rounded-full border border-emerald-500/10 animate-ping" style={{ animationDelay: "0.3s" }} />
          </>
        )}
        <div className={`relative z-10 transition-all duration-500 ${stage === "enter" ? "scale-0 opacity-0" : stage === "celebrate" ? "scale-110 opacity-100" : "scale-100 opacity-100"}`}>
          <img src="/zoomo-mascot.png" alt="Zoomo" className={`w-32 h-32 ${stage === "celebrate" ? "animate-wiggle" : "animate-float"}`} />
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl -z-10" />
        </div>
      </div>

      {stage === "celebrate" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: ["#10b981", "#34d399", "#6ee7b7", "#fff", "#fbbf24"][i % 5],
                left: `${5 + (i * 4.7) % 90}%`,
                top: `${10 + (i * 7.3) % 70}%`,
                animationDelay: `${(i * 0.1) % 0.8}s`,
                animationDuration: `${0.6 + (i % 4) * 0.2}s`,
                opacity: 0.7 + (i % 3) * 0.1,
              }}
            />
          ))}
        </div>
      )}

      <div className={`text-center transition-all duration-500 ${stage === "enter" ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"
                style={{
                  strokeDasharray: 30,
                  strokeDashoffset: stage === "celebrate" ? 0 : 30,
                  transition: "stroke-dashoffset 0.5s ease 0.3s",
                }}
              />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Order Placed!</h2>
        </div>
        <p className="text-emerald-400 font-medium text-sm">Zoomo is on it! 🍔 Your food is being prepared.</p>
        <p className="text-gray-500 text-xs mt-1">You'll receive updates in My Orders</p>
      </div>

      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full transition-all ease-linear"
          style={{ width: stage === "celebrate" ? "100%" : "0%", transitionDuration: stage === "celebrate" ? "2600ms" : "0ms" }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PROMO APPLIED FLASH
───────────────────────────────────────── */
function PromoFlash({ promo, onDone }) {
  const [visible, setVisible] = useState(true);
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setPopped(true), 50);
    const t1 = setTimeout(() => setVisible(false), 2400);
    const t2 = setTimeout(() => onDone(), 2900);
    return () => [t0, t1, t2].forEach(clearTimeout);
  }, []);

  return (
    <div className={`fixed inset-0 z-[998] pointer-events-none flex items-end justify-center pb-28 transition-all duration-500 ${visible ? "opacity-100" : "opacity-0 translate-y-4"}`}>
      <div className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all duration-500 ease-out bg-[#0a1a0f] border-emerald-500/40 shadow-[0_0_60px_rgba(16,185,129,0.35)] ${popped ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-6 opacity-0"}`}>
        <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 blur-xl" />
        <div className={`relative w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center transition-transform duration-700 ${popped ? "rotate-0" : "-rotate-45"}`}>
          <FiTag className="text-emerald-400" size={18} />
        </div>
        <div className="relative">
          <p className="text-white font-bold text-sm tracking-wide">
            🎉 <span className="text-emerald-400">{promo.code}</span> applied!
          </p>
          <p className="text-emerald-600 text-xs mt-0.5">{promo.label} saved on your order</p>
        </div>
        <div className="absolute bottom-0 left-0 h-[2px] w-full rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            style={{ animation: popped ? "shimmer 2s linear forwards" : "none" }}
          />
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); opacity: 1; }
          100% { transform: translateX(100%);  opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN CHECKOUT
───────────────────────────────────────── */
export default function Checkout() {
  const { cart, getSubtotal, clearCart } = useCart(); // ✅ destructure clearCart
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ street: "", city: "", state: "", zipCode: "", country: "India" });
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Promo
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [showPromoFlash, setShowPromoFlash] = useState(false);

  // Tip
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const [showCustomTip, setShowCustomTip] = useState(false);

  // Schedule
  const [scheduleDelivery, setScheduleDelivery] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/addresses");
        const list = Array.isArray(res) ? res : res?.data ?? [];
        setAddresses(list);
        if (list.length > 0) setSelectedAddress(list[0].id);
        else setShowForm(true);
      } catch { setShowForm(true); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const minDate = new Date().toISOString().split("T")[0];

  function getTimeSlots() {
    const slots = [];
    const now = new Date();
    const start = new Date(now);
    start.setMinutes(Math.ceil(start.getMinutes() / 30) * 30 + 30, 0, 0);
    const end = new Date(now);
    end.setHours(23, 30, 0, 0);
    while (start <= end) {
      slots.push(start.toTimeString().slice(0, 5));
      start.setMinutes(start.getMinutes() + 30);
    }
    return slots;
  }

  /* ── Promo logic ── */
  function applyPromo() {
    setPromoError("");
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const found = PROMO_CODES[code];
    if (!found) {
      setPromoError("Invalid promo code. Try ZOOMO50, BOGO or FREESHIP.");
      return;
    }
    setAppliedPromo({ code, ...found });
    setPromoInput("");
    setShowPromoFlash(true);
  }

  function removePromo() {
    setAppliedPromo(null);
    setPromoError("");
    setPromoInput("");
  }

  /* ── Save address ── */
  async function saveAddress() {
    if (!form.street || !form.city || !form.state || !form.zipCode) return alert("Fill all fields");
    try {
      const res = await api.post("/addresses", form);
      const addr = res?.data ?? res;
      setAddresses(p => [...p, addr]);
      setSelectedAddress(addr.id);
      setShowForm(false);
    } catch { alert("Failed to save address"); }
  }

  /* ── Place order ── */
  async function placeOrder() {
    if (!selectedAddress) return alert("Select a delivery address");
    if (!paymentMethod) return alert("Select a payment method");
    if (scheduleDelivery && (!scheduleDate || !scheduleTime)) return alert("Select a delivery date and time");
    setPlacing(true);
    try {
      await api.post("/orders", {
        restaurantId: cart.items[0].dish.restaurantId,
        addressId: selectedAddress,
        items: cart.items.map(i => ({ dishId: i.dish.id, quantity: i.quantity })),
        paymentMethod,
        promoCode: appliedPromo?.code ?? null,
        tip: tip,
        scheduledFor: scheduleDelivery ? `${scheduleDate}T${scheduleTime}:00` : null,
      });
      await clearCart(); // ✅ clear cart after successful order
      setPlacing(false);
      setShowSuccess(true);
    } catch {
      alert("Failed to place order. Try again.");
      setPlacing(false);
    }
  }

  if (loading) return <MascotLoader text="Loading checkout..." />;
  if (placing) return <MascotLoader text="Placing your order... 🍔" />;

  /* ── Bill calculations ── */
  const subtotal = parseFloat(getSubtotal().toFixed(2));
  const delivery = appliedPromo?.type === "ship" ? 0 : 29;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const tipAmount = showCustomTip && customTip
    ? parseFloat(parseFloat(customTip).toFixed(2)) || 0
    : tip;

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "percent") {
      discount = parseFloat(
        Math.min(subtotal * appliedPromo.value / 100, appliedPromo.max ?? Infinity).toFixed(2)
      );
    } else if (appliedPromo.type === "flat") {
      discount = parseFloat(Math.min(appliedPromo.value, subtotal).toFixed(2));
    }
  }

  // ✅ Integer paise math — eliminates floating point drift
  const total = (
    Math.round(subtotal * 100) +
    Math.round(delivery * 100) +
    Math.round(tax * 100) +
    Math.round(tipAmount * 100) -
    Math.round(discount * 100)
  ) / 100;

  return (
    <div className="min-h-screen bg-black text-white pb-10">

      {showSuccess && <OrderSuccessAnimation onDone={() => navigate("/orders")} />}
      {showPromoFlash && appliedPromo && (
        <PromoFlash promo={appliedPromo} onDone={() => setShowPromoFlash(false)} />
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition">
            <FiArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        {/* ── Delivery Address ── */}
        <Section title="Delivery Address">
          {!showForm && addresses.map(a => (
            <label key={a.id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${selectedAddress === a.id ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5"}`}>
              <input type="radio" checked={selectedAddress === a.id} onChange={() => setSelectedAddress(a.id)} className="mt-1 accent-emerald-600" />
              <div>
                <FiMapPin className="text-emerald-500 inline mr-1" size={13} />
                <span className="text-white text-sm font-medium">{a.street}</span>
                <p className="text-gray-400 text-xs mt-0.5">{a.city}, {a.state} - {a.zipCode}</p>
              </div>
            </label>
          ))}
          {showForm && (
            <div className="space-y-3">
              {["street", "city", "state", "zipCode"].map(f => (
                <input key={f} placeholder={f[0].toUpperCase() + f.slice(1)} value={form[f]}
                  onChange={e => setForm({ ...form, [f]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              ))}
              <div className="flex gap-3">
                <button onClick={saveAddress} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition">Save Address</button>
                {addresses.length > 0 && <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm">Cancel</button>}
              </div>
            </div>
          )}
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="text-emerald-500 text-sm hover:underline">+ Add new address</button>
          )}
        </Section>

        {/* ── Schedule Delivery ── */}
        <Section title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiClock className="text-emerald-500" size={15} />
              <span>Schedule Delivery</span>
            </div>
            <button
              onClick={() => setScheduleDelivery(v => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${scheduleDelivery ? "bg-emerald-600" : "bg-white/10"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${scheduleDelivery ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        }>
          {!scheduleDelivery ? (
            <p className="text-gray-500 text-xs">Deliver as soon as possible (25–40 min)</p>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-400 text-xs">Pick a date and time for your delivery</p>
              {/* ✅ FIXED — stacks on mobile, side by side on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Date</label>
                  <input
                    type="date"
                    min={minDate}
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Time</label>
                  <select
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="" className="bg-black">Select time</option>
                    {getTimeSlots().map(t => (
                      <option key={t} value={t} className="bg-black">{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              {scheduleDate && scheduleTime && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  <FiCheck size={12} />
                  Scheduled for {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </div>
              )}
            </div>
          )}
        </Section>

        {/* ── Tip the delivery partner ── */}
        <Section title={
          <div className="flex items-center gap-2">
            <FiHeart className="text-pink-400" size={15} />
            <span>Tip Your Delivery Partner</span>
          </div>
        }>
          <p className="text-gray-500 text-xs">100% of the tip goes directly to your delivery partner 💚</p>
          <div className="flex gap-2 flex-wrap mt-1">
            {TIP_OPTIONS.map(t => (
              <button
                key={t}
                onClick={() => { setTip(t); setShowCustomTip(false); setCustomTip(""); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${tip === t && !showCustomTip
                  ? "bg-pink-500/20 border-pink-500/50 text-pink-300"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
              >
                {t === 0 ? "No tip" : `₹${t}`}
              </button>
            ))}
            <button
              onClick={() => { setShowCustomTip(true); setTip(0); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${showCustomTip
                ? "bg-pink-500/20 border-pink-500/50 text-pink-300"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
            >
              Custom
            </button>
          </div>
          {showCustomTip && (
            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
                type="number"
                min="0"
                max="500"
                placeholder="Enter amount"
                value={customTip}
                onChange={e => setCustomTip(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
            </div>
          )}
        </Section>

        {/* ── Payment Method ── */}
        <Section title="Payment Method">
          {[
            { id: "COD", label: "Cash on Delivery", sub: "Pay when your order arrives" },
            { id: "ONLINE", label: "Online Payment", sub: "Coming soon", disabled: true },
          ].map(p => (
            <label key={p.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${p.disabled ? "opacity-40 cursor-not-allowed" : ""} ${paymentMethod === p.id ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5"}`}>
              <input type="radio" name="payment" disabled={p.disabled} checked={paymentMethod === p.id} onChange={() => !p.disabled && setPaymentMethod(p.id)} className="accent-emerald-600" />
              <div>
                <p className="text-white text-sm font-medium">{p.label}</p>
                <p className="text-gray-400 text-xs">{p.sub}</p>
              </div>
            </label>
          ))}
        </Section>

        {/* ── Promo Code ── */}
        <Section title={
          <div className="flex items-center gap-2">
            <FiTag className="text-emerald-500" size={15} />
            <span>Promo Code</span>
          </div>
        }>
          {appliedPromo ? (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2">
                <FiTag className="text-emerald-400" size={14} />
                <div>
                  <p className="text-emerald-400 font-bold text-sm">{appliedPromo.code}</p>
                  <p className="text-emerald-600 text-xs">{appliedPromo.label} applied!</p>
                </div>
              </div>
              <button onClick={removePromo} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 transition">
                <FiX size={14} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={promoInput}
                  onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                  onKeyDown={e => e.key === "Enter" && applyPromo()}
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm uppercase tracking-wider"
                />
                <button
                  onClick={applyPromo}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <FiX size={11} /> {promoError}
                </p>
              )}
              <div className="flex gap-2 flex-wrap">
                {Object.entries(PROMO_CODES).map(([code, info]) => (
                  <button
                    key={code}
                    onClick={() => { setPromoInput(code); setPromoError(""); }}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 transition"
                  >
                    {code} · {info.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </Section>

        {/* ── Order Summary ── */}
        <Section title="Order Summary">
          {cart.items.map(i => (
            <div key={i.id} className="flex justify-between text-sm text-gray-300">
              <span>{i.dish.name} × {i.quantity}</span>
              <span>₹{(i.dish.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-3 space-y-1.5 text-sm text-gray-400">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between">
              <span>Delivery</span>
              {appliedPromo?.type === "ship"
                ? <span className="text-emerald-400">FREE</span>
                : <span>₹{delivery.toFixed(2)}</span>
              }
            </div>
            <div className="flex justify-between"><span>Tax (5%)</span><span>₹{tax.toFixed(2)}</span></div>
            {tipAmount > 0 && (
              <div className="flex justify-between text-pink-400">
                <span>Tip 💚</span><span>₹{tipAmount.toFixed(2)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount ({appliedPromo?.code})</span>
                <span>− ₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10">
              <span>Total</span><span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </Section>

        <button
          onClick={placeOrder}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition active:scale-[0.99]"
        >
          {scheduleDelivery && scheduleDate && scheduleTime
            ? `Schedule Order · ₹${total.toFixed(2)}`
            : `Place Order · ₹${total.toFixed(2)}`}
        </button>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5 p-5 rounded-2xl bg-[#111] border border-white/10 space-y-3">
      <h3 className="font-semibold text-white flex items-center">{title}</h3>
      {children}
    </div>
  );
}