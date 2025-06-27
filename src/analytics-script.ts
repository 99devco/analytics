/*
  This script is used to initialize the analytics library via a script tag.
*/

// Include our external dependencies!
import * as analytics from "./analytics";

// Declare the global type
declare global {
  interface Window {
    nndev: typeof analytics;
  }
}

// Read properties from the script import
const script = document.currentScript || document.querySelector("script[src*='99dev'][data-site-uuid]");
const uuid = script?.getAttribute("data-site-uuid") || "";
const apiUrl = script?.getAttribute("data-api-url") || "https://api.99.dev";
const navType = script?.getAttribute("data-watch") || "natural";

// Call the analytics library
analytics.init({
  uuid,
  navType: navType as "natural" | "hash" | "history",
  apiUrl,
});

// Expose the analytics library as a global variable
window.nndev = analytics;
