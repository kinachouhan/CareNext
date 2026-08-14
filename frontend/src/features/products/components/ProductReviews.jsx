import React, { useState } from "react";
import { Star, Edit2, Trash2, X, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { 
  createReviewThunk, 
  updateReviewThunk, 
  deleteReviewThunk 
} from "../../../slice/product/productThunk";
import toast from "react-hot-toast";

const ProductReviews = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit states
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const reviews = product?.reviews || [];
  const currentUserId = user?._id?.toString() || user?.id?.toString();

  const existingReview = reviews.find((r) => r.user?.toString() === currentUserId);

  // 1. Create Review (Preventing any default page refresh)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Crucial to prevent page reload
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    const productId = product?._id || product?.id;
    setIsSubmitting(true);
    try {
      await dispatch(
        createReviewThunk({ productId, rating, comment })
      ).unwrap();
      
      toast.success("Review posted successfully!");
      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(typeof error === 'string' ? error : "Failed to post review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Update Review (Preventing any default page reload)
  const handleUpdate = async (e, reviewId) => {
    e.preventDefault(); // Crucial to prevent page reload
    if (!editComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    const productId = product?._id || product?.id;
    try {
      await dispatch(
        updateReviewThunk({ 
          productId, 
          reviewId, 
          rating: editRating, 
          comment: editComment 
        })
      ).unwrap();

      toast.success("Review updated successfully!");
      setEditingReviewId(null);
    } catch (error) {
      toast.error(typeof error === 'string' ? error : "Failed to update review");
    }
  };

  // 3. Delete Review
  const confirmDelete = async () => {
    if (!reviewToDelete) return;

    const productId = product?._id || product?.id;
    try {
      await dispatch(
        deleteReviewThunk({ productId, reviewId: reviewToDelete })
      ).unwrap();

      toast.success("Review deleted successfully!");
    } catch (error) {
      toast.error(typeof error === 'string' ? error : "Failed to delete review");
    } finally {
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Star className="text-yellow-400 fill-yellow-400" size={22} />
        Customer Reviews ({reviews.length})
      </h3>

      {/* CREATE REVIEW FORM */}
      {user && !existingReview && (
        <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-100">
          <h4 className="text-sm font-bold text-gray-800 mb-3">Write a Review</h4>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-500 font-medium">Rating:</span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#06A1B7]"
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </div>

          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full border border-gray-200 bg-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#06A1B7] outline-none mb-3 resize-none"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#06A1B7] hover:bg-[#058a9d] text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Post Review"}
          </button>
        </form>
      )}

      {/* REVIEWS LIST */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-6">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((rev) => {
            const reviewUserId = rev.user?._id?.toString() || rev.user?.toString();
            const isOwner = reviewUserId === currentUserId || user?.role === "admin";
            const isEditing = editingReviewId === rev._id;

            return (
              <div key={rev._id} className="border-b border-gray-100 pb-5 last:border-none">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-gray-900">{rev.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Just now"}
                    </span>
                    {isOwner && !isEditing && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReviewId(rev._id);
                            setEditRating(rev.rating);
                            setEditComment(rev.comment);
                          }}
                          className="text-gray-400 hover:text-[#06A1B7] transition-colors cursor-pointer"
                          title="Edit review"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReviewToDelete(rev._id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* EDIT REVIEW FORM */}
                {isEditing ? (
                  <form onSubmit={(e) => handleUpdate(e, rev._id)} className="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <select
                        value={editRating}
                        onChange={(e) => setEditRating(Number(e.target.value))}
                        className="border border-gray-200 bg-white rounded-lg px-2 py-1 text-xs font-semibold outline-none"
                      >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Average</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                      </select>
                    </div>
                    <textarea
                      rows="2"
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#06A1B7] outline-none mb-3 resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="bg-[#06A1B7] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={14} /> Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingReviewId(null)}
                        className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < rev.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                        />
                      ))}
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{rev.comment}</p>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* REUSEABLE DELETE MODAL POPUP */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Delete Review</h2>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setReviewToDelete(null);
                }}
                className="border border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-red-500/20 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;