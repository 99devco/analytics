/**
 * @category Core
 */

// Include external dependencies
import { getConfig } from "./config";
import getURL from "./get-url";
import recordView from "./record-view";

/** Array of cleanup functions for event listeners */
const unwatchers:Array<()=>any> = [];

/**
 * Starts watching for navigation changes and records page views automatically.
 * Currently supports 'hash' navigation type. 'history' navigation type is planned.
 * 
 * @example
 * ```typescript
 * // Start watching for hash navigation changes
 * watch();
 * ```
 * 
 * @throws {Error} If navigation type is 'history' (not yet implemented)
 */
export default function watch():void {
  const { nav_type } = getConfig();

  if (nav_type === "hash") {
    // Capture the current URL to use as the referrer later
    let referrer = getURL();
    function nndev_listener () {
      const url = getURL();
      recordView(url, referrer);
      referrer = url;
    };
    window.addEventListener("hashchange", nndev_listener);
    unwatchers.push(function () {
      window.removeEventListener("hashchange", nndev_listener);
    });
  } else if (nav_type === "history") {
    throw new Error(`TODO: Implement the history watch functionality`);
  }
}

/**
 * Stops watching for navigation changes and cleans up event listeners.
 * 
 * @example
 * ```typescript
 * // Stop watching for navigation changes
 * unwatch();
 * ```
 */
export const unwatch = function () {
  unwatchers.forEach(un => un());
}