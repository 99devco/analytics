// typedoc-shared.js
export default {
  entryPoints: ["src/analytics.ts"],
  excludePrivate: true,
  excludeProtected: true,
  excludeExternals: true,
  includeVersion: true,
  hideGenerator: true,
  categorizeByGroup: true,
  categoryOrder: ["Core", "Configuration", "Utilities", "*"],
  readme: "README.md",
  exclude: ["**/*.test.ts", "**/*.spec.ts"],
  sort: ["source-order"],
  visibilityFilters: {
    protected: false,
    private: false,
    inherited: true,
    external: false
  },
  excludeTags: ["@private"],
  validation: {
    invalidLink: true,
    notExported: true
  }
}; 