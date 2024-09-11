import { createRouteHandler } from "uploadthing/next";
 
import { kmlFileRouter } from "./core";
 
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: kmlFileRouter,
 
  // Apply an (optional) custom config:
  // config: { ... },
});