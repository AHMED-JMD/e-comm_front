/**
 * Teardown for the pre-boot veil that `brandLoader()` (vite.config.js) inlines
 * into index.html and admin.html. The veil lives outside the React root, so
 * React never touches it — the app has to lift it once it has painted.
 */

/** Long enough that the flag animation reads as a beat, not a flicker. */
const MIN_VISIBLE_MS = 1200;
/** Matches the opacity transition on #luma-boot in loader.css. */
const FADE_MS = 420;

export function hidePageLoader() {
  const veil = document.getElementById("luma-boot");
  if (!veil) return;

  // `performance.now()` is time since navigation started, so a fast boot still
  // shows the full rise while a slow one lifts the veil the moment it can.
  const hold = Math.max(0, MIN_VISIBLE_MS - performance.now());

  window.setTimeout(() => {
    veil.classList.add("is-done");
    window.setTimeout(() => veil.remove(), FADE_MS);
  }, hold);
}

/**
 * Waits for the frame after React commits, then the frame after the browser has
 * painted it, so the veil never lifts onto an empty screen.
 */
export function hidePageLoaderAfterPaint() {
  requestAnimationFrame(() => requestAnimationFrame(hidePageLoader));
}
