import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { useHeaderStore } from "../../store/headerStore";
import { useMealCategories } from "../../hooks/useMealCategories";
import UserMenu from "../ui/UserMenu";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const headerStore = useHeaderStore();
  const { categories } = useMealCategories();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeCategory =
    location.pathname.startsWith("/category/")
      ? decodeURIComponent(location.pathname.replace("/category/", ""))
      : "";

  const navigateToHome = () => {
    setMenuOpen(false);
    headerStore.clearSearch();
    navigate("/");
  };

  const goToCategory = (cat) => {
    setMenuOpen(false);
    headerStore.setCategory(cat);
    headerStore.clearSearch();
    navigate(`/category/${cat}`);
  };

  return (
    <header className="bg-white shadow-xl">
      <div className="flex items-center justify-between px-4 sm:px-10 lg:px-16 py-4 gap-4">

        {/* Logo */}
        <h1
          className="text-2xl text-[#FF7A00] font-bold cursor-pointer whitespace-nowrap"
          onClick={navigateToHome}
        >
          Food Library
        </h1>

        {/* Desktop Categories — Center */}
        <nav className="hidden sm:flex flex-1 justify-center gap-6 text-md font-light text-gray-700">
          {categories.map((cat) => {
            const isActive =
              activeCategory.toLowerCase() === cat.strCategory.toLowerCase();

            return (
              <button
                key={cat.idCategory}
                onClick={() => goToCategory(cat.strCategory)}
                className={`capitalize transition ${
                  isActive
                    ? "text-[#FF7A00] font-semibold"
                    : "hover:text-[#FF7A00]"
                }`}
              >
                {cat.strCategory}
              </button>
            );
          })}
        </nav>

        {/* User Menu - Desktop */}
        <div className="hidden sm:block">
          <UserMenu />
        </div>

        {/* Mobile Toggle */}
        <button
          className="sm:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {!menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col items-start gap-3 px-6 pb-4 text-gray-700 text-md font-light border-t animate-fadeIn">
          {categories.map((cat) => {
            const isActive =
              activeCategory.toLowerCase() === cat.strCategory.toLowerCase();

            return (
              <button
                key={cat.idCategory}
                onClick={() => goToCategory(cat.strCategory)}
                className={`capitalize ${
                  isActive
                    ? "text-[#FF7A00] font-semibold"
                    : "hover:text-[#FF7A00]"
                }`}
              >
                {cat.strCategory}
              </button>
            );
          })}
          
          {/* User Menu - Mobile */}
          <div className="w-full pt-3 border-t border-gray-200 mt-2">
            <UserMenu />
          </div>
        </div>
      )}
    </header>
  );
}
