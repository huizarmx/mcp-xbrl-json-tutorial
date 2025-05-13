// api/routes/entities.ts
import { RouterContext } from "../deps.ts";
import { connectToDatabase, getEntitiesCollection } from "../config/database.ts";

// Get all entities
export async function getEntities(ctx: RouterContext<string>) {
    const db = await connectToDatabase();
    const entitiesCollection = getEntitiesCollection(db);

    const entities = await entitiesCollection.find().toArray();

    ctx.response.body = {
        data: entities
    };
}

// Get entity by ID
export async function getEntityById(ctx: RouterContext<string>) {
    const db = await connectToDatabase();
    const entitiesCollection = getEntitiesCollection(db);

    const id = ctx.params.id;
    if (!id) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Entity ID is required" };
        return;
    }

    const entity = await entitiesCollection.findOne({ id: id });

    if (!entity) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Entity not found" };
        return;
    }

    ctx.response.body = { data: entity };
}