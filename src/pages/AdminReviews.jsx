import { useEffect, useMemo, useState } from "react";
import { FiTrash2, FiSearch, FiStar, FiPackage } from "react-icons/fi";
import { useAdmin } from "../context/useAdmin";
import { StarRatingDisplay } from "../components/StarRating";
import Spinner from "../components/Spinner";
import { getImageUrl } from "../utils/api";
import { formatDate, getInitials } from "../utils/validators";

export default function AdminReviews() {
  const { reviews, reviewsPagination, loadReviews, deleteReview } = useAdmin();
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [feedback, setFeedback] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(true);
      loadReviews({
        page: 1,
        limit: reviewsPagination.limit || 10,
        search: search || undefined,
        rating: ratingFilter === "all" ? undefined : Number(ratingFilter),
      })
        .catch(() => undefined)
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, ratingFilter, reviewsPagination.limit, loadReviews]);

  const goToPage = (nextPage) => {
    setIsLoading(true);
    loadReviews({
      page: nextPage,
      limit: reviewsPagination.limit || 10,
      search: search || undefined,
      rating: ratingFilter === "all" ? undefined : Number(ratingFilter),
    })
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  };

  const handleDelete = async (review) => {
    if (!window.confirm("هل تريد حذف هذا التقييم نهائياً؟")) return;

    try {
      setDeletingId(review.id);
      await deleteReview(review.id);
      setFeedback("تم حذف التقييم وتحديث متوسط تقييم المنتج.");
    } catch (error) {
      setFeedback(error.message || "تعذر حذف التقييم.");
    } finally {
      setDeletingId(null);
    }
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">تقييمات المنتجات</h1>
          <p className="text-sm text-gray-500 mt-1">
            مراجعة نجوم وتعليقات المشترين وحذف أي محتوى مخالف.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-100">
          <FiStar className="text-amber-500" />
          <div className="text-sm">
            <p className="font-bold text-amber-800">
              {reviewsPagination.totalItems || 0} تقييم
            </p>
            <p className="text-xs text-amber-700">
              متوسط الصفحة: {averageRating.toFixed(1)} / 5
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <FiSearch className="absolute top-1/2 -translate-y-1/2 right-4 text-pink-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input-field pr-11"
            placeholder="ابحث في نص التعليقات"
          />
        </div>

        <select
          value={ratingFilter}
          onChange={(event) => setRatingFilter(event.target.value)}
          className="input-field"
        >
          <option value="all">كل التقييمات</option>
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating} نجوم
            </option>
          ))}
        </select>
      </div>

      {feedback && (
        <div className="p-3 rounded-2xl bg-pink-50 border border-pink-100 text-sm text-pink-800">
          {feedback}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="w-8 h-8 border-4 border-pink-200 border-t-pink-600" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-3xl">
          <div className="text-5xl mb-3">⭐</div>
          <p className="text-gray-500">لا توجد تقييمات مطابقة.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const imageUrl = getImageUrl(review.product?.image);

            return (
              <article
                key={review.id}
                className="p-4 rounded-3xl border border-gray-100 bg-white hover:shadow-card transition-shadow"
              >
                <div className="flex flex-wrap items-start gap-4">
                  <span className="w-14 h-14 shrink-0 rounded-2xl bg-mesh-soft overflow-hidden flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={review.product?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiPackage className="text-pink-500" size={22} />
                    )}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">
                        {review.product?.name}
                      </h3>
                      <span className="badge-pill bg-gray-100 text-gray-600">
                        {review.product?.store?.name || "متجر غير محدد"}
                      </span>
                      {review.isVerifiedPurchase && (
                        <span className="badge-pill bg-green-50 text-green-700">
                          شراء موثق
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {getInitials(review.author?.name || "؟")}
                        </span>
                        {review.author?.name}
                      </span>
                      <span>{formatDate(review.createdAt)}</span>
                      <StarRatingDisplay
                        value={review.rating}
                        size="xs"
                        showValue={false}
                      />
                    </div>

                    {review.comment && (
                      <p className="text-sm text-gray-700 break-words p-3 rounded-2xl bg-gray-50/80">
                        {review.comment}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      متوسط تقييم المنتج الآن:{" "}
                      {Number(review.product?.ratingAvg || 0).toFixed(1)} من{" "}
                      {review.product?.ratingCount || 0} تقييم
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(review)}
                    disabled={deletingId === review.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-60"
                  >
                    {deletingId === review.id ? (
                      <Spinner className="w-3.5 h-3.5 border-2 border-red-300/40 border-t-red-700" />
                    ) : (
                      <FiTrash2 size={14} />
                    )}
                    حذف
                  </button>
                </div>
              </article>
            );
          })}

          {reviewsPagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-500">
                صفحة {reviewsPagination.page} من {reviewsPagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(reviewsPagination.page - 1)}
                  disabled={reviewsPagination.page <= 1}
                  className="px-4 py-2 text-sm rounded-xl border border-gray-300 disabled:opacity-50"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(reviewsPagination.page + 1)}
                  disabled={
                    reviewsPagination.page >= reviewsPagination.totalPages
                  }
                  className="px-4 py-2 text-sm rounded-xl border border-gray-300 disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
