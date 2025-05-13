#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

// API configuration
const API_BASE_URL = process.env.API_BASE_URL || "http://host.docker.internal:8000";

// Type definitions
interface ApiResponse {
    data: any;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Helper functions
async function fetchApi(endpoint: string, queryParams: URLSearchParams = new URLSearchParams()) {
    try {
        const url = `${API_BASE_URL}${endpoint}?${queryParams}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        return await response.json() as ApiResponse;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

// Tool definitions
const GET_FACTS_TOOL: Tool = {
    name: "xbrl_getFacts",
    description: "Get XBRL facts with filtering options",
    inputSchema: {
        type: "object",
        properties: {
            entity: {
                type: "string",
                description: "Entity identifier (e.g., FUNO, FSHOP, SOMA)"
            },
            concept: {
                type: "string",
                description: "XBRL concept identifier"
            },
            year: {
                type: "string",
                description: "Reporting year"
            },
            quarter: {
                type: "string",
                description: "Reporting quarter"
            },
            limit: {
                type: "number",
                description: "Maximum number of facts to return"
            },
            dimensions: {
                type: "object",
                description: "Additional dimensional filters"
            }
        }
    }
};

const GET_FACT_BY_ID_TOOL: Tool = {
    name: "xbrl_getFactById",
    description: "Get a specific XBRL fact by ID",
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "The fact ID to retrieve"
            }
        },
        required: ["id"]
    }
};

const GET_FACTS_WITH_CURSOR_TOOL: Tool = {
    name: "xbrl_getFactsWithCursor",
    description: "Get XBRL facts with cursor-based pagination",
    inputSchema: {
        type: "object",
        properties: {
            cursor: {
                type: "string",
                description: "Cursor for pagination"
            },
            direction: {
                type: "string",
                enum: ["next", "prev"],
                description: "Direction of pagination"
            },
            limit: {
                type: "number",
                description: "Maximum number of facts to return"
            },
            entity: {
                type: "string",
                description: "Entity identifier"
            },
            concept: {
                type: "string",
                description: "XBRL concept identifier"
            },
            year: {
                type: "string",
                description: "Reporting year"
            },
            quarter: {
                type: "string",
                description: "Reporting quarter"
            },
            dimensions: {
                type: "object",
                description: "Additional dimensional filters"
            }
        }
    }
};

const GET_FINANCIAL_METRICS_TOOL: Tool = {
    name: "xbrl_getFinancialMetrics",
    description: "Get key financial metrics for an entity",
    inputSchema: {
        type: "object",
        properties: {
            entity: {
                type: "string",
                description: "Entity identifier"
            },
            year: {
                type: "string",
                description: "Reporting year"
            },
            quarter: {
                type: "string",
                description: "Reporting quarter"
            }
        },
        required: ["entity"]
    }
};

const GET_FINANCIAL_STATEMENT_TOOL: Tool = {
    name: "xbrl_getFinancialStatement",
    description: "Get a specific financial statement for an entity",
    inputSchema: {
        type: "object",
        properties: {
            entity: {
                type: "string",
                description: "Entity identifier"
            },
            type: {
                type: "string",
                enum: ["balanceSheet", "incomeStatement", "cashFlow"],
                description: "Statement type"
            },
            year: {
                type: "string",
                description: "Reporting year"
            },
            quarter: {
                type: "string",
                description: "Reporting quarter"
            }
        },
        required: ["entity"]
    }
};

const COMPARE_ENTITIES_TOOL: Tool = {
    name: "xbrl_compareEntities",
    description: "Compare financial metrics across multiple entities",
    inputSchema: {
        type: "object",
        properties: {
            entities: {
                oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } }
                ],
                description: "Entity identifiers, comma-separated or as an array"
            },
            metrics: {
                oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } }
                ],
                description: "XBRL concept identifiers, comma-separated or as an array"
            },
            year: {
                type: "string",
                description: "Reporting year"
            },
            quarter: {
                type: "string",
                description: "Reporting quarter"
            }
        },
        required: ["entities", "metrics"]
    }
};

const GET_FINANCIAL_RATIOS_TOOL: Tool = {
    name: "xbrl_getFinancialRatios",
    description: "Calculate financial ratios for an entity",
    inputSchema: {
        type: "object",
        properties: {
            entity: {
                type: "string",
                description: "Entity identifier"
            },
            year: {
                type: "string",
                description: "Reporting year"
            },
            quarter: {
                type: "string",
                description: "Reporting quarter"
            }
        },
        required: ["entity"]
    }
};

const GET_TREND_ANALYSIS_TOOL: Tool = {
    name: "xbrl_getTrendAnalysis",
    description: "Analyze trends in financial metrics over time",
    inputSchema: {
        type: "object",
        properties: {
            entity: {
                type: "string",
                description: "Entity identifier"
            },
            metrics: {
                oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } }
                ],
                description: "XBRL concept identifiers, comma-separated or as an array"
            },
            periods: {
                type: "number",
                description: "Number of periods to include"
            }
        },
        required: ["entity"]
    }
};

const GET_CONCEPT_BY_ID_TOOL: Tool = {
    name: "xbrl_getConceptById",
    description: "Get XBRL concept information by ID",
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "Concept identifier"
            }
        },
        required: ["id"]
    }
};

const GET_CONCEPT_LABELS_TOOL: Tool = {
    name: "xbrl_getConceptLabels",
    description: "Get labels for an XBRL concept",
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "Concept identifier"
            },
            lang: {
                type: "string",
                description: "Language code (e.g., 'en', 'es')"
            },
            role: {
                type: "string",
                description: "Label role"
            }
        },
        required: ["id"]
    }
};

const SEARCH_CONCEPTS_TOOL: Tool = {
    name: "xbrl_searchConcepts",
    description: "Search for XBRL concepts by label text",
    inputSchema: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "Search text"
            },
            language: {
                type: "string",
                description: "Language code (e.g., 'en', 'es')"
            },
            minSimilarity: {
                type: "number",
                description: "Minimum similarity score (0-1)"
            }
        },
        required: ["text"]
    }
};

const GET_ENTITIES_TOOL: Tool = {
    name: "xbrl_getEntities",
    description: "Get all available entities",
    inputSchema: {
        type: "object",
        properties: {}
    }
};

const GET_ENTITY_BY_ID_TOOL: Tool = {
    name: "xbrl_getEntityById",
    description: "Get entity information by ID",
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "Entity identifier"
            }
        },
        required: ["id"]
    }
};

const XBRL_TOOLS = [
    GET_FACTS_TOOL,
    GET_FACT_BY_ID_TOOL,
    GET_FACTS_WITH_CURSOR_TOOL,
    GET_FINANCIAL_METRICS_TOOL,
    GET_FINANCIAL_STATEMENT_TOOL,
    COMPARE_ENTITIES_TOOL,
    GET_FINANCIAL_RATIOS_TOOL,
    GET_TREND_ANALYSIS_TOOL,
    GET_CONCEPT_BY_ID_TOOL,
    GET_CONCEPT_LABELS_TOOL,
    SEARCH_CONCEPTS_TOOL,
    GET_ENTITIES_TOOL,
    GET_ENTITY_BY_ID_TOOL
] as const;

// API handlers
async function handleGetFacts(params: any) {
    const { entity, concept, year, quarter, limit, dimensions } = params;

    // Build query string
    const queryParams = new URLSearchParams();
    if (entity) queryParams.set("entity", entity);
    if (concept) queryParams.set("concept", concept);
    if (year) queryParams.set("year", year);
    if (quarter) queryParams.set("quarter", quarter);
    if (limit) queryParams.set("limit", limit.toString());

    // Add dimensional filters
    if (dimensions) {
        for (const [key, value] of Object.entries(dimensions)) {
            queryParams.set(`dim_${key}`, value as string);
        }
    }

    try {
        const result = await fetchApi("/api/facts", queryParams);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error getting facts: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
        };
    }
}

async function handleGetFactById(id: string) {
    try {
        const result = await fetchApi(`/api/facts/${id}`);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error getting fact by ID: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
        };
    }
}

async function handleGetFactsWithCursor(params: any) {
    const { cursor, direction, limit, entity, concept, year, quarter, dimensions } = params;

    // Build query string
    const queryParams = new URLSearchParams();
    if (cursor) queryParams.set("cursor", cursor);
    if (direction) queryParams.set("direction", direction);
    if (limit) queryParams.set("limit", limit.toString());
    if (entity) queryParams.set("entity", entity);
    if (concept) queryParams.set("concept", concept);
    if (year) queryParams.set("year", year);
    if (quarter) queryParams.set("quarter", quarter);

    // Add dimensional filters
    if (dimensions) {
        for (const [key, value] of Object.entries(dimensions)) {
            queryParams.set(`dim_${key}`, value as string);
        }
    }

    try {
        const result = await fetchApi("/api/facts/cursor", queryParams);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error getting facts with cursor: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
        };
    }
}

async function handleGetFinancialMetrics(entity: string, year?: string, quarter?: string) {
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("entity", entity);
    if (year) queryParams.set("year", year);
    if (quarter) queryParams.set("quarter", quarter);

    try {
        const result = await fetchApi("/api/finance/metrics", queryParams);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error getting financial metrics: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
        };
    }
}

async function handleGetFinancialStatement(entity: string, type?: string, year?: string, quarter?: string) {
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("entity", entity);
    if (type) queryParams.set("type", type);
    if (year) queryParams.set("year", year);
    if (quarter) queryParams.set("quarter", quarter);

    try {
        const result = await fetchApi("/api/finance/statement", queryParams);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error getting financial statement: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
        };
    }
}

async function handleCompareEntities(params: any) {
    const { entities, metrics, year, quarter } = params;

    // Process arrays vs strings
    const entitiesParam = Array.isArray(entities) ? entities.join(',') : entities;
    const metricsParam = Array.isArray(metrics) ? metrics.join(',') : metrics;

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("entities", entitiesParam);
    queryParams.set("metrics", metricsParam);
    if (year) queryParams.set("year", year);
    if (quarter) queryParams.set("quarter", quarter);

    try {
        const result = await fetchApi("/api/finance/compare", queryParams);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error comparing entities: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
        };
    }
}

async function handleGetFinancialRatios(entity: string, year?: string, quarter?: string) {
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("entity", entity);
    if (year) queryParams.set("year", year);
    if (quarter) queryParams.set("quarter", quarter);

    try {
        const result = await fetchApi("/api/finance/ratios", queryParams);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error getting financial ratios: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
        };
    }
}

async function handleGetTrendAnalysis(entity: string, metrics?: string | string[], periods?: number) {
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("entity", entity);

    if (metrics) {
        const metricsParam = Array.isArray(metrics) ? metrics.join(',') : metrics;
        queryParams.set("metrics", metricsParam);
    }

    if (periods) queryParams.set("periods", periods.toString());

    try {
        const result = await fetchApi("/api/finance/trends", queryParams);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error getting trend analysis: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
        };
    }
}

async function handleGetConceptById(id: string) {
    try {
        const result = await fetchApi(`/api/concepts/${id}`);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error getting concept by ID: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
        };
    }
}

async function handleGetConceptLabels(id: string, lang?: string, role?: string) {
    // Build query string
    const queryParams = new URLSearchParams();
    if (lang) queryParams.set("lang", lang);
    if (role) queryParams.set("role", role);

    try {
        const result = await fetchApi(`/api/concepts/${id}/labels`, queryParams);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error getting concept labels: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
        };
    }
}

async function handleSearchConcepts(text: string, language?: string, minSimilarity?: number) {
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.set("text", text);
    if (language) queryParams.set("lang", language);
    if (minSimilarity) queryParams.set("minSimilarity", minSimilarity.toString());

    try {
        const result = await fetchApi("/api/concepts/search/byLabel", queryParams);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error searching concepts: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
        };
    }
}

async function handleGetEntities() {
    try {
        const result = await fetchApi("/api/entities");
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error getting entities: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
        };
    }
}

async function handleGetEntityById(id: string) {
    try {
        const result = await fetchApi(`/api/entities/${id}`);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false
        };
    } catch (error) {
        return {
            content: [{ type: "text", text: `Error getting entity by ID: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
        };
    }
}

// Server setup
const server = new Server(
    {
        name: "xbrl-financial-data-service",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    },
);

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: XBRL_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        switch (request.params.name) {
            case "xbrl_getFacts": {
                return await handleGetFacts(request.params.arguments);
            }

            case "xbrl_getFactById": {
                const { id } = request.params.arguments as { id: string };
                return await handleGetFactById(id);
            }

            case "xbrl_getFactsWithCursor": {
                return await handleGetFactsWithCursor(request.params.arguments);
            }

            case "xbrl_getFinancialMetrics": {
                const { entity, year, quarter } = request.params.arguments as {
                    entity: string;
                    year?: string;
                    quarter?: string;
                };
                return await handleGetFinancialMetrics(entity, year, quarter);
            }

            case "xbrl_getFinancialStatement": {
                const { entity, type, year, quarter } = request.params.arguments as {
                    entity: string;
                    type?: string;
                    year?: string;
                    quarter?: string;
                };
                return await handleGetFinancialStatement(entity, type, year, quarter);
            }

            case "xbrl_compareEntities": {
                return await handleCompareEntities(request.params.arguments);
            }

            case "xbrl_getFinancialRatios": {
                const { entity, year, quarter } = request.params.arguments as {
                    entity: string;
                    year?: string;
                    quarter?: string;
                };
                return await handleGetFinancialRatios(entity, year, quarter);
            }

            case "xbrl_getTrendAnalysis": {
                const { entity, metrics, periods } = request.params.arguments as {
                    entity: string;
                    metrics?: string | string[];
                    periods?: number;
                };
                return await handleGetTrendAnalysis(entity, metrics, periods);
            }

            case "xbrl_getConceptById": {
                const { id } = request.params.arguments as { id: string };
                return await handleGetConceptById(id);
            }

            case "xbrl_getConceptLabels": {
                const { id, lang, role } = request.params.arguments as {
                    id: string;
                    lang?: string;
                    role?: string;
                };
                return await handleGetConceptLabels(id, lang, role);
            }

            case "xbrl_searchConcepts": {
                const { text, language, minSimilarity } = request.params.arguments as {
                    text: string;
                    language?: string;
                    minSimilarity?: number;
                };
                return await handleSearchConcepts(text, language, minSimilarity);
            }

            case "xbrl_getEntities": {
                return await handleGetEntities();
            }

            case "xbrl_getEntityById": {
                const { id } = request.params.arguments as { id: string };
                return await handleGetEntityById(id);
            }

            default:
                return {
                    content: [{
                        type: "text",
                        text: `Unknown tool: ${request.params.name}`
                    }],
                    isError: true
                };
        }
    } catch (error) {
        return {
            content: [{
                type: "text",
                text: `Error: ${error instanceof Error ? error.message : String(error)}`
            }],
            isError: true
        };
    }
});

async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("XBRL Financial Data MCP Server running on stdio");
}

runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});