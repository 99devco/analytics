/*

This file contains a minimal example of how to use the ESM modules and entry
point for testing via the `npm run-script dev` command.

It is NOT intended to be used as part of the actual 99dev analytics package.

*/

// Include our external dependencies!
import * as analytics from "./analytics";

const UUID_STORAGE_KEY = "99dev-test-uuid";
const testUuid = localStorage.getItem(UUID_STORAGE_KEY)?.trim() || "";

// Initialize the analytics system only when a UUID is configured
if (testUuid) {
  analytics.init({
    uuid: testUuid,
    // navType: "history",
    apiUrl: "http://localhost:3000",
    debug: true,
  });
}

// Expose the event recorder globally
(window as any).recordEvent = analytics.recordEvent;

