import { useDeferredValue, useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlidersHorizontal, ArrowUpDown, X, Loader2 } from "lucide-react";
import Loader from "../../../shared/components/Loader";
import ProductGrid from "../components/ProductGrid";
import ProductSearch from "../components/ProductSearch";
import Pagination from "../components/Pagination";
import ProductSidebar from "../components/ProductSidebar";
import { getProductsThunk } from "../../../slice/product/productThunk";
import EmptyProducts from "./../components/EmptyProducts";
import { useSearchParams } from "react-router";

const PRODUCTS_PER_PAGE = 10;
const MOBILE_ITEMS_PER_BATCH = 8;

const Products = () => {
  const dispatch = useDispatch();
  const { products = [], isLoading } = useSelector((state) => state.product);
  const [search, setSearch] = useState("");

  // Mobile drawer states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Mobile Infinite Scroll Visible Limit State
  const [mobileVisibleCount, setMobileVisibleCount] = useState(MOBILE_ITEMS_PER_BATCH);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [filters, setFilters] = useState({
    categories: [],
    subCategories: [],
    price: 0,
    inStock: false,
    featured: false,
    bestSeller: false,
    newArrival: false,
  });

  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getProductsThunk());
  }, [dispatch]);

  const deferredSearch = useDeferredValue(search);

  // Reset pagination and infinite scroll counters whenever filters/search/sort change
  useEffect(() => {
    setCurrentPage(1);
    setMobileVisibleCount(MOBILE_ITEMS_PER_BATCH);
  }, [deferredSearch, filters, sortBy]);

  const maxPrice = useMemo(() => {
    if (!products.length) return 0;
    const activeProducts = products.filter((p) => p.status === "active" && Number(p.stock) > 0);
    if (!activeProducts.length) return 0;
    return Math.max(...activeProducts.map((product) => Number(product.price) || 0));
  }, [products]);

  useEffect(() => {
    setFilters((prev) => {
      if (prev.price > 0) return prev;
      return { ...prev, price: maxPrice };
    });
  }, [maxPrice]);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setFilters((prev) => ({
        ...prev,
        categories: [category],
      }));
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];
    const keyword = deferredSearch.trim().toLowerCase();
    const categorySet = new Set(filters.categories);
    const subCategorySet = new Set(filters.subCategories);
    const maxFilterPrice = Number(filters.price);

    let data = [...products].filter((product) => {
      if (product.status && product.status !== "active") return false;
      if (Number(product.stock) <= 0) return false;

      if (filters.inStock && Number(product.stock) <= 0) return false;
      if (filters.featured && !product.featured) return false;
      if (filters.bestSeller && !product.bestSeller) return false;
      if (filters.newArrival && !product.newArrival) return false;
      if (maxFilterPrice > 0 && Number(product.price) > maxFilterPrice) return false;

      if (categorySet.size > 0 && !categorySet.has(product.category)) return false;
      if (subCategorySet.size > 0 && !subCategorySet.has(product.subCategory)) return false;

      if (keyword) {
        const searchString = `${product.name || ""} ${product.category || ""} ${product.subCategory || ""}`.toLowerCase();
        if (!searchString.includes(keyword)) return false;
      }

      return true;
    });

    switch (sortBy) {
      case "low":
        data.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "high":
        data.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name":
        data.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      default:
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return data;
  }, [products, deferredSearch, filters, sortBy]);

  // Desktop Pagination Slicing
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;

  const desktopProducts = useMemo(() => {
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, indexOfFirstProduct, indexOfLastProduct]);

  // Mobile Infinite Scroll Slicing
  const mobileProducts = useMemo(() => {
    return filteredProducts.slice(0, mobileVisibleCount);
  }, [filteredProducts, mobileVisibleCount]);

  const hasMoreMobileProducts = mobileVisibleCount < filteredProducts.length;

  // Handle Mobile Infinite Scroll Trigger on Window Scroll
  const handleScroll = useCallback(() => {
    if (window.innerWidth >= 1024) return; // Only apply infinite scroll on mobile/tablet view
    if (isFetchingMore || !hasMoreMobileProducts) return;

    // Check if user is scrolled within 300px of the bottom of the page
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300) {
      setIsFetchingMore(true);
      setTimeout(() => {
        setMobileVisibleCount((prev) => prev + MOBILE_ITEMS_PER_BATCH);
        setIsFetchingMore(false);
      }, 400); // Slight smooth delay for UX loading feel
    }
  }, [isFetchingMore, hasMoreMobileProducts]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (isLoading) {
    return <Loader text="Loading Products..." />;
  }

  return (
    <section className="bg-[#F5F7FB] min-h-screen pb-24 lg:pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 lg:mb-6">
          <ProductSearch
            value={search}
            onSearch={setSearch}
            totalProducts={filteredProducts.length}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-24">
              <ProductSidebar
                products={products}
                filters={filters}
                setFilters={setFilters}
                maxPrice={maxPrice}
              />
            </div>
          </aside>

          {/* Main Product Area */}
          <section className="flex-1 min-w-0">
            {/* Desktop Sort Header */}
            <div className="hidden lg:flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-600 font-medium text-sm">
                Showing {desktopProducts.length} of {filteredProducts.length} products
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#06A1B7] outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <option value="">Newest Arrivals</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Product Grid - Renders mobile slice on small screens, desktop page slice on large screens */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="block lg:hidden">
                  <ProductGrid products={mobileProducts} />
                  {isFetchingMore && (
                    <div className="py-8 flex justify-center items-center">
                      <Loader2 className="w-6 h-6 animate-spin text-[#06A1B7]" />
                      <span className="ml-2 text-xs font-semibold text-gray-500">Loading more products...</span>
                    </div>
                  )}
                  {!hasMoreMobileProducts && mobileProducts.length > 8 && (
                    <p className="text-center text-xs text-gray-400 py-6">You've reached the end of the list!</p>
                  )}
                </div>

                <div className="hidden lg:block">
                  <ProductGrid products={desktopProducts} />
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-10 md:p-16 text-center shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px]">
                <EmptyProducts />
              </div>
            )}

            {/* Pagination (Visible on Desktop Only) */}
            {totalPages > 1 && (
              <div className="mt-8 hidden lg:block">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  indexOfFirstProduct={indexOfFirstProduct}
                  indexOfLastProduct={indexOfLastProduct}
                  totalProducts={filteredProducts.length}
                />
              </div>
            )}
          </section>
        </div>
      </div>

      {/* MOBILE FIXED BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-30 flex">
        <button
          onClick={() => setIsSortOpen(true)}
          className="flex-1 py-4 flex justify-center items-center gap-2 text-gray-700 font-semibold border-r border-gray-200 hover:bg-gray-50 active:bg-gray-100"
        >
          <ArrowUpDown size={18} />
          Sort
        </button>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex-1 py-4 flex justify-center items-center gap-2 text-gray-700 font-semibold hover:bg-gray-50 active:bg-gray-100"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      {/* Dark Overlay for Drawers */}
      {(isFilterOpen || isSortOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => {
            setIsFilterOpen(false);
            setIsSortOpen(false);
          }}
        />
      )}

      {/* Mobile Sort Drawer */}
      <div
        className={`
        fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out
        ${isSortOpen ? "translate-y-0" : "translate-y-full"}
      `}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Sort By</h3>
            <button
              onClick={() => setIsSortOpen(false)}
              className="p-2 bg-gray-100 rounded-full text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3 pb-6">
            {[
              { value: "", label: "Newest Arrivals" },
              { value: "low", label: "Price: Low to High" },
              { value: "high", label: "Price: High to Low" },
              { value: "name", label: "Name: A to Z" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortBy(option.value);
                  setIsSortOpen(false);
                }}
                className={`w-full text-left px-5 py-4 rounded-xl font-medium transition-colors ${
                  sortBy === option.value
                    ? "bg-cyan-50 text-[#06A1B7] border border-cyan-100"
                    : "bg-gray-50 text-gray-700 border border-transparent hover:bg-gray-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div
        className={`
        fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-3xl z-50 lg:hidden flex flex-col transform transition-transform duration-300 ease-in-out
        ${isFilterOpen ? "translate-y-0" : "translate-y-full"}
      `}
      >
        <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-gray-900">Filters</h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="p-2 bg-gray-100 rounded-full text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
          <ProductSidebar
            products={products}
            filters={filters}
            setFilters={setFilters}
            maxPrice={maxPrice}
          />
        </div>

        <div className="p-4 border-t border-gray-100 shrink-0 bg-white pb-safe">
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full bg-[#06A1B7] text-white py-4 rounded-xl font-bold shadow-sm shadow-cyan-500/20 active:bg-[#058a9d]"
          >
            Show {mobileProducts.length} Results
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;