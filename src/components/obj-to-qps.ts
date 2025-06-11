/**
 * @category Utilities
 */

/**
 * Converts an object to a query parameter string.
 * 
 * @param paramObj - Object containing key-value pairs to convert to query parameters
 * @returns URL-encoded query parameter string
 * 
 * @example
 * ```typescript
 * objToQps({ page: 'home', id: 123 }); // returns "page=home&id=123"
 * ```
 */
export default function objToQps (paramObj:{}) {
  return Object.entries(paramObj).map(e => e.join("=")).join("&");
}