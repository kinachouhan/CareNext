import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistThunk, clearWishlistThunk } from "../../../slice/wishlist/wishlistThunk";
import toast from "react-hot-toast";

export const useWishlist = () => {
  const dispatch = useDispatch();
  const wishlistState = useSelector((state) => state.wishlist) || {};
  const { items = [], isLoading = false } = wishlistState;

  const isInWishlist = (productId) => {
    if (!Array.isArray(items)) return false;
    return items.some((item) => {
      const id = item?._id || item?.id || item;
      return id === productId;
    });
  };

  const toggleWishlist = async (product) => {
    try {
      const productId = product._id || product.id || product;
      const currentlyInWishlist = isInWishlist(productId);

      await dispatch(toggleWishlistThunk(product)).unwrap();
      
      toast.success(
        currentlyInWishlist ? "Removed from Wishlist" : "Added to Wishlist",
        { icon: currentlyInWishlist ? "🗑️" : "❤️" }
      );
    } catch (error) {
      toast.error(error || "Something went wrong");
    }
  };

  // NEW: Add this clearWishlist function
  const clearWishlist = async () => {
    try {
      await dispatch(clearWishlistThunk()).unwrap();
      toast.success("Wishlist cleared");
    } catch (error) {
      toast.error(error || "Failed to clear wishlist");
    }
  };

  return { items, isLoading, isInWishlist, toggleWishlist, clearWishlist };
};