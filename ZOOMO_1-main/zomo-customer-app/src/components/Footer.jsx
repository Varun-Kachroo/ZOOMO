
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20 py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <h2 className="text-3xl font-bold mb-3">Zoomo Eats</h2>
          <p className="text-gray-400">
            Fastest food delivery platform with real-time tracking & exciting offers.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/restaurants">Restaurants</a></li>
            <li><a href="/offers">Offers</a></li>
            <li><a href="/support">Support</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

      </div>

      <div className="text-center text-gray-500 mt-10">
        © {new Date().getFullYear()} Zoomo Eats. All rights reserved.
      </div>
    </footer>
  );
}
