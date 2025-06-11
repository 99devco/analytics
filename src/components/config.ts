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
  nav_type: "history" | "hash" | "natural",
  /** API endpoint for analytics data */
  api_url: string,
}

/** Default configuration values */
let config:AnalyticsConfig = {
  uuid: "",
  nav_type: "natural",
  api_url: "https://api.99.dev",
};

/**
 * Updates the analytics configuration with new values
 * @param newConfig - Partial configuration object containing values to update
 */
export const setConfig = (newConfig:Partial<AnalyticsConfig>) => {
  config = { ...config, ...newConfig };
};

/**
 * Gets the current analytics configuration
 * @returns The current configuration object
 */
export const getConfig = () => config;
