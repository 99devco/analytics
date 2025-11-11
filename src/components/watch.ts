/**
 * @category Core
 * @remarks Provides functionality to automatically track page views during navigation
 */

// Include external dependencies
import { getConfig } from "./config";
import { recordView } from "./record-view";

/** 
 * Array of cleanup functions for event listeners.
 * Used to maintain references to all active watchers for cleanup.
 */
const unwatchers:Array<()=>any> = [];

/**
 * Starts monitoring client-side navigation and automatically calls `recordView`
 * whenever the URL changes. The implementation adapts to the configured nav type:
 *
 * - `"hash"`: listens for `hashchange` events.
 * - `"history"`: patches `pushState`/`replaceState` and listens for `popstate`.
 * - `"natural"`: returns a no-op because full page loads already trigger views.
 *
 * @returns A cleanup function that detaches any listeners and restores patched APIs.
 *
 * @example
 * ```typescript
 * const stop = watch();
 * // ...later
 * stop();
 * ```
 */
export function watch():()=>void {

  const { navType } = getConfig();

  let unwatcher = () => {};

  // Create a closure to maintain referrer state and handle URL changes
  const handleUrlChange = function () {
    recordView();
  }

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
 * Removes every active watcher created via `watch()` and restores any patched
 * History API methods. Useful when tearing down single-page apps or hot-reload.
 *
 * @example
 * ```typescript
 * unwatch();
 * ```
 */
export const unwatch = function () {
  unwatchers.forEach(un => un());
}
