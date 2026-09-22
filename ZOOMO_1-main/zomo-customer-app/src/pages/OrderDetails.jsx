import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { MascotLoader } from "./LandingPage";
import { useOrderTracking } from "../hooks/useOrderTracking";
import LiveTrackingMap from "../components/LiveTrackingMap";

const C = {
  page:"#F4F7F5", surface:"#FFFFFF", primary:"#0F3D2D", hover:"#164A39", accent:"#1F7A52",
  textMain:"#0C1612", textSub:"#6B7280", textMuted:"#9CA3AF", border:"#DCE6E0", borderSoft:"#EEF3F0",
};

// ✅ FIX: these keys never matched the real order.status values, which
// use underscores (READY_FOR_PICKUP, OUT_FOR_DELIVERY) — so the status
// pill always fell back to the default gray, never actually reflecting
// the real status color once an order moved past PREPARING.
const STATUS_STYLE = {
  SCHEDULED: { color:"#2563EB", bg:"#DBEAFE" },
  PENDING: { color:"#D97706", bg:"#FEF3C7" },
  PREPARING: { color:"#EA580C", bg:"#FFEDD5" },
  READY_FOR_PICKUP: { color:"#7C3AED", bg:"#EDE9FE" },
  OUT_FOR_DELIVERY: { color:"#0284C7", bg:"#E0F2FE" },
  DELIVERED: { color:"#16A34A", bg:"#DCFCE7" },
  CANCELLED: { color:"#DC2626", bg:"#FEE2E2" },
};

const STATUS_LABEL = {
  SCHEDULED: "Scheduled",
  PENDING: "Order Placed",
  PREPARING: "Preparing",
  READY_FOR_PICKUP: "Ready for Pickup",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STEPS = ["PENDING", "PREPARING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "DELIVERED"];

const Icon = {
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
  ),
  Check: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Live: () => (
    <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:"#22C55E" }} />
  ),
};

function Card({ title, children }) {
  return (
    <div style={{ padding:20, borderRadius:18, background:C.surface, border:`1px solid ${C.border}` }}>
      <h3 style={{ fontWeight:700, fontSize:14, color:C.textMain, marginBottom:12 }}>{title}</h3>
      {children}
    </div>
  );
}

function StatusStepper({ status }) {
  if (status === "CANCELLED") return null;
  const currentIndex = STEPS.indexOf(status);

  return (
    <div style={{ display:"flex", alignItems:"center", padding:"4px 4px 12px" }}>
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step} style={{ display:"flex", alignItems:"center", flex: isLast ? "0 0 auto" : 1 }}>
            <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0,
              background: done ? C.primary : C.borderSoft,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"background 300ms" }}>
              {done && <Icon.Check />}
            </div>
            {!isLast && (
              <div style={{ flex:1, height:3, borderRadius:2, margin:"0 4px",
                background: i < currentIndex ? C.primary : C.borderSoft,
                transition:"background 300ms" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ NEW — live position + live status pushed over the socket,
  // no polling or manual refresh needed.
  const { liveLocation, liveStatus, connected } = useOrderTracking(id);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <MascotLoader text="Loading order details..." />;

  // api.js resolves even on 401/404/500 with an error-shaped body
  // ({statusCode, message}) instead of rejecting — that body is
  // truthy but has no `id`, so guard on that too, not just !order.
  if (!order?.id) return (
    <div style={{ minHeight:"100vh", background:C.page, display:"flex", alignItems:"center",
      justifyContent:"center", fontFamily:"'Satoshi', system-ui, sans-serif" }}>
      <p style={{ color:C.textSub }}>Order not found</p>
    </div>
  );

  // Prefer whatever's come through live — falls back to the status
  // from the initial fetch until the first live update arrives.
  const currentStatus = liveStatus || order.status;
  const statusStyle = STATUS_STYLE[currentStatus] || { color:C.textSub, bg:C.borderSoft };

  const showTracking =
    order.driver &&
    (currentStatus === "READY_FOR_PICKUP" || currentStatus === "OUT_FOR_DELIVERY");

  // Driver's last-known position from the DB (persisted on every socket
  // update) as a starting point, until a live update arrives.
  const driverLocation = liveLocation || (
    order.driver?.currentLat && order.driver?.currentLng
      ? { lat: order.driver.currentLat, lng: order.driver.currentLng }
      : null
  );

  return (
    <div style={{ minHeight:"100vh", background:C.page, fontFamily:"'Satoshi', system-ui, sans-serif" }}>
      <style>{`@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');`}</style>

      <div style={{ maxWidth:600, margin:"0 auto", padding:"28px 20px 60px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button onClick={() => navigate("/orders")}
            style={{ width:38, height:38, borderRadius:12, border:`1.5px solid ${C.border}`,
              background:C.surface, display:"flex", alignItems:"center", justifyContent:"center",
              color:C.textSub, cursor:"pointer", transition:"all 120ms" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}>
            <Icon.ArrowLeft />
          </button>
          <h1 style={{ fontSize:20, fontWeight:700, color:C.textMain, flex:1 }}>
            Order #{order.id.slice(0, 6).toUpperCase()}
          </h1>
          <span style={{ fontSize:11, fontWeight:700, padding:"5px 12px", borderRadius:8,
            color:statusStyle.color, background:statusStyle.bg, whiteSpace:"nowrap",
            display:"flex", alignItems:"center", gap:5 }}>
            {connected && showTracking && <Icon.Live />}
            {STATUS_LABEL[currentStatus] || currentStatus}
          </span>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Progress stepper */}
          <Card title="Order Progress">
            <StatusStepper status={currentStatus} />
          </Card>

          {/* Live tracking map — only once a driver is assigned and
              actually moving toward pickup/delivery */}
          {showTracking && (
            <Card title="Live Tracking">
              <LiveTrackingMap
                restaurant={order.restaurant}
                address={order.address}
                driverLocation={driverLocation}
              />
              {order.driver?.user?.name && (
                <p style={{ marginTop:10, fontSize:13, color:C.textSub, textAlign:"center" }}>
                  {order.driver.user.name} is on the way
                  {order.driver.vehicleType ? ` · ${order.driver.vehicleType}` : ""}
                </p>
              )}
            </Card>
          )}

          {/* Restaurant */}
          <Card title="Restaurant">
            <p style={{ fontWeight:600, fontSize:14, color:C.textMain }}>{order.restaurant?.name}</p>
            <p style={{ color:C.textMuted, fontSize:12, marginTop:3 }}>{new Date(order.createdAt).toLocaleString()}</p>
          </Card>

          {/* Items */}
          <Card title="Items Ordered">
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                  <span style={{ color:C.textSub }}>{item.dish.name} × {item.quantity}</span>
                  <span style={{ fontWeight:600, color:C.textMain }}>₹{item.dish.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Bill */}
          <Card title="Bill Summary">
            <div style={{ display:"flex", flexDirection:"column", gap:8, fontSize:13, color:C.textSub }}>
              {order.subtotal && <div style={{ display:"flex", justifyContent:"space-between" }}><span>Subtotal</span><span>₹{order.subtotal}</span></div>}
              {order.deliveryFee > 0 && <div style={{ display:"flex", justifyContent:"space-between" }}><span>Delivery</span><span>₹{order.deliveryFee}</span></div>}
              {order.tax && <div style={{ display:"flex", justifyContent:"space-between" }}><span>Tax</span><span>₹{order.tax}</span></div>}
              <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:15,
                color:C.textMain, borderTop:`1px solid ${C.borderSoft}`, paddingTop:10, marginTop:2 }}>
                <span>Total</span><span>₹{order.total}</span>
              </div>
            </div>
          </Card>

          {/* Payment */}
          {order.payment && (
            <Card title="Payment">
              <div style={{ display:"flex", flexDirection:"column", gap:6, fontSize:13 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ color:C.textSub }}>Method</span>
                  <span style={{ color:C.textMain, fontWeight:600 }}>{order.payment.provider}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ color:C.textSub }}>Status</span>
                  <span style={{ color:C.accent, fontWeight:600 }}>{order.payment.status}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ color:C.textSub }}>Amount</span>
                  <span style={{ color:C.textMain, fontWeight:600 }}>₹{order.payment.amount}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
