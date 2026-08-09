import React from "react";
import { useWishlist } from "../hooks/useWishlist";
import ProductCard from "../../products/components/ProductCard";
import { Heart, Trash2 } from "lucide-react"; // Added Trash2
import { Link } from "react-router";

const Wishlist = () => {
  // Ensure 'clearWishlist' is exported from your useWishlist hook
  const { items, isLoading, clearWishlist } = useWishlist();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#06A1B7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart size={36} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mt-2 mb-6">Save items you love to review them later.</p>
        <Link
          to="/shop"
          className="inline-block bg-[#06A1B7] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#058a9d] transition-all"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Clear All button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          My Wishlist
        </h1>
        <button
          onClick={clearWishlist}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 active:scale-95"
        >
          <Trash2 size={16} />
          Clear All
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;