import React from "react";
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
      <h2 className={sectionTitle}>
        Product Description
      </h2>

      <div className="space-y-6">

        {/* Short Description */}

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className={labelStyles}>
              Short Description
            </label>

            <span className="text-xs text-gray-500">
              {shortDescription.length}/200
            </span>
          </div>

          <textarea
            rows={3}
            placeholder="Enter short description..."
            className={`${inputStyles} resize-none`}
            {...register("shortDescription", {
              required: "Short Description is required",
              maxLength: {
                value: 200,
                message:
                  "Maximum 200 characters allowed",
              },
            })}
          />

          <p className={errorStyles}>
            {errors.shortDescription?.message}
          </p>
        </div>

        {/* Full Description */}

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className={labelStyles}>
              Full Description
            </label>

            <span className="text-xs text-gray-500">
              {fullDescription.length}/1000
            </span>
          </div>

          <textarea
            rows={7}
            placeholder="Enter complete product description..."
            className={`${inputStyles} resize-y min-h-[180px]`}
            {...register("fullDescription", {
              required: "Full Description is required",
              maxLength: {
                value: 1000,
                message:
                  "Maximum 1000 characters allowed",
              },
            })}
          />

          <p className={errorStyles}>
            {errors.fullDescription?.message}
          </p>
        </div>

      </div>
    </div>
  );
};

export default React.memo(ProductDescription);