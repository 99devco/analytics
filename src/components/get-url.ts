/**
 * @category Utilities
 */

// Include external dependencies
import { getConfig } from "./config";
import { log } from "./logger";

/**
 * Resolves the current page URL in two forms:
 * - `actualUrl`: the path detected from browser navigation (hash/history/pathname)
 * - `recordUrl`: the path that should be persisted, allowing canonical/meta overrides
 *
 * The record URL is derived using this order of precedence:
 * 1. `<meta name="99dev-page" />`
 * 2. `<link rel="canonical" />`
 * 3. Fallback to the actual URL
 *
 * The actual URL honors the configured navigation type:
 * - `"hash"`: uses `window.location.hash` without the leading `#`
 * - `"history"`: prefers `window.history.state.url` when provided
 * - `"natural"` (default): uses `window.location.pathname`
 *
 * When `normalizeUrls` is enabled the function removes query parameters, ensures a
 * leading slash, trims trailing slashes, and drops `.html` extensions so both URLs
 * share consistent formatting.
 *
 * @returns An object containing `{ actualUrl, recordUrl }`, both relative to the origin.
 *
 * @example
 * ```typescript
 * const { actualUrl, recordUrl } = getURL();
 *
 * // Meta override
 * // <meta name="99dev-page" content="https://example.com/about">
 * // → actualUrl === "/"
 * // → recordUrl === "/about"
 *
 * // Hash navigation
 * // URL: https://example.com/#/products?page=2
 * // → actualUrl === "/products"
 * // → recordUrl === "/products"
 *
 * // History state override
 * // history.pushState({ url: "/custom-path" }, "", "/products")
 * // → actualUrl === "/custom-path"
 * // → recordUrl === "/custom-path"
 * ```
 */
export default function getURL(): {actualUrl: string, recordUrl: string} {

  // Unpack config settings
  const { navType, normalizeUrls } = getConfig();

  // Prepare the strings for the actual URL and the URL to record.
  // These can differ due to URL overloaded via canonical or 99Dev meta.
  let actualUrl = "",
      recordUrl = "";

  // Handle 99dev Page Meta
  const metaTag:HTMLMetaElement|null = document.querySelector('meta[name="99dev-page"]');
  if (metaTag && metaTag.content)
    recordUrl =  metaTag.content.replace(window.location.origin,"");

  // Handle Canonicals
  else {
    const canonicalLink:HTMLLinkElement|null = document.querySelector("link[rel='canonical']");
    if (canonicalLink && canonicalLink.href)
        recordUrl = canonicalLink.href.replace(window.location.origin,"");
  }

  // Handle Hash
  if (navType === "hash")
    actualUrl = window.location.hash.substring(1); // Drop the leading "#" and any query parameters
  // Handle History API
  else  if (navType === "history" && window.history.state && window.history.state.url)
    actualUrl = window.history.state.url;
  // Default fallback
  else
    actualUrl = window.location.pathname;

  // URL formatting
  if (normalizeUrls) {

    // Remove query parameters
    actualUrl = actualUrl.split("?")[0];

    // Ensure leading slash is present
    if (actualUrl[0] !== "/")
      actualUrl = ["/", actualUrl].join("");

    // Remove trailing slash
    if (actualUrl.length > 1 && actualUrl[actualUrl.length - 1] === "/")
      actualUrl = actualUrl.slice(0, -1);

    // Remove trailing file extension
    if (actualUrl.endsWith(".html"))
      actualUrl = actualUrl.slice(0, -5);
  }

  // Ensure the URL to record is set
  if (!recordUrl)
    recordUrl = actualUrl;

  // Log and return the results.
  const ret =  { actualUrl, recordUrl };
  log("getURL() results:", ret);
  return ret;
}
