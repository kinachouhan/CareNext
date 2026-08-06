import React, { memo, useMemo, useState, useCallback } from "react";
import { Search, SlidersHorizontal, ChevronRight, ChevronDown } from "lucide-react";
import categoryData from "../../../lib/categoryData.json";

const CustomCheckbox = memo(({ checked, onChange }) => {
  return (
    <div
      onClick={onChange}
      className={`
        w-5 h-5 rounded-[6px] border-2 flex items-center justify-center cursor-pointer transition-all duration-200 shrink-0
        ${checked 
          ? "bg-[#06A1B7] border-[#06A1B7]" 
          : "border-gray-300 bg-white hover:border-[#06A1B7]/50"
        }
      `}
    >
      {checked && (
        <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-white">
          <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
});

const ProductSidebar = ({ products = [], filters, setFilters, maxPrice }) => {
  const [searchCategory, setSearchCategory] = useState("");
  const [openCategories, setOpenCategories] = useState([]);
  const productCounts = useMemo(() => {
    const counts = { categories: {}, subCategories: {} };
    
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      if (p.category) {
        counts.categories[p.category] = (counts.categories[p.category] || 0) + 1;
      }
      if (p.subCategory) {
        counts.subCategories[p.subCategory] = (counts.subCategories[p.subCategory] || 0) + 1;
      }
    }
    
    return counts;
  }, [products]);

  const categories = useMemo(() => {
    const searchLower = searchCategory.toLowerCase();
    return categoryData.filter((category) =>
      category.name.toLowerCase().includes(searchLower)
    );
  }, [searchCategory]);

  const selectedCategories = Array.isArray(filters.categories) ? filters.categories : [];
  const selectedSubCategories = Array.isArray(filters.subCategories) ? filters.subCategories : [];

  const toggleOpenCategory = useCallback((name) => {
    setOpenCategories((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  }, []);

  // CATEGORY SELECT
  const toggleCategory = useCallback((category) => {
    const subNames = category.sub?.map((item) => item.name) || [];
    const alreadySelected = selectedCategories.includes(category.name);

    setFilters((prev) => ({
      ...prev,
      categories: alreadySelected
        ? prev.categories.filter((item) => item !== category.name)
        : [...prev.categories, category.name],
      subCategories: alreadySelected
        ? prev.subCategories.filter((item) => !subNames.includes(item))
        : [...new Set([...prev.subCategories, ...subNames])],
    }));
  }, [selectedCategories, setFilters]);

  // SUB CATEGORY SELECT
  const toggleSubCategory = useCallback((category, sub) => {
    const isSelected = selectedSubCategories.includes(sub.name);
    let updatedSubs;

    if (isSelected) {
      updatedSubs = selectedSubCategories.filter((item) => item !== sub.name);
    } else {
      updatedSubs = [...selectedSubCategories, sub.name];
    }

    const allSelected = category.sub.every((item) =>
      updatedSubs.includes(item.name),
    );

    setFilters((prev) => ({
      ...prev,
      subCategories: updatedSubs,
      categories: allSelected
        ? [...new Set([...prev.categories, category.name])]
        : prev.categories.filter((item) => item !== category.name),
    }));
  }, [selectedSubCategories, setFilters]);

  return (
    <div className="w-full bg-white flex flex-col h-full lg:border lg:border-gray-200 lg:rounded-3xl lg:shadow-sm">
      
      {/* HEADER */}
      <div className="hidden lg:flex justify-between items-center px-6 py-5 border-b border-gray-100">
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-cyan-50 rounded-xl">
            <SlidersHorizontal size={20} className="text-[#06A1B7]" />
          </div>
          <h2 className="font-bold text-xl text-gray-900">Filters</h2>
        </div>

        <button
          onClick={() =>
            setFilters({
              categories: [],
              subCategories: [],
              price: maxPrice,
              inStock: false,
              featured: false,
              bestSeller: false,
              newArrival: false,
            })
          }
          className="text-[#06A1B7] hover:text-[#058a9d] font-semibold text-sm transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* SEARCH CATEGORIES */}
      <div className="p-5 lg:p-6 pb-2">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#06A1B7]/20 focus:border-[#06A1B7] transition-all text-sm"
          />
        </div>
      </div>

      {/* CATEGORY LIST */}
      <div className="px-5 lg:px-6 pb-6 pt-4 space-y-4">
        <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs">Categories</h3>

        <div className="space-y-3">
          {categories.map((category) => {
            const isOpen = openCategories.includes(category.name);
            const isChecked = selectedCategories.includes(category.name);
            const count = productCounts.categories[category.name] || 0;

            return (
              <div key={category.name} className="flex flex-col">
                {/* Main Category Row */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <CustomCheckbox
                      checked={isChecked}
                      onChange={() => toggleCategory(category)}
                    />
                    <button
                      onClick={() => toggleOpenCategory(category.name)}
                      className="font-medium text-gray-700 hover:text-[#06A1B7] transition-colors text-sm flex items-center gap-1.5"
                    >
                      {category.name}
                      {isOpen ? (
                        <ChevronDown size={14} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={14} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                    {count}
                  </span>
                </div>

                {/* Sub Categories */}
                {isOpen && (
                  <div className="ml-[10px] mt-3 space-y-2.5 border-l-2 border-gray-100 pl-4 py-1">
                    {(category.sub || []).map((sub) => {
                      const isSubChecked = selectedSubCategories.includes(sub.name);
                      
                      // OPTIMIZATION: Instant dictionary lookup
                      const subCount = productCounts.subCategories[sub.name] || 0;

                      return (
                        <div key={sub.name} className="flex justify-between items-center group">
                          <div className="flex items-center gap-3">
                            <CustomCheckbox
                              checked={isSubChecked}
                              onChange={() => toggleSubCategory(category, sub)}
                            />
                            <span 
                              className="text-sm text-gray-600 cursor-pointer hover:text-[#06A1B7] transition-colors" 
                              onClick={() => toggleSubCategory(category, sub)}
                            >
                              {sub.name}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-gray-400">
                            {subCount}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PRICE SLIDER */}
      <div className="border-t border-gray-100 p-5 lg:p-6">
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs">Price Range</h3>
          <span className="text-sm font-bold text-[#06A1B7]">Up to ₹{filters.price}</span>
        </div>

        <input
          type="range"
          min="0"
          max={maxPrice}
          value={filters.price}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              price: Number(e.target.value),
            }))
          }
          className="w-full accent-[#06A1B7] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* OTHER FILTERS */}
      <div className="border-t border-gray-100 p-5 lg:p-6 pb-8">
        <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-xs mb-4">Other Filters</h3>

        <div className="space-y-3">
          {[
            ["inStock", "In Stock Only"],
            ["featured", "Featured Products"],
            ["bestSeller", "Best Sellers"],
            ["newArrival", "New Arrivals"],
          ].map(([key, label]) => (
            <label key={key} className="flex gap-3 items-center cursor-pointer group">
              <CustomCheckbox
                checked={filters[key]}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    [key]: !prev[key],
                  }))
                }
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductSidebar);