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
    <div className="min-h-screen bg-[#F5F7FB] p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add Product</h1>
        <p className="text-gray-500 mt-1">Create a new product.</p>
      </div>
      <ProductForm mode="add" onSubmit={handleAddProduct} loading={isLoading} />
    </div>
  );
};

export default AddProducts;
