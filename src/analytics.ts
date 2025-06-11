/**
 * @module @99devco/analytics
 * @packageDocumentation
 * 
 * A lightweight JavaScript library for tracking and reporting web browser interactions.
 * 
 * @example
 * ```ts
 * import { init, recordView, watch, unwatch } from '@99devco/analytics';
 * 
 * // Initialize the analytics
 * init('your-site-uuid');
 * 
 * // Record a page view
 * recordView();
 * 
 * // Start watching for navigation changes
 * watch();
 * 
 * // Stop watching for navigation changes
 * unwatch();
 * ```
 */

export * from "./components/init";
export * from "./components/record-view";
export * from "./components/watch";
