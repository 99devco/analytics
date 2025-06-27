/**
 * @category Core
 */

import { getConfig } from "./config";
import getURL from "./get-url";
import objToQps from "./obj-to-qps";

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
    pcount: getPCount() + 1,
  };

  // Ignore page refreshes if the config is set to not track them
  if (!trackPageRefreshes && pageView.url === pageView.referrer) {
    return;
  }

  // Cache the pCount / Page Count for subsequent page view saves.
  cachePCount(pageView.pcount);

  // Cache the URL as the referrer for subsequent page view saves.
  cacheReferrer(pageView.url);

  // Load the tracking pixel / send the analytics event
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
function getPCount():number {
  return parseInt(sessionStorage.getItem("99pcount") || "") || 0;
}

/**
 * Saves a new pCount / Page Count value into storage
 * @private
 */
function cachePCount(pCount:number):void {
  sessionStorage.setItem("99pcount", pCount.toString());
}
