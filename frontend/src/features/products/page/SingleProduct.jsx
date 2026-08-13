import React, { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  Heart,
  ChevronRight,
  CheckCircle,
  Package,
  Zap,
  Star,
  Loader2
} from "lucide-react";

import { Link, useParams, useNavigate, useLocation } from "react-router"; 
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../../shared/components/Loader";
import { getProductByIdThunk } from "../../../slice/product/productThunk";
import EmptyProducts from "../components/EmptyProducts";
import RelatedProducts from "../components/RelatedProducts"; 
import useCart from "../../cart/hooks/useCart";
import { useWishlist } from "../../wishlist/hooks/useWishlist";
import toast from "react-hot-toast";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Check user authentication state from Redux
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});

  const { selectedProduct: product, isLoading } = useSelector(
    (state) => state.product
  );
  
  const { addToCart, isInCart } = useCart(); 
  const { isInWishlist, toggleWishlist } = useWishlist();

  const productId = product?._id || product?.id;
  const alreadyInCart = isInCart(productId);
  const isWishlisted = isInWishlist(productId);

  const [cartLoading, setCartLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProductByIdThunk(id));
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [dispatch, id]); 

  const finalPrice = useMemo(() => {
    if (!product?.price) return 0;
    const price = Number(product.price);
    const discount = Number(product.discount || 0);
    return Math.round(price - (price * discount) / 100);
  }, [product?.price, product?.discount]);

  // Helper to verify authentication
  const checkAuth = () => {
    if (!user && !isAuthenticated) {
      toast.error("Please login to continue");
      navigate("/login", { state: { from: location.pathname } });
      return false;
    }
    return true;
  };

  const handleCartAction = async () => {
    if (!checkAuth()) return; // Stop if not logged in
    
    if (cartLoading) return;
    setCartLoading(true);
    try {
      if (!alreadyInCart) {
        await addToCart(product);
        toast.success("Added to cart");
      } else {
        navigate("/cart");
      }
    } catch (error) {
      console.error("Cart action failed:", error);
    } finally {
      setCartLoading(false);
    }
  };

  // const handleBuyNow = async () => {
  //   if (product?.stock === 0) return;
  //   if (!checkAuth()) return; // Redirect to login if user is guest

  //   setBuyNowLoading(true);
  //   try {
  //     if (!alreadyInCart) {
  //       await addToCart(product);
  //     }
  //     // Navigate directly to checkout page
  //     navigate("/checkout");
  //   } catch (error) {
  //     toast.error("Failed to proceed to checkout");
  //   } finally {
  //     setBuyNowLoading(false);
  //   }
  // };

  const handleBuyNow = () => {
    if (product?.stock === 0) return;
    if (!checkAuth()) return; // Redirect if guest

    const buyNowItem = {
      product: product._id || product.id,
      name: product.name,
      price: finalPrice, 
      quantity: 1,
      image: product.image,
    };

    navigate("/checkout", { state: { buyNowItem } });
  };

  if (isLoading) return <Loader text="Loading Product..." />;

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#F5F7FB]">
        <EmptyProducts />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] pb-20 pt-4 md:pt-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* BREADCRUMBS */}
        <nav 
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6 md:mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar"
        >
          <Link to="/" className="hover:text-[#06A1B7] transition-colors">Home</Link>
          <ChevronRight size={14} className="shrink-0" />
          <Link to="/shop" className="hover:text-[#06A1B7] transition-colors">Products</Link>
          <ChevronRight size={14} className="shrink-0" />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#06A1B7] cursor-pointer transition-colors">
            {product.category}
          </Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="font-semibold text-gray-900 truncate" aria-current="page">
            {product.name}
          </span>
        </nav>

        {/* PRODUCT CARD CONTAINER */}
        <article className="bg-white rounded-[24px] md:rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* IMAGE SECTION */}
            <div className="lg:w-1/2 bg-white flex justify-center items-center p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 relative">
              {product.bestSeller && (
                <span className="absolute top-6 left-6 z-10 bg-[#06A1B7] text-white px-3 md:px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                  Best Seller
                </span>
              )}
              <div className="w-full max-w-[300px] md:max-w-[420px] aspect-square flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
            </div>

            {/* DETAILS SECTION */}
            <div className="lg:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col">
              
              <span className="text-[#06A1B7] font-bold uppercase tracking-widest text-xs md:text-sm mb-2">
                {product.subCategory}
              </span>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-2 text-balance">
                {product.name}
              </h1>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm font-medium text-gray-600 ml-1.5">(4.8)</span>
              </div>

              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                {product.shortDescription}
              </p>

              {/* PRICE */}
              <div className="flex items-end gap-3 md:gap-4 mt-6 md:mt-8 flex-wrap">
                <span className="text-3xl md:text-4xl font-bold text-gray-900">
                  ₹{finalPrice}
                </span>

                {Number(product.discount) > 0 && (
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="line-through text-gray-400 font-medium text-sm md:text-base">
                      ₹{product.price}
                    </span>
                    <span className="bg-red-50 text-red-600 border border-red-100 px-2.5 py-1 rounded-lg text-xs md:text-sm font-bold tracking-wide">
                      {product.discount}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* STOCK STATUS */}
              <div className="mt-6 md:mt-8">
                {product.stock > 0 ? (
                  <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">
                    <CheckCircle size={18} />
                    In Stock
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 md:gap-4 mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-1 gap-2 sm:gap-3">
                  
                  {/* Add To Cart Button */}
                  <button
                    onClick={handleCartAction}
                    disabled={product.stock === 0 || cartLoading}
                    className="flex-1 bg-cyan-50/50 hover:bg-cyan-50 border-2 border-[#06A1B7] text-[#06A1B7] py-3 md:py-3.5 rounded-xl font-bold flex items-center justify-center gap-1.5 md:gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {cartLoading ? (
                      <Loader2 size={18} className="animate-spin shrink-0" />
                    ) : (
                      <ShoppingCart size={18} className="shrink-0" />
                    )}
                    <span>{alreadyInCart ? "Go To Cart" : "Add To Cart"}</span>
                  </button>

                  {/* Buy Now Button */}
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0 || buyNowLoading}
                    className="flex-1 bg-[#06A1B7] hover:bg-[#058da2] text-white py-3 md:py-3.5 rounded-xl font-bold flex items-center justify-center gap-1.5 md:gap-2 shadow-sm shadow-cyan-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {buyNowLoading ? (
                      <Loader2 size={18} className="animate-spin shrink-0" />
                    ) : (
                      <Zap size={18} className="shrink-0" />
                    )}
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => {
                    if (checkAuth()) toggleWishlist(product);
                  }}
                  aria-label="Add to Wishlist"
                  className="w-12 sm:w-14 shrink-0 border border-gray-200 bg-white rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all active:scale-95 group"
                >
                  <Heart
                    size={22}
                    className={`transition-colors ${
                      isWishlisted 
                        ? "text-red-500 fill-red-500" 
                        : "text-gray-400 group-hover:text-red-500 group-hover:fill-red-500"
                    }`}
                  />
                </button>
              </div>

              {/* FULL DESCRIPTION */}
              <div className="mt-8 md:mt-10 bg-gray-50 border border-gray-100 rounded-2xl p-5 md:p-6">
                <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-3 text-sm md:text-base">
                  <Package size={18} className="text-[#06A1B7]" />
                  Product Details
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {product.fullDescription}
                </p>
              </div>

            </div>
          </div>
        </article>

        <RelatedProducts category={product.category} currentProductId={product._id} />

      </div>
    </main>
  );
};

export default SingleProduct;