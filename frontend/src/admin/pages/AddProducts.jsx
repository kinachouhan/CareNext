import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { addProductThunk } from "../../slice/product/productThunk";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { buildProductFormData } from "../../utils/buildProductFormData";
import ProductForm from "../components/productForm/ProductForm";

const AddProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.product.isLoading);

  const handleAddProduct = useCallback(
    async (data) => {
      try {
        const formData = buildProductFormData(data);
        await dispatch(addProductThunk(formData)).unwrap();
        toast.success("Product Added Successfully");
        navigate("/admin/products");
      } catch (error) {
        toast.error(
          error?.response?.data?.message ??
            error?.message ??
            "Something went wrong",
        );
      }
    },
    [dispatch, navigate],
  );

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-3 sm:p-4 pb-10">
      <div className="mb-6 sm:px-6 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-950">Add Product</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-0.5">Create a new product listing in your inventory.</p>
      </div>
      
      <div className="rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100">
        <ProductForm mode="add" onSubmit={handleAddProduct} loading={isLoading} />
      </div>
    </div>
  );
};

export default AddProducts;