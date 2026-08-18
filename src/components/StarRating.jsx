import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const SIZES = {
  xs: 12,
  sm: 15,
  md: 20,
  lg: 28,
  xl: 36,
};

/**
 * Read-only star display. Supports fractional values (4.3 → 4 stars + 30%).
 */
export function StarRatingDisplay({
  value = 0,
  count,
  size = "sm",
  showValue = true,
  className = "",
}) {
  const pixels = SIZES[size] || SIZES.sm;
  const safeValue = Math.max(0, Math.min(Number(value) || 0, 5));

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="inline-flex items-center gap-0.5" dir="ltr">
        {[0, 1, 2, 3, 4].map((index) => {
          const fill = Math.max(0, Math.min(safeValue - index, 1)) * 100;

          return (
            <span
              key={index}
              className="relative inline-block leading-none"
              style={{ width: pixels, height: pixels }}
            >
              <FaRegStar size={pixels} className="text-amber-300 absolute inset-0" />
              <span
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${fill}%`, height: pixels }}
              >
                <FaStar size={pixels} className="text-amber-400" />
              </span>
            </span>
          );
        })}
      </span>

      {showValue && (
        <span className="text-xs font-bold text-amber-700">
          {safeValue.toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span className="text-xs text-gray-500">({count})</span>
      )}
    </span>
  );
}

/**
 * Interactive star picker used in the review form.
 */
export function StarRatingInput({
  value = 0,
  onChange,
  size = "lg",
  disabled = false,
}) {
  const [hovered, setHovered] = useState(0);
  const pixels = SIZES[size] || SIZES.lg;
  const active = hovered || value;

  return (
    <span className="inline-flex items-center gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={`${star} من 5`}
        >
          {star <= active ? (
            <FaStar size={pixels} className="text-amber-400 drop-shadow-sm" />
          ) : (
            <FaRegStar size={pixels} className="text-gray-300" />
          )}
        </button>
      ))}
    </span>
  );
}

export default StarRatingDisplay;
