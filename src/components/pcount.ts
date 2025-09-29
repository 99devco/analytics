import { log } from "./logger";

const PCOUNT_KEY = "99pcount";

/**
 * Gets the page view count for the current session
 * @private
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
 * Saves a new pCount / Page Count value into storage
 * @private
 */
export function cachePCount(pCount:number):void {
  sessionStorage.setItem(PCOUNT_KEY, pCount.toString());
  localStorage.setItem(PCOUNT_KEY, pCount.toString());
}
