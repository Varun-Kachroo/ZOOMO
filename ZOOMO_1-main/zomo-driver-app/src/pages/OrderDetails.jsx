import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useSwipeable } from "react-swipeable";
import BottomNav from "../components/BottomNav";
import {
  markOrderPickedUp,
  markOrderDelivered,
  fetchOrderDetails,
} from "../services/driverApi";
import { useDriverAuth } from "../context/DriverAuthContext";
import { useDriverLocation } from "../hooks/useDriverLocation";
import DriverMap from "../components/DriverMap";
import { getDistanceMeters } from "../utils/distance";
import {
  FiArrowLeft,
  FiChevronRight,
  FiUser,
  FiPackage,
  FiCreditCard,
  FiPhone,
  FiCopy,
  FiCheckCircle,
} from "react-icons/fi";

const PICKUP_RADIUS = 150;
const DELIVERY_RADIUS = 100;

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { driver } = useDriverAuth();
  const driverLocation = useDriverLocation();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [codPaymentConfirmed, setCodPaymentConfirmed] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const isOnline = Boolean(driver?.isAvailable);

  useEffect(() => {
    if (!isOnline) navigate("/home", { replace: true });
  }, [isOnline, navigate]);

  useEffect(() => {
    let mounted = true;
    setFetchError("");
    fetchOrderDetails(id)
      .then((data) => {
        if (!mounted) return;
        setOrder(data);
        setStatus(data.status);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("fetchOrderDetails error:", err);
        setFetchError("Could not load order. Please go back and retry.");
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const isPickupPhase = status === "READY_FOR_PICKUP";

  const target = useMemo(() => {
    if (!order) return null;
    return isPickupPhase ? order.restaurant : order.address;
  }, [order, isPickupPhase]);

  const distance = useMemo(() => {
    if (!driverLocation || !target?.lat || !target?.lng) return null;
    return getDistanceMeters(
      driverLocation.lat,
      driverLocation.lng,
      target.lat,
      target.lng
    );
  }, [driverLocation, target]);

  const isNearTarget = useMemo(() => {
    if (distance == null) return true;
    return isPickupPhase
      ? distance <= PICKUP_RADIUS
      : distance <= DELIVERY_RADIUS;
  }, [distance, isPickupPhase]);

  const paymentMethod = order?.payment?.method || "ONLINE";
  const isCOD = paymentMethod === "COD";

  const customerName = order?.customer?.name || "Customer";
  const customerPhone = order?.customer?.phone || null;

  async function handlePickup() {
    if (!order || loading) return;
    setLoading(true);
    try {
      await markOrderPickedUp(id);
      setStatus("OUT_FOR_DELIVERY");
    } catch (err) {
      console.error(err);
      alert("Failed to confirm pickup. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkDelivered() {
    if (!order) return;
    try {
      setUpdating(true);
      setUpdateError("");
      await markOrderDelivered(order.id);
      navigate("/delivery-complete");
    } catch (err) {
      console.error(err);
      setUpdateError("Failed to mark as delivered. Try again.");
    } finally {
      setUpdating(false);
    }
  }

  const swipeHandlers = useSwipeable({
    onSwipedRight: isPickupPhase ? handlePickup : handleMarkDelivered,
    delta: 90,
    trackMouse: true,
  });

  const copyAddress = () => {
    if (!order?.address) return;
    navigator.clipboard.writeText(
      `${order.address.street}, ${order.address.city}`
    );
  };

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-black">
        {fetchError ? (
          <>
            <p className="text-red-500 text-sm px-6 text-center">
              {fetchError}
            </p>
            <button
              onClick={() => navigate("/orders")}
              className="px-6 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold"
            >
              Back to Orders
            </button>
          </>
        ) : (
          <p className="text-gray-500 text-sm">Loading order...</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-white dark:bg-black">

      {/* HEADER */}
      <div className="relative h-44">
        <img
          src={order.restaurant?.imageUrl}
          alt={order.restaurant?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-white bg-black/40 p-2 rounded-full"
        >
          <FiArrowLeft />
        </button>
        <div className="absolute bottom-3 left-4 text-white">
          <h1 className="font-semibold">{order.restaurant?.name}</h1>
          <p className="text-xs">Order #{order.id?.slice(0, 8)}</p>
        </div>
      </div>

      {/* PHASE BANNER */}
      <div
        className={`mx-4 mt-4 px-4 py-2 rounded-xl font-semibold text-sm ${
          isPickupPhase
            ? "bg-amber-100 text-amber-800"
            : "bg-emerald-100 text-emerald-800"
        }`}
      >
        {isPickupPhase
          ? "Navigate to restaurant for pickup"
          : "Deliver order to customer"}
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* MAP */}
        <DriverMap
          restaurant={order.restaurant}
          customer={order.address}
          status={status}
        />

        {/* DISTANCE */}
        {distance !== null && (
          <div
            className={`text-center text-sm font-medium ${
              isNearTarget ? "text-green-600" : "text-red-500"
            }`}
          >
            {isNearTarget
              ? "You are near the target"
              : `${(distance / 1000).toFixed(2)} km away`}
          </div>
        )}

        {/* CUSTOMER */}
        <div className="p-4 rounded-xl border space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <FiUser /> Customer
          </div>
          <div className="flex justify-between items-start">
            <div className="text-sm">
              <div className="font-medium">{customerName}</div>
              <div className="text-gray-600">
                {order.address?.street}, {order.address?.city}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={copyAddress}>
                <FiCopy />
              </button>
              {customerPhone && (
                <a href={`tel:${customerPhone}`}>
                  <FiPhone />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ITEMS */}
        <div className="p-4 rounded-xl border space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <FiPackage /> Items
          </div>
          {order.items?.map((item) => {
            const qty = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            return (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.dish?.name ?? "Item"} x {qty}
                </span>
                <span>Rs.{(price * qty).toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        {/* PAYMENT */}
        <div className="p-4 rounded-xl border space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <FiCreditCard /> Payment
          </div>
          <div className="flex justify-between text-sm">
            <span>{paymentMethod}</span>
            <span className="font-semibold">
              Rs.{Number(order.total).toFixed(2)}
            </span>
          </div>

          {/* COD CASH TOGGLE */}
          {isCOD && status === "OUT_FOR_DELIVERY" && (
            <button
              onClick={() => setCodPaymentConfirmed((prev) => !prev)}
              className={`w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                codPaymentConfirmed
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-amber-400 bg-amber-50 text-amber-700"
              }`}
            >
              <FiCheckCircle
                className={`text-xl ${
                  codPaymentConfirmed ? "text-green-500" : "text-amber-400"
                }`}
              />
              {codPaymentConfirmed
                ? "Cash Collected"
                : "Tap to confirm cash collected"}
            </button>
          )}
        </div>

        {/* RESTAURANT ADDRESS */}
        {isPickupPhase && (
          <div className="p-4 rounded-xl border space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <FiUser /> Restaurant Address
            </div>
            <div className="text-sm">
              <div className="font-medium">{order.restaurant?.name}</div>
              <div className="text-gray-600">
                {order.restaurant?.address || "Address not available"}
              </div>
            </div>
          </div>
        )}

        {/* ERROR */}
        {updateError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 font-medium">{updateError}</p>
          </div>
        )}

        {/* PICKUP BUTTON */}
        {status === "READY_FOR_PICKUP" && (
          <button
            {...swipeHandlers}
            onClick={handlePickup}
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60 transition-all"
          >
            <FiChevronRight />
            {loading ? "Confirming..." : "Confirm Pickup"}
          </button>
        )}

        {/* DELIVERY BUTTON */}
        {status === "OUT_FOR_DELIVERY" && (
          <button
            {...swipeHandlers}
            onClick={handleMarkDelivered}
            disabled={updating || (isCOD && !codPaymentConfirmed)}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              isCOD && !codPaymentConfirmed
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <FiChevronRight />
            {updating
              ? "Completing..."
              : isCOD && !codPaymentConfirmed
              ? "Confirm Cash First"
              : "Confirm Delivery"}
          </button>
        )}

      </div>
      <BottomNav />
    </div>
  );
}
