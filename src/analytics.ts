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
 * // Initialize the analytics and watch for navigation changes
 * analytics.init('your-site-uuid')
 * const unwatcher = analytics.watch();
 * 
 * // Stop watching for navigation changes
 * unwatcher();
 * 
 * ```
 */

export * from "./components/init";
export * from "./components/record-view";
export * from "./components/watch";
