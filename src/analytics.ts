/**
 * @99devco/analytics
 * A lightweight JavaScript library for tracking and reporting web browser interactions.
 * 
 * @packageDocumentation
 */

// Include our external dependencies
import init from "./components/init";
import recordView from "./components/record-view";
import watch, { unwatch } from "./components/watch";

/**
 * Core exports for the analytics library.
 * 
 * @example
 * ```typescript
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
export { init, recordView, watch, unwatch };
