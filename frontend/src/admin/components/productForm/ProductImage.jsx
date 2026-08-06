import React, { useEffect, useState, useCallback } from "react";
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
    // No new image selected
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

  const removeImage = useCallback(() => {
    setValue("image", null);

    // Restore existing image if editing
    setPreview(currentImage || null);
  }, [setValue, currentImage]);

  return (
    <div className={cardStyles}>
      <h2 className={sectionTitle}>
        Product Image
      </h2>

      <label
        htmlFor="image"
        className="
          border-2
          border-dashed
          border-gray-300
          rounded-2xl
          p-8
          flex
          flex-col
          items-center
          justify-center
          cursor-pointer
          hover:border-[#06A1B7]
          transition
        "
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-56 h-56 rounded-xl object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <>
            <ImagePlus
              size={60}
              className="text-gray-400 mb-4"
            />

            <p className="font-medium">
              Click to Upload
            </p>

            <p className="text-gray-500 text-sm">
              JPG • PNG • WEBP
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Maximum 2 MB
            </p>
          </>
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

      {preview && (
        <button
          type="button"
          onClick={removeImage}
          className="
            mt-5
            bg-red-500
            hover:bg-red-600
            text-white
            px-5
            py-2
            rounded-xl
            flex
            items-center
            gap-2
          "
        >
          <Trash2 size={18} />
          Remove Image
        </button>
      )}
    </div>
  );
};

export default React.memo(ProductImage);