/**
 * @category Utilities
 */

/**
 * UTM campaign parameters extracted from the current URL or recovered from
 * this tab's session cache. All fields are optional.
 *
 * @category Utilities
 */
export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

// Supported UTM keys that can be extracted and cached.
const UTM_KEYS: Array<keyof UtmParams> = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

// Session cache key used to persist UTMs for the current tab/session.
const STORAGE_KEY = "99dev_utm";

/**
 * Reads UTM parameters from the current URL, preferring query-string values on
 * `window.location.search` over values found in hash-fragment query strings,
 * and caches fresh values in `sessionStorage` for the rest of the tab session.
 *
 * If no UTM values are present in the current URL, previously cached values
 * are returned (if available).
 *
 * @category Core
 *
 * @returns UTM parameters from the current URL when present, otherwise cached values.
 *
 * @example
 * ```ts
 * const utm = getUtmParams();
 * // { utm_source: "google", utm_campaign: "spring-sale" }
 * ```
 */
export function getUtmParams (): UtmParams {
  const urlParams = extractUtmFromUrl();

  // Persist fresh URL UTMs for this tab session (last-touch within session).
  if (Object.keys(urlParams).length > 0) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(urlParams));
    return urlParams;
  }

  // Fall back to previously cached UTMs when the current URL has none.
  const cached = sessionStorage.getItem(STORAGE_KEY);
  if (!cached) return {};

  try {
    const parsed = JSON.parse(cached);
    if (!parsed || typeof parsed !== "object") return {};

    const normalized: UtmParams = {};
    for (const key of UTM_KEYS) {
      if (typeof parsed[key] === "string" && parsed[key] !== "") {
        normalized[key] = parsed[key];
      }
    }
    return normalized;
  } catch (_err) {
    return {};
  }
}

/**
 * Extracts UTM parameters from both standard query params and hash-based query
 * params (for hash-routed SPAs), then merges with priority for
 * `window.location.search` when duplicate keys exist.
 */
function extractUtmFromUrl (): UtmParams {
  const fromSearch: UtmParams = {};
  const fromHash: UtmParams = {};

  // Read standard ad-platform UTMs from the URL search string.
  const searchParams = new URLSearchParams(window.location.search);
  for (const key of UTM_KEYS) {
    const value = searchParams.get(key);
    if (value) fromSearch[key] = value;
  }

  // Read UTMs from hash-fragment query strings (e.g. "#/route?utm_source=...").
  const hash = window.location.hash || "";
  const hashQueryIndex = hash.indexOf("?");
  if (hashQueryIndex >= 0) {
    const hashQuery = hash.slice(hashQueryIndex + 1);
    const hashParams = new URLSearchParams(hashQuery);
    for (const key of UTM_KEYS) {
      const value = hashParams.get(key);
      if (value) fromHash[key] = value;
    }
  }

  // Merge with search-string values taking precedence over hash values.
  return {
    ...fromHash,
    ...fromSearch,
  };
}
