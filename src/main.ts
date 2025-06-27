/*

This file contains a minimal example of how to use the ESM modules and entry
point for testing via the `npm run-script dev` command.

It is NOT intended to be used as part of the actual 99dev analytics package.

*/

// Include our external dependencies!
import * as analytics from "./analytics";

analytics.init({
  uuid: "baac2fb6-25b2-4ea6-abc7-2619dc064ffa",
  navType: "history",
  apiUrl: "http://localhost:3000",
});
analytics.watch();
