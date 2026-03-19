import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiCheck } from "react-icons/fi";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { MascotLoader } from "./LandingPage";

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
      navigate("/orders");
    } catch { alert("Failed to place order. Try again."); }
    finally { setPlacing(false); }
  }

  if (loading) return <MascotLoader text="Loading checkout..." />;
  if (placing) return <MascotLoader text="Placing your order... 🍔" />;

  const subtotal = getSubtotal();
  const delivery = 29;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  return (
    <div className="min-h-screen bg-black text-white pb-10">
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
              <span>₹{i.dish.price * i.quantity}</span>
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
