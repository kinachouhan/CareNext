import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <div 
          key={product._id || index} 
          className={index >= 2 ? "hidden sm:block" : "block"}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default React.memo(ProductGrid);