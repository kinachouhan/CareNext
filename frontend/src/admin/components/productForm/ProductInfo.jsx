import React, { useMemo, memo } from "react";
import { useFormContext } from "react-hook-form";
import {
  inputStyles,
  labelStyles,
  errorStyles,
  cardStyles,
  sectionTitle,
  selectStyles,
} from "./styles";
import categories from "../../../lib/categoryData.json";

const ProductInfo = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const selectedCategory = watch("category");

  const selectedCategoryData = useMemo(() => {
    return categories.find(
      (item) => item.name === selectedCategory
    );
  }, [selectedCategory]);

  return (
    <div className={cardStyles}>
      <h2 className={`${sectionTitle} text-base sm:text-lg`}>
        Product Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
        
        {/* Product Name */}
        <div className="md:col-span-2">
          <label className={`${labelStyles} text-xs sm:text-sm`}>
            Product Name
          </label>

          <input
            {...register("productName", {
              required: "Product Name is required",
            })}
            className={`${inputStyles} text-xs sm:text-sm py-2.5 sm:py-3`}
            placeholder="Enter Product Name"
          />

          <p className={`${errorStyles} text-[11px] sm:text-xs`}>
            {errors.productName?.message}
          </p>
        </div>

        {/* Category */}
        <div>
          <label className={`${labelStyles} text-xs sm:text-sm`}>
            Category
          </label>

          <select
            {...register("category", {
              required: "Category is required",
            })}
            className={`${selectStyles} text-xs sm:text-sm py-2.5 sm:py-3`}
          >
            <option value="">
              Select Category
            </option>

            {categories.map((item) => (
              <option
                key={item.name}
                value={item.name}
              >
                {item.name}
              </option>
            ))}
          </select>

          <p className={`${errorStyles} text-[11px] sm:text-xs`}>
            {errors.category?.message}
          </p>
        </div>

        {/* Sub Category */}
        <div>
          <label className={`${labelStyles} text-xs sm:text-sm`}>
            Sub Category
          </label>

          <select
            {...register("subCategory", {
              required: "Sub Category is required",
            })}
            className={`${selectStyles} text-xs sm:text-sm py-2.5 sm:py-3`}
            disabled={!selectedCategory}
          >
            <option value="">
              {selectedCategory ? "Select Sub Category" : "Select category first"}
            </option>

            {selectedCategoryData?.sub?.map(
              (sub) => (
                <option
                  key={sub.name}
                  value={sub.name}
                >
                  {sub.name}
                </option>
              )
            )}
          </select>

          <p className={`${errorStyles} text-[11px] sm:text-xs`}>
            {errors.subCategory?.message}
          </p>
        </div>

      </div>
    </div>
  );
};

export default memo(ProductInfo);