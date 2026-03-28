import { Link } from "react-router-dom";

function ZLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#0F3D2E" />
      <path d="M8 10H22" stroke="#22C55E" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M22 10L10 22" stroke="#22C55E" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10 22H24" stroke="#22C55E" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-z-card text-white mt-20 py-16 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <div className="flex items-center gap-2 mb-3">
            <ZLogo />
            <h2 className="text-2xl font-bold">Zoomo <span className="text-z-accent">Eats</span></h2>
          </div>
          <p className="text-gray-400">
            Fastest food delivery platform with real-time tracking & exciting offers.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/restaurants" className="hover:text-z-accent transition">Restaurants</a></li>
            <li><a href="/offers" className="hover:text-z-accent transition">Offers</a></li>
            <li><a href="/support" className="hover:text-z-accent transition">Support</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/terms" className="hover:text-z-accent transition">Terms & Conditions</a></li>
            <li><a href="/privacy" className="hover:text-z-accent transition">Privacy Policy</a></li>
          </ul>
        </div>

      </div>
      <div className="text-center text-gray-500 mt-10">
        © {new Date().getFullYear()} Zoomo Eats. All rights reserved.
      </div>
    </footer>
  );
}