import React, { memo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  inputStyles,
  labelStyles,
  errorStyles,
  cardStyles,
  sectionTitle,
} from "./styles";

const ProductDescription = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const shortDescription =
    useWatch({
      control,
      name: "shortDescription",
    }) || "";

  const fullDescription =
    useWatch({
      control,
      name: "fullDescription",
    }) || "";

  return (
    <div className={cardStyles}>
      <h2 className={`${sectionTitle} text-base sm:text-lg`}>
        Product Description
      </h2>

      <div className="space-y-4 sm:space-y-5">

        {/* Short Description */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className={`${labelStyles} text-xs sm:text-sm`}>
              Short Description
            </label>

            <span className={`text-[11px] font-bold ${shortDescription.length > 200 ? "text-red-500" : "text-gray-400"}`}>
              {shortDescription.length}/200
            </span>
          </div>

          <textarea
            rows={2}
            placeholder="Write a brief overview..."
            className={`${inputStyles} text-xs sm:text-sm py-2.5 sm:py-3 resize-none`}
            {...register("shortDescription", {
              required: "Short Description is required",
              maxLength: {
                value: 200,
                message: "Maximum 200 characters allowed",
              },
            })}
          />

          <p className={`${errorStyles} text-[11px] sm:text-xs`}>
            {errors.shortDescription?.message}
          </p>
        </div>

        {/* Full Description */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className={`${labelStyles} text-xs sm:text-sm`}>
              Full Description
            </label>

            <span className={`text-[11px] font-bold ${fullDescription.length > 1000 ? "text-red-500" : "text-gray-400"}`}>
              {fullDescription.length}/1000
            </span>
          </div>

          <textarea
            rows={4}
            placeholder="Enter details like ingredients, usage, storage instructions, benefits..."
            className={`${inputStyles} text-xs sm:text-sm py-2.5 sm:py-3 resize-y min-h-[110px] sm:min-h-[130px]`}
            {...register("fullDescription", {
              required: "Full Description is required",
              maxLength: {
                value: 1000,
                message: "Maximum 1000 characters allowed",
              },
            })}
          />

          <p className={`${errorStyles} text-[11px] sm:text-xs`}>
            {errors.fullDescription?.message}
          </p>
        </div>

      </div>
    </div>
  );
};

export default memo(ProductDescription);