import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiStar, FiClock, FiShoppingCart, FiPlus, FiMinus, FiTag } from "react-icons/fi";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { MascotLoader } from "./LandingPage";

export default function Restaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, increaseQuantity, decreaseQuantity, restaurantConflict, confirmReplaceCart, cancelReplaceCart } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [rest, menu] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/dishes?restaurantId=${id}`)
        ]);
        setRestaurant(rest);
        setDishes(Array.isArray(menu) ? menu : []);
      } catch {
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleAdd(dishId) {
    setAddingId(dishId);
    await addToCart(dishId);
    setAddingId(null);
  }

  const totalItems = cart?.items?.reduce((t, i) => t + i.quantity, 0) ?? 0;

  if (loading) return <MascotLoader text="Loading menu..." />;
  if (!restaurant) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <img src="/zoomo-mascot.png" alt="" className="w-20 opacity-30 mx-auto mb-4 animate-float" />
        <p className="text-gray-500">Restaurant not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm">Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-28">

      {/* Hero Banner */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img
          src={restaurant.imageUrl || `https://source.unsplash.com/1200x400/?restaurant`}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-black/70 transition"
        >
          <FiArrowLeft />
        </button>

        {/* Restaurant info overlay */}
        <div className="absolute bottom-5 left-4 right-4">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">{restaurant.name}</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <FiStar className="text-yellow-400 fill-yellow-400" size={13} /> {restaurant.rating?.toFixed(1) ?? "4.3"}
            </span>
            <span className="flex items-center gap-1">
              <FiClock size={13} /> 25-40 min
            </span>
            <span>{restaurant.cuisineType || "Various"}</span>
          </div>
          {restaurant.description && (
            <p className="text-gray-400 text-xs mt-1 line-clamp-1">{restaurant.description}</p>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <h2 className="text-xl font-bold text-white mb-4">Menu</h2>

        {dishes.length === 0 ? (
          <div className="text-center py-16">
            <img src="/zoomo-mascot.png" alt="" className="w-20 opacity-30 mx-auto mb-4 animate-float" />
            <p className="text-gray-500">No dishes available right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dishes.map(dish => {
              const item = cart?.items?.find(i => i.dish?.id === dish.id);
              const qty = item?.quantity ?? 0;
              const isAdding = addingId === dish.id;

              return (
                <div
                  key={dish.id}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#111] border border-white/10 hover:border-emerald-500/20 transition group"
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {/* Veg/Non-veg indicator */}
                    <div className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center mb-1.5 ${dish.isVegetarian ? "border-green-500" : "border-red-500"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${dish.isVegetarian ? "bg-green-500" : "bg-red-500"}`} />
                    </div>
                    <h3 className="font-semibold text-white text-sm truncate">{dish.name}</h3>
                    <p className="text-emerald-400 font-bold text-sm mt-0.5">₹{dish.price}</p>
                    {dish.description && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{dish.description}</p>}
                    {dish.calories && <p className="text-gray-600 text-[10px] mt-1">{dish.calories} kcal</p>}
                  </div>

                  {/* Image + Add button */}
                  <div className="relative shrink-0">
                    <img
                      src={dish.imageUrl || `https://source.unsplash.com/120x120/?${encodeURIComponent(dish.name)}`}
                      alt={dish.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                      {qty === 0 ? (
                        <button
                          onClick={() => handleAdd(dish.id)}
                          disabled={isAdding}
                          className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-[#111] border border-emerald-500 text-emerald-400 text-xs font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition shadow-lg disabled:opacity-50"
                        >
                          {isAdding ? (
                            <span className="flex gap-0.5">
                              {[0, 0.1, 0.2].map((d, i) => <span key={i} className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />)}
                            </span>
                          ) : (
                            <><FiPlus size={12} /> ADD</>
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 bg-emerald-600 rounded-xl px-2 py-1 shadow-lg">
                          <button onClick={() => decreaseQuantity(item)} className="w-5 h-5 flex items-center justify-center text-white hover:bg-emerald-700 rounded-lg">
                            <FiMinus size={11} />
                          </button>
                          <span className="text-white text-xs font-bold w-4 text-center">{qty}</span>
                          <button onClick={() => increaseQuantity(item)} className="w-5 h-5 flex items-center justify-center text-white hover:bg-emerald-700 rounded-lg">
                            <FiPlus size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Cart Footer */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-black/90 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/cart")}
              className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition text-white font-semibold active:scale-[0.99]"
            >
              <span className="bg-emerald-700 px-2 py-0.5 rounded-lg text-sm">{totalItems}</span>
              <span>View Cart</span>
              <FiShoppingCart size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Conflict Modal */}
      {restaurantConflict && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center">
            <img src="/zoomo-mascot.png" alt="" className="w-16 mx-auto mb-3 animate-wiggle" />
            <h2 className="text-lg font-bold text-white mb-2">Start a new cart?</h2>
            <p className="text-gray-400 text-sm mb-5">Your cart has items from another restaurant. Adding this will clear your current cart.</p>
            <div className="flex gap-3">
              <button onClick={cancelReplaceCart} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition text-sm">Cancel</button>
              <button onClick={confirmReplaceCart} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition text-sm font-semibold">Yes, replace</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
