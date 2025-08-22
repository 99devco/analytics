/**
 * @category Core
 */

import { getConfig } from "./config";
import getURL from "./get-url";
import objToQps from "./obj-to-qps";
import { log } from "./logger";
import { getReferrer } from "./get-referrer";
import { cachePCount, getPCount } from "./pcount";

// @ts-ignore
const version = __VERSION__;

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
    pcount: Infinity,
    version
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
 * Saved a referrer value to Session Storage. Necessary for History and Hash routing.
 * @private
 */
function cacheReferrer(referrer:string):void {
  sessionStorage.setItem("99referrer", referrer);
}
