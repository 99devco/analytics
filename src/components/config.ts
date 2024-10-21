let config = {
  uuid: null,
  nav_type: "natural",
  api_url: "https://api.99.dev",
};

export const setConfig = (newConfig:{}) => {
  config = { ...config, ...newConfig };
};

export const getConfig = () => config;
