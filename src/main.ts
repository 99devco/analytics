// Include our external dependencies!
import * as nndev from "./analytics";

  nndev.init("some-uuid-goes-here", {nav_type:"hash"}).watch();
// OR
// nndev.init("some-uuid-goes-here", {nav_type:"hash"}).recordView();