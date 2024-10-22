export interface AnalyticsConfig {
  uuid: string,
  nav_type: "history" | "hash" | "natural",
  api_url: string,
}

let config:AnalyticsConfig = {
  uuid: "",
  nav_type: "natural",
  api_url: "https://api.99.dev",
};

export const setConfig = (newConfig:Partial<AnalyticsConfig>) => {
  config = { ...config, ...newConfig };
};

export const getConfig = () => config;
