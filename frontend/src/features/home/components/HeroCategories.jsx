import React, { useRef, useMemo } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import categoryData from "../../../lib/categoryData.json";

const HeroCategories = () => {
  const scrollRef = useRef(null);
  const categories = useMemo(() => {
    return categoryData.map((cat) => ({
      name: cat.name,
      image: cat.image,
      link: `/shop?category=${encodeURIComponent(cat.name)}`,
    }));
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Explore Categories
        </h2>

        <div className="flex items-center gap-4">
        
          <Link
            to="/shop"
            className="text-sm font-semibold text-[#06A1B7] hover:underline"
          >
            View All
          </Link>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-[#06A1B7] hover:text-[#06A1B7] transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-[#06A1B7] hover:text-[#06A1B7] transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

     
      <div 
        ref={scrollRef}
        className="flex items-center gap-6 md:gap-8 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [supports(scrollbar-width:none)]:scrollbar-none [&::-webkit-scrollbar]:hidden scroll-smooth py-2 px-1"
      >
        {categories.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="flex flex-col items-center shrink-0 group/card cursor-pointer w-24 sm:w-28"
          >
           
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] group-hover/card:shadow-[0_6px_25px_rgba(6,161,183,0.15)] group-hover/card:border-[#06A1B7]/40 transition-all duration-300 relative overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                />
              </div>
            </div>

            
            <span className="mt-3 text-xs sm:text-sm font-semibold text-gray-800 text-center line-clamp-2 group-hover/card:text-[#06A1B7] transition-colors leading-tight">
              {item.name}
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default HeroCategories;