import { log } from "./logger";

const PCOUNT_KEY = "99pcount";

/**
 * Derives the visitor's page-count for the current browsing context. The count
 * is primarily read from `sessionStorage`, with `localStorage` used as a fallback
 * to handle new tabs or browser restarts. Several heuristics are applied:
 *
 * - Fresh external entry (no stored count, referrer is empty or absolute URL)
 *   resets the counter to `1`.
 * - Opening an internal link in a new tab reuses the `localStorage` value.
 * - When another tab has progressed further, its higher `localStorage` value
 *   becomes the baseline to keep counts monotonic.
 *
 * @param referrer - The raw referrer path/URL to help detect external entries
 * @param skipIncrement - When true, returns the existing count without adding one
 * @returns The next page-count that should be associated with the view/event
 *
 * @example
 * ```typescript
 * const pcount = getPCount(document.referrer);
 * ```
 */
export function getPCount(referrer:string, skipIncrement:boolean = false):number {
  // Read the pCount from session storage.
  const session_pcount = parseInt(sessionStorage.getItem(PCOUNT_KEY) || "") || 0;
  const increment = skipIncrement ? 0 : 1;

  // If natural, external entry detected, reset pCount.
  const entry_detected = session_pcount === 0 && (!referrer || referrer.indexOf("http") === 0);
  if (entry_detected) {
    log("Entry detected, resetting pCount");
    return 1;
  }

  const local_pcount = parseInt(localStorage.getItem(PCOUNT_KEY) || "") || 0;
  const new_tab_detected = session_pcount === 0 && referrer && referrer.indexOf("http") === -1;
  if (new_tab_detected) {
    log("New tab detected! Reading pCount from local storage.");
    return local_pcount + increment;
  }

  if (local_pcount > session_pcount) {
    log("Out-of-tab navigation detected, resetting pCount from local storage.");
    return local_pcount + increment;
  }

  log("Normal in-page navigation detected, increment pcount from session storage.");
  return session_pcount + increment;
}

/**
 * Persists the supplied page-count to both session and local storage so reloads,
 * new tabs, and other heuristics can make consistent decisions.
 * @private
 */
export function cachePCount(pCount:number):void {
  sessionStorage.setItem(PCOUNT_KEY, pCount.toString());
  localStorage.setItem(PCOUNT_KEY, pCount.toString());
}
