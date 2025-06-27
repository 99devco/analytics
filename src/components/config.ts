/**
 * @category Configuration
 */

/**
 * Configuration interface for the analytics library
 * @interface AnalyticsConfig
 */
export interface AnalyticsConfig {
  /** Unique identifier for your site */
  uuid: string,
  /** Navigation type to watch for page changes */
  navType: "natural" | "history" | "hash",
  /** API endpoint for analytics data */
  apiUrl: string,
  /** Whether to normalize URLS to remove trailing slashes, file extensions, and query parameters */
  normalizeUrls: boolean,
  /** Whether to track page refreshes as views */
  trackPageRefreshes: boolean,
}

/** Default configuration values */
let config:AnalyticsConfig = {
  uuid: "",
  navType: "natural",
  apiUrl: "https://api.99.dev",
  normalizeUrls: true,
  trackPageRefreshes: false,
};

/**
 * Updates the analytics configuration with new values
 * @param newConfig - Partial configuration object containing values to update
 */
export const setConfig = (newConfig:Partial<AnalyticsConfig>):AnalyticsConfig => {
  config = { ...config, ...newConfig };
  return config;
};

/**
 * Gets the current analytics configuration
 * @returns The current configuration object
 */
export const getConfig = () => config;
