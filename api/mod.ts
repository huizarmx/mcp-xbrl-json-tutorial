// api/mod.ts
import { Application, Router, oakCors } from "./deps.ts";
import { getFacts, getFactById, getFactsWithCursor } from "./routes/facts.ts";
import { getEntities, getEntityById } from "./routes/entities.ts";
import { getFinancialMetrics, compareEntities, getFinancialStatement, calculateFinancialRatios, getTrendAnalysis } from "./routes/finance.ts";
import { getConceptById, getConceptLabels, searchConceptsByLabel } from "./routes/concepts.ts";
const app = new Application();
const router = new Router();

// Configure middleware
app.use(oakCors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })); // Allow CORS
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        console.error("Error handling request:", error);
        ctx.response.status = 500;
        ctx.response.body = { error: "Internal server error" };
    }
});

// Log requests
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.request.method} ${ctx.request.url.pathname} - ${ms}ms`);
});

// Define routes
router
    .get("/api/facts", getFacts)
    .get("/api/facts/cursor", getFactsWithCursor)
    .get("/api/facts/:id", getFactById)
    .get("/api/entities", getEntities)
    .get("/api/entities/:id", getEntityById)
    .get("/api/finance/metrics", getFinancialMetrics)
    .get("/api/finance/compare", compareEntities)
    .get("/api/finance/statement", getFinancialStatement)
    .get("/api/finance/ratios", calculateFinancialRatios)
    .get("/api/finance/trends", getTrendAnalysis)
    .get("/api/concepts/:id", getConceptById)
    .get("/api/concepts/:id/labels", getConceptLabels)
    .get("/api/concepts/search/byLabel", searchConceptsByLabel);

// Register router
app.use(router.routes());
app.use(router.allowedMethods());

// 404 handler
app.use((ctx) => {
    ctx.response.status = 404;
    ctx.response.body = { error: "Not found" };
});

// Start server
const port = Deno.env.get("PORT") || "8000";
console.log(`XBRL API server running on http://localhost:${port}`);

await app.listen({ port: parseInt(port) });