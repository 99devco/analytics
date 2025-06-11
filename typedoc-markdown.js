// typedoc-markdown.js
import sharedConfig from './typedoc-shared.js';

export default {
  ...sharedConfig,
  out: "docs",
  plugin: ["typedoc-plugin-markdown"]
}; 