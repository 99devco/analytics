/**
 * @module @99devco/analytics
 * @packageDocumentation
 * 
 * A lightweight JavaScript library for tracking and reporting web browser interactions.
 * 
 * @example
 * ```ts
 * import * as analytics from '@99devco/analytics';
 * 
 * // Initialize the analytics - minimal example
 * analytics.init('your-site-uuid')
 * 
 * // Initialize the analytics - minimal example for hash or history navigation
 * // This automatically adds a Hash or History API watcher.
 * analytics.init('your-site-uuid', {
 *   navType: 'hash', // or 'history'
 * });
 * 
 * // Initialize the analytics with all available options
 * analytics.init({
 *   uuid: 'your-site-uuid',
 *   apiUrl: 'https://api.99.dev',
 *   navType: 'hash',
 *   recordView: false,
 *   trackPageRefreshes: true,
 *   normalizeUrls: false,
 *   debug: true,
 * });
 * 
 * 
 * ```
 */

export * from "./components/init";
export * from "./components/record-view";
export * from "./components/watch";
