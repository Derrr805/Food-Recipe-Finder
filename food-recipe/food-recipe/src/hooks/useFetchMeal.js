import { useState } from "react";

export function useFetchMeals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_BASE;

  const fetchMeals = async (query = "") => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${baseUrl}/search.php?s=${query}`);
      const data = await res.json();
      console.log(data)
      setMeals(data.meals || []);
    } catch (err) {
      setError("Failed to fetch meals");
    } finally {
      setLoading(false);
    }
  };

  return { meals, loading, error, fetchMeals };
}
