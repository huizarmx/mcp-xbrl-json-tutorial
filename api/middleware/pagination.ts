// api/middleware/pagination.ts
import { RouterContext } from "../deps.ts";

// Pagination middleware
export function withPagination(handler: (ctx: RouterContext<string>) => Promise<void>) {
    return async (ctx: RouterContext<string>) => {
        // Get pagination parameters from query string
        const url = new URL(ctx.request.url);
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "100");

        // Add pagination info to context state
        ctx.state.pagination = {
            page: Math.max(1, page), // Ensure page is at least 1
            limit: Math.min(500, Math.max(1, limit)), // Limit between 1 and 500
            skip: (Math.max(1, page) - 1) * Math.min(500, Math.max(1, limit))
        };

        // Continue to the handler
        await handler(ctx);
    };
}

// Sort middleware
export function withSorting(handler: (ctx: RouterContext<string>) => Promise<void>) {
    return async (ctx: RouterContext<string>) => {
        // Get sort parameters from query string
        const url = new URL(ctx.request.url);
        const sortField = url.searchParams.get("sort") || "dimensions.concept";
        const sortDirection = url.searchParams.get("order")?.toLowerCase() === "desc" ? -1 : 1;

        // Add sort info to context state
        ctx.state.sort = {
            field: sortField,
            direction: sortDirection
        };

        // Continue to the handler
        await handler(ctx);
    };
}