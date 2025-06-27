/**
 * @category Core
 */

// Include external dependencies
import {
  setConfig,
  type AnalyticsConfig
} from "./config";
import { recordView } from "./record-view";
import { watch } from "./watch";
import { log } from "./logger";

/**
 * Configuration options for initializing the analytics library.
 * @public
 */
export interface InitOptions extends Partial<AnalyticsConfig> {
  /** If false, prevents recording the initial page view. Default is true. */
  recordView?: boolean;

  /** The API URL to record traffic to. Default is https://api.99.dev. */
  apiUrl?: string;

  /** The navigation type to use. Default is 'natural'. */
  navType?: "natural" | "history" | "hash";

  /** Whether to normalize URLS to remove trailing slashes, file extensions, and query parameters. Default is true. */
  normalizeUrls?: boolean;

  /** Whether to add a watcher to the analytics library. Default is true if Hash or History navType is used. */
  addWatcher?: boolean;
}

/**
 * Complete configuration options for initializing the analytics library.
 * @public
 */
export interface CompleteInitOptions extends InitOptions {
  /** The unique identifier for your site */
  uuid: string;
}

/**
 * Initializes the analytics library with either a site UUID and options, or just options containing the UUID.
 * 
 * @param uuidOrConfig - Either the unique identifier for your site or the full options object
 * @param options - Optional configuration settings (only used if first parameter is a string)
 * 
 * @example
 * ```typescript
 * // Basic initialization with string UUID
 * init('your-site-uuid');
 * 
 * // With custom options
 * init('your-site-uuid', {
 *   apiUrl: 'https://99dev-proxy.yourdomain.com',
 *   navType: 'hash',
 *   recordView: false,
 * });
 * 
 * // With options object only
 * init({
 *   uuid: 'your-site-uuid',
 *   apiUrl: 'https://99dev-proxy.yourdomain.com',
 *   navType: 'hash',
 *   recordView: false,
 * });
 * ```
 */
export function init(uuidOrConfig: string | CompleteInitOptions, options?: InitOptions): void {
  let settings: Partial<InitOptions>;
  
  if (typeof uuidOrConfig === 'string') {
    // If first parameter is a string, use it as UUID
    settings = options ? options : {};
    settings.uuid = uuidOrConfig;
  } else {
    // If first parameter is options object
    settings = uuidOrConfig
  }

  // cache the config values
  const config = setConfig(settings);

  log(JSON.stringify({config}, null, 2));

  // record the current page, unless the options toggle it off
  if (settings.recordView !== false) {
    recordView();
  }

  // add a has or history watcher, unless the options toggle it off
  if (settings.addWatcher !== false && (config.navType === "hash" || config.navType === "history")) {
    watch();
  }
}