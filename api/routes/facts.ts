// api/routes/facts.ts
import { RouterContext } from "../deps.ts";
import { connectToDatabase, getFactsCollection } from "../config/database.ts";
import { withPagination, withSorting } from "../middleware/pagination.ts";
import { cursorPagination } from "./utils.ts";

export async function getFactsWithCursor(ctx: RouterContext<string>) {
    const db = await connectToDatabase();
    const factsCollection = getFactsCollection(db);

    // Get query parameters
    const url = new URL(ctx.request.url);
    const entity = url.searchParams.get("entity");
    const concept = url.searchParams.get("concept");
    console.log(concept);
    const year = url.searchParams.get("year");
    const quarter = url.searchParams.get("quarter");
    const limit = parseInt(url.searchParams.get("limit") || "100");

    // Build query
    const query: any = {};

    if (entity) {
        query["dimensions.entity"] = { $regex: entity, $options: "i" };
    }

    if (concept) {
        query["dimensions.concept"] = { $regex: concept, $options: "i" };
    }

    if (year) {
        query["year"] = year;
    }

    if (quarter) {
        query["quarter"] = quarter;
    }

    // Process dimensional filters
    for (const [key, value] of url.searchParams.entries()) {
        if (["cursor", "direction", "limit", "entity", "concept", "year", "quarter"].includes(key)) {
            continue;
        } else if (key.startsWith("dim_")) {
            const dimensionName = key.substring(4);
            query[`dimensions.${dimensionName}`] = value;
        }
    }

    // Use cursor pagination
    const result = await cursorPagination(ctx, factsCollection, query, "factId", limit);

    ctx.response.body = result;
}

// Get facts with pagination and filtering, supporting dimensional filters
export const getFacts = withPagination(withSorting(async (ctx: RouterContext<string>) => {
    const db = await connectToDatabase();
    const factsCollection = getFactsCollection(db);

    // Get query parameters
    const url = new URL(ctx.request.url);

    // Build query
    const query: any = {};

    // Process all query parameters
    for (const [key, value] of url.searchParams.entries()) {
        // Skip pagination and sorting params
        if (["page", "limit", "sort", "order"].includes(key)) {
            continue;
        } else if (key === "entity") {
            query["dimensions.entity"] = { $regex: value, $options: "i" };
        } else if (key === "concept") {
            query["dimensions.concept"] = { $regex: value, $options: "i" };
        } else if (key === "period") {
            query["dimensions.period"] = { $regex: value, $options: "i" };
        } else if (key === "year") {
            query["year"] = value;
        } else if (key === "quarter") {
            query["quarter"] = value;
        } else if (key === "reportId") {
            query["reportId"] = value;
        } else if (key.startsWith("dim_")) {
            // Dynamic dimensional filters
            const dimensionName = key.substring(4); // Remove 'dim_' prefix
            query[`dimensions.${dimensionName}`] = value;
        }
    }

    // Get pagination and sorting from context state
    const { page, limit, skip } = ctx.state.pagination;
    const { field, direction } = ctx.state.sort;

    // Create sort object
    const sort: any = {};
    sort[field] = direction;

    // Execute query with pagination and sorting
    const facts = await factsCollection.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();

    // Get total count for pagination
    const total = await factsCollection.countDocuments(query);

    ctx.response.body = {
        data: facts,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        sort: {
            field,
            order: direction === 1 ? "asc" : "desc"
        }
    };
}));

// Get fact by ID
export async function getFactById(ctx: RouterContext<string>) {
    const db = await connectToDatabase();
    const factsCollection = getFactsCollection(db);

    const id = ctx.params.id;
    if (!id) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Fact ID is required" };
        return;
    }

    const fact = await factsCollection.findOne({ factId: id });

    if (!fact) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Fact not found" };
        return;
    }

    ctx.response.body = { data: fact };
}