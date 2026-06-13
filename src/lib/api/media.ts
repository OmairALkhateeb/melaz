import { getApiBaseUrl } from "./client";

/**
 * Resolves a media URL from the Laravel API.
 * - Absolute URLs (http/https/data) are returned unchanged.
 * - Root-relative paths (/storage/...) are prefixed with the API base URL.
 * - Bare paths (storage/...) are prefixed with API base + slash.
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;

  const trimmed = url.trim();

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  const base = getApiBaseUrl();
  return trimmed.startsWith("/") ? `${base}${trimmed}` : `${base}/${trimmed}`;
}
