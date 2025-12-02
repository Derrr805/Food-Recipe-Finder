import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHeaderStore } from "../store/headerStore";
import { Image } from "@unpic/react";

export default function Category() {
    const { name } = useParams();
    const navigate = useNavigate();
    const headerStore = useHeaderStore();

    const base = import.meta.env.VITE_API_BASE;

    const [recipes, setRecipes] = useState([]);
    const [limit, setLimit] = useState(8);
    const searchQuery = headerStore.searchQuery;

    const displayedRecipes = useMemo(
        () => recipes.slice(0, limit),
        [recipes, limit]
    );

    const displayedCount = displayedRecipes.length;
    const totalCount = recipes.length;


    const title = useMemo(() => {
        if (searchQuery) return "Search Results";

        if (!name || name.toLowerCase() === "all") return "All Recipes";

        return `${name} Collection`;
    }, [name, searchQuery]);

    const fetchRecipes = async () => {
        try {
            let url = "";

            if (searchQuery) {
                url = `${base}/search.php?s=${searchQuery}`;
            } else if (!name || name.toLowerCase() === "all") {
                url = `${base}/search.php?s=`;
            } else {
                url = `${base}/filter.php?c=${name}`;
            }
            console.log(url)
            const res = await fetch(url);
            const data = await res.json();

            const items = data.meals || [];

            setRecipes(items);
        } catch (err) {
            console.error("Failed to fetch category recipes:", err);
        }
    };

    useEffect(() => {
        fetchRecipes();
        setLimit(8);
    }, [name, searchQuery]);

    const loadMore = () => setLimit((prev) => prev + 8);

    const goToDetail = (id) => navigate(`/detail/${id}`);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Page Title */}
            <div className="mb-6 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 leading-snug">
                    {searchQuery ? (
                        <>
                            Search Results For{" "}
                            <span className="text-orange-500">“{searchQuery}”</span>
                        </>
                    ) : (
                        title
                    )}
                </h2>

                <div className="text-gray-500 text-sm space-y-1">
                    {!searchQuery && (
                        <div>
                            See all new in from{" "}
                            <span className="font-medium text-gray-700">
                                {title.toLowerCase()}
                            </span>{" "}
                            here
                        </div>
                    )}

                    <div>
                        Displaying{" "}
                        <span className="text-orange-500 font-medium">
                            1 - {displayedCount}
                        </span>{" "}
                        of {totalCount} recipes
                    </div>
                </div>
            </div>

            {/* Recipes Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayedRecipes.map((meal) => (
                    <div
                        key={meal.idMeal}
                        className="bg-gray-50 p-4 rounded-xl hover:shadow-md transition cursor-pointer"
                        onClick={() => goToDetail(meal.idMeal)}
                    >
                        <Image
                            src={meal.strMealThumb}
                            alt={meal.strMeal}
                            className="w-full h-44 sm:h-48 md:h-56 object-cover rounded-lg mb-3"
                        />

                        <p className="text-gray-500 text-xs sm:text-sm truncate">
                            {meal.strCategory || name}
                        </p>

                        <h3 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2 mt-1">
                            {meal.strMeal}
                        </h3>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center mt-8">
                {displayedCount < totalCount && (
                    <button
                        onClick={loadMore}
                        className="border rounded-full px-5 py-2 text-sm hover:bg-gray-100 transition"
                    >
                        Load more
                    </button>
                )}
            </div>
        </div>
    );
}
