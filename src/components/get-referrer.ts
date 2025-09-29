/**
 * Gets the referrer path relative to the current origin
 * @private
 */
export function getReferrer(referrerOverload?: string): string {
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
  return split[split.length - 1] || "";
}
