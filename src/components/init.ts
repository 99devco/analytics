/**
 * @category Core
 */

// Include external dependencies
import {
  setConfig,
  type AnalyticsConfig
} from "./config";
import { recordView } from "./record-view";

/**
 * Configuration options for initializing the analytics library.
 * @public
 */
export interface InitOptions extends Partial<AnalyticsConfig> {
  /** If false, prevents recording the initial page view. Default is true. */
  recordView?: boolean;

  /** The API URL to record traffic to. Default is https://api.99.dev. */
  apiUrl?: string;

  /** The navigation type to use. Default is 'history'. */
  navType?: "hash" | "history";

  /** Whether to normalize URLS to remove trailing slashes, file extensions, and query parameters. Default is true. */
  normalizeUrls?: boolean;
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
  let settings: Partial<AnalyticsConfig>;
  
  if (typeof uuidOrConfig === 'string') {
    // If first parameter is a string, use it as UUID
    settings = { uuid: uuidOrConfig };
    if (options) {
      if (options.navType) settings.navType = options.navType;
      if (options.apiUrl) settings.apiUrl = options.apiUrl;
    }
  } else {
    // If first parameter is options object
    settings = { uuid: uuidOrConfig.uuid };
    if (uuidOrConfig.navType) settings.navType = uuidOrConfig.navType;
    if (uuidOrConfig.apiUrl) settings.apiUrl = uuidOrConfig.apiUrl;
  }

  // cache the config values
  setConfig(settings);

  // record the current page, unless the options toggle it off
  const shouldRecordView = typeof uuidOrConfig === 'string' 
    ? options?.recordView !== false
    : uuidOrConfig.recordView !== false;

  if (shouldRecordView) {
    recordView();
  }
}