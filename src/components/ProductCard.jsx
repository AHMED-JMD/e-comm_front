import { FiShoppingCart, FiStar, FiCheck } from "react-icons/fi";
import { useState } from "react";
import { StarRatingDisplay } from "./StarRating";
import { CategoryIconBadge, getCategoryColor, getCategoryIcon } from "../utils/categoryIcons";
import { getImageUrl } from "../utils/api";
import { formatPrice } from "../utils/validators";

/**
 * Storefront product card, shared by the home page and the browse page.
 */
export default function ProductCard({ product, onAddToCart, onOpenReviews }) {
  const [justAdded, setJustAdded] = useState(false);

  const category = product.categoryInfo;
  const palette = getCategoryColor(category?.color);
  const PlaceholderIcon = getCategoryIcon(category?.icon);
  const imageUrl = getImageUrl(product.image);
  const isOutOfStock = Number(product.stock) <= 0;

  const handleAdd = () => {
    onAddToCart?.(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="card !p-0 overflow-hidden hover:-translate-y-2 group flex flex-col">
      {/* Media */}
      <div className="relative h-52 bg-mesh-soft flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span
            className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${palette.gradient} text-white flex items-center justify-center shadow-glow`}
          >
            <PlaceholderIcon size={46} />
          </span>
        )}

        {category && (
          <span
            className={`absolute top-3 right-3 badge-pill bg-white/90 backdrop-blur-sm ${palette.text} shadow-sm`}
          >
            <CategoryIconBadge
              icon={category.icon}
              color={category.color}
              size="sm"
              iconSize={11}
              className="!w-5 !h-5 !rounded-md !shadow-none"
            />
            {category.name}
          </span>
        )}

        {isOutOfStock && (
          <span className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="badge-pill bg-red-600 text-white !px-4 !py-2 text-sm">
              نفدت الكمية
            </span>
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <button
          type="button"
          onClick={() => onOpenReviews?.(product)}
          className="inline-flex items-center gap-2 mb-3 w-fit hover:opacity-80 transition-opacity"
          title="عرض وإضافة التقييمات"
        >
          <StarRatingDisplay
            value={product.ratingAvg}
            count={product.ratingCount}
            size="sm"
          />
        </button>

        <p className="text-sm text-gray-600 mb-4">
          <span className="font-semibold">المتجر:</span>{" "}
          {product.store?.name || "غير محدد"}
        </p>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-display font-extrabold text-gradient">
              {formatPrice(product.price)}
            </span>
            {!isOutOfStock && Number(product.stock) <= 5 && (
              <span className="badge-pill bg-amber-50 text-amber-700">
                باقي {product.stock}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={isOutOfStock}
              className="btn-primary flex-1 !py-2.5 !px-4 text-sm inline-flex items-center justify-center gap-2"
            >
              {justAdded ? (
                <>
                  <FiCheck />
                  تمت الإضافة
                </>
              ) : (
                <>
                  <FiShoppingCart />
                  أضف للسلة
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenReviews?.(product)}
              className="px-3.5 rounded-full border-2 border-amber-200 text-amber-600 hover:bg-amber-50 transition-colors"
              aria-label="تقييم المنتج"
              title="تقييم المنتج"
            >
              <FiStar />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
