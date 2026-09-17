import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F0F2EE", color: "#111827" }}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}