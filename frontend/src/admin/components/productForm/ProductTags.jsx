import React from "react";
import { useFormContext } from "react-hook-form";
import {
  cardStyles,
  sectionTitle,
  labelStyles,
  selectStyles,
} from "./styles";

const switches = [
  {
    label: "Featured Product",
    name: "feature",
  },
  {
    label: "Best Seller",
    name: "best",
  },
  {
    label: "New Arrival",
    name: "new",
  },
];

const ProductTags = () => {
  const { register, watch } = useFormContext();

  return (
    <div className={cardStyles}>
      <h2 className={sectionTitle}>
        Product Status
      </h2>
      <div className="grid gap-6">
        <div>
          <label className={labelStyles}>
            Product Status
          </label>

          <select
            {...register("status")}
            className={selectStyles}
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {switches.map((item) => (
            <label
              key={item.name}
              className="
              flex
              items-center
              justify-between
              border
              border-gray-200
              rounded-xl
              px-4
              py-3
              cursor-pointer
              hover:border-[#06A1B7]
              transition
              "
            >
              <span className="font-medium">
                {item.label}
              </span>

              <input
                type="checkbox"
                {...register(item.name)}
                className="
                h-5
                w-5
                accent-[#06A1B7]
                cursor-pointer
                "
              />
            </label>
          ))}

        </div>


        <div className="bg-gray-100 rounded-xl p-4 ">
          <h3 className="font-semibold mb-3">
            Selected Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {watch("status") === "active" && (
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                Active
              </span>
            )}

            {watch("status") === "inactive" && (
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                Inactive
              </span>
            )}

            {watch("feature") && (
              <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm">
                Featured
              </span>
            )}

            {watch("best") && (
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                Best Seller
              </span>
            )}

            {watch("new") && (
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                New Arrival
              </span>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default React.memo(ProductTags);