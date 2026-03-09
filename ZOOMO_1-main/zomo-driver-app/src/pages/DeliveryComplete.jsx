import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function DeliveryComplete() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-28 text-center relative overflow-hidden">
      {/* BACKGROUND PATTERN */}
      <img
        src="/pattern.svg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-5 dark:opacity-[0.03]"
      />

      <div className="relative">
        {/* MASCOT */}
        <img
          src="/zoomo-mascot.png"
          alt="Delivery complete"
          className="h-44 mx-auto mb-6"
        />

        {/* TITLE */}
        <h1 className="text-2xl font-semibold">
          Delivery Completed
        </h1>

        {/* SUBTEXT */}
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
          Nice work! You’re all set to accept your next delivery.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/orders")}
          className="mt-8 w-full max-w-sm mx-auto
                     py-4 rounded-xl font-semibold
                     bg-emerald-600 text-white
                     hover:bg-emerald-700 transition
                     active:scale-[0.98]"
        >
          Back to Orders
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
