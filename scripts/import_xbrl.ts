// scripts/import_xbrl.ts
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

// Configuration
const MONGO_URI = "mongodb://ferretdb:ferretdb_password@ferretdb:27017/postgres";
const DB_NAME = "xbrl_financial_data";
const FACTS_FILE = "/app/data/all_facts.json";
const CONCEPTS_FILE = "/app/data/concepts_array.json";
const LABELS_FILE = "/app/data/labels_array.json";

// Connect to FerretDB
const client = new MongoClient();
try {
    await client.connect(MONGO_URI);
    console.log("Connected to FerretDB");

    const db = client.database(DB_NAME);

    // Get collection references
    const factsCollection = db.collection("facts");
    const conceptsCollection = db.collection("concepts");
    const entitiesCollection = db.collection("entities");
    const labelsCollection = db.collection("labels");
    const reportsCollection = db.collection("reports");

    console.log("Starting data import...");

    // Load and import data
    await importFacts(factsCollection);
    await importConcepts(conceptsCollection);
    await importLabels(labelsCollection);
    await extractEntities(factsCollection, entitiesCollection);
    await createReports(factsCollection, reportsCollection);

    console.log("Data import completed successfully");

    // After import, verify data
    await verifyDataIntegrity(db);

    console.log("Data import completed successfully");
} catch (error) {
    console.error("Error during import:", error);
} finally {
    await client.close();
    console.log("Database connection closed");
}

// Preprocess facts before insertion
async function preprocessFacts(facts) {
    return facts.map(fact => {
        // Normalize numeric values
        if (fact.decimals !== undefined) {
            // Convert string values to numbers
            fact.numericValue = parseFloat(fact.value);

            // Add normalized value based on decimals
            if (fact.decimals !== null) {
                const scale = Math.pow(10, fact.decimals);
                fact.normalizedValue = Math.round(fact.numericValue * scale) / scale;
            }
        }

        // Normalize periods to ISO dates
        if (fact.dimensions?.period) {
            fact.dimensions.periodType = fact.dimensions.period.includes('/') ? 'duration' : 'instant';

            // Extract start and end dates for duration periods
            if (fact.dimensions.periodType === 'duration') {
                const [startDate, endDate] = fact.dimensions.period.split('/');
                fact.dimensions.startDate = startDate;
                fact.dimensions.endDate = endDate;
            } else {
                fact.dimensions.pointDate = fact.dimensions.period;
            }
        }

        // Extract report metadata
        if (fact.reportId) {
            const [entity, year, quarter] = fact.reportId.split('_');
            fact.reportEntity = entity;
            fact.reportYear = year;
            fact.reportQuarter = quarter;
        }

        return fact;
    });
}

// Import facts from all_facts.json
async function importFacts(collection) {
    console.log("Importing facts...");

    const factData = JSON.parse(await Deno.readTextFile(FACTS_FILE));
    const processedFacts = await preprocessFacts(factData);

    // Process data in batches
    const batchSize = 1000;
    for (let i = 0; i < processedFacts.length; i += batchSize) {
        const batch = processedFacts.slice(i, i + batchSize);
        await collection.insertMany(batch);
        console.log(`Imported ${i + batch.length} of ${processedFacts.length} facts`);
    }

    console.log("Facts import completed");
}

// Extract and create report records
async function createReports(factsCollection, reportsCollection) {
    console.log("Creating report records...");

    // Find unique reports by reportId
    const reports = await factsCollection.aggregate([
        { $match: { reportId: { $exists: true } } },
        {
            $group: {
                _id: "$reportId",
                entity: { $first: "$dimensions.entity" },
                year: { $first: "$year" },
                quarter: { $first: "$quarter" },
                facts: { $push: "$$ROOT" }
            }
        }
    ]).toArray();

    // Process each report
    for (const report of reports) {
        // Find period boundaries
        const periodFacts = report.facts.filter(f => f.dimensions?.period);
        const periods = periodFacts.map(f => f.dimensions.period);

        // Extract start and end dates
        let startDate = null;
        let endDate = null;

        for (const period of periods) {
            if (period.includes('/')) {
                const [start, end] = period.split('/');
                if (!startDate || start < startDate) startDate = start;
                if (!endDate || end > endDate) endDate = end;
            }
        }

        // Find currency
        const currencyFact = report.facts.find(f =>
            f.dimensions.concept === "ifrs-full:DescriptionOfPresentationCurrency");
        const currency = currencyFact ? currencyFact.value : null;

        // Create report object
        const reportDoc = {
            reportId: report._id,
            entity: report.entity,
            year: report.year,
            quarter: report.quarter,
            startDate: startDate,
            endDate: endDate,
            currency: currency,
            factCount: report.facts.length
        };

        // Insert or update report
        await reportsCollection.updateOne(
            { reportId: report._id },
            { $set: reportDoc },
            { upsert: true }
        );
    }

    console.log("Report creation completed");
}

// Import concepts from concepts_array.json
async function importConcepts(collection) {
    console.log("Importing concepts...");

    const conceptData = JSON.parse(await Deno.readTextFile(CONCEPTS_FILE));

    // Add unique IDs to avoid conflicts and process in batches
    const batchSize = 500;
    for (let i = 0; i < conceptData.length; i += batchSize) {
        const batch = conceptData.slice(i, i + batchSize);
        await collection.insertMany(batch);
        console.log(`Imported ${i + batch.length} of ${conceptData.length} concepts`);
    }

    console.log("Concepts import completed");
}

// Import labels from labels_array.json
async function importLabels(collection) {
    console.log("Importing labels...");

    const labelData = JSON.parse(await Deno.readTextFile(LABELS_FILE));

    // Process in batches
    const batchSize = 500;
    for (let i = 0; i < labelData.length; i += batchSize) {
        const batch = labelData.slice(i, i + batchSize);
        await collection.insertMany(batch);
        console.log(`Imported ${i + batch.length} of ${labelData.length} labels`);
    }

    console.log("Labels import completed");
}

// Extract and create entity records from facts
async function extractEntities(factsCollection, entitiesCollection) {
    console.log("Extracting entities...");

    // Find unique entities in the facts collection
    const entityFacts = await factsCollection.aggregate([
        {
            $match: {
                "dimensions.entity": { $exists: true },
                "dimensions.concept": {
                    $in: [
                        "ifrs-full:NameOfReportingEntityOrOtherMeansOfIdentification",
                        "ifrs-full:DescriptionOfNatureOfFinancialStatements",
                        "ifrs_mx-cor_20141205:TipoDeEmisora",
                        "ifrs_mx-cor_20141205:Consolidado"
                    ]
                }
            }
        },
        { $group: { _id: "$dimensions.entity", facts: { $push: "$$ROOT" } } }
    ]).toArray();

    // Process each entity
    for (const entityGroup of entityFacts) {
        const entityId = entityGroup._id;
        const entityFacts = entityGroup.facts;

        // Create entity object
        const entity = {
            id: entityId,
            name: findFactValue(entityFacts, "ifrs-full:NameOfReportingEntityOrOtherMeansOfIdentification"),
            description: findFactValue(entityFacts, "ifrs-full:DescriptionOfNatureOfFinancialStatements"),
            sector: findFactValue(entityFacts, "ifrs_mx-cor_20141205:TipoDeEmisora"),
            consolidated: findFactValue(entityFacts, "ifrs_mx-cor_20141205:Consolidado") === "true"
        };

        // Insert or update entity
        await entitiesCollection.updateOne(
            { id: entityId },
            { $set: entity },
            { upsert: true }
        );
    }

    console.log("Entity extraction completed");
}

// Helper to find a specific fact value from an array of facts
function findFactValue(facts, conceptId) {
    const fact = facts.find(f => f.dimensions.concept === conceptId);
    return fact ? fact.value : null;
}

async function verifyDataIntegrity(db) {
    console.log("Verifying data integrity...");

    // Check counts in each collection
    const factCount = await db.collection("facts").countDocuments();
    const conceptCount = await db.collection("concepts").countDocuments();
    const entityCount = await db.collection("entities").countDocuments();
    const labelCount = await db.collection("labels").countDocuments();
    const reportCount = await db.collection("reports").countDocuments();

    console.log(`Facts: ${factCount}`);
    console.log(`Concepts: ${conceptCount}`);
    console.log(`Entities: ${entityCount}`);
    console.log(`Labels: ${labelCount}`);
    console.log(`Reports: ${reportCount}`);

    // Check for orphaned facts (facts with no matching concept)
    const factsWithConcepts = await db.collection("facts").aggregate([
        {
            $lookup: {
                from: "concepts",
                localField: "dimensions.concept",
                foreignField: "id",
                as: "conceptMatch"
            }
        },
        { $match: { conceptMatch: { $size: 0 } } },
        { $count: "orphanedFacts" }
    ]).toArray();

    const orphanedFacts = factsWithConcepts.length > 0 ? factsWithConcepts[0].orphanedFacts : 0;
    console.log(`Orphaned facts: ${orphanedFacts}`);

    // Verify entities have necessary fields
    const incompleteEntities = await db.collection("entities").countDocuments({
        $or: [
            { name: null },
            { name: { $exists: false } }
        ]
    });

    console.log(`Incomplete entities: ${incompleteEntities}`);

    console.log("Data verification completed");
}