import React, { useEffect, useMemo, useCallback, memo } from "react";
import { FormProvider, useForm } from "react-hook-form";

import ProductInfo from "./ProductInfo";
import PricingInventory from "./PricingInventory";
import ProductDescription from "./ProductDescription";
import ProductImage from "./ProductImage";
import ProductTags from "./ProductTags";
import ProductActions from "./ProductActions";

const DEFAULT_FORM_VALUES = {
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
};

const ProductForm = ({
  mode = "add",
  product = null,
  onSubmit,
  loading,
}) => {
  const methods = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { handleSubmit, reset } = methods;

  // Memoize form initial data formatting for performance optimization
  const formattedProductValues = useMemo(() => {
    if (!product?._id) return DEFAULT_FORM_VALUES;
    return {
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
    };
  }, [product]);

  useEffect(() => {
    if (mode === "edit" && product?._id) {
      reset(formattedProductValues);
    }
  }, [mode, product?._id, reset, formattedProductValues]);

  const handleReset = useCallback(() => {
    if (mode === "edit" && product?._id) {
      reset(formattedProductValues);
    } else {
      reset(DEFAULT_FORM_VALUES);
    }
  }, [mode, product?._id, reset, formattedProductValues]);

  return (
    <FormProvider {...methods}>
      <form
        id="product-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 max-w-5xl mx-auto"
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

export default memo(ProductForm);