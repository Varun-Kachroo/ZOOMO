import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DishForm from "../components/DishForm";
import api from "../services/api";

export default function EditDish() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const res = await api.get(`/merchant/dishes/${id}`);
        setDish(res.data);
      } catch {
        alert("Failed to load dish");
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [id]);

  const submit = async (data) => {
    await api.patch(`/merchant/dishes/${id}`, data);
    navigate("/menu");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl bg-white dark:bg-[#141414] p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Edit Dish
      </h1>

      <DishForm
        initialData={dish}   // ✅ THIS IS THE KEY
        onSubmit={submit}
        mode="edit"
      />
    </div>
  );
}
