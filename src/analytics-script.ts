// Include our external dependencies!
import * as analytics from "./analytics";

// Read properties from the script import
const script = document.currentScript || document.querySelector("script[src*='99dev'][data-site-uuid]");
const site_uuid = script?.getAttribute("data-site-uuid") || "";
const api_url = script?.getAttribute("data-api-url") || "https://api.99.dev";
const nav_type = script?.getAttribute("data-watch") || "natural";

// Call the ES code
analytics.init(
  site_uuid,
  {
    // @ts-ignore
    nav_type,
    api_url,
  }
).watch();