// api/config/database.ts
import { MongoClient, config } from "../deps.ts";

// Load environment variables
const env = config();

// Database configuration
const MONGO_URI = env.MONGO_URI || "mongodb://ferretdb:ferretdb_password@ferretdb:27017/postgres";
const DB_NAME = env.DB_NAME || "xbrl_financial_data";

// Database client instance
let db: any;

export async function connectToDatabase() {
    if (db) return db;

    const client = new MongoClient();

    try {
        await client.connect(MONGO_URI);
        console.log("Connected to FerretDB");

        db = client.database(DB_NAME);
        return db;
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
}

// Get collection references
export function getFactsCollection(database: any) {
    return database.collection("facts");
}

export function getConceptsCollection(database: any) {
    return database.collection("concepts");
}

export function getLabelsCollection(database: any) {
    return database.collection("labels");
}

export function getEntitiesCollection(database: any) {
    return database.collection("entities");
}

export function getReportsCollection(database: any) {
    return database.collection("reports");
}