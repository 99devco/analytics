/*

This file contains a minimal example of how to use the ESM modules and entry
point for testing via the `npm run-script dev` command.

It is NOT intended to be used as part of the actual 99dev analytics package.

*/

// Include our external dependencies!
import * as analytics from "./analytics";

analytics.init({
  uuid: "45cb85ab-1e27-4db4-b3e1-468e8a1e32fc",
  // navType: "hash",
  apiUrl: "http://localhost:3000",
});
analytics.watch();
