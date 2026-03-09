import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";

export default function Cart() {
  const {
    cart,
    loading,
    decreaseQuantity,
    increaseQuantity,
    removeItem,
    getSubtotal,
    restaurantConflict,
    confirmReplaceCart,
    cancelReplaceCart,
  } = useCart();

  const navigate = useNavigate();
  const { dark } = useContext(ThemeContext); // ✅ Using theme context

  const pageBg = dark ? "bg-black" : "bg-[#f8fffb]";

  if (loading)
    return (
      <div className={`min-h-screen flex items-center justify-center ${pageBg} text-gray-600 dark:text-gray-300`}>
        Loading your cart...
      </div>
    );

  if (!cart || cart.items.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${pageBg} px-6 text-center`}>
        <img src="/empty-cart.png" className="w-40 opacity-90 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Start adding delicious food to your cart 🍕
        </p>
        <Link
          to="/restaurants"
          className="px-5 py-3 rounded-2xl bg-emerald-600 text-white 
          hover:brightness-110 active:scale-95 transition shadow-lg"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${pageBg} pt-24 pb-12 transition-colors`}>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          Your Cart 🛒
        </h1>

        <div className="space-y-5">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="
              bg-white/90 dark:bg-black/40 backdrop-blur-xl 
              rounded-3xl p-5 ring-1 ring-black/10 dark:ring-white/10 
              shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] 
              dark:shadow-[0_10px_40px_-12px_rgba(0,255,180,0.15)]
              flex items-center justify-between transition"
            >
              {/* Dish info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {item.dish.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">₹{item.dish.price}</p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-4">
                <button
                  className="
                  w-9 h-9 rounded-xl 
                  bg-gray-200 hover:bg-gray-300 
                  dark:bg-white/10 dark:hover:bg-white/20
                  hover:scale-110 active:scale-95 transition 
                  grid place-content-center"
                  onClick={() => decreaseQuantity(item)}
                >
                  <span className="text-xl">−</span>
                </button>

                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  {item.quantity}
                </span>

                <button
                  className="
                  w-9 h-9 rounded-xl 
                  bg-gray-200 hover:bg-gray-300 
                  dark:bg-white/10 dark:hover:bg-white/20
                  hover:scale-110 active:scale-95 transition 
                  grid place-content-center"
                  onClick={() => increaseQuantity(item)}
                >
                  <span className="text-xl">+</span>
                </button>
              </div>

              {/* Remove */}
              <button
                className="text-red-500 font-semibold hover:scale-105 transition"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div
          className="
          mt-8 bg-white/90 dark:bg-black/40 backdrop-blur-xl 
          rounded-3xl p-6 ring-1 ring-black/10 dark:ring-white/10 
          shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)]
          dark:shadow-[0_10px_40px_-12px_rgba(0,255,180,0.15)] transition"
        >
          <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
            <span>Subtotal</span>
            <span>₹{getSubtotal()}</span>
          </div>

          <button
            className="
            mt-5 w-full py-4 rounded-2xl bg-emerald-600 text-white text-lg font-semibold
            hover:brightness-110 active:scale-95 transition shadow-lg"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>

      {/* Restaurant Conflict Modal */}
      {restaurantConflict && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-black p-6 rounded-2xl shadow-xl text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Replace Cart?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your cart contains items from another restaurant. Adding this item
              will reset your cart. Do you want to proceed?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={cancelReplaceCart}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                onClick={confirmReplaceCart}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
