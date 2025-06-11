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
  /** If true, prevents recording the initial page view */
  dontRecordView?: boolean;
}

/**
 * Initializes the analytics library with the provided site UUID and options.
 * 
 * @param uuid - The unique identifier for your site
 * @param options - Optional configuration settings
 * 
 * @example
 * ```typescript
 * // Basic initialization
 * init('your-site-uuid');
 * 
 * // With custom options
 * init('your-site-uuid', {
 *   api_url: 'https://custom-api.99.dev',
 *   nav_type: 'hash',
 *   dontRecordView: true
 * });
 * ```
 */
export function init (uuid:string, options?:InitOptions):void {
  // unpack the options for fine grain control
  const settings:InitOptions = { uuid };
  if (options) {
    if (options.nav_type) settings.nav_type = options.nav_type;
    if (options.api_url) settings.api_url = options.api_url;
  }

  // cache the config values
  setConfig(settings);

  // record the current page, unless the options toggle it off
  if (options && !options.dontRecordView) {
    recordView();
  }
}