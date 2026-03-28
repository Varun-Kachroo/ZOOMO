import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { MascotLoader } from "./LandingPage";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, loading, increaseQuantity, decreaseQuantity, removeItem, getSubtotal, restaurantConflict, confirmReplaceCart, cancelReplaceCart } = useCart();

  if (loading) return <MascotLoader text="Loading cart..." />;

  if (!cart || cart.items.length === 0) return (
    <div className="min-h-screen bg-z-page flex flex-col items-center justify-center text-center px-4">
      <img src="/zoomo-mascot.png" alt="" className="w-28 opacity-60 mb-5 animate-float" />
      <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
      <p className="text-gray-500 text-sm mb-6">Add some delicious food to get started!</p>
      <button onClick={() => navigate("/restaurants")} className="px-6 py-3 rounded-2xl bg-z-primary text-white font-semibold hover:bg-z-hover transition">
        Browse Restaurants
      </button>
    </div>
  );

  const subtotal = parseFloat(getSubtotal().toFixed(2));
  const delivery = 29;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = parseFloat((subtotal + delivery + tax).toFixed(2));

  return (
    <div className="min-h-screen bg-z-page text-white pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition">
            <FiArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-white">Your Cart</h1>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-6">
          {cart.items.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-z-card border border-white/10">
              <img
                src={item.dish?.imageUrl || `https://source.unsplash.com/80x80/?food`}
                alt={item.dish?.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate">{item.dish?.name}</h3>
                <p className="text-z-accent text-sm font-bold mt-0.5">₹{item.dish?.price * item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => decreaseQuantity(item)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition">
                  <FiMinus size={12} />
                </button>
                <span className="text-white font-semibold text-sm w-4 text-center">{item.quantity}</span>
                <button onClick={() => increaseQuantity(item)} className="w-7 h-7 rounded-lg bg-z-primary flex items-center justify-center text-white hover:bg-z-hover transition">
                  <FiPlus size={12} />
                </button>
              </div>
              <button onClick={() => removeItem(item.id)} className="p-2 text-gray-600 hover:text-red-400 transition">
                <FiTrash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Bill */}
        <div className="p-5 rounded-2xl bg-z-card border border-white/10 mb-5 space-y-3">
          <h3 className="font-semibold text-white mb-3">Bill Details</h3>
          {[
            { label: "Subtotal", val: `₹${subtotal}` },
            { label: "Delivery Fee", val: `₹${delivery}` },
            { label: "Tax & charges (5%)", val: `₹${tax}` },
          ].map(r => (
            <div key={r.label} className="flex justify-between text-sm text-gray-400">
              <span>{r.label}</span><span>{r.val}</span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold">
            <span>Total</span><span>₹{total}</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full py-4 rounded-2xl bg-z-primary hover:bg-z-hover text-white font-semibold transition active:scale-[0.99]"
        >
          Proceed to Checkout · ₹{total}
        </button>
      </div>

      {/* Conflict Modal */}
      {restaurantConflict && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-z-card border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-bold text-white mb-2">Replace Cart?</h2>
            <p className="text-gray-400 text-sm mb-5">Your cart has items from another restaurant.</p>
            <div className="flex gap-3">
              <button onClick={cancelReplaceCart} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm">Cancel</button>
              <button onClick={confirmReplaceCart} className="flex-1 py-3 rounded-xl bg-z-primary text-white text-sm font-semibold">Replace</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}