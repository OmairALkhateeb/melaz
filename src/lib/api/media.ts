import { getApiBaseUrl } from "./client";

/** Known Laravel hosts whose /storage paths should be same-origin in production. */
const API_MEDIA_HOSTS = [/melaz-motors\.livetech\.it\.com/i];

/**
 * Rewrites absolute API storage URLs to same-origin paths in production
 * (avoids https→http mixed-content blocking on Vercel).
 */
function tryRewriteApiMediaUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const isKnownHost = API_MEDIA_HOSTS.some((re) => re.test(parsed.hostname));
    if (!isKnownHost || !parsed.pathname.startsWith("/storage/")) return null;

    const base = getApiBaseUrl();
    return base ? `${base}${parsed.pathname}` : parsed.pathname;
  } catch {
    return null;
  }
}

/**
 * Resolves a media URL from the Laravel API.
 * - Absolute URLs (http/https/data) are returned unchanged, except known API
 *   storage hosts which are rewritten to same-origin /storage/... paths.
 * - Root-relative paths (/storage/...) are prefixed with the API base URL.
 * - Bare paths (storage/...) are prefixed with API base + slash.
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;

  const trimmed = url.trim();

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    if (trimmed.startsWith("data:")) return trimmed;
    return tryRewriteApiMediaUrl(trimmed) ?? trimmed;
  }

  if (trimmed.startsWith("//")) {
    const withHttps = `https:${trimmed}`;
    return tryRewriteApiMediaUrl(withHttps) ?? withHttps;
  }

  const base = getApiBaseUrl();
  return trimmed.startsWith("/") ? `${base}${trimmed}` : `${base}/${trimmed}`;
}
