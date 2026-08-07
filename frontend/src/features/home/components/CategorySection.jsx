import React, { memo, useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import ProductGrid from "../../products/components/ProductGrid";

const CategorySection = ({
  title,
  products = [],
  category,
  limit = 4,
}) => {
  const categoryProducts = useMemo(() => {
    if (!products.length || !category) return [];
    return products
      .filter((product) => product.category === category)
      .slice(0, limit);
  }, [products, category, limit]);

  if (categoryProducts.length === 0) return null;

  const handleViewAllClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <section className="mt-10 md:mt-16 w-full max-w-7xl mx-auto px-4">
      
      {/* SLEEK COMPACT HEADER */}
      <div className="flex items-center justify-between mb-5 md:mb-6">
        
        {/* Title with modern accent bar */}
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 md:h-7 bg-[#06A1B7] rounded-full" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
        </div>

        {/* View All Link with Auto-Scroll */}
        <Link
          to={`/shop?category=${encodeURIComponent(category)}`}
          onClick={handleViewAllClick}
          className="group flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#06A1B7] bg-cyan-50/70 hover:bg-cyan-100/70 px-3.5 py-2 rounded-xl transition-all duration-200"
        >
          <span>View All</span>
          <ArrowRight 
            size={16} 
            className="transition-transform duration-300 group-hover:translate-x-1" 
          />
        </Link>
      </div>

      {/* PRODUCT GRID */}
      <div className="w-full">
        <ProductGrid products={categoryProducts} />
      </div>

    </section>
  );
};

export default memo(CategorySection);