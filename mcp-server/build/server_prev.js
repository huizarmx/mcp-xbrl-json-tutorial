// mcp/server.ts
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// API configuration
const API_BASE_URL = "http://deno-api:8000";
// Create MCP server
const server = new McpServer({
    name: "XBRL Financial Data Service",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
        prompts: {}
    },
});
// Fetch wrapper with error handling
async function fetchApi(endpoint, queryParams = new URLSearchParams()) {
    try {
        const url = `${API_BASE_URL}${endpoint}?${queryParams}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}
// Tool: Get Facts
server.tool("getFacts", {
    entity: z.string().optional(),
    concept: z.string().optional(),
    year: z.string().optional(),
    quarter: z.string().optional(),
    limit: z.number().optional(),
    dimensions: z.record(z.string()).optional()
}, async (params) => {
    const { entity, concept, year, quarter, limit, dimensions } = params;
    // Build query string
    const queryParams = new URLSearchParams();
    if (entity)
        queryParams.set("entity", entity);
    if (concept)
        queryParams.set("concept", concept);
    if (year)
        queryParams.set("year", year);
    if (quarter)
        queryParams.set("quarter", quarter);
    if (limit)
        queryParams.set("limit", limit.toString());
    // Add dimensional filters
    if (dimensions) {
        for (const [key, value] of Object.entries(dimensions)) {
            queryParams.set(`dim_${key}`, value);
        }
    }
    const result = await fetchApi("/api/facts", queryParams);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
});
// Tool: Get Fact by ID
server.tool("getFactById", {
    id: z.string()
}, async ({ id }) => {
    const result = await fetchApi(`/api/facts/${id}`);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
});
// Tool: Get Facts with Cursor Pagination
server.tool("getFactsWithCursor", {
    cursor: z.string().optional(),
    direction: z.enum(["next", "prev"]).optional(),
    limit: z.number().optional(),
    entity: z.string().optional(),
    concept: z.string().optional(),
    year: z.string().optional(),
    quarter: z.string().optional(),
    dimensions: z.record(z.string()).optional()
}, async (params) => {
    const { cursor, direction, limit, entity, concept, year, quarter, dimensions } = params;
    // Build query string
    const queryParams = new URLSearchParams();
    if (cursor)
        queryParams.set("cursor", cursor);
    if (direction)
        queryParams.set("direction", direction);
    if (limit)
        queryParams.set("limit", limit.toString());
    if (entity)
        queryParams.set("entity", entity);
    if (concept)
        queryParams.set("concept", concept);
    if (year)
        queryParams.set("year", year);
    if (quarter)
        queryParams.set("quarter", quarter);
    // Add dimensional filters
    if (dimensions) {
        for (const [key, value] of Object.entries(dimensions)) {
            queryParams.set(`dim_${key}`, value);
        }
    }
    const result = await fetchApi("/api/facts/cursor", queryParams);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
});
// Tool: Get Financial Metrics
server.tool("getFinancialMetrics", {
    entity: z.string(),
    year: z.string().optional(),
    quarter: z.string().optional()
}, async ({ entity, year, quarter }) => {
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("entity", entity);
    if (year)
        queryParams.set("year", year);
    if (quarter)
        queryParams.set("quarter", quarter);
    const result = await fetchApi("/api/finance/metrics", queryParams);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
});
// Tool: Get Financial Statement
server.tool("getFinancialStatement", {
    entity: z.string(),
    type: z.enum(["balanceSheet", "incomeStatement", "cashFlow"]).optional(),
    year: z.string().optional(),
    quarter: z.string().optional()
}, async ({ entity, type, year, quarter }) => {
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("entity", entity);
    if (type)
        queryParams.set("type", type);
    if (year)
        queryParams.set("year", year);
    if (quarter)
        queryParams.set("quarter", quarter);
    const result = await fetchApi("/api/finance/statement", queryParams);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
});
// Tool: Compare Entities
server.tool("compareEntities", {
    entities: z.union([z.string(), z.array(z.string())]),
    metrics: z.union([z.string(), z.array(z.string())]),
    year: z.string().optional(),
    quarter: z.string().optional()
}, async ({ entities, metrics, year, quarter }) => {
    // Process arrays vs strings
    const entitiesParam = Array.isArray(entities) ? entities.join(',') : entities;
    const metricsParam = Array.isArray(metrics) ? metrics.join(',') : metrics;
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("entities", entitiesParam);
    queryParams.set("metrics", metricsParam);
    if (year)
        queryParams.set("year", year);
    if (quarter)
        queryParams.set("quarter", quarter);
    const result = await fetchApi("/api/finance/compare", queryParams);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
});
// Tool: Get Financial Ratios
server.tool("getFinancialRatios", {
    entity: z.string(),
    year: z.string().optional(),
    quarter: z.string().optional()
}, async ({ entity, year, quarter }) => {
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("entity", entity);
    if (year)
        queryParams.set("year", year);
    if (quarter)
        queryParams.set("quarter", quarter);
    const result = await fetchApi("/api/finance/ratios", queryParams);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
});
// Tool: Get Trend Analysis
server.tool("getTrendAnalysis", {
    entity: z.string(),
    metrics: z.union([z.string(), z.array(z.string())]).optional(),
    periods: z.number().optional()
}, async ({ entity, metrics, periods }) => {
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("entity", entity);
    if (metrics) {
        const metricsParam = Array.isArray(metrics) ? metrics.join(',') : metrics;
        queryParams.set("metrics", metricsParam);
    }
    if (periods)
        queryParams.set("periods", periods.toString());
    const result = await fetchApi("/api/finance/trends", queryParams);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
});
// Tool: Get Concept by ID
server.tool("getConceptById", {
    id: z.string()
}, async ({ id }) => {
    const result = await fetchApi(`/api/concepts/${id}`);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
});
// Tool: Get Concept Labels
server.tool("getConceptLabels", {
    id: z.string(),
    lang: z.string().optional(),
    role: z.string().optional()
}, async ({ id, lang, role }) => {
    // Build query string
    const queryParams = new URLSearchParams();
    if (lang)
        queryParams.set("lang", lang);
    if (role)
        queryParams.set("role", role);
    const result = await fetchApi(`/api/concepts/${id}/labels`, queryParams);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
});
// Tool: Search Concepts
server.tool("searchConcepts", {
    text: z.string(),
    language: z.string().optional(),
    minSimilarity: z.number().optional()
}, async ({ text, language, minSimilarity }) => {
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("text", text);
    if (language)
        queryParams.set("lang", language);
    if (minSimilarity)
        queryParams.set("minSimilarity", minSimilarity.toString());
    const result = await fetchApi("/api/concepts/search/byLabel", queryParams);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
});
// Tool: Get Entities
server.tool("getEntities", {}, async () => {
    const result = await fetchApi("/api/entities");
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
});
// Tool: Get Entity by ID
server.tool("getEntityById", {
    id: z.string()
}, async ({ id }) => {
    const result = await fetchApi(`/api/entities/${id}`);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
});
// Resource: Available Entities
server.resource("entities", "xbrl://entities", async (uri) => {
    const result = await fetchApi("/api/entities");
    return {
        contents: [{
                uri: uri.href,
                text: JSON.stringify(result.data, null, 2)
            }]
    };
});
// Resource: Entity Information
server.resource("entity", new ResourceTemplate("xbrl://entity/{id}", {
    list: undefined
}), async (uri, { id }) => {
    const result = await fetchApi(`/api/entities/${id}`);
    return {
        contents: [{
                uri: uri.href,
                text: JSON.stringify(result.data, null, 2)
            }]
    };
});
// Resource: Financial Statement Structure
server.resource("statement-structure", new ResourceTemplate("xbrl://statements/{type}", {
    list: undefined
}), async (uri, { type }) => {
    let conceptList = [];
    switch (type) {
        case "balanceSheet":
            conceptList = [
                "ifrs-full:Assets",
                "ifrs-full:CurrentAssets",
                "ifrs-full:CashAndCashEquivalents",
                "ifrs-full:TradeAndOtherCurrentReceivables",
                "ifrs-full:Inventories",
                "ifrs-full:NoncurrentAssets",
                "ifrs-full:PropertyPlantAndEquipment",
                "ifrs-full:InvestmentProperty",
                "ifrs-full:Liabilities",
                "ifrs-full:CurrentLiabilities",
                "ifrs-full:TradeAndOtherCurrentPayables",
                "ifrs-full:NoncurrentLiabilities",
                "ifrs-full:NoncurrentBorrowings",
                "ifrs-full:Equity"
            ];
            break;
        case "incomeStatement":
            conceptList = [
                "ifrs-full:Revenue",
                "ifrs-full:CostOfSales",
                "ifrs-full:GrossProfit",
                "ifrs-full:OtherIncome",
                "ifrs-full:DistributionCosts",
                "ifrs-full:AdministrativeExpense",
                "ifrs-full:OtherExpense",
                "ifrs-full:ProfitLossFromOperatingActivities",
                "ifrs-full:FinanceIncome",
                "ifrs-full:FinanceCosts",
                "ifrs-full:ProfitLossBeforeTax",
                "ifrs-full:TaxExpense",
                "ifrs-full:ProfitLoss"
            ];
            break;
        case "cashFlow":
            conceptList = [
                "ifrs-full:CashFlowsFromUsedInOperatingActivities",
                "ifrs-full:ProfitLossAdjustedForNoncashItems",
                "ifrs-full:CashFlowsFromUsedInInvestingActivities",
                "ifrs-full:CashFlowsFromUsedInFinancingActivities",
                "ifrs-full:IncreaseDecreaseInCashAndCashEquivalents",
                "ifrs-full:CashAndCashEquivalentsAtBeginningOfPeriod",
                "ifrs-full:CashAndCashEquivalentsAtEndOfPeriod"
            ];
            break;
        default:
            throw new Error(`Unknown statement type: ${type}`);
    }
    // Get labels for these concepts
    const queryParams = new URLSearchParams();
    queryParams.set("lang", "en");
    const labelPromises = conceptList.map(async (concept) => {
        try {
            const result = await fetchApi(`/api/concepts/${concept}/labels`, queryParams);
            return {
                id: concept,
                labels: result.data
            };
        }
        catch (error) {
            return {
                id: concept,
                labels: []
            };
        }
    });
    const conceptsWithLabels = await Promise.all(labelPromises);
    return {
        contents: [{
                uri: uri.href,
                text: JSON.stringify(conceptsWithLabels, null, 2)
            }]
    };
});
// Resource: Common Financial Metrics
server.resource("financial-metrics", "xbrl://metrics", async (uri) => {
    const metrics = [
        {
            name: "Revenue",
            concept: "ifrs-full:Revenue",
            description: "Total income from sales and services",
            statement: "Income Statement"
        },
        {
            name: "Profit/Loss",
            concept: "ifrs-full:ProfitLoss",
            description: "Net profit or loss for the period",
            statement: "Income Statement"
        },
        {
            name: "Assets",
            concept: "ifrs-full:Assets",
            description: "Total resources owned or controlled by the entity",
            statement: "Balance Sheet"
        },
        {
            name: "Liabilities",
            concept: "ifrs-full:Liabilities",
            description: "Total obligations owed to third parties",
            statement: "Balance Sheet"
        },
        {
            name: "Equity",
            concept: "ifrs-full:Equity",
            description: "Total ownership interest in the entity",
            statement: "Balance Sheet"
        },
        {
            name: "Cash and Cash Equivalents",
            concept: "ifrs-full:CashAndCashEquivalents",
            description: "Liquid assets that can be readily converted to cash",
            statement: "Balance Sheet"
        },
        {
            name: "Operating Cash Flow",
            concept: "ifrs-full:CashFlowsFromUsedInOperatingActivities",
            description: "Cash generated from day-to-day business operations",
            statement: "Cash Flow Statement"
        }
    ];
    return {
        contents: [{
                uri: uri.href,
                text: JSON.stringify(metrics, null, 2)
            }]
    };
});
// Add these to our server.ts file
// Prompt: Analyze Entity Financials
server.prompt("analyzeEntityFinancials", {
    entity: z.string(),
    year: z.string(),
    quarter: z.string()
}, ({ entity, year, quarter }) => ({
    messages: [{
            role: "user",
            content: {
                type: "text",
                text: `Please analyze the financial performance of ${entity} for ${year} Q${quarter}. Include:
    1. Overview of key metrics
    2. Balance sheet analysis
    3. Profitability analysis
    4. Cash flow analysis
    5. Key financial ratios
    6. Strengths and potential concerns`
            }
        }]
}));
// Prompt: Compare Entities - Simplified
server.prompt("compareEntities", "Compare financial metrics between multiple entities for a specific year", () => ({
    messages: [{
            role: "user",
            content: {
                type: "text",
                text: `Please compare the [METRIC] for the following entities in [YEAR]:
    [ENTITY1, ENTITY2, ...]
    
    Include:
    1. Side-by-side comparison
    2. Percentage differences
    3. Key observations
    4. Which entity performs best on this metric and why`
            }
        }]
}));
// Prompt: Analyze Financial Trends - Simplified
server.prompt("analyzeFinancialTrends", "Analyze trends in a financial metric for a specific entity over time", () => ({
    messages: [{
            role: "user",
            content: {
                type: "text",
                text: `Please analyze the trends in [METRIC] for [ENTITY] over the last [N] quarters.
    
    Include:
    1. Quarterly values
    2. Quarter-over-quarter growth rates
    3. Visualization of the trend
    4. Analysis of seasonality or patterns
    5. Potential factors influencing changes`
            }
        }]
}));
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("XBRL Json MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
