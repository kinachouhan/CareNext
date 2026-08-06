import React, { useCallback } from "react";
import { Search, X } from "lucide-react";

const ProductSearch = ({ value = "", onSearch, totalProducts }) => {
  // Using useCallback prevents the function from being recreated on every render
  const handleChange = useCallback(
    (e) => {
      onSearch(e.target.value);
    },
    [onSearch]
  );

  // Memoizing submit and clear handlers for peak React.memo performance
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSearch(value);
  }, [onSearch, value]);

  const clearSearch = useCallback(() => {
    onSearch("");
  }, [onSearch]);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-7xl mx-auto group"
      role="search"
    >
      {/* Left Search Icon (Decorative) */}
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#06A1B7] transition-colors pointer-events-none"
        aria-hidden="true"
      />

      {/* Input Field */}
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search dental products, instruments..."
        aria-label="Search products"
        className="
          w-full
          py-3.5
          md:py-4
          pl-11
          pr-[100px]
          md:pr-[140px]
          bg-white
          border
          border-gray-200
          rounded-2xl
          text-gray-800
          placeholder:text-gray-400
          outline-none
          focus:border-[#06A1B7]
          focus:ring-4
          focus:ring-[#06A1B7]/10
          transition-all
          shadow-sm
          text-sm
          md:text-base
          [&::-webkit-search-cancel-button]:hidden
        "
      />

      {/* Right Side Controls (Clear & Submit) */}
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
        
        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={clearSearch}
            className="p-1.5 mr-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}

        {/* Embedded Search Button */}
        <button
          type="submit"
          aria-label="Submit search"
          className="
            flex
            items-center
            justify-center
            h-10
            md:h-11
            w-10
            md:w-auto
            md:px-6
            rounded-xl
            bg-[#06A1B7]
            text-white
            shadow-sm
            shadow-cyan-500/20
            hover:bg-[#058a9d]
            active:scale-95
            transition-all
          "
        >
          <Search size={18} className="md:hidden" aria-hidden="true" />
          <span className="hidden md:block font-semibold text-sm">Search</span>
        </button>
      </div>
    </form>
  );
};

export default React.memo(ProductSearch);