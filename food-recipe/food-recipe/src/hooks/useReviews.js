import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useReviews(mealId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews untuk meal tertentu
  const fetchReviews = useCallback(async () => {
    if (!mealId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select("*")
        .eq("meal_id", mealId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Gagal memuat reviews");
    } finally {
      setLoading(false);
    }
  }, [mealId]);

  // Submit review baru
  const submitReview = async ({ username, rating, comment }) => {
    if (!mealId) return { success: false, error: "Meal ID tidak ditemukan" };

    try {
      setSubmitting(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from("reviews")
        .insert([
          {
            meal_id: mealId,
            username: username.trim(),
            rating: parseInt(rating),
            comment: comment.trim(),
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Tambah review baru ke state (di awal list)
      setReviews((prev) => [data, ...prev]);

      return { success: true, data };
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Gagal mengirim review");
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  // Hitung rata-rata rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  // Fetch reviews saat mealId berubah
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error,
    submitting,
    submitReview,
    refetch: fetchReviews,
    averageRating,
    totalReviews: reviews.length,
  };
}
