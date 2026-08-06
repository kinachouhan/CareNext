import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";

const ProductCard = ({ product, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
      <div className="flex gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-24 h-24 rounded-xl object-cover border"
          loading="lazy"
        />

        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">
            {product.name}
          </h2>

          <p className="text-sm text-gray-500">
            {product.subCategory}
          </p>

          <div className="mt-3 space-y-1 text-sm">
            <p>
              <span className="font-medium">
                Category:
              </span>{" "}
              {product.category}
            </p>

            <p>
              <span className="font-medium">
                Price:
              </span>{" "}
              ₹{product.price}
            </p>

            <p>
              <span className="font-medium">
                Stock:
              </span>{" "}
              {product.stock}
            </p>
          </div>

          <div className="mt-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                product.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-5 border-t pt-4">
        <Link
          to={`/admin/edit-product/${product._id}`}
          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
        >
          <Pencil size={18} />
        </Link>

        <button
          onClick={() => onDelete(product._id)}
          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);