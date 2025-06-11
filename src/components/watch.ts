/**
 * @category Core
 * @module Watch
 * @description Provides functionality to automatically track page views during navigation
 */

// Include external dependencies
import { getConfig, setConfig } from "./config";
import getURL from "./get-url";
import { recordView } from "./record-view";

/** 
 * Array of cleanup functions for event listeners.
 * Used to maintain references to all active watchers for cleanup.
 */
const unwatchers:Array<()=>any> = [];

/**
 * Starts watching for navigation changes and records page views automatically.
 * Supports both hash-based and History API-based navigation.
 * 
 * @example
 * ```typescript
 * // Start watching using default navigation type from init()
 * watch();
 * 
 * // Start watching hash-based navigation
 * const unwatcher = watch("hash");
 * 
 * // Start watching History API navigation
 * const unwatcher = watch("history");
 * 
 * // Stop watching
 * unwatcher();
 * ```
 * 
 * @param navType - Optional navigation type to use ("hash" or "history")
 * @returns A function that removes the watcher when called
 */
export function watch(navType?: "hash" | "history"):()=>void {
  // Set or get the navigation type configuration
  if (navType) {
    setConfig({ navType });
  }
  else {
    navType = getConfig().navType;
  }

  let unwatcher = () => {};

  // Create a closure to maintain referrer state and handle URL changes
  const handleUrlChange = (() => {
    // Store the initial URL as the first referrer
    let referrer = getURL();
    return () => {
      const url = getURL();
      recordView(url, referrer);
      referrer = url;
    };
  })();

  if (navType === "hash") {
    // Hash-based navigation: Watch for hashchange events
    window.addEventListener("hashchange", handleUrlChange);
    unwatcher = function () {
      window.removeEventListener("hashchange", handleUrlChange);
    }
    unwatchers.push(unwatcher);
  } else if (navType === "history") {
    // History API navigation: Watch for popstate events (back/forward navigation)
    window.addEventListener("popstate", handleUrlChange);
    
    // Intercept pushState and replaceState to catch programmatic navigation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    // Override pushState to trigger analytics
    window.history.pushState = function() {
      originalPushState.apply(this, arguments as any);
      handleUrlChange();
    };
    
    // Override replaceState to trigger analytics
    window.history.replaceState = function() {
      originalReplaceState.apply(this, arguments as any);
      handleUrlChange();
    };
    
    // Create cleanup function to restore original behavior
    unwatcher = function () {
      window.removeEventListener("popstate", handleUrlChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    }
    unwatchers.push(unwatcher);
  }
  return unwatcher;
}

/**
 * Stops watching for navigation changes and cleans up all event listeners.
 * This will remove all watchers created by watch() and restore any overridden
 * browser APIs to their original state.
 * 
 * @example
 * ```typescript
 * // Stop all navigation watching
 * unwatch();
 * ```
 */
export const unwatch = function () {
  unwatchers.forEach(un => un());
}