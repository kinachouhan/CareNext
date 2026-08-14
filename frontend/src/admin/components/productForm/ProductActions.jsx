import React, { memo, useCallback } from "react";
import { Save, RotateCcw, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

const ProductActions = ({
  loading,
  mode = "add",
  onReset,
}) => {
  const navigate = useNavigate();

  const handleCancel = useCallback(() => {
    navigate("/admin/products");
  }, [navigate]);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-end gap-3 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] mt-6">
      <button
        type="button"
        onClick={handleCancel}
        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs md:text-sm hover:bg-gray-50 active:scale-95 transition-all w-full sm:w-auto"
      >
        <ArrowLeft size={16} />
        <span>Cancel</span>
      </button>

      {mode === "add" && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs md:text-sm hover:bg-gray-50 active:scale-95 transition-all w-full sm:w-auto"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#06A1B7] hover:bg-[#058a9d] text-white font-bold text-xs md:text-sm shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all w-full sm:w-auto"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Save size={16} />
        )}
        <span>
          {loading
            ? "Saving..."
            : mode === "edit"
            ? "Update Product"
            : "Add Product"}
        </span>
      </button>
    </div>
  );
};

export default memo(ProductActions);