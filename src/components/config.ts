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
  navType: "history" | "hash",
  /** API endpoint for analytics data */
  apiUrl: string,
}

/** Default configuration values */
let config:AnalyticsConfig = {
  uuid: "",
  navType: "history",
  apiUrl: "https://api.99.dev",
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
