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

  /** The navigation type to use. Default is 'natural'. */
  navType?: "hash" | "history" | "natural";
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
 *   apiUrl: 'https://99dev-proxy.yourdomain.com',
 *   navType: 'hash',
 *   recordView: false,
 * });
 * ```
 */
export function init (uuid:string, options?:InitOptions):any {
  // unpack the options for fine grain control
  const settings = { uuid };
  if (options) {
    if (options.navType) settings.navType = options.navType;
    if (options.apiUrl) settings.apiUrl = options.apiUrl;
  }

  // cache the config values
  setConfig(settings);

  // record the current page, unless the options toggle it off
  if (options && options.recordView != false) {
    recordView();
  }

  // @ts-ignore
  return this; // this is a hack to allow chaining of methods
}