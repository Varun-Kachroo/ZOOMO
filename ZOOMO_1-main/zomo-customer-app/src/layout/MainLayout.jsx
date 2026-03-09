import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
