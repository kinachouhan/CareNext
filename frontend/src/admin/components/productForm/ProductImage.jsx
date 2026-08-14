import React, { useEffect, useState, useCallback, memo } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  cardStyles,
  sectionTitle,
  errorStyles,
} from "./styles";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const ProductImage = ({ currentImage }) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const image = useWatch({
    control,
    name: "image",
  });

  const [preview, setPreview] = useState(currentImage || null);

  useEffect(() => {
    if (!image?.length) {
      setPreview(currentImage || null);
      return;
    }

    const file = image[0];
    if (!(file instanceof File)) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image, currentImage]);

  const removeImage = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setValue("image", null);
    setPreview(currentImage || null);
  }, [setValue, currentImage]);

  return (
    <div className={cardStyles}>
      <h2 className={sectionTitle}>
        Product Image
      </h2>

      <label
        htmlFor="image"
        className="group relative border-2 border-dashed border-gray-200 hover:border-[#06A1B7] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 hover:bg-cyan-50/20 transition-all duration-300"
      >
        {preview ? (
          <div className="relative flex flex-col items-center">
            <img
              src={preview}
              alt="Preview"
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-md border border-gray-100"
              loading="lazy"
              decoding="async"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center"
              title="Remove Image"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#06A1B7] mb-3 group-hover:scale-105 transition-transform">
              <ImagePlus size={28} />
            </div>

            <p className="font-bold text-gray-800 text-sm sm:text-base">
              Click to upload product image
            </p>

            <p className="text-gray-400 text-xs mt-1">
              Supports: JPG, PNG, WEBP (Max 2MB)
            </p>
          </div>
        )}

        <input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          {...register("image", {
            required: !currentImage
              ? "Product Image is required"
              : false,

            validate: {
              fileSize: (files) =>
                !files?.[0] ||
                files[0].size <= MAX_SIZE ||
                "Maximum size is 2MB",

              fileType: (files) =>
                !files?.[0] ||
                ALLOWED_TYPES.includes(files[0].type) ||
                "Only JPG, PNG & WEBP are allowed",
            },
          })}
        />
      </label>

      {errors.image && (
        <p className={errorStyles}>
          {errors.image.message}
        </p>
      )}
    </div>
  );
};

export default memo(ProductImage);