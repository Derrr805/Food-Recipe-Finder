import { useState, useEffect } from "react";

export function useMealCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const base = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${base}/categories.php`);
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { categories, loading };
}
