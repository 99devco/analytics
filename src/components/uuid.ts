/**
 * Generates a RFC4122-compliant v4 UUID without requiring crypto dependencies.
 * 
 * This function creates a pseudo-random UUID that follows the v4 format:
 * xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where x is any hexadecimal digit
 * and y is one of 8, 9, A, or B.
 * 
 * Note: This implementation uses Math.random() for randomness, which is
 * suitable for client-side analytics but not for cryptographic purposes.
 * 
 * @returns A string representing a v4 UUID
 * 
 * @example
 * ```typescript
 * const id = uuid(); // Returns something like "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 * ```
 */
export function uuid(): string {
  // RFC4122-ish v4 UUID without crypto dependency
  let d = Date.now();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
