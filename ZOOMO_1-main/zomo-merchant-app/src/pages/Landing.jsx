// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";


export default function Landing() {
    const { dark } = useTheme();

  return (
    <div
      className={`
        w-full min-h-screen
        ${dark ? "bg-black text-white" : "bg-white text-black"}
        transition-colors duration-300
      `}
    >

      {/* ================= HERO ================= */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <img
          src="/zoomo-logo.png"
          alt="Zoomo"
          className="w-20 mb-6 drop-shadow-lg"
        />

        <h1 className="text-4xl sm:text-6xl font-bold leading-tight max-w-3xl">
          Run your restaurant.
          <br />
          <span className="text-emerald-500">
            We handle the tech.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400">
          Zoomo helps restaurants manage orders, menus, and operations effortlessly —
          all from one powerful dashboard.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/signup"
            className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700
                       text-white font-semibold shadow-lg hover:shadow-xl transition"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className={`px-8 py-3 rounded-2xl border 
              ${dark ? "border-white/20 hover:bg-white/10" : "border-black/20 hover:bg-gray-100"}
              transition font-semibold
            `}
          >
            Merchant Login
          </Link>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className={`${dark ? "bg-[#0f0f0f]" : "bg-gray-100"} px-6 py-20`}>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Feature title="Live Order Management" desc="Accept, prepare, and track orders in real-time with clear status updates." />
          <Feature title="Smart Menu Control" desc="Add, edit, or disable dishes instantly. Keep your menu always updated." />
          <Feature title="Restaurant Profile" desc="Manage restaurant details, images, and visibility effortlessly." />
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            How Zoomo Works
          </h2>

          <div className="grid sm:grid-cols-3 gap-10">
            <Step number="1" title="Sign Up">Create your merchant account in minutes.</Step>
            <Step number="2" title="Add Menu">Upload dishes, prices, and images.</Step>
            <Step number="3" title="Manage Orders">Receive and fulfill orders seamlessly.</Step>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className={`${dark ? "bg-[#0f0f0f]" : "bg-gray-100"} px-6 py-20 text-center`}>
        <h2 className="text-3xl font-bold">
          Ready to grow your restaurant?
        </h2>

        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Join hundreds of restaurants using Zoomo to grow their business.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link to="/signup" className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
            Create Merchant Account
          </Link>

          <Link to="/login" className={`px-8 py-3 rounded-2xl border 
            ${dark ? "border-white/20 hover:bg-white/10" : "border-black/20 hover:bg-gray-200"}
            font-semibold`}>
            Login
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Zoomo Eats. All rights reserved.
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Feature({ title, desc }) {
  return (
    <div
      className="rounded-3xl p-6 shadow border
                 bg-white dark:bg-[#141414]
                 border-black/5 dark:border-white/10
                 hover:shadow-xl transition"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  );
}

function Step({ number, title, children }) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow">
        {number}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{children}</p>
    </div>
  );
}
