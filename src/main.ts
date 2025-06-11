/*

This file contains a minimal example of how to use the ESM modules.
It is NOT intended to be used as part of the actual 99dev analytics package.

*/

// Include our external dependencies!
import { init, watch } from "./analytics";

init("some-uuid-goes-here", {nav_type:"hash"});
watch();