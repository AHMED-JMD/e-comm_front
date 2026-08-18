/**
 * The dashboard and the storefront are two builds of the same app served from
 * two hosts (store.com and admin.store.com). Everything host-related lives
 * here so links can cross between them without hardcoding domains.
 */

const ADMIN_SUBDOMAIN = import.meta.env.VITE_ADMIN_SUBDOMAIN || "admin";

/** Explicit overrides win — needed when the two apps sit on unrelated domains. */
const ADMIN_URL_OVERRIDE = import.meta.env.VITE_ADMIN_URL || "";
const STORE_URL_OVERRIDE = import.meta.env.VITE_STORE_URL || "";

function stripTrailingSlash(url) {
  return url.replace(/\/+$/, "");
}

function currentLocation() {
  if (typeof window === "undefined") {
    return { protocol: "https:", hostname: "", port: "", origin: "" };
  }

  return window.location;
}

export function isAdminHost(hostname = currentLocation().hostname) {
  if (ADMIN_URL_OVERRIDE) {
    try {
      return new URL(ADMIN_URL_OVERRIDE).hostname === hostname;
    } catch {
      /* fall through to the subdomain check */
    }
  }

  return hostname.startsWith(`${ADMIN_SUBDOMAIN}.`);
}

/**
 * Dev fallback: some setups cannot resolve `admin.localhost`, so opening
 * `/admin.html` directly also boots the dashboard.
 */
export function isAdminEntry() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    isAdminHost() || window.location.pathname.replace(/\/$/, "") === "/admin.html"
  );
}

function buildOrigin(hostname) {
  const { protocol, port } = currentLocation();
  return `${protocol}//${hostname}${port ? `:${port}` : ""}`;
}

/** Origin of the storefront, seen from wherever this code runs. */
export function storeOrigin() {
  if (STORE_URL_OVERRIDE) {
    return stripTrailingSlash(STORE_URL_OVERRIDE);
  }

  const { hostname, origin } = currentLocation();

  if (isAdminHost(hostname)) {
    return buildOrigin(hostname.slice(ADMIN_SUBDOMAIN.length + 1));
  }

  return stripTrailingSlash(origin);
}

/** Origin of the dashboard, seen from wherever this code runs. */
export function adminOrigin() {
  if (ADMIN_URL_OVERRIDE) {
    return stripTrailingSlash(ADMIN_URL_OVERRIDE);
  }

  const { hostname, origin } = currentLocation();

  if (isAdminHost(hostname)) {
    return stripTrailingSlash(origin);
  }

  return buildOrigin(`${ADMIN_SUBDOMAIN}.${hostname}`);
}

export function storeUrl(path = "/") {
  return `${storeOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function adminUrl(path = "/") {
  return `${adminOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Legacy `/admin/...` links from the single-app days keep working by bouncing
 * to the matching dashboard route on the subdomain.
 */
export function legacyAdminPathToDashboard(pathname) {
  const suffix = pathname.replace(/^\/admin\/?/, "");
  return adminUrl(`/${suffix}`);
}
