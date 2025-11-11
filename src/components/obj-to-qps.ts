/**
 * @category Utilities
 */

/**
 * Converts a flat object into a query-parameter string by concatenating keys
 * and values with `=` and joining pairs with `&`. The function assumes the
 * values are already safe for transport—it does not perform URL encoding.
 *
 * @param paramObj - Object containing primitive key-value pairs to serialize
 * @returns A string such as `key=value&flag=true`
 *
 * @example
 * ```typescript
 * objToQps({ page: "home", id: 123 }); // "page=home&id=123"
 * objToQps({ search: encodeURIComponent("99 dev") });
 * ```
 */
export default function objToQps (paramObj:{}) {
  return Object.entries(paramObj).map(e => e.join("=")).join("&");
}
