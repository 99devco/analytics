/**
 * @category Core
 */

// Include external dependencies
import { getConfig, setConfig } from "./config";
import getURL from "./get-url";
import { recordView } from "./record-view";

/** Array of cleanup functions for event listeners */
const unwatchers:Array<()=>any> = [];

/**
 * Starts watching for navigation changes and records page views automatically.
 * 
 * @example
 * ```typescript
 * 
 * // Start watching for navigation changes using the default navigation type or one previously set during init()
 * watch();
 * 
 * // Alternatively, Start watching for hash (or history) navigation changes…
 * const unwatcher = watch("hash");
 * 
 * // and stop watching for navigation changes
 * unwatcher();
 * ```
 * 
 * @throws {Error} If navigation type is 'history' (not yet implemented)
 * @returns {() => void} A function that removes the hash or history watcher applied by watch()
 */
export function watch(navType?: "hash" | "history"):()=>void {

  if (navType) {
    setConfig({ navType });
  }
  else {
    navType = getConfig().navType;
  }

  let unwatcher = () => {};

  if (navType === "hash") {
    // Capture the current URL to use as the referrer later
    let referrer = getURL();
    function nndevWatchListener () {
      const url = getURL();
      recordView(url, referrer);
      referrer = url;
    };
    window.addEventListener("hashchange", nndevWatchListener);
    unwatcher = function () {
      window.removeEventListener("hashchange", nndevWatchListener);
    }
    unwatchers.push(unwatcher);
  } else if (navType === "history") {
    throw new Error(`TODO: Implement the history watch functionality`);
  }
  return unwatcher;
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