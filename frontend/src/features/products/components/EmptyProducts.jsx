import React from "react";
import { PackageSearch } from "lucide-react";

const EmptyProducts = () => {
  return (
    <div className="py-20 flex flex-col items-center justify-center">

      <PackageSearch
        size={70}
        className="text-gray-300 mb-4"
      />

      <h2 className="text-2xl font-semibold">
        No Products Found
      </h2>

      <p className="text-gray-500 mt-2">
        Try searching with another keyword.
      </p>

    </div>
  );
};

export default EmptyProducts;