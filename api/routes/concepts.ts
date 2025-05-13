// api/routes/concepts.ts
import { RouterContext } from "../deps.ts";
import { connectToDatabase, getConceptsCollection, getLabelsCollection } from "../config/database.ts";

// Get concept by ID
export async function getConceptById(ctx: RouterContext<string>) {
    const db = await connectToDatabase();
    const conceptsCollection = getConceptsCollection(db);

    const id = ctx.params.id;
    if (!id) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Concept ID is required" };
        return;
    }

    const concept = await conceptsCollection.findOne({ id: id });

    if (!concept) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Concept not found" };
        return;
    }

    ctx.response.body = { data: concept };
}

// Get labels for a concept
export async function getConceptLabels(ctx: RouterContext<string>) {
    const db = await connectToDatabase();
    const labelsCollection = getLabelsCollection(db);

    const id = ctx.params.id;
    if (!id) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Concept ID is required" };
        return;
    }

    // Get query parameters
    const url = new URL(ctx.request.url);
    const lang = url.searchParams.get("lang");
    const role = url.searchParams.get("role");

    // Build query
    const query: any = { conceptId: id };

    if (lang) {
        query.lang = lang;
    }

    if (role) {
        query.role = role;
    }

    const labels = await labelsCollection.find(query).toArray();

    ctx.response.body = {
        data: labels,
        conceptId: id
    };
}

// Fuzzy search for concepts by label text
export async function searchConceptsByLabel(ctx: RouterContext<string>) {
    const db = await connectToDatabase();
    const labelsCollection = getLabelsCollection(db);

    // Get query parameters
    const url = new URL(ctx.request.url);
    const searchText = url.searchParams.get("text");
    const lang = url.searchParams.get("lang") || "en";
    const minSimilarity = parseFloat(url.searchParams.get("minSimilarity") || "0.6");

    if (!searchText) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Search text is required" };
        return;
    }

    // Get all labels for the specified language
    const query: any = { lang: lang };
    const labels = await labelsCollection.find(query).toArray();

    // Calculate similarity scores
    const results = labels.map(label => {
        const similarity = calculateSimilarity(searchText.toLowerCase(), label.lab.toLowerCase());
        return {
            conceptId: label.conceptId,
            label: label.lab,
            language: label.lang,
            role: label.role,
            similarity: similarity
        };
    });

    // Filter by minimum similarity and sort by similarity (descending)
    const filteredResults = results
        .filter(result => result.similarity >= minSimilarity)
        .sort((a, b) => b.similarity - a.similarity);

    ctx.response.body = {
        data: filteredResults,
        searchText: searchText,
        language: lang,
        count: filteredResults.length
    };
}

// Helper function to calculate string similarity (Levenshtein distance-based)
function calculateSimilarity(s1: string, s2: string): number {
    // Simple implementation of Levenshtein distance
    const track = Array(s2.length + 1).fill(null).map(() =>
        Array(s1.length + 1).fill(null));

    for (let i = 0; i <= s1.length; i += 1) {
        track[0][i] = i;
    }

    for (let j = 0; j <= s2.length; j += 1) {
        track[j][0] = j;
    }

    for (let j = 1; j <= s2.length; j += 1) {
        for (let i = 1; i <= s1.length; i += 1) {
            const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator, // substitution
            );
        }
    }

    const distance = track[s2.length][s1.length];
    const maxLength = Math.max(s1.length, s2.length);

    // Calculate similarity as 1 - normalized distance
    return 1 - distance / maxLength;
}