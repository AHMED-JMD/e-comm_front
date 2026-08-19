/**
 * The Luma "Meroë" logo — three Nubian pyramids beside the wordmark.
 * Proportions come straight from the source lockup: the centre pyramid is the
 * unit (h), the flanking ones 0.72h tall and 0.43h wide, spaced 0.10h apart.
 */

const TRIANGLE = { clipPath: "polygon(50% 0, 100% 100%, 0 100%)" };

/** Small Sudan flag — the badge that sits under the wordmark. */
export function SudanFlag({ width = 20, className = "" }) {
  return (
    <svg
      viewBox="0 0 18 9"
      width={width}
      height={width / 2}
      className={`shrink-0 rounded-[1px] ring-1 ring-black/10 ${className}`}
      role="img"
      aria-label="السودان"
    >
      <rect width="18" height="3" fill="#D21034" />
      <rect y="3" width="18" height="3" fill="#FFFFFF" />
      <rect y="6" width="18" height="3" fill="#000000" />
      <path d="M0 0 L7 4.5 L0 9 Z" fill="#007229" />
    </svg>
  );
}

/** Bare pyramid mark — used on its own for icons and favicons. */
export function LogoMark({ height = 22, tone = "brand", className = "" }) {
  const side = {
    width: Math.round(height * 0.43),
    height: Math.round(height * 0.72),
  };
  const centre = { width: Math.round(height * 0.57), height };
  const gap = Math.max(2, Math.round(height * 0.1));

  const sideColor = tone === "onDark" ? "bg-pink-200" : "bg-blue-600";
  const centreColor = tone === "onDark" ? "bg-canvas" : "bg-ink";

  return (
    <span
      className={`inline-flex items-end ${className}`}
      style={{ gap }}
      aria-hidden="true"
    >
      <span className={sideColor} style={{ ...TRIANGLE, ...side }} />
      <span className={centreColor} style={{ ...TRIANGLE, ...centre }} />
      <span className={sideColor} style={{ ...TRIANGLE, ...side }} />
    </span>
  );
}

/**
 * Horizontal lockup: mark + LUMA + لُوما over a small Sudan flag, the compact
 * form from the brand sheet.
 * `tone="onDark"` swaps in the sand/off-white pair for dark surfaces.
 */
export default function Logo({
  height = 22,
  tone = "brand",
  showArabic = true,
  showLatin = true,
  showFlag = true,
  className = "",
}) {
  const latinSize = Math.round(height * 0.75);
  const arabicSize = Math.round(height * 0.72);
  const flagWidth = Math.max(14, Math.round(height * 0.9));
  const textColor = tone === "onDark" ? "text-canvas" : "text-ink";
  const arabicColor = tone === "onDark" ? "text-pink-200" : "text-ink";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark height={height} tone={tone} />

      <span className="inline-flex flex-col items-center gap-1">
        <span className="inline-flex items-center gap-2.5">
          {showLatin && (
            <span
              className={`font-logo leading-none ${textColor}`}
              style={{
                fontSize: latinSize,
                letterSpacing: "0.24em",
                textIndent: "0.24em",
              }}
            >
              LUMA
            </span>
          )}

          {showArabic && (
            <span
              dir="rtl"
              className={`font-logo-ar leading-none ${arabicColor}`}
              style={{ fontSize: arabicSize }}
            >
              لُوما
            </span>
          )}
        </span>

        {showFlag && <SudanFlag width={flagWidth} />}
      </span>
    </span>
  );
}

/** Olive app-icon tile — the square lockup from the brand sheet. */
export function LogoIcon({ size = 44, radius = "0.9rem", className = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center bg-blue-600 shrink-0 ${className}`}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <LogoMark height={Math.round(size * 0.42)} tone="onDark" />
    </span>
  );
}
