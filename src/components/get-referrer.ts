export const referrerStorageKeyActual = "99referrer_actual";
export const referrerStorageKeyRecord = "99referrer_record";

/**
 * Returns both the observed and recorded referrer paths, relative to the current origin.
 *
 * The function first checks `sessionStorage` for the values previously stored under
 * `referrerStorageKeyActual` and `referrerStorageKeyRecord`, ensuring continuity as the
 * visitor navigates within the site. When no cached data exists (first page view), it
 * derives both values from `document.referrer`, stripping the origin so only the path
 * remains.
 *
 * @returns An object containing `{ actualReferrer, recordReferrer }`.
 *
 * @example
 * ```typescript
 * const { actualReferrer, recordReferrer } = getReferrer();
 * // → "/pricing"
 * ```
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
