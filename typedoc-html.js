// typedoc-html.js
import sharedConfig from './typedoc-shared.js';

export default {
  ...sharedConfig,
  out: "docs-html",
  plugin: ["typedoc-unhoax-theme"],
  // theme: "unhoax",
}; 