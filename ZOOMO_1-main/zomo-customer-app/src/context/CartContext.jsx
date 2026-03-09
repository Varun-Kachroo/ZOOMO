import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const EMPTY_CART = { items: [] };

export default function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(true);
  const [restaurantConflict, setRestaurantConflict] = useState(null);

  /* ================= LOAD CART ================== */
  useEffect(() => {
    if (!isAuthenticated) {
      setCart(EMPTY_CART);
      setLoading(false);
      return;
    }
    loadCart();
  }, [isAuthenticated]);

  async function loadCart() {
  setLoading(true);
  try {
    const res = await api.get("/cart");

    const normalized = {
      items: Array.isArray(res?.items) ? res.items : [],
    };

    setCart(normalized);

  } catch (err) {
    console.warn("❌ Could not load cart:", err);
    setCart(EMPTY_CART);
  } finally {
    setLoading(false);
  }
}


  /* ================= ADD ITEM ================== */
  /* ================= ADD ITEM ================== */
async function addToCart(dishId) {
  try {
    console.log("🛒 Add clicked:", dishId);

    const dishRes = await api.get(`/dishes/${dishId}`);
    console.log("🔍 Raw dish response:", dishRes);

    const dish = dishRes?.data || dishRes; // normalize
    console.log("🍽 Normalized dish:", dish);

    if (!dish || !dish.restaurantId) {
      console.warn("❌ Dish missing restaurantId → Check backend response", dish);
      return;
    }

    const newRestaurantId = dish.restaurantId;

    const currentItems = Array.isArray(cart?.items) ? cart.items : [];

    // 🍽️ Restaurant conflict check
    if (
      currentItems.length > 0 &&
      currentItems[0]?.dish?.restaurantId !== newRestaurantId
    ) {
      console.warn("⚠️ Conflict detected → opening confirmation modal");
      setRestaurantConflict({ newDishId: dishId, newRestaurantId });
      return;
    }

    console.log("📦 Sending add item request to backend...");
    const added = await api.post("/cart/items", { dishId, quantity: 1 });
    console.log("📩 Backend response to add:", added);

    await loadCart();

  } catch (error) {
    console.error("❌ Add to cart failed:", error);
  }
}



  /* ============ CONFLICT HANDLING ============ */
  async function confirmReplaceCart() {
    if (!restaurantConflict) return;
    await clearCart();
    await addToCart(restaurantConflict.newDishId);
    setRestaurantConflict(null);
  }

  function cancelReplaceCart() {
    setRestaurantConflict(null);
  }

  /* ============ UPDATE / REMOVE ITEMS ============ */
  async function increaseQuantity(item) {
    await api.patch(`/cart/items/${item.id}`, { quantity: item.quantity + 1 });
    await loadCart();
  }

  async function decreaseQuantity(item) {
    const newQty = item.quantity - 1;

    if (newQty <= 0) {
      return removeItem(item.id);
    }

    await api.patch(`/cart/items/${item.id}`, { quantity: newQty });
    await loadCart();
  }

  async function removeItem(id) {
    await api.delete(`/cart/items/${id}`);
    await loadCart();
  }

  async function clearCart() {
    await api.delete("/cart");
    setCart(EMPTY_CART);
  }

  /* ============ DERIVED GETTERS ============ */
  const getTotalItemCount = () =>
    cart.items.reduce((sum, i) => sum + i.quantity, 0);

  const getSubtotal = () =>
    cart.items.reduce((sum, i) => sum + i.quantity * i.dish.price, 0);

  /* ============ EXPORT ============ */
  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        getTotalItemCount,
        getSubtotal,
        restaurantConflict,
        confirmReplaceCart,
        cancelReplaceCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
