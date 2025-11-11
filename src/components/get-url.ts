/**
 * @category Utilities
 */

// Include external dependencies
import { getConfig } from "./config";
import { log } from "./logger";

/**
 * Gets the current page URL based on navigation type and available meta information.
 * The function follows this priority order:
 * 1. 99dev page meta tag
 * 2. Canonical link
 * 3. Hash or History browser API (per configuration)
 * 
 * For History API navigation, the function will:
 * - Use the current pathname
 * - Include search parameters if present
 * - Use state.url if available in the history state
 * 
 * @returns The current page URL path (without origin)
 * 
 * @example
 * ```typescript
 * // With meta tag
 * // <meta name="99dev-page" content="https://example.com/about">
 * getURL(); // returns "/about"
 * 
 * // With hash navigation
 * // URL: https://example.com/#/products
 * getURL(); // returns "/products"
 * 
 * // With History API
 * // URL: https://example.com/products?page=2
 * getURL(); // returns "/products
 * 
 * // With History API and state
 * // history.pushState({ url: '/custom-path' }, '', '/products')
 * getURL(); // returns "/custom-path"
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