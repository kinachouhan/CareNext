import { Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const ProductRow = ({
    product,
    onDelete,
}) => {

   return (
             <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      loading="lazy"
  decoding="async"
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {product.subCategory}
                    </p>
                  </td>
                  <td>{product.category}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        product.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center gap-3">
                      <button className="text-green-600 hover:text-green-800">
                        <Link
                          to={`/admin/edit-product/${product._id}`}
                          className="p-2 rounded-lg cursor"
                        >
                          <Pencil size={18} />
                        </Link>
                      </button>
                      <button
                        onClick={() => onDelete(product._id)}
                        className="p-2 rounded-lg text-red-500 cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
   )

}

export default React.memo(ProductRow);