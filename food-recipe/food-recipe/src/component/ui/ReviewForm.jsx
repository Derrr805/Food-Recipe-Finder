import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StarRating from "./StarRating";

export default function ReviewForm({ onSubmit, submitting }) {
  const { user, isAuthenticated } = useAuth();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});

  // Get username from user metadata
  const username = user?.user_metadata?.username || 
                   user?.user_metadata?.display_name || 
                   user?.email?.split("@")[0] || 
                   "Anonymous";

  const validate = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = "Rating harus dipilih";
    }

    if (!comment.trim()) {
      newErrors.comment = "Komentar harus diisi";
    } else if (comment.trim().length < 10) {
      newErrors.comment = "Komentar minimal 10 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await onSubmit({ username, rating, comment });

    if (result.success) {
      // Reset form setelah berhasil
      setRating(0);
      setComment("");
      setErrors({});
    }
  };

  // Jika belum login, tampilkan pesan untuk login
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Login untuk Memberikan Review
        </h3>
        <p className="text-gray-500 mb-4">
          Kamu perlu masuk ke akun untuk memberikan rating dan komentar.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 border border-orange-500 text-orange-500 hover:bg-orange-50 font-medium rounded-lg transition-colors"
          >
            Daftar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Tulis Review</h3>

      {/* User Info */}
      <div className="mb-4 flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-orange-600 font-semibold">
            {username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-800">{username}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <StarRating rating={rating} onRatingChange={setRating} size="lg" />
        {errors.rating && (
          <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
        )}
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Komentar
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagikan pengalaman kamu dengan resep ini..."
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
            errors.comment ? "border-red-500" : "border-gray-300"
          }`}
          disabled={submitting}
        />
        {errors.comment && (
          <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        {submitting ? "Mengirim..." : "Kirim Review"}
      </button>
    </form>
  );
}
