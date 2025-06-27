/**
 * @category Utilities
 */

// Include external dependencies
import { getConfig } from "./config";

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
export default function getURL() {
  const { navType, normalizeUrls } = getConfig();

  // Handle 99dev Page Meta
  const metaTag:HTMLMetaElement|null = document.querySelector('meta[name="99dev-page"]');
  if (metaTag && metaTag.content)
    return metaTag.content.replace(window.location.origin,"");

  // Handle Canonicals
  const canonicalLink:HTMLLinkElement|null = document.querySelector("link[rel='canonical']");
  if (canonicalLink && canonicalLink.href)
      return canonicalLink.href.replace(window.location.origin,"");

  let url = "";

  // Handle Hash
  if (navType === "hash")
    url = window.location.hash.substring(1); // Drop the leading "#" and any query parameters
  // Handle History API
  else  if (navType === "history" && window.history.state && window.history.state.url)
    url = window.history.state.url;
  // Default fallback
  else
    url = window.location.pathname;

  // URL formatting
  if (normalizeUrls) {

    // Remove query parameters
    url = url.split("?")[0];

    // Ensure leading slash is present
    if (url[0] !== "/")
      url = ["/", url].join("");

    // Remove trailing slash
    if (url[url.length - 1] === "/")
      url = url.slice(0, -1);

    // Remove trailing file extension
    if (url.endsWith(".html"))
      url = url.slice(0, -5);
  }

  return url;
}