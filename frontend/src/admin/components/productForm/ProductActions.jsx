import React from "react";
import { Save, RotateCcw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const ProductActions = ({
  loading,
  mode = "add",
  onReset,
}) => {
   
  const navigate = useNavigate()
  return (
    <div className=" bg-white rounded-lg mt-8 py-4 flex flex-col sm:flex-row justify-end gap-3">
      <button
        type="button"
        onClick={()=> navigate("/admin/products")}
        className="
          flex items-center justify-center gap-2
          px-5 py-3
          rounded-xl
          border
          hover:bg-gray-100
          transition
        "
      >
        <ArrowLeft size={18} />
        Cancel
      </button>


      <button
        type="button"
        onClick={onReset}
        className="
          flex items-center justify-center gap-2
          px-5 py-3
          rounded-xl
          border
          hover:bg-gray-100
          transition
        "
      >
        <RotateCcw size={18} />
        Reset
      </button>

      <button
        type="submit"
        disabled={loading}
        className="
          flex items-center justify-center gap-2
          px-6 py-3
          rounded-xl
          bg-[#06A1B7]
          text-white
          hover:bg-[#04889b]
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition
        "
      >
        <Save size={18} />

        {loading
          ? "Saving..."
          : mode === "edit"
          ? "Update Product"
          : "Add Product"}
      </button>
    </div>
  );
};

export default React.memo(ProductActions);