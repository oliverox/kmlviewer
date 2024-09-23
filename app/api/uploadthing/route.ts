import { createRouteHandler } from "uploadthing/server";
 
import { kmlFileRouter } from "./core";
 
// Export routes for Next App Router
const handler = createRouteHandler({
  router: kmlFileRouter,
  config: { 
    logLevel: 'All'
   },
});
export { handler as GET, handler as POST };