/**
 * Generates a RFC4122-compliant v4 UUID using crypto functions when available.
 * 
 * This function creates a cryptographically secure UUID that follows the v4 format:
 * xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where x is any hexadecimal digit
 * and y is one of 8, 9, A, or B.
 * 
 * The function will use the Web Crypto API (crypto.getRandomValues) when available
 * for better randomness, falling back to a pseudo-random implementation for older browsers.
 * 
 * @returns A string representing a v4 UUID
 * 
 * @example
 * ```typescript
 * const id = uuid(); // Returns something like "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 * ```
 */
export function uuid(): string {
  // Check if crypto.getRandomValues is available
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Use cryptographically secure random values
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    
    // Set version (4) and variant bits
    array[6] = (array[6] & 0x0f) | 0x40; // Version 4
    array[8] = (array[8] & 0x3f) | 0x80; // Variant 1
    
    // Convert to hex string
    const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Format as UUID
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  }
  
  // Fallback to pseudo-random implementation for older browsers
  let d = Date.now();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
