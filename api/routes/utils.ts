// api/routes/utils.ts
import { RouterContext } from "../deps.ts";

// Function to enable cursor-based pagination
export async function cursorPagination(
    ctx: RouterContext<string>,
    collection: any,
    query: any,
    sortField: string = "_id",
    limit: number = 100
) {
    const url = new URL(ctx.request.url);
    const cursor = url.searchParams.get("cursor");
    const direction = url.searchParams.get("direction") || "next";

    // Build cursor query
    const cursorQuery = { ...query };
    if (cursor) {
        if (direction === "next") {
            cursorQuery[sortField] = { $gt: cursor };
        } else {
            cursorQuery[sortField] = { $lt: cursor };
        }
    }

    // Create sort object
    const sort: any = {};
    sort[sortField] = direction === "next" ? 1 : -1;

    // Execute query
    const results = await collection.find(cursorQuery)
        .sort(sort)
        .limit(limit + 1) // Fetch one extra to determine if there are more results
        .toArray();

    // Check if there are more results
    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;

    // Get next cursor
    const nextCursor = data.length > 0 ? data[data.length - 1][sortField] : null;

    return {
        data,
        pagination: {
            limit,
            hasMore,
            nextCursor,
            direction
        }
    };
}