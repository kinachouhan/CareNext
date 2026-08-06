import React from "react";
import { useFormContext } from "react-hook-form";
import {
  inputStyles,
  labelStyles,
  errorStyles,
  cardStyles,
  sectionTitle,
  selectStyles,
} from "./styles";

const units = [
  "Kg",
  "Gram",
  "Litre",
  "ml",
  "Piece",
  "Packet",
  "Box",
];



const PricingInventory = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={cardStyles}>
      <h2 className={sectionTitle}>
        Pricing & Inventory
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Price */}

        <div>
          <label className={labelStyles}>
            Price (₹)
          </label>

          <input
            type="number"
            min={1}
            placeholder="100"
            className={inputStyles}
            {...register("price", {
              required: "Price is required",
              min: {
                value: 1,
                message: "Price must be greater than 0",
              },
            })}
          />

          <p className={errorStyles}>
            {errors.price?.message}
          </p>
        </div>

        {/* Discount */}

        <div>
          <label className={labelStyles}>
            Discount
          </label>

          <input
            type="number"
            placeholder="10"
            className={inputStyles}
            {...register("discount")}
          />

          <p className={errorStyles}>
            {errors.discount?.message}
          </p>
        </div>

        {/* Stock */}

        <div>
          <label className={labelStyles}>
            Stock
          </label>

          <input
            type="number"
            min={1}
            placeholder="50"
            className={inputStyles}
            {...register("stock", {
              required: "Stock is required",
              min: {
                value: 1,
                message: "Invalid stock",
              },
            })}
          />

          <p className={errorStyles}>
            {errors.stock?.message}
          </p>
        </div>

        {/* Unit */}

        <div>
          <label className={labelStyles}>
            Unit
          </label>

          <select
            className={selectStyles}
            {...register("unit", {
              required: "Unit is required",
            })}
          >
            <option value="">
              Select Unit
            </option>

            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>

          <p className={errorStyles}>
            {errors.unit?.message}
          </p>
        </div>

      </div>
    </div>
  );
};

export default React.memo(PricingInventory);