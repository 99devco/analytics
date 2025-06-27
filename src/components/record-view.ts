/**
 * @category Core
 */

import { getConfig } from "./config";
import getURL from "./get-url";
import objToQps from "./obj-to-qps";
import { log } from "./logger";

/**
 * Records a page view in the analytics system.
 * 
 * @param url - Optional URL to record. If not provided, the current page URL will be used
 * @param referrer - Optional referrer URL. If not provided, the document referrer will be used
 * 
 * @example
 * ```typescript
 * // Record current page view
 * recordView();
 * 
 * // Record specific URL and referrer
 * recordView('https://example.com/page', 'https://example.com');
 * ```
 */
export function recordView (url?:string, referrer?:string):void {
  // Unpack config settings
  const { uuid, apiUrl, trackPageRefreshes } = getConfig();

  // Format the Page View data
  const pageView = {
    url: url || getURL(),
    referrer: referrer || getReferrer(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    pcount: Infinity
  };

  // Ignore page refreshes if the config is set to not track them
  if (!trackPageRefreshes && pageView.url === pageView.referrer) {
    log("Page refresh detected, skipping page view record.");
    return;
  }

  // Determine the Page Count.
  pageView.pcount = getPCount(pageView.referrer);

  log(JSON.stringify({pageView}, null, 2));

  // Cache the pCount / Page Count for subsequent page view saves.
  cachePCount(pageView.pcount);

  // Cache the URL as the referrer for subsequent page view saves.
  cacheReferrer(pageView.url);

  // Load the tracking pixel / send the analytics event
  if (!uuid) {
    log("No UUID found, skipping tracking pixel load.");
    return;
  }
  const trkpxl = document.createElement("img");
  trkpxl.setAttribute("alt", "");
  trkpxl.setAttribute("aria-hidden", "true");
  trkpxl.style.position = "absolute";
  trkpxl.src = encodeURI(`${apiUrl}/mian/${uuid}/tpxl.gif?${objToQps(pageView)}`);
  trkpxl.addEventListener("load", function () {
    trkpxl.parentNode?.removeChild(trkpxl);
  });
  trkpxl.addEventListener("error", function () {
    trkpxl.parentNode?.removeChild(trkpxl);
  });
  document.body.appendChild(trkpxl);
}

/**
 * Gets the referrer path relative to the current origin
 * @private
 */
function getReferrer(referrerOverload?:string):string {
  // If a referrer overload is provided, cache it and return it
  if (referrerOverload) {
    sessionStorage.setItem("99referrer", referrerOverload);
    return referrerOverload;
  }

  // Otherwise, check for a stored referrer in Session Storage
  const storedReferrer = sessionStorage.getItem("99referrer");
  if (storedReferrer) {
    return storedReferrer;
  }

  // Otherwise, get the referrer from document / headers.
  const split = window.document.referrer.split(window.location.origin);
  return split[split.length-1] || "";
}

/**
 * Saved a referrer value to Session Storage. Necessary for History and Hash routing.
 * @private
 */
function cacheReferrer(referrer:string):void {
  sessionStorage.setItem("99referrer", referrer);
}

/**
 * Gets the page view count for the current session
 * @private
 */
function getPCount(referrer:string):number {
  // Read the pCount from session storage.
  const session_pcount = parseInt(sessionStorage.getItem("99pcount") || "") || 0;

  // If natural, external entry detected, reset pCount.
  const entry_detected = session_pcount === 0 && (!referrer || referrer.indexOf("http") === 0);
  if (entry_detected) {
    log("Entry detected, resetting pCount");
    return 1;
  }

  const local_pcount = parseInt(localStorage.getItem("99pcount") || "") || 0;
  const new_tab_detected = session_pcount === 0 && referrer && referrer.indexOf("http") === -1;
  if (new_tab_detected) {
    log("New tab detected! Reading pCount from local storage.");
    return local_pcount + 1;
  }

  if (local_pcount > session_pcount) {
    log("Out-of-tab navigation detected, resetting pCount from local storage.");
    return local_pcount + 1;
  }

  log("Normal in-page navigation detected, increment pcount from session storage.");
  return session_pcount + 1;
}

/**
 * Saves a new pCount / Page Count value into storage
 * @private
 */
function cachePCount(pCount:number):void {
  sessionStorage.setItem("99pcount", pCount.toString());
  localStorage.setItem("99pcount", pCount.toString());
}
