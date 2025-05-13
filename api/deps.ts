// deps.ts
// This file manages all external dependencies for the application
// Using a deps.ts file is a Deno convention for centralizing dependencies

// Oak - Web framework (similar to Express for Node.js)
export {
    Application,
    Router,
    Context,
    Status,
    helpers,
    isHttpError,
} from "https://deno.land/x/oak@v12.6.1/mod.ts";
export type {
    Middleware,
    RouterContext,
    RouterMiddleware,
} from "https://deno.land/x/oak@v12.6.1/mod.ts";

// MongoDB driver - for connecting to FerretDB
export {
    MongoClient,
    ObjectId,
    Database,
    Collection,
} from "https://deno.land/x/mongo@v0.32.0/mod.ts";
export type {
    Document,
    Filter,
    FindOptions,
    InsertOptions,
    UpdateOptions,
} from "https://deno.land/x/mongo@v0.32.0/mod.ts";

// CORS middleware
export { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

// Environment variables
export { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

// Standard Deno modules
export {
    join,
    dirname,
    basename,
    extname,
    parse as parsePath,
} from "https://deno.land/std@0.207.0/path/mod.ts";
export {
    parse as parseDate,
    format as formatDate,
} from "https://deno.land/std@0.207.0/datetime/mod.ts";

// Logging
export * as log from "https://deno.land/std@0.207.0/log/mod.ts";
