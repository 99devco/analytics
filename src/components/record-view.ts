/**
 * @category Core
 */

import { getConfig } from "./config";
import getURL from "./get-url";
import objToQps from "./obj-to-qps";
import { log } from "./logger";
import { getReferrer, referrerStorageKeyActual, referrerStorageKeyRecord } from "./get-referrer";
import { cachePCount, getPCount } from "./pcount";
import { getUtmParams } from "./utm";

// @ts-ignore
const version = __VERSION__;

/**
 * Records the current page view by collecting the normalized URL, referrer,
 * timezone, SDK version, and calculated page-count, then dispatching a tracking
 * pixel to the configured API endpoint. UTM parameters are automatically
 * included when present in the URL (or recovered from the current session).
 *
 * When called without overrides the function:
 * 1. Reads `{ actualUrl, recordUrl }` from `getURL()` so canonical/meta overrides
 *    are respected while still tracking refresh detection.
 * 2. Reads `{ actualReferrer, recordReferrer }` from `getReferrer()` so the
 *    recorded referrer can differ from the in-session navigation path.
 * 3. Computes the page count via `getPCount()` to understand the visit depth.
 * 4. Skips recording if a refresh is detected and `trackPageRefreshes` is false.
 * 5. Persists the new `pcount` and referrer values for the next navigation.
 *
 * @param url - Optional override for the recorded URL path (defaults to `recordUrl`)
 * @param referrer - Optional override for the recorded referrer path (defaults to `recordReferrer`)
 *
 * @example
 * ```typescript
 * // Record the current page view using canonical/meta data
 * recordView();
 *
 * // Record a virtual page view for in-app navigation
 * recordView("/pricing", "/features");
 * ```
 */
export function recordView (url?:string, referrer?:string):void {
  // Unpack config settings
  const { uuid, apiUrl, trackPageRefreshes } = getConfig();

  // Read the URL and referrer
  const { actualUrl, recordUrl } = getURL();
  const { actualReferrer, recordReferrer } = getReferrer();

  // Format the Page View data
  const pageViewBase = {
    url: url || recordUrl,
    referrer: referrer || recordReferrer,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    pcount: Infinity,
    version
  };

  // Attach session-cached UTMs to every page view for campaign attribution.
  const utmParams = getUtmParams();
  const pageView = {
    ...pageViewBase,
    ...utmParams,
  };

  // Ignore page refreshes if the config is set to not track them
  if (!trackPageRefreshes && actualUrl === actualReferrer) {
    log("Page refresh detected, skipping page view record.");
    return;
  }

  // Determine the Page Count.
  pageView.pcount = getPCount(actualReferrer);

  log(JSON.stringify({pageView}, null, 2));

  // Cache the pCount / Page Count for subsequent page view saves.
  cachePCount(pageView.pcount);

  // Cache the URL as the referrer for subsequent page view saves.
  cacheReferrer(actualUrl, pageView.url);

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
 * Persists both the literal navigation path and the canonical/meta override so the
 * next invocation of `recordView()` can treat them as the prior referrer.
 * @private
 */
function cacheReferrer(actualReferrer:string, recordReferrer:string):void {
  sessionStorage.setItem(referrerStorageKeyActual, actualReferrer);
  sessionStorage.setItem(referrerStorageKeyRecord, recordReferrer);
}
