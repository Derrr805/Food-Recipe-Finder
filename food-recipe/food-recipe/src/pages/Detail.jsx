import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Image } from "@unpic/react";
import ReviewSection from "../component/ui/ReviewSection";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_BASE;

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/lookup.php?i=${id}`);
      const data = await res.json();
      console.log(data);
      
      setRecipe(data.meals?.[0] || null);
    } catch (err) {
      console.error("Failed to fetch recipe:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const getIngredients = () => {
    const arr = [];
    if (!recipe) return arr;

    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        arr.push({ ingredient, measure });
      }
    }
    return arr;
  };

  const ingredients = getIngredients();

  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">

      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 text-gray-500 text-xs sm:text-sm">
        <span
          className="cursor-pointer hover:text-orange-500 mx-1 sm:mx-2"
          onClick={() => navigate("/")}
        >
          Home
        </span>

        <Image src="/breadcrumb.png" alt=">" className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2" />

        <span className="capitalize mx-1 sm:mx-2">
          {recipe?.strCategory || "Loading..."}
        </span>

        <Image src="/breadcrumb.png" alt=">" className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2" />

        <span className="text-gray-700 truncate max-w-[60%] sm:max-w-none mx-1 sm:mx-2">
          {recipe?.strMeal || ""}
        </span>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex flex-col md:flex-row max-w-7xl w-full mx-auto bg-white rounded-xl shadow-sm p-4 sm:p-8 gap-6 sm:gap-8">

        {/* LOADING SKELETON */}
        {loading ? (
          <>
            {/* Left Skeleton */}
            <div className="flex-1 min-w-0 animate-shimmer space-y-4">
              <div className="bg-gray-200 rounded-xl h-72 sm:h-96 w-full"></div>
            </div>

            {/* Right Skeleton */}
            <div className="flex-1 min-w-0 animate-shimmer space-y-4">
              <div className="h-7 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mt-6"></div>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 min-w-0 flex justify-center items-center bg-[#F3F4F6] rounded-xl p-4 sm:p-6">
              <Image
                src={recipe?.strMealThumb}
                alt={recipe?.strMeal}
                className="max-h-72 sm:max-h-96 object-cover rounded-xl"
              />
            </div>

            {/* ----------------- RIGHT COLUMN: DETAILS ----------------- */}
            <div className="flex-1 min-w-0 flex flex-col mt-6 md:mt-0">

              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 leading-tight">
                {recipe?.strMeal}
              </h1>

              <p className="text-orange-500 text-lg sm:text-xl font-semibold mb-3">
                {recipe?.strArea} • {recipe?.strCategory}
              </p>

              {/* INGREDIENTS */}
              <h3 className="text-md sm:text-lg font-semibold mb-2">Ingredients</h3>

              <ul className="text-gray-700 text-sm sm:text-base mb-4 space-y-1 list-disc list-inside">
                {ingredients.map((i, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{i.ingredient}</span>: {i.measure}
                  </li>
                ))}
              </ul>

              {/* INSTRUCTIONS */}
              <h3 className="text-md sm:text-lg font-semibold mb-2">Instructions</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {recipe?.strInstructions}
              </p>

              <button
                className="bg-orange-500 text-white font-semibold py-2 sm:py-3 rounded-lg mt-6 w-full sm:w-1/2"
                onClick={() => window.open(recipe.strYoutube, "_blank")}
              >
                Watch on YouTube 🎬
              </button>
            </div>
          </>
        )}

      </main>

      {/* Review Section */}
      {!loading && recipe && (
        <div className="max-w-7xl w-full mx-auto bg-white rounded-xl shadow-sm p-4 sm:p-8 mt-6">
          <ReviewSection mealId={id} />
        </div>
      )}
    </div>
  );
}
