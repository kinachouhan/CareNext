import React, { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

import ProductInfo from "./ProductInfo";
import PricingInventory from "./PricingInventory";
import ProductDescription from "./ProductDescription";
import ProductImage from "./ProductImage";
import ProductTags from "./ProductTags";
import ProductActions from "./ProductActions";

const ProductForm = ({
  mode = "add",
  product = null,
  onSubmit,
  loading,
}) => {

  const methods = useForm({
    defaultValues: {
      productName: "",
      category: "",
      subCategory: "",
      price: "",
      discount: "",
      stock: "",
      unit: "",
      shortDescription: "",
      fullDescription: "",
      status: "active",
      feature: false,
      best: false,
      new: false,
      image: null,
    },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (mode === "edit" && product?._id) {
      reset({
        productName: product.name ?? "",
        category: product.category ?? "",
        subCategory: product.subCategory ?? "",
        price: product.price ?? "",
        discount: product.discount ?? 0,
        stock: product.stock ?? "",
        unit: product.unit ?? "",
        shortDescription: product.shortDescription ?? "",
        fullDescription: product.fullDescription ?? "",
        status: product.status ?? "active",
        feature: product.featured ?? false,
        best: product.bestSeller ?? false,
        new: product.newArrival ?? false,
        image: null,
      });
    }
  }, [mode, product?._id, reset]);

  const handleReset = () => {
    if (mode === "edit" && product?._id) {
      reset({
        productName: product.name ?? "",
        category: product.category ?? "",
        subCategory: product.subCategory ?? "",
        price: product.price ?? "",
        discount: product.discount ?? 0,
        stock: product.stock ?? "",
        unit: product.unit ?? "",
        shortDescription: product.shortDescription ?? "",
        fullDescription: product.fullDescription ?? "",
        status: product.status ?? "active",
        feature: product.featured ?? false,
        best: product.bestSeller ?? false,
        new: product.newArrival ?? false,
        image: null,
      });
    } else {
      reset();
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        id="product-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <ProductInfo />
        <PricingInventory />
        <ProductDescription />
        <ProductImage currentImage={product?.image} />
        <ProductTags />
        <ProductActions
          loading={loading}
          mode={mode}
          onReset={handleReset}
        />
      </form>
    </FormProvider>
  );
};

export default React.memo(ProductForm);