import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

export default function MainLayout({ children }) {
  return (
    <div style={{ minHeight:"100vh", background:"#F4F7F5", color:"#0C1612" }}>
      <Navbar />
      {/* Extra bottom padding on mobile so content clears the fixed BottomNav */}
      <main style={{ paddingBottom:"env(safe-area-inset-bottom, 0px)" }} className="ze-main-with-navpad">
        {children}
      </main>
      <style>{`
        @media (max-width: 860px) {
          .ze-main-with-navpad { padding-bottom: 76px; }
        }
      `}</style>
      <BottomNav />
    </div>
  );
}
