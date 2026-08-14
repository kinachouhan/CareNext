import React, { useCallback, useEffect, memo } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import ProductForm from "../components/productForm/ProductForm";
import Loader from "../../shared/components/Loader";

import {
  getProductByIdThunk,
  updateProductThunk,
} from "../../slice/product/productThunk";

import { buildProductFormData } from "../../utils/buildProductFormData";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, selectedProduct } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        await dispatch(getProductByIdThunk(id)).unwrap();
      } catch (error) {
        toast.error(
          error?.message || "Failed to load product"
        );
        navigate("/admin/products");
      }
    };

    fetchProduct();
  }, [dispatch, id, navigate]);

  const handleUpdateProduct = useCallback(
    async (data) => {
      try {
        const formData = buildProductFormData(data);
        await dispatch(
          updateProductThunk({
            id,
            formData,
          })
        ).unwrap();
        toast.success("Product Updated Successfully");
        navigate("/admin/products");
      } catch (error) {
        toast.error(
          error?.message ||
            "Something went wrong"
        );
      }
    },
    [dispatch, navigate, id]
  );

  if (isLoading && !selectedProduct) {
    return (
      <Loader text="Loading Product..." />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-3 sm:p-4 md:p-6 pb-20">
      
      <div className="mb-6 sm:px-6 px-4">
        <h1 className=" text-2xl md:text-3xl font-bold text-gray-950">
          Edit Product
        </h1>

        <p className="text-xs md:text-sm text-gray-500 mt-0.5">
          Update your product inventory details and specs.
        </p>
      </div>

      <div className=" rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 ">
        <ProductForm
          mode="edit"
          product={selectedProduct}
          onSubmit={handleUpdateProduct}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default memo(EditProduct);