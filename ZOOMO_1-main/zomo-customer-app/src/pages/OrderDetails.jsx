import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { MascotLoader } from "./LandingPage";

const C = {
  page: "#F5F7F6", surface: "#FFFFFF", primary: "#0F3D2E", hover: "#145A43", accent: "#22C55E",
  textMain: "#0B0F0E", textSub: "#6B7280", textMuted: "#9CA3AF", border: "#E5E7EB", borderSoft: "#F0F2F1",
};

const STATUS_STYLE = {
  PENDING: { color: "#D97706", bg: "#FEF3C7" },
  CONFIRMED: { color: "#2563EB", bg: "#DBEAFE" },
  PREPARING: { color: "#EA580C", bg: "#FFEDD5" },
  READYFORPICKUP: { color: "#7C3AED", bg: "#EDE9FE" },
  OUTFORDELIVERY: { color: "#0284C7", bg: "#E0F2FE" },
  DELIVERED: { color: "#16A34A", bg: "#DCFCE7" },
  CANCELLED: { color: "#DC2626", bg: "#FEE2E2" },
};

const Icon = {
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
  ),
};

function Card({ title, children }) {
  return (
    <div style={{ padding: 20, borderRadius: 18, background: C.surface, border: `1px solid ${C.border}` }}>
      <h3 style={{ fontWeight: 700, fontSize: 14, color: C.textMain, marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  );
}

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <MascotLoader text="Loading order details..." />;

  if (!order) return (
    <div style={{
      minHeight: "100vh", background: C.page, display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "'Poppins', system-ui, sans-serif"
    }}>
      <p style={{ color: C.textSub }}>Order not found</p>
    </div>
  );

  const statusStyle = STATUS_STYLE[order.status] || { color: C.textSub, bg: C.borderSoft };

  return (
    <div style={{ minHeight: "100vh", background: C.page, fontFamily: "'Poppins', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "28px 20px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => navigate("/orders")}
            style={{
              width: 38, height: 38, borderRadius: 12, border: `1.5px solid ${C.border}`,
              background: C.surface, display: "flex", alignItems: "center", justifyContent: "center",
              color: C.textSub, cursor: "pointer", transition: "all 120ms"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}>
            <Icon.ArrowLeft />
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.textMain, flex: 1 }}>
            Order #{order.id.slice(0, 6).toUpperCase()}
          </h1>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 8,
            color: statusStyle.color, background: statusStyle.bg, whiteSpace: "nowrap"
          }}>
            {order.status}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Restaurant */}
          <Card title="Restaurant">
            <p style={{ fontWeight: 600, fontSize: 14, color: C.textMain }}>{order.restaurant?.name}</p>
            <p style={{ color: C.textMuted, fontSize: 12, marginTop: 3 }}>{new Date(order.createdAt).toLocaleString()}</p>
          </Card>

          {/* Items */}
          <Card title="Items Ordered">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: C.textSub }}>{item.dish.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600, color: C.textMain }}>₹{item.dish.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Bill */}
          <Card title="Bill Summary">
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: C.textSub }}>
              {order.subtotal && <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>₹{order.subtotal}</span></div>}
              {order.deliveryFee && <div style={{ display: "flex", justifyContent: "space-between" }}><span>Delivery</span><span>₹{order.deliveryFee}</span></div>}
              {order.tax && <div style={{ display: "flex", justifyContent: "space-between" }}><span>Tax</span><span>₹{order.tax}</span></div>}
              <div style={{
                display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15,
                color: C.textMain, borderTop: `1px solid ${C.borderSoft}`, paddingTop: 10, marginTop: 2
              }}>
                <span>Total</span><span>₹{order.total}</span>
              </div>
            </div>
          </Card>

          {/* Payment */}
          {order.payment && (
            <Card title="Payment">
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: C.textSub }}>Method</span>
                  <span style={{ color: C.textMain, fontWeight: 600 }}>{order.payment.provider}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: C.textSub }}>Status</span>
                  <span style={{ color: C.accent, fontWeight: 600 }}>{order.payment.status}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: C.textSub }}>Amount</span>
                  <span style={{ color: C.textMain, fontWeight: 600 }}>₹{order.payment.amount}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}