import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import ProductCard from "./ProductCard";

const RelatedProducts = ({ category, currentProductId }) => {
  const { products = [] } = useSelector((state) => state.product);

  const { displayProducts, sectionTitle, linkTarget } = useMemo(() => {
    if (!products.length) {
      return { displayProducts: [], sectionTitle: "", linkTarget: "" };
    }

    const related = products.filter(
      (p) => p.category === category && p._id !== currentProductId
    );

    if (related.length > 0) {
      return {
        displayProducts: related.slice(0, 4),
        sectionTitle: "Related Products",
        linkTarget: `/shop?category=${category}`, 
      };
    }

    
    const fallbackProducts = products
      .filter((p) => p._id !== currentProductId)
      .sort((a, b) => {
        
        if (a.bestSeller && !b.bestSeller) return -1;
        if (!a.bestSeller && b.bestSeller) return 1;
        return 0;
      });

    return {
      displayProducts: fallbackProducts.slice(0, 4),
      sectionTitle: "You May Also Like",
      linkTarget: "/shop", // Link back to the main shop
    };
  }, [products, category, currentProductId]);

  
  if (displayProducts.length === 0) return null;

  return (
    <div className="mt-12 md:mt-16 border-t border-gray-100 pt-10 md:pt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {sectionTitle}
        </h2>
        <Link 
          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
          to={linkTarget} 
          className="text-[#06A1B7] font-semibold hover:text-[#058a9d] hover:underline transition-colors w-fit"
        >
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {displayProducts.map((prod) => (
          <ProductCard key={prod._id} product={prod} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;