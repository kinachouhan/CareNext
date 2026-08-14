import React, { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  Heart,
  ChevronRight,
  CheckCircle,
  Package,
  Zap,
  Star,
  Loader2,
  ShieldCheck,
  Truck
} from "lucide-react";

import { Link, useParams, useNavigate, useLocation } from "react-router"; 
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../../shared/components/Loader";
import { getProductByIdThunk } from "../../../slice/product/productThunk";
import EmptyProducts from "../components/EmptyProducts";
import RelatedProducts from "../components/RelatedProducts"; 
import ProductReviews from "../components/ProductReviews";
import useCart from "../../cart/hooks/useCart";
import { useWishlist } from "../../wishlist/hooks/useWishlist";
import toast from "react-hot-toast";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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

  const checkAuth = () => {
    if (!user && !isAuthenticated) {
      toast.error("Please login to continue");
      navigate("/login", { state: { from: location.pathname } });
      return false;
    }
    return true;
  };

  const handleCartAction = async () => {
    if (!checkAuth()) return;
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

  const handleBuyNow = () => {
    if (product?.stock === 0) return;
    if (!checkAuth()) return;

    const buyNowItem = {
      product: productId,
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
      <div className="min-h-screen flex justify-center items-center bg-[#F5F7FB] px-4">
        <EmptyProducts />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] pb-28 sm:pb-20 pt-3 sm:pt-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* BREADCRUMBS */}
        <nav 
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none"
        >
          <Link to="/" className="hover:text-[#06A1B7] transition-colors">Home</Link>
          <ChevronRight size={14} className="shrink-0 text-gray-400" />
          <Link to="/shop" className="hover:text-[#06A1B7] transition-colors">Products</Link>
          <ChevronRight size={14} className="shrink-0 text-gray-400" />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#06A1B7] transition-colors">
            {product.category}
          </Link>
          <ChevronRight size={14} className="shrink-0 text-gray-400" />
          <span className="font-medium text-gray-800 truncate max-w-[150px] sm:max-w-xs" aria-current="page">
            {product.name}
          </span>
        </nav>

        {/* MAIN PRODUCT ARTICLE */}
        <article className="bg-white rounded-2xl sm:rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* IMAGE SECTION */}
            <div className="lg:w-1/2 bg-gradient-to-b from-gray-50/50 to-white flex justify-center items-center p-5 sm:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 relative">
              {product.bestSeller && (
                <span className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 bg-[#06A1B7] text-white px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
                  Best Seller
                </span>
              )}
              <div className="w-full max-w-[280px] sm:max-w-[380px] md:max-w-[420px] aspect-square flex items-center justify-center p-2 sm:p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* DETAILS SECTION */}
            <div className="lg:w-1/2 p-5 sm:p-8 md:p-10 flex flex-col justify-between">
              <div>
                {product.subCategory && (
                  <span className="text-[#06A1B7] font-semibold uppercase tracking-wider text-[11px] sm:text-xs mb-1.5 block">
                    {product.subCategory}
                  </span>
                )}

                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug mb-2">
                  {product.name}
                </h1>

                {/* Rating & Reviews Header */}
                <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={15} 
                        className={star <= Math.round(product.ratings || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">
                    {product.ratings ? product.ratings.toFixed(1) : "0.0"}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400">
                    ({product.numReviews || 0} reviews)
                  </span>
                </div>

                <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6">
                  {product.shortDescription}
                </p>

                {/* PRICE BLOCK */}
                <div className="flex items-baseline gap-3 mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
                    ₹{finalPrice}
                  </span>

                  {Number(product.discount) > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="line-through text-gray-400 text-sm sm:text-base font-medium">
                        ₹{product.price}
                      </span>
                      <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md text-xs font-bold">
                        {product.discount}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* STOCK STATUS */}
                <div className="mb-6">
                  {product.stock > 0 ? (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium">
                      <CheckCircle size={16} />
                      In Stock ({product.stock} available)
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium">
                      Out of Stock
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS (Desktop & Tablet) */}
              <div className="hidden sm:flex gap-3 pt-4 border-t border-gray-100">
                <div className="flex flex-1 gap-3">
                  <button
                    onClick={handleCartAction}
                    disabled={product.stock === 0 || cartLoading}
                    className="flex-1 bg-cyan-50/60 hover:bg-cyan-100/50 border-2 border-[#06A1B7] text-[#06A1B7] py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                  >
                    {cartLoading ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
                    <span>{alreadyInCart ? "Go To Cart" : "Add To Cart"}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0 || buyNowLoading}
                    className="flex-1 bg-[#06A1B7] hover:bg-[#058da2] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-cyan-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                  >
                    {buyNowLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                    <span>Buy Now</span>
                  </button>
                </div>

                <button
                  onClick={() => { if (checkAuth()) toggleWishlist(product); }}
                  aria-label="Wishlist"
                  className="w-12 shrink-0 border border-gray-200 bg-white rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all active:scale-95 cursor-pointer"
                >
                  <Heart
                    size={20}
                    className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-400"}
                  />
                </button>
              </div>

              {/* TRUST BADGES */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-[#06A1B7] shrink-0" />
                  <span>Fast & Secure Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#06A1B7] shrink-0" />
                  <span>100% Genuine Quality</span>
                </div>
              </div>

              {/* FULL DESCRIPTION */}
              {product.fullDescription && (
                <div className="mt-6 bg-gray-50/70 border border-gray-100 rounded-2xl p-4 sm:p-5">
                  <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-2 text-xs sm:text-sm">
                    <Package size={16} className="text-[#06A1B7]" />
                    Product Specifications
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
                    {product.fullDescription}
                  </p>
                </div>
              )}

            </div>
          </div>
        </article>

        {/* MOBILE STICKY ACTION BAR (Visible only on small screens) */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 flex items-center gap-2 z-40 shadow-lg">
          <button
            onClick={() => { if (checkAuth()) toggleWishlist(product); }}
            aria-label="Wishlist"
            className="w-11 h-11 shrink-0 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 active:scale-95 bg-white"
          >
            <Heart size={20} className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"} />
          </button>
          
          <button
            onClick={handleCartAction}
            disabled={product.stock === 0 || cartLoading}
            className="flex-1 bg-cyan-50 border border-[#06A1B7] text-[#06A1B7] h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            {cartLoading ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
            <span>{alreadyInCart ? "Cart" : "Add"}</span>
          </button>

          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0 || buyNowLoading}
            className="flex-1 bg-[#06A1B7] text-white h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 shadow-sm"
          >
            {buyNowLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
            <span>Buy Now</span>
          </button>
        </div>

        {/* CUSTOMER REVIEWS SECTION */}
        <ProductReviews product={product} />

        {/* RELATED PRODUCTS */}
        <RelatedProducts category={product.category} currentProductId={productId} />

      </div>
    </main>
  );
};

export default SingleProduct;