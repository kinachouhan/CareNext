export const buildProductFormData = (data) => {
  const formData = new FormData();

  const fields = {
    name: data.productName,
    category: data.category,
    subCategory: data.subCategory,
    price: data.price,
    discount: data.discount || 0,
    stock: data.stock,
    unit: data.unit,
    shortDescription: data.shortDescription,
    fullDescription: data.fullDescription,
    status: data.status,
    featured: data.feature,
    bestSeller: data.best,
    newArrival: data.new,
  };

  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  if (data.image?.[0]) {
    formData.append("image", data.image[0]);
  }

  return formData;
};