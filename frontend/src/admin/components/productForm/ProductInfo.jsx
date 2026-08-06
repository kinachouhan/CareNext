import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  inputStyles,
  labelStyles,
  errorStyles,
  cardStyles,
  sectionTitle,
  selectStyles,
} from "./styles";
import categories from "../../../lib/categoryData.json"

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
      <h2 className={sectionTitle}>
        Product Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelStyles}>
            Product Name
          </label>

          <input
            {...register("productName", {
              required: "Product Name is required",
            })}
            className={inputStyles}
            placeholder="Enter Product Name"
          />

          <p className={errorStyles}>
            {errors.productName?.message}
          </p>
        </div>

        {/* Category */}

        <div>
          <label className={labelStyles}>
            Category
          </label>

          <select
            {...register("category", {
              required: "Category is required",
            })}
            className={selectStyles}
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

          <p className={errorStyles}>
            {errors.category?.message}
          </p>
        </div>

        {/* Sub Category */}

        <div>
          <label className={labelStyles}>
            Sub Category
          </label>

          <select
            {...register("subCategory", {
              required: "Sub Category is required",
            })}
            className={selectStyles}
          >
            <option value="">
              Select Sub Category
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

          <p className={errorStyles}>
            {errors.subCategory?.message}
          </p>
        </div>

      </div>
    </div>
  );
};

export default React.memo(ProductInfo);