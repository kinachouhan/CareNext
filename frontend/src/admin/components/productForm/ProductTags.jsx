import React, { memo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  cardStyles,
  sectionTitle,
  labelStyles,
  selectStyles,
} from "./styles";

const SWITCHES = [
  {
    label: "Featured",
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
  const { register, control } = useFormContext();

  const status = useWatch({ control, name: "status" });
  const feature = useWatch({ control, name: "feature" });
  const best = useWatch({ control, name: "best" });
  const newItem = useWatch({ control, name: "new" });

  return (
    <div className={cardStyles}>
      <h2 className={`${sectionTitle} text-base sm:text-lg`}>
        Product Status & Tags
      </h2>

      <div className="space-y-4 sm:space-y-5">
        
        {/* Product Status Select */}
        <div>
          <label className={`${labelStyles} text-xs sm:text-sm`}>
            Product Status
          </label>

          <select
            {...register("status")}
            className={`${selectStyles} text-xs sm:text-sm py-2.5 sm:py-3`}
          >
            <option value="active">
              Active
            </option>
            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>

        {/* Checkbox Switches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {SWITCHES.map((item) => (
            <label
              key={item.name}
              className="flex items-center justify-between border border-gray-200 rounded-xl px-3.5 py-2.5 sm:py-3 cursor-pointer hover:border-[#06A1B7] hover:bg-cyan-50/10 transition-all select-none"
            >
              <span className="font-semibold text-xs sm:text-sm text-gray-800">
                {item.label}
              </span>

              <input
                type="checkbox"
                {...register(item.name)}
                className="h-4 w-4 rounded text-[#06A1B7] accent-[#06A1B7] cursor-pointer"
              />
            </label>
          ))}
        </div>

        {/* Live Selected Tags Preview Box */}
        <div className="bg-gray-50/80 rounded-2xl p-3.5 sm:p-4 border border-gray-100">
          <h3 className="font-bold text-[11px] sm:text-xs uppercase tracking-wider text-gray-400 mb-2">
            Active Tags Preview
          </h3>
          
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {status === "active" && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold border border-emerald-100">
                Active
              </span>
            )}

            {status === "inactive" && (
              <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[11px] sm:text-xs font-bold border border-red-100">
                Inactive
              </span>
            )}

            {feature && (
              <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-[#06A1B7] text-[11px] sm:text-xs font-bold border border-cyan-100">
                Featured
              </span>
            )}

            {best && (
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] sm:text-xs font-bold border border-amber-100">
                Best Seller
              </span>
            )}

            {newItem && (
              <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] sm:text-xs font-bold border border-purple-100">
                New Arrival
              </span>
            )}

            {!status && !feature && !best && !newItem && (
              <span className="text-xs text-gray-400 italic font-medium">
                No custom tags enabled
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default memo(ProductTags);