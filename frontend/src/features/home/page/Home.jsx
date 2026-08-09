import React, { useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsThunk } from "../../../slice/product/productThunk";

import Hero from "../components/Hero";
import HeroCategories from "../components/HeroCategories";
import CategorySection from "../components/CategorySection";
import categoryData from "../../../lib/categoryData.json";
import Loader from "../../../shared/components/Loader"; // Import your loader

const Home = () => {
  const dispatch = useDispatch();
  const { products = [], isLoading } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (!products.length && !isLoading) {
      dispatch(getProductsThunk());
    }
  }, [dispatch, products.length, isLoading]);

  // Show loader on initial load if products are not fetched yet
  if (isLoading && products.length === 0) {
    return <Loader text="Loading Storefront..." />;
  }

  return (
    <main className="bg-[#F5F7FB] min-h-screen pb-6 overflow-hidden">
      
      {/* HERO SECTION CONTAINER */}
      <div className="max-w-7xl mx-auto px-4  ">
        <Hero />
        <HeroCategories />
      </div>

      {/* DYNAMIC CATEGORY SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12 space-y-12 md:space-y-16">
        {categoryData.map((item) => (
          <CategorySection
            key={item.name}
            title={item.name}
            category={item.name}
            products={products}
            limit={4}
          />
        ))}
      </div>

    </main>
  );
};

export default memo(Home);