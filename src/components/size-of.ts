/**
 * Calculates the byte size of a string using UTF-8 encoding.
 * 
 * This function is used to determine the size of payloads before sending them
 * to ensure they don't exceed browser limits for beacon requests.
 * 
 * @param str - The string to calculate the byte size for
 * @returns The number of bytes the string occupies when encoded as UTF-8
 * 
 * @example
 * ```typescript
 * const size = sizeOf("Hello, World!"); // Returns 13
 * const largeSize = sizeOf(JSON.stringify(largeObject));
 * ```
 */
export function sizeOf(str: string): number {
  return new TextEncoder().encode(str).length;
}
