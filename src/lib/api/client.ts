import type { CarsListParams } from "./types";

const DEFAULT_API_BASE_URL = "http://melaz-motors.livetech.it.com";
const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (isApiError(error)) {
    if (error.status === 0) {
      const msg = error.message.toLowerCase();
      if (msg.includes("abort") || msg.includes("timeout")) {
        return "The request took too long. Please check your connection and try again.";
      }
      return "Unable to reach the server. Please check your connection and try again.";
    }
    if (error.status === 404) return "The requested resource was not found.";
    return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/**
 * Resolves the API origin used to build request URLs.
 * - An explicit VITE_API_BASE_URL wins (use `/` or an empty value to force
 *   same-origin/relative requests; a full origin like `https://api.example.com`
 *   targets that host directly).
 * - With no override, production builds use relative paths (served behind the
 *   Vercel proxy in `vercel.json`, which avoids https→http mixed-content), while
 *   local dev falls back to the dev backend.
 */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim();
  if (raw !== undefined && raw !== "") {
    return raw === "/" ? "" : raw.replace(/\/+$/, "");
  }
  return import.meta.env.PROD ? "" : DEFAULT_API_BASE_URL.replace(/\/+$/, "");
}

type QueryParamValue = string | number | boolean | null | undefined;

/**
 * Builds a query string from a params object.
 * Skips null, undefined, and empty strings.
 */
export function buildQueryString(params?: Record<string, QueryParamValue>): string {
  if (!params) return "";

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;
    search.set(key, String(value));
  }

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function buildCarsListQuery(params?: CarsListParams): string {
  return buildQueryString(params as Record<string, QueryParamValue> | undefined);
}

type ApiRequestOptions = {
  path: string;
  params?: Record<string, QueryParamValue>;
  signal?: AbortSignal;
  headers?: HeadersInit;
  timeoutMs?: number;
};

function combineAbortSignals(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort();
      return controller.signal;
    }
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }
  return controller.signal;
}

function createTimeoutSignal(timeoutMs: number): AbortSignal {
  if (
    typeof AbortSignal !== "undefined" &&
    "timeout" in AbortSignal &&
    typeof AbortSignal.timeout === "function"
  ) {
    return AbortSignal.timeout(timeoutMs);
  }

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return null;
  }
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return text.length ? text : null;
}

function extractErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (record.errors && typeof record.errors === "object") {
      const first = Object.values(record.errors as Record<string, unknown[]>)[0]?.[0];
      if (typeof first === "string") return first;
    }
  }
  return `Request failed with status ${status}`;
}

/**
 * Low-level JSON GET helper. Prefer domain services in `cars.ts` over calling this directly.
 */
export async function apiGet<T>({
  path,
  params,
  signal,
  headers,
  timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
}: ApiRequestOptions): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}${buildQueryString(params)}`;

  const timeoutSignal = createTimeoutSignal(timeoutMs);
  const requestSignal = signal
    ? combineAbortSignals([signal, timeoutSignal])
    : timeoutSignal;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...headers,
      },
      signal: requestSignal,
    });
  } catch (cause) {
    const isTimeout =
      (cause instanceof DOMException && cause.name === "TimeoutError") ||
      (cause instanceof Error && cause.name === "TimeoutError");
    const message = isTimeout
      ? "Request timed out"
      : cause instanceof Error
        ? cause.message
        : "Network request failed";
    throw new ApiError(message, 0, cause);
  }

  const body = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(body, response.status), response.status, body);
  }

  return body as T;
}
