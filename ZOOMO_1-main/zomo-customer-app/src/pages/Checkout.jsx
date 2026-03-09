import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { cart, getSubtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  /* ===========================
     LOAD USER ADDRESSES
  =========================== */
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/addresses");

        // ✅ WORKS FOR BOTH api styles
        const list = Array.isArray(res) ? res : res?.data;

        if (Array.isArray(list) && list.length > 0) {
          setAddresses(list);
          setSelectedAddress(
            list.find((a) => a.isDefault)?.id || list[0].id
          );
        } else {
          setAddresses([]);
          setShowAddressForm(true);
        }
      } catch (err) {
        console.error("Failed to load addresses:", err);
        setShowAddressForm(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ===========================
     SAVE ADDRESS
  =========================== */
  async function handleSaveAddress() {
    if (
      !form.street.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.zipCode.trim()
    ) {
      return alert("Please fill all address fields.");
    }

    if (isNaN(form.zipCode)) {
      return alert("Zip code must be a number.");
    }

    try {
      const res = await api.post("/addresses", form);

      // ✅ normalize response
      const newAddress = res?.data ?? res;

      if (!newAddress?.id) {
        throw new Error("Invalid address response");
      }

      setAddresses((prev) => [...prev, newAddress]);
      setSelectedAddress(newAddress.id);
      setShowAddressForm(false);

      setForm({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
      });
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Error saving address.");
    }
  }

  /* ===========================
     PLACE ORDER
  =========================== */
  async function placeOrder() {
    if (!selectedAddress) return alert("Please select an address.");
    if (!paymentMethod) return alert("Please select a payment method.");
    if (!cart || cart.items.length === 0) return;

    setPlacingOrder(true);

    try {
      const payload = {
        restaurantId: cart.items[0].dish.restaurantId,
        addressId: selectedAddress,
        items: cart.items.map((i) => ({
          dishId: i.dish.id,
          quantity: i.quantity,
        })),
        paymentMethod,
      };

      await api.post("/orders", payload);

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (!cart || cart.items.length === 0) {
    return <div className="p-6 text-center">Your cart is empty.</div>;
  }

  if (loading) {
    return <div className="p-4">Loading checkout...</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      {/* ================= ADDRESS ================= */}
      <div className="mb-6 p-4 bg-white dark:bg-black/30 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-3">Delivery Address</h2>

        {showAddressForm ? (
          <div className="grid gap-3">
            {["street", "city", "state", "zipCode"].map((field) => (
              <input
                key={field}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10 text-black dark:text-white"
                value={form[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
              />
            ))}

            <div className="flex gap-3">
              <button
                onClick={handleSaveAddress}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl"
              >
                Save Address
              </button>

              <button
                onClick={() => setShowAddressForm(false)}
                className="flex-1 py-3 bg-gray-300 dark:bg-white/20 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className="flex gap-3 p-4 border border-gray-300 dark:border-white/20 rounded-xl mb-2 cursor-pointer"
              >
                <input
                  type="radio"
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                />

                <div>
                  <p className="font-semibold">
                    {addr.street}
                  </p>
                  <p className="text-sm opacity-70">
                    {addr.city}, {addr.state} - {addr.zipCode}
                  </p>
                </div>
              </label>
            ))}

            <button
              onClick={() => setShowAddressForm(true)}
              className="text-emerald-600 underline text-sm"
            >
              + Add new address
            </button>
          </>
        )}
      </div>

      {/* ================= PAYMENT ================= */}
      <div className="mb-6 p-4 bg-white dark:bg-black/30 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Payment Method</h2>

        <label className="block p-3 border rounded-xl mb-2 cursor-pointer">
          <input
            type="radio"
            name="payment"
            onChange={() => setPaymentMethod("COD")}
          />
          <span className="ml-2">Cash on Delivery</span>
        </label>

        <label className="block p-3 border rounded-xl opacity-50 cursor-not-allowed">
          <input type="radio" disabled />
          <span className="ml-2">Online Payment (Coming Soon)</span>
        </label>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="mb-6 p-4 bg-white dark:bg-black/30 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>

        {cart.items.map((i) => (
          <div key={i.id} className="flex justify-between mb-2">
            <span>{i.dish.name} × {i.quantity}</span>
            <span>₹{i.dish.price * i.quantity}</span>
          </div>
        ))}

        <div className="flex justify-between text-xl font-bold mt-3">
          <span>Total</span>
          <span>₹{getSubtotal()}</span>
        </div>
      </div>

      <button
        onClick={placeOrder}
        disabled={placingOrder}
        className="w-full bg-emerald-600 text-white py-3 rounded-xl text-lg"
      >
        {placingOrder ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
