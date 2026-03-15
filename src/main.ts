/*

This file contains a minimal example of how to use the ESM modules and entry
point for testing via the `npm run-script dev` command.

It is NOT intended to be used as part of the actual 99dev analytics package.

*/

// Include our external dependencies!
import * as analytics from "./analytics";

// Initialize the analytics system
analytics.init({
  uuid: "40d4f9c4-10b1-41d0-aea8-472fcc8be35e",
  // navType: "history",
  apiUrl: "http://localhost:3000",
  debug: true,
});

// Expose the event recorder globally
(window as any).recordEvent = analytics.recordEvent;


