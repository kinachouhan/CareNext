import React, { useMemo } from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  indexOfFirstProduct,
  indexOfLastProduct,
  totalProducts,
}) => {
  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold">
          {indexOfFirstProduct + 1}
        </span>{" "}
        -
        <span className="font-semibold">
          {" "}
          {Math.min(indexOfLastProduct, totalProducts)}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {totalProducts}
        </span>{" "}
        products
      </p>

      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button
          onClick={() => onPageChange((prev) => prev - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border transition ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-[#06A1B7] hover:text-white"
          }`}
        >
          Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg transition ${
              currentPage === page
                ? "bg-[#06A1B7] text-white"
                : "bg-white border hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg border transition ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-[#06A1B7] hover:text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default React.memo(Pagination);