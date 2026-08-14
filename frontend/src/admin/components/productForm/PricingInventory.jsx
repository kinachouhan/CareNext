import React, { memo } from "react";
import { useFormContext } from "react-hook-form";
import {
  inputStyles,
  labelStyles,
  errorStyles,
  cardStyles,
  sectionTitle,
  selectStyles,
} from "./styles";

const UNITS = ["Kg", "Gram", "Litre", "ml", "Piece", "Packet", "Box"];

const PricingInventory = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={cardStyles}>
      <h2 className={`${sectionTitle} text-base sm:text-lg`}>
        Pricing & Inventory
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">

        {/* Price */}
        <div className="col-span-1">
          <label className={`${labelStyles} text-xs sm:text-sm`}>
            Price (₹)
          </label>

          <input
            type="number"
            min={1}
            step="any"
            placeholder="100"
            className={`${inputStyles} text-xs sm:text-sm py-2.5 sm:py-3`}
            {...register("price", {
              required: "Price required",
              min: {
                value: 1,
                message: "Must be > 0",
              },
              valueAsNumber: true,
            })}
          />

          <p className={`${errorStyles} text-[11px] sm:text-xs`}>
            {errors.price?.message}
          </p>
        </div>

        {/* Discount */}
        <div className="col-span-1">
          <label className={`${labelStyles} text-xs sm:text-sm`}>
            Discount (%)
          </label>

          <input
            type="number"
            min={0}
            max={100}
            placeholder="10"
            className={`${inputStyles} text-xs sm:text-sm py-2.5 sm:py-3`}
            {...register("discount", {
              min: { value: 0, message: "Min 0%" },
              max: { value: 100, message: "Max 100%" },
              valueAsNumber: true,
            })}
          />

          <p className={`${errorStyles} text-[11px] sm:text-xs`}>
            {errors.discount?.message}
          </p>
        </div>

        {/* Stock */}
        <div className="col-span-1">
          <label className={`${labelStyles} text-xs sm:text-sm`}>
            Stock
          </label>

          <input
            type="number"
            min={0}
            placeholder="50"
            className={`${inputStyles} text-xs sm:text-sm py-2.5 sm:py-3`}
            {...register("stock", {
              required: "Stock required",
              min: {
                value: 0,
                message: "Cannot be negative",
              },
              valueAsNumber: true,
            })}
          />

          <p className={`${errorStyles} text-[11px] sm:text-xs`}>
            {errors.stock?.message}
          </p>
        </div>

        {/* Unit */}
        <div className="col-span-1">
          <label className={`${labelStyles} text-xs sm:text-sm`}>
            Unit
          </label>

          <select
            className={`${selectStyles} text-xs sm:text-sm py-2.5 sm:py-3`}
            {...register("unit", {
              required: "Unit required",
            })}
          >
            <option value="">
              Select Unit
            </option>

            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>

          <p className={`${errorStyles} text-[11px] sm:text-xs`}>
            {errors.unit?.message}
          </p>
        </div>

      </div>
    </div>
  );
};

export default memo(PricingInventory);