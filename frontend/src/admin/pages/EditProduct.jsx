import React, { useCallback, useEffect } from "react";
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
    <div className="min-h-screen bg-[#F5F7FB] p-4 sm:p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Edit Product
        </h1>

        <p className="text-gray-500 mt-1">
          Update your product information.
        </p>
      </div>

      <ProductForm
        mode="edit"
        product={selectedProduct}
        onSubmit={handleUpdateProduct}
        loading={isLoading}
      />
    </div>
  );
};

export default React.memo(EditProduct);