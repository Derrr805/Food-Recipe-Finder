import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchMeals } from "../hooks/useFetchMeal";
import { Image } from "@unpic/react";

export default function RecipeList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(8);
  const [loadingMore, setLoadingMore] = useState(false);

  const { meals, loading, fetchMeals } = useFetchMeals();

  useEffect(() => {
    fetchMeals("");
  }, []);

  const loadMore = () => {
    setLimit((prev) => prev + 8);
  };

  const goToDetail = (id) => {
    navigate(`/detail/${id}`);
  };

  const handleScroll = useCallback(() => {
    const nearBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 100;

    if (nearBottom && window.innerWidth < 640 && !loadingMore) {
      setLoadingMore(true);

      setTimeout(() => {
        loadMore();
        setLoadingMore(false);
      }, 800);
    }
  }, [loadingMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const filteredMeals = meals.slice(0, limit);

  return (
    <div className="bg-stone-100">
      {/* banner image */}
      <div className="flex justify-center py-5 px-2 sm:px-4">
        <Image
          src="/bg.png"
          loading="lazy"
          alt="Logo"
          className="max-h-[300px] sm:max-h-[400px] w-full max-w-[1320px] object-contain"
        />
      </div>

      {/* divider */}
      <div className="bg-[#EEF2F7] w-full h-6 sm:h-10" />

      <div className="px-4 sm:px-10 lg:px-16 py-10 bg-white">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
            Recipes
          </h2>

          {/* Search box */}
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-lg"
              onClick={() => fetchMeals(search)}
            >
              Search
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-orange-500"></div>
          </div>
        )}

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMeals.map((m) => (
            <div
              key={m.idMeal}
              className="bg-gray-50 rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col"
              onClick={() => goToDetail(m.idMeal)}
            >
              <Image
                src={m.strMealThumb}
                alt="meal"
                className="rounded-xl mx-auto mb-4 w-full h-56 sm:h-64 object-cover bg-gray-100"
              />

              <div className="flex flex-wrap items-center text-sm text-gray-600 mb-1 justify-center sm:justify-start">
                <span className="capitalize">{m.strCategory}</span>

                <div className="mx-2 text-gray-500">•</div>

                <span className="capitalize">{m.strArea}</span>
              </div>

              <h3 className="mt-2 font-medium text-gray-900 line-clamp-2 text-center sm:text-left">
                {m.strMeal}
              </h3>
            </div>
          ))}
        </div>

        {/* Load More (Desktop) */}
        <div className="hidden sm:flex justify-center mt-8">
          {!loading && filteredMeals.length < meals.length && (
            <button
              className="px-6 py-2 bg-gray-100 rounded-xl border hover:bg-gray-200 transition text-sm sm:text-base"
              onClick={loadMore}
            >
              Load more
            </button>
          )}
        </div>

        {/* Loading more indicator (Mobile) */}
        {loadingMore && (
          <div className="sm:hidden flex justify-center mt-6 text-gray-500 text-sm">
            Loading more recipes...
          </div>
        )}
      </div>

      <div className="bg-[#EEF2F7] w-full h-6 sm:h-10" />
    </div>
  );
}
