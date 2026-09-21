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
      setCart({ items: Array.isArray(res?.items) ? res.items : [] });
    } catch (err) {
      console.warn("❌ Could not load cart:", err);
      setCart(EMPTY_CART);
    } finally {
      setLoading(false);
    }
  }

  /* ================= ADD ITEM ================== */
  // ✅ FIX: the Bag now holds items from any number of restaurants at
  // once — no more client-side conflict check, no more wiping the cart
  // when a dish from a different restaurant is added. Just add it.
  async function addToCart(dishId, quantity = 1) {
    try {
      await api.post("/cart/items", { dishId, quantity });
      await loadCart();
    } catch (error) {
      console.error("❌ Add to cart failed:", error);
    }
  }

  /* ============ UPDATE / REMOVE ITEMS ============ */
  async function increaseQuantity(item) {
    await api.patch(`/cart/items/${item.id}`, { quantity: item.quantity + 1 });
    await loadCart();
  }

  async function decreaseQuantity(item) {
    const newQty = item.quantity - 1;
    if (newQty <= 0) return removeItem(item.id);
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

  // ✅ NEW — clears just one restaurant's items after checking out with
  // them, leaving the rest of the bag (other restaurants) intact.
  async function clearRestaurantItems(restaurantId) {
    await api.delete(`/cart/restaurant/${restaurantId}`);
    await loadCart();
  }

  /* ============ DERIVED GETTERS ============ */
  const getTotalItemCount = () =>
    cart.items.reduce((sum, i) => sum + i.quantity, 0);

  // Subtotal across the WHOLE bag (all restaurants combined)
  const getSubtotal = () =>
    cart.items.reduce((sum, i) => sum + i.quantity * i.dish.price, 0);

  // ✅ NEW — groups bag items by restaurant, so the Bag page can show
  // one section per restaurant with its own subtotal and checkout button.
  // Each dish already carries its restaurant (backend include), so this
  // is a pure client-side grouping — no extra API calls needed.
  function getRestaurantGroups() {
    const groups = {};
    for (const item of cart.items) {
      const r = item.dish?.restaurant;
      if (!r) continue;
      if (!groups[r.id]) {
        groups[r.id] = {
          restaurantId: r.id,
          restaurantName: r.name,
          restaurantImage: r.imageUrl,
          items: [],
          subtotal: 0,
          itemCount: 0,
        };
      }
      groups[r.id].items.push(item);
      groups[r.id].subtotal += item.quantity * item.dish.price;
      groups[r.id].itemCount += item.quantity;
    }
    return Object.values(groups);
  }

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
        clearRestaurantItems,
        getTotalItemCount,
        getSubtotal,
        getRestaurantGroups,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
