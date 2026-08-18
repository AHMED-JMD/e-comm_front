/**
 * The Luma "Meroë" logo — three Nubian pyramids beside the wordmark.
 * Proportions come straight from the source lockup: the centre pyramid is the
 * unit (h), the flanking ones 0.72h tall and 0.43h wide, spaced 0.10h apart.
 */

const TRIANGLE = { clipPath: "polygon(50% 0, 100% 100%, 0 100%)" };

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
 * Horizontal lockup: mark + LUMA + لُوما, the compact form from the brand sheet.
 * `tone="onDark"` swaps in the sand/off-white pair for dark surfaces.
 */
export default function Logo({
  height = 22,
  tone = "brand",
  showArabic = true,
  showLatin = true,
  showTagline = true,
  className = "",
}) {
  const latinSize = Math.round(height * 0.75);
  const arabicSize = Math.round(height * 0.72);
  const taglineSize = Math.max(9, Math.round(height * 0.34));
  const textColor = tone === "onDark" ? "text-canvas" : "text-ink";
  const arabicColor = tone === "onDark" ? "text-pink-200" : "text-ink";
  const taglineColor = tone === "onDark" ? "text-pink-200/80" : "text-blue-600";

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

        {showTagline && (
          <span
            dir="rtl"
            className={`font-bold leading-none ${taglineColor}`}
            style={{ fontSize: taglineSize, letterSpacing: "0.08em" }}
          >
            متجر سوداني
          </span>
        )}
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
