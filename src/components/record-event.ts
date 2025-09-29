/**
 * @category Core
 */

import { getConfig } from "./config";
import { log } from "./logger";
import { getReferrer } from "./get-referrer";
import { sizeOf } from "./size-of";
import { uuid } from "./uuid";
import getURL from "./get-url";
import { getPCount } from "./pcount";

// @ts-ignore
const version = __VERSION__;

/**
 * Maximum payload bytes per beacon. Keep conservative to avoid per-browser caps.
 * Note: Practical limits vary (~64KB typical).
 */
const MAX_BYTES = 60000;

/**
 * Event packet sent to the API.
 */
export interface AnalyticsEvent {
  /** Event name, e.g., "checkout_started" */
  event_name: string;
  /** Page URL where the event occurred */
  url: string;
  /** Page view count for the current session */
  pcount: number;
  /** User-defined props; keep shallow/JSON-serializable */
  event_details?: Record<string, unknown>;
  /** Client-generated GUID to deduplicate server-side */
  idempotency: string;
}

/**
 * Batch payload sent to the API.
 */
export interface AnalyticsBatch {
  /** Events in this batch */
  events: AnalyticsEvent[];
  /** Transport hint ("beacon" | "fetch_keepalive" | "xhr") */
  transport: string;
  /** SDK/library version */
  script_version: string;
  /** Timezone of the client */
  timezone: string;
}

// In-memory queue (not persisted across reloads)
const QUEUE: AnalyticsEvent[] = [];

/**
 * Records a user-defined analytics event. Events are queued and periodically
 * flushed using `navigator.sendBeacon()` with a fetch keepalive fallback.
 *
 * @param type - Event name (e.g., "cta_click")
 * @param props - Optional user-defined properties (plain JSON)
 *
 * @example
 * ```ts
 * recordEvent("video_play", { id: "abc123", position: 0 });
 * recordEvent("cta_click", { ctaId: "signup-hero" });
 * ```
 */
export function recordEvent(
  event_name: string,
  event_details?: Record<string, unknown>,
): void {
  const { uuid: siteUUID } = getConfig();

  if (!siteUUID) {
    log("No UUID found, skipping event record.");
    return;
  }

  const evt: AnalyticsEvent = {
    event_name,
    event_details,
    url: getURL(),
    pcount: getPCount(getReferrer(), true),
    idempotency: uuid(),
  };

  QUEUE.push(evt);
  log("Event added to queue", evt)

  // Eager flush for higher volumes; otherwise timers/unload will pick it up.
  if (QUEUE.length >= 10) flushEvents();
}

/**
 * Flushes queued events to the collector. Generally not necessary to call
 * manually—SDK will flush on interval and page lifecycle, but it is exposed
 * for advanced use.
 *
 * @param force - Ignored in the current implementation; reserved for future use
 */
export function flushEvents(_force = false): void {
  void _force;
  if (QUEUE.length === 0) return;

  const { uuid: siteUUID, apiUrl } = getConfig();
  if (!siteUUID || !apiUrl) {
    log("Missing config (uuid/apiUrl), skipping flush.");
    return;
  }

  // Compose endpoint to match API style used by record-view
  const ENDPOINT = `${apiUrl}/mian-events/${siteUUID}`;

  // Build a batch under the size limit
  const batch: AnalyticsBatch = {
    events: [],
    transport: "beacon",
    script_version: version,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  };
  for (const e of QUEUE) {
    const test = JSON.stringify({ ...batch, events: [...batch.events, e] });
    if (sizeOf(test) > MAX_BYTES) break;
    batch.events.push(e);
  }

  if (batch.events.length === 0) return;

  // Remove sent items from QUEUE
  QUEUE.splice(0, batch.events.length);

  const body = JSON.stringify(batch);
  const blob = new Blob([body], { type: "application/json" });

  let sent = false;
  if ("sendBeacon" in navigator) {
    sent = navigator.sendBeacon(ENDPOINT, blob);
  }

  if (!sent) {
    // Fallback for older browsers or if sendBeacon refused
    batch.transport = "fetch_keepalive";
    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(batch),
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => { /* fire-and-forget */ });
  }

  // If more remain (due to size cap), schedule the next micro-batch
  if (QUEUE.length > 0) {
    setTimeout(() => flushEvents(), 10);
  }
}

// Page lifecycle: maximize delivery on tab hide/unload
addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flushEvents(true);
});
addEventListener("pagehide", () => flushEvents(true));

// Optional: periodic flush for long-lived tabs
setInterval(() => flushEvents(), 10000);