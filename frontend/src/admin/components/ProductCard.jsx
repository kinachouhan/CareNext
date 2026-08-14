import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import React, { memo } from "react";

const ProductCard = memo(({ product, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col justify-between h-full">
      <div className="flex gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-gray-50 border border-gray-100 shrink-0"
          loading="lazy"
        />

        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 truncate">
            {product.name}
          </h2>

          <p className="text-xs font-semibold text-[#06A1B7] mt-0.5 truncate">
            {product.subCategory || "General"}
          </p>

          <div className="mt-2.5 space-y-1 text-xs text-gray-600">
            <p className="truncate">
              <span className="font-bold text-gray-400 uppercase text-[10px]">Category:</span>{" "}
              <span className="font-medium text-gray-700">{product.category}</span>
            </p>

            <p>
              <span className="font-bold text-gray-400 uppercase text-[10px]">Price:</span>{" "}
              <span className="font-extrabold text-gray-900">₹{product.price}</span>
            </p>

            <p>
              <span className="font-bold text-gray-400 uppercase text-[10px]">Stock:</span>{" "}
              <span className={`font-bold ${product.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>
                {product.stock} units
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
            product.status === "active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {product.status}
        </span>

        <div className="flex items-center gap-1.5">
          <Link
            to={`/admin/edit-product/${product._id}`}
            className="p-2 rounded-xl bg-cyan-50 text-[#06A1B7] hover:bg-cyan-100 transition-colors"
            title="Edit Product"
          >
            <Pencil size={16} />
          </Link>

          <button
            onClick={() => onDelete(product._id)}
            className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;