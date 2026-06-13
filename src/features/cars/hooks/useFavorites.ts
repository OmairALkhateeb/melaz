import { useCallback, useSyncExternalStore } from "react";

/**
 * Lightweight favorites store backed by localStorage. Cars are referenced by
 * slug. The full /favorites page comes later — this just persists the toggle
 * so the heart state survives navigation and reloads, and stays in sync across
 * every CarCard via a module-level subscriber set.
 */
const STORAGE_KEY = "almelaz:favorites";

let current: string[] = readInitial();
const listeners = new Set<() => void>();

function readInitial(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    /* storage full / unavailable — keep in-memory state */
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function toggle(slug: string) {
  if (!slug) return;
  current = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
  persist();
  emit();
}

// Keep tabs/windows in sync.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      current = readInitial();
      emit();
    }
  });
}

/** Reactive list of favorite slugs. */
export function useFavorites(): string[] {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => current,
  );
}

/** Whether a single car is favorited, plus a toggle bound to its slug. */
export function useFavorite(slug: string | null | undefined): {
  isFavorite: boolean;
  toggleFavorite: () => void;
} {
  const favorites = useFavorites();
  const isFavorite = slug ? favorites.includes(slug) : false;
  const toggleFavorite = useCallback(() => {
    if (slug) toggle(slug);
  }, [slug]);
  return { isFavorite, toggleFavorite };
}
