import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import ThemeContext from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

export default function Restaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dark } = useContext(ThemeContext);

  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    restaurantConflict,
    confirmReplaceCart,
    cancelReplaceCart,
  } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD RESTAURANT + DISHES ================= */
  useEffect(() => {
    async function load() {
      try {
        const rest = await api.get(`/restaurants/${id}`);
        const menu = await api.get(`/dishes?restaurantId=${id}`);

        setRestaurant(rest || null);
        setDishes(Array.isArray(menu) ? menu : []);

      } catch (err) {
        console.error("❌ Failed to load restaurant:", err);
        setRestaurant(null);
        setDishes([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-xl">Loading...</div>;

  if (!restaurant) {
    return (
      <div className="p-6 text-center text-red-500">
        ❌ Restaurant unavailable or not found.
      </div>
    );
  }

  const totalItems = cart?.items?.reduce((t, i) => t + i.quantity, 0) || 0;

  /* ================= UI ================= */
  return (
    <div className={`min-h-screen ${dark ? "bg-black" : "bg-[#f7fff9]"}`}>

      {/* ===== Banner ===== */}
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={restaurant.imageUrl || "https://source.unsplash.com/1200x600/?restaurant"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-5 left-6 text-white">
          <h1 className="text-3xl font-bold drop-shadow-lg">{restaurant.name}</h1>
          <p className="opacity-90 text-sm">{restaurant.description}</p>
        </div>
      </div>

      {/* ===== Menu ===== */}
      <div className="max-w-4xl mx-auto px-4 mt-6 pb-24">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Menu</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {dishes.map((dish) => {
            const item = cart?.items?.find((i) => i.dish?.id === dish.id);
            const qty = item?.quantity || 0;

            return (
              <div
                key={dish.id}
                className="rounded-3xl p-4 ring-1 ring-black/10 dark:ring-white/10 bg-white/90 dark:bg-[#0f0f0f]/80 shadow-md hover:shadow-xl transition"
              >
                {/* Dish Info */}
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white">{dish.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{dish.description}</p>
                    <p className="mt-2 font-bold text-emerald-600">₹{dish.price}</p>
                  </div>
                  <img
                    src={dish.imageUrl || "https://source.unsplash.com/150x150/?food"}
                    className="w-20 h-20 rounded-xl object-cover ml-3"
                    alt={dish.name}
                  />
                </div>

                {/* ===== Add / Update Buttons ===== */}
                <div className="mt-4">
                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(dish.id)}
                      className="w-full bg-emerald-600 text-white py-2 rounded-xl font-semibold"
                    >
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-200 dark:bg-white/10 p-2 rounded-xl">
                      <button
                        disabled={!item}
                        onClick={() => item && decreaseQuantity(item)}
                        className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg font-bold text-xl"
                      >
                        −
                      </button>

                      <span className="text-lg font-semibold dark:text-white">
                        {qty}
                      </span>

                      <button
                        disabled={!item}
                        onClick={() => item && increaseQuantity(item)}
                        className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg font-bold text-xl"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Sticky Footer ===== */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-black p-4 flex justify-between border-t border-gray-200 dark:border-white/10">
        <span className="font-semibold dark:text-white">🛒 {totalItems} items</span>
        <button
          onClick={() => navigate("/cart")}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          View Cart →
        </button>
      </div>

      {/* ===== Conflict Modal ===== */}
      {restaurantConflict && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center">
          <div className="bg-white dark:bg-black p-6 rounded-2xl">
            <h2 className="text-lg font-bold dark:text-white mb-3">Replace Cart?</h2>
            <p className="text-sm mb-4 dark:text-gray-300">
              Your cart contains food from another restaurant.
            </p>
            <button onClick={cancelReplaceCart} className="mr-2 px-3 py-2 rounded bg-gray-300">
              Cancel
            </button>
            <button onClick={confirmReplaceCart} className="px-3 py-2 rounded bg-emerald-600 text-white">
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
