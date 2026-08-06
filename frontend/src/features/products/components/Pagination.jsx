import React, { memo, useMemo } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  indexOfFirstProduct,
  indexOfLastProduct,
  totalProducts,
}) => {
  const pages = useMemo(() => {
    const visible = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        visible.push(i);
      }
    } else {
      visible.push(1);

      if (currentPage > 3) {
        visible.push("...");
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        visible.push(i);
      }

      if (currentPage < totalPages - 2) {
        visible.push("...");
      }

      visible.push(totalPages);
    }

    return visible;
  }, [currentPage, totalPages]);

  // Handle case where there are no products
  if (totalProducts === 0) return null;

  return (
    <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 w-full">
      
      {/* Product Count Text */}
      <p className="text-xs md:text-sm text-gray-500 font-medium">
        Showing{" "}
        <span className="font-bold text-gray-800">
          {indexOfFirstProduct + 1}
        </span>
        {" - "}
        <span className="font-bold text-gray-800">
          {Math.min(indexOfLastProduct, totalProducts)}
        </span>{" "}
        of <span className="font-bold text-gray-800">{totalProducts}</span> Products
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 px-1">
        
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous Page"
          className="
            h-9 w-9 md:h-11 md:w-11
            rounded-[10px] md:rounded-xl
            border border-gray-200
            bg-white text-gray-600
            flex items-center justify-center
            disabled:opacity-40
            disabled:cursor-not-allowed
            hover:not(:disabled):bg-[#06A1B7]
            hover:not(:disabled):text-white
            hover:not(:disabled):border-[#06A1B7]
            transition-all duration-200
            shrink-0
          "
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        {pages.map((page, index) =>
          page === "..." ? (
            <div
              key={`dots-${index}`}
              className="
                w-6 md:w-8
                flex justify-center items-center
                text-gray-400 shrink-0
              "
            >
              <MoreHorizontal size={18} />
            </div>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`
                h-9 w-9 md:h-11 md:w-11
                rounded-[10px] md:rounded-xl
                font-semibold text-sm md:text-base
                transition-all duration-200 shrink-0
                ${
                  currentPage === page
                    ? "bg-[#06A1B7] text-white shadow-md shadow-cyan-500/20 border-transparent"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#06A1B7] hover:text-[#06A1B7]"
                }
              `}
            >
              {page}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
          className="
            h-9 w-9 md:h-11 md:w-11
            rounded-[10px] md:rounded-xl
            border border-gray-200
            bg-white text-gray-600
            flex items-center justify-center
            disabled:opacity-40
            disabled:cursor-not-allowed
            hover:not(:disabled):bg-[#06A1B7]
            hover:not(:disabled):text-white
            hover:not(:disabled):border-[#06A1B7]
            transition-all duration-200
            shrink-0
          "
        >
          <ChevronRight size={18} />
        </button>
      </div>
      
    </div>
  );
};

export default memo(Pagination);