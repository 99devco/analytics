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
  const _url = url || getURL();
  const { uuid, api_url } = getConfig();

  // Load the tracking pixel / send the analytics event
  const trkpxl = document.createElement("img");
  trkpxl.setAttribute("alt", "");
  trkpxl.setAttribute("aria-hidden", "true");
  trkpxl.style.position = "absolute";
  trkpxl.src = encodeURI(`${api_url}/mian/${uuid}/tpxl.gif?${objToQps({
    url: _url,
    referrer: referrer || getReferrer(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    pcount: getPCount(),
  })}`);
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
function getReferrer():string {
  const split = window.document.referrer.split(window.location.origin);
  console.log(split[split.length-1]);
  return split[split.length-1] || "";
}

/**
 * Gets and increments the page view count for the current session
 * @private
 */
function getPCount():number {
  const pcount = parseInt(sessionStorage.getItem("99pcount") || "") || 1;
  sessionStorage.setItem("99pcount", (pcount+1).toString())
  return pcount;
}
