import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import Spinner from "./Spinner";
import { StarRatingDisplay, StarRatingInput } from "./StarRating";
import { useAuth } from "../context/AuthContext";
import apiClient, { extractApiError } from "../utils/api";
import { formatDate, getInitials } from "../utils/validators";

const RATING_LABELS = {
  1: "سيئ",
  2: "مقبول",
  3: "جيد",
  4: "جيد جداً",
  5: "ممتاز",
};

/**
 * Product reviews: the rating summary, everyone's comments, and the form the
 * signed-in buyer uses to add or update their own star rating.
 */
export default function ProductReviewsModal({
  product,
  isOpen,
  onClose,
  onRatingChange,
}) {
  const { isLoggedIn } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ ratingAvg: 0, ratingCount: 0 });
  const [myReview, setMyReview] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const productId = product?.id;

  const loadReviews = useCallback(async () => {
    if (!productId) return;

    setIsLoading(true);
    setError("");

    try {
      const { data } = await apiClient.get(`/shop/products/${productId}/reviews`);
      setReviews(data.reviews || []);
      setSummary(data.summary || { ratingAvg: 0, ratingCount: 0 });

      if (isLoggedIn) {
        const { data: mine } = await apiClient.get(
          `/shop/products/${productId}/reviews/mine`,
        );
        setMyReview(mine.review || null);
        setHasPurchased(Boolean(mine.hasPurchased));
        setRating(mine.review?.rating || 0);
        setComment(mine.review?.comment || "");
      }
    } catch {
      setError("تعذر تحميل التقييمات، حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  }, [productId, isLoggedIn]);

  useEffect(() => {
    if (isOpen) {
      setFeedback("");
      loadReviews();
    }
  }, [isOpen, loadReviews]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback("");
    setError("");

    if (!rating) {
      setError("يرجى اختيار عدد النجوم أولاً.");
      return;
    }

    try {
      setIsSaving(true);
      const { data } = await apiClient.post(
        `/shop/products/${productId}/reviews`,
        { rating, comment: comment.trim() || null },
      );

      setFeedback(
        myReview ? "تم تحديث تقييمك بنجاح." : "شكراً لك، تم إضافة تقييمك.",
      );
      onRatingChange?.(productId, data.summary);
      await loadReviews();
    } catch (submitError) {
      setError(extractApiError(submitError, "تعذر حفظ التقييم، حاول لاحقاً."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!myReview) return;
    if (!window.confirm("هل تريد حذف تقييمك لهذا المنتج؟")) return;

    try {
      setIsSaving(true);
      await apiClient.delete(`/shop/reviews/${myReview.id}`);
      setMyReview(null);
      setRating(0);
      setComment("");
      setFeedback("تم حذف تقييمك.");
      onRatingChange?.(productId, null);
      await loadReviews();
    } catch {
      setError("تعذر حذف التقييم.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={`تقييم المنتج — ${product?.name || ""}`}
    >
      <div className="space-y-6">
        {/* Summary */}
        <div className="flex flex-wrap items-center gap-5 p-4 rounded-2xl bg-mesh-soft border border-black/[0.04]">
          <div className="text-center">
            <p className="text-4xl font-display font-black text-gradient leading-none">
              {Number(summary.ratingAvg || 0).toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 mt-1">من 5</p>
          </div>
          <div>
            <StarRatingDisplay
              value={summary.ratingAvg}
              size="md"
              showValue={false}
            />
            <p className="text-sm text-gray-600 mt-1">
              {summary.ratingCount > 0
                ? `${summary.ratingCount} تقييم من المشترين`
                : "لا توجد تقييمات بعد — كن أول من يقيّم"}
            </p>
          </div>
        </div>

        {/* My review form */}
        {isLoggedIn ? (
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-2xl border-2 border-blue-100 bg-blue-50/40 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-bold text-gray-900">
                {myReview ? "تعديل تقييمك" : "أضف تقييمك"}
              </h4>
              {hasPurchased && (
                <span className="badge-pill bg-green-100 text-green-700">
                  <FiCheckCircle size={13} />
                  عملية شراء موثقة
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <StarRatingInput value={rating} onChange={setRating} size="lg" />
              {rating > 0 && (
                <span className="text-sm font-bold text-amber-700">
                  {RATING_LABELS[rating]}
                </span>
              )}
            </div>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              className="input-field !rounded-2xl"
              placeholder="اكتب رأيك في المنتج (اختياري)"
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary !py-2.5 inline-flex items-center gap-2"
              >
                {isSaving && <Spinner />}
                {myReview ? "تحديث التقييم" : "إرسال التقييم"}
              </button>

              {myReview && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full font-bold text-sm text-red-600 border-2 border-red-200 hover:bg-red-50 transition-colors"
                >
                  <FiTrash2 />
                  حذف تقييمي
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center">
            <p className="text-gray-700 mb-3">
              سجّل الدخول لتتمكن من تقييم هذا المنتج.
            </p>
            <Link to="/login" className="btn-primary !py-2.5">
              تسجيل الدخول
            </Link>
          </div>
        )}

        {feedback && (
          <p className="p-3 rounded-xl bg-green-50 text-green-700 text-sm font-medium">
            {feedback}
          </p>
        )}
        {error && (
          <p className="p-3 rounded-xl bg-red-50 text-red-700 text-sm font-medium">
            {error}
          </p>
        )}

        {/* Everyone else's reviews */}
        <div className="space-y-3">
          <h4 className="font-bold text-gray-900">آراء المشترين</h4>

          {isLoading ? (
            <div className="flex justify-center py-6">
              <Spinner className="w-6 h-6 border-2 border-blue-200 border-t-blue-600" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              لا توجد تعليقات على هذا المنتج حتى الآن.
            </p>
          ) : (
            <ul className="space-y-3 max-h-72 overflow-y-auto pl-1">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="p-4 rounded-2xl border border-gray-100 bg-white"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center">
                      {getInitials(review.author?.name || "؟")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-gray-900">
                          {review.author?.name || "مستخدم"}
                        </span>
                        {review.isVerifiedPurchase && (
                          <span className="badge-pill bg-green-50 text-green-700">
                            <FiCheckCircle size={12} />
                            شراء موثق
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <StarRatingDisplay
                        value={review.rating}
                        size="xs"
                        showValue={false}
                        className="mt-1"
                      />
                      {review.comment && (
                        <p className="text-sm text-gray-700 mt-2 break-words">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
