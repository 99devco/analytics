export const referrerStorageKeyActual = "99referrer_actual";
export const referrerStorageKeyRecord = "99referrer_record";

/**
 * Gets the referrer path relative to the current origin
 * @private
 */
export function getReferrer(): { actualReferrer:string, recordReferrer:string } {

  // Check for a stored referrer in Session Storage. This is stored from
  // previous page views on this site.
  let actualReferrer = sessionStorage.getItem(referrerStorageKeyActual) || "";
  let recordReferrer = sessionStorage.getItem(referrerStorageKeyRecord) || "";

  // Otherwise, get the referrer from document / headers. This is when visitors
  // first land on this site.
  if (!actualReferrer || !recordReferrer) {
    const split = window.document.referrer.split(window.location.origin);
    actualReferrer = recordReferrer = split[split.length - 1] || "";
  }

  return { actualReferrer, recordReferrer };
}
