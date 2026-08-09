import React, { useState } from "react";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { Link } from "react-router";
import useCart from "../../cart/hooks/useCart";
import { useWishlist } from "../../wishlist/hooks/useWishlist";

const ProductCard = ({ product }) => {
  const price = product?.price || 0;
  const discount = product?.discount || 0;
  const finalPrice = Math.round(price - (price * discount) / 100);

  const { addToCart, removeItem, isInCart } = useCart();
  
  const productId = product?._id || product?.id;
  const alreadyInCart = isInCart(productId);

  const [isLoading, setIsLoading] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
const isWishlisted = isInWishlist(productId);

const handleWishlist = (e) => {
  e.preventDefault();
  toggleWishlist(product);
};



  const handleCartAction = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (alreadyInCart) {
        await removeItem(product);
      } else {
        await addToCart(product);
      }
    } catch (error) {
      console.error("Cart action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] md:hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col h-full overflow-hidden transition-all duration-300 md:hover:-translate-y-1">
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 bg-[#FF3B30] text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full tracking-wide shadow-sm pointer-events-none">
          {discount}% OFF
        </div>
      )}

      {/* Wishlist Heart */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 md:top-4 md:right-4 z-20 bg-white border border-gray-100 shadow-sm rounded-full p-1.5 md:p-2.5 hover:bg-red-50 transition-colors group/heart"
        aria-label="Add to wishlist"
      >
        <Heart
          size={16}
          className={`transition-colors ${
    isWishlisted 
      ? "text-red-500 fill-red-500" 
      : "text-gray-400 group-hover/heart:text-red-500"
  }`}
          // className="text-gray-400 group-hover/heart:text-red-500 group-hover/heart:fill-red-500 md:w-5 md:h-5 transition-colors"
        />
      </button>

     
      <Link
        to={`/shop/${productId}`}
        className="flex flex-col flex-1 group/link"
      >
        {/* Image Area */}
        <div className="w-full h-36 md:h-52 lg:h-60 p-4 md:p-6 flex items-center justify-center bg-white shrink-0 overflow-hidden">
          <img
            src={product?.image}
            alt={product?.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain transition-transform duration-500 md:group-hover/link:scale-110"
          />
        </div>

        {/* Text & Details Area */}
        <div className="px-3 pt-3 md:px-5 md:pt-5 flex flex-col flex-1 border-t border-gray-50">
          <h3 className="text-[15px] md:text-lg font-bold text-[#0F172A] line-clamp-1 md:line-clamp-2 leading-tight md:group-hover/link:text-[#06A1B7] transition-colors">
            {product?.name}
          </h3>

          <p className="text-[11px] md:text-sm text-gray-500 mt-1 md:mt-1.5 line-clamp-1 md:line-clamp-2 leading-relaxed">
            {product?.shortDescription || "No description"}
          </p>

          <div className="flex items-center gap-1.5 md:gap-2.5 mt-2 md:mt-3 mb-3 md:mb-5">
            <span className="text-lg md:text-2xl font-bold text-[#0F172A]">
              ₹{finalPrice}
            </span>
            {discount > 0 && (
              <span className="text-xs md:text-sm font-medium text-gray-400 line-through">
                ₹{price}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action Button Container (Optimized with Spinner and State Control) */}
      <div className="px-3 pb-3 md:px-5 md:pb-5 pt-0 mt-auto">
        {alreadyInCart ? (
          <button
            onClick={handleCartAction}
            disabled={isLoading}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-[10px] md:rounded-xl py-2 md:py-3 flex items-center justify-center gap-1.5 md:gap-2 text-sm md:text-base font-semibold transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-red-500" />
            ) : (
              <>
                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                Remove
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleCartAction}
            disabled={isLoading}
            className="w-full bg-[#06A1B7] hover:bg-[#058b9e] text-white rounded-[10px] md:rounded-xl py-2 md:py-3 flex items-center justify-center gap-1.5 md:gap-2 text-sm md:text-base font-semibold shadow-sm md:shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-white" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                Add to Cart
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// Memoized to prevent redundant renders when listing out hundreds of products in a shop grid
export default React.memo(ProductCard);