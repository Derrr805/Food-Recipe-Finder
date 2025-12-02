import { useReviews } from "../../hooks/useReviews";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import StarRating from "./StarRating";

export default function ReviewSection({ mealId }) {
  const {
    reviews,
    loading,
    error,
    submitting,
    submitReview,
    averageRating,
    totalReviews,
  } = useReviews(mealId);

  return (
    <section className="mt-8 sm:mt-12">
      <div className="border-t border-gray-200 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Reviews & Rating
          </h2>

          {/* Summary */}
          {totalReviews > 0 && (
            <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-orange-500">
                  {averageRating}
                </span>
                <span className="text-gray-500">/5</span>
              </div>
              <StarRating rating={Math.round(averageRating)} readonly size="sm" />
              <span className="text-gray-500 text-sm">
                ({totalReviews} review{totalReviews > 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Review Form */}
        <div className="mb-8">
          <ReviewForm onSubmit={submitReview} submitting={submitting} />
        </div>

        {/* Reviews List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Semua Review ({totalReviews})
          </h3>
          <ReviewList reviews={reviews} loading={loading} />
        </div>
      </div>
    </section>
  );
}
