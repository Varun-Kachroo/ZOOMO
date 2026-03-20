import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin } from "react-icons/fi";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { MascotLoader } from "./LandingPage";


/* ── Order Success Animation ── */
function OrderSuccessAnimation({ onDone }) {
  const [stage, setStage] = useState("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("celebrate"), 600);
    const t2 = setTimeout(() => setStage("exit"), 3200);
    const t3 = setTimeout(() => onDone(), 3800);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center gap-6 transition-opacity duration-500 ${stage === "exit" ? "opacity-0" : "opacity-100"
        }`}
    >
      {/* Ripple rings */}
      <div className="relative flex items-center justify-center">
        {stage === "celebrate" && (
          <>
            <div className="absolute w-40 h-40 rounded-full border-2 border-emerald-500/30 animate-ping" />
            <div
              className="absolute w-56 h-56 rounded-full border border-emerald-500/10 animate-ping"
              style={{ animationDelay: "0.3s" }}
            />
          </>
        )}

        {/* Mascot */}
        <div
          className={`relative z-10 transition-all duration-500 ${stage === "enter"
              ? "scale-0 opacity-0"
              : stage === "celebrate"
                ? "scale-110 opacity-100"
                : "scale-100 opacity-100"
            }`}
        >
          <img
            src="/zoomo-mascot.png"
            alt="Zoomo"
            className={`w-32 h-32 ${stage === "celebrate" ? "animate-wiggle" : "animate-float"}`}
          />
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl -z-10" />
        </div>
      </div>

      {/* Confetti dots */}
      {stage === "celebrate" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-bounce"
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

      {/* Text */}
      <div
        className={`text-center transition-all duration-500 ${stage === "enter" ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          {/* Animated checkmark */}
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline
                points="20 6 9 17 4 12"
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
        <p className="text-emerald-400 font-medium text-sm">
          Zoomo is on it! 🍔 Your food is being prepared.
        </p>
        <p className="text-gray-500 text-xs mt-1">
          You'll receive updates in My Orders
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all ease-linear"
          style={{
            width: stage === "celebrate" ? "100%" : "0%",
            transitionDuration: stage === "celebrate" ? "2600ms" : "0ms",
          }}
        />
      </div>
    </div>
  );
}


/* ── Main Checkout ── */
export default function Checkout() {
  const { cart, getSubtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ street: "", city: "", state: "", zipCode: "", country: "India" });
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ NEW

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

  async function placeOrder() {
    if (!selectedAddress) return alert("Select a delivery address");
    if (!paymentMethod) return alert("Select a payment method");
    setPlacing(true);
    try {
      await api.post("/orders", {
        restaurantId: cart.items[0].dish.restaurantId,
        addressId: selectedAddress,
        items: cart.items.map(i => ({ dishId: i.dish.id, quantity: i.quantity })),
        paymentMethod,
      });
      setPlacing(false);
      setShowSuccess(true); // ✅ show animation instead of immediate navigate
    } catch {
      alert("Failed to place order. Try again.");
      setPlacing(false);
    }
  }

  if (loading) return <MascotLoader text="Loading checkout..." />;
  if (placing) return <MascotLoader text="Placing your order... 🍔" />;

  const subtotal = parseFloat(getSubtotal().toFixed(2));
  const delivery = 29;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = parseFloat((subtotal + delivery + tax).toFixed(2));

  return (
    <div className="min-h-screen bg-black text-white pb-10">

      {/* ✅ Order success animation — sits above everything */}
      {showSuccess && (
        <OrderSuccessAnimation onDone={() => navigate("/orders")} />
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition">
            <FiArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        {/* Address */}
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
                <input
                  key={f}
                  placeholder={f[0].toUpperCase() + f.slice(1)}
                  value={form[f]}
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

        {/* Payment */}
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

        {/* Summary */}
        <Section title="Order Summary">
          {cart.items.map(i => (
            <div key={i.id} className="flex justify-between text-sm text-gray-300">
              <span>{i.dish.name} × {i.quantity}</span>
              <span>₹{(i.dish.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-3 space-y-1 text-sm text-gray-400">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>₹{delivery}</span></div>
            <div className="flex justify-between"><span>Tax (5%)</span><span>₹{tax}</span></div>
            <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10">
              <span>Total</span><span>₹{total}</span>
            </div>
          </div>
        </Section>

        <button
          onClick={placeOrder}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition active:scale-[0.99]"
        >
          Place Order · ₹{total}
        </button>
      </div>
    </div>
  );
}


function Section({ title, children }) {
  return (
    <div className="mb-5 p-5 rounded-2xl bg-[#111] border border-white/10 space-y-3">
      <h3 className="font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

