/**
 * @category Core
 */

import { getConfig } from "./config";

/**
 * Logs a message to the console if debug mode is enabled in the configuration.
 * 
 * This function checks the debug setting from the analytics configuration and only
 * outputs the message to the console if debug mode is turned on. This allows for
 * conditional logging that can be controlled via the analytics configuration.
 * 
 * @param message - The message to log to the console
 * 
 * @example
 * ```typescript
 * // Log a debug message
 * log("Analytics initialized successfully");
 * 
 * // Log with dynamic content
 * log(`Page view recorded for URL: ${currentUrl}`);
 * ```
 */
export function log(message: string): void {
  const { debug } = getConfig();
  if (debug) {
    console.log(message);
  }
}