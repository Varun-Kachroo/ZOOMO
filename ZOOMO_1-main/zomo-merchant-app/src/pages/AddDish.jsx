import { useNavigate, useLocation } from "react-router-dom";
import DishForm from "../components/DishForm";
import api from "../services/api";

export default function AddDish() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const restaurantId = state?.restaurantId;

  const submit = async (data) => {
    await api.post("/merchant/dishes", {
      ...data,
      restaurantId,
    });
    navigate("/menu");
  };

  return (
    <div className="max-w-3xl">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Add New Dish
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Create a new item for your restaurant menu
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/80 dark:bg-[#0f0f0f] backdrop-blur
                      rounded-3xl p-6
                      border border-black/10 dark:border-white/10">
        <DishForm onSubmit={submit} />
      </div>
    </div>
  );
}
