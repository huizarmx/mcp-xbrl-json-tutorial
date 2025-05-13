// api/test_api.ts
const BASE_URL = "http://localhost:8000";

// Helper function to log test results
function logTest(name: string, success: boolean, details?: any) {
    console.log(`${success ? "✅" : "❌"} ${name}`);
    if (details) {
        console.log(JSON.stringify(details, null, 2));
    }
    console.log("-".repeat(50));
}

// Test getting entities
async function testGetEntities() {
    console.log("Testing GET /api/entities");

    try {
        const response = await fetch(`${BASE_URL}/api/entities`);
        const data = await response.json();

        logTest(
            "Get Entities",
            response.status === 200 && Array.isArray(data.data),
            { status: response.status, count: data.data.length }
        );

        return data;
    } catch (error) {
        logTest("Get Entities", false, { error: error.message });
        return null;
    }
}

// Test getting entity by ID
async function testGetEntityById(id: string) {
    console.log(`Testing GET /api/entities/${id}`);

    try {
        const response = await fetch(`${BASE_URL}/api/entities/${id}`);
        const data = await response.json();

        logTest(
            `Get Entity by ID (${id})`,
            response.status === 200 && data.data !== null,
            { status: response.status, entity: data.data ? data.data.id : null }
        );

        return data;
    } catch (error) {
        logTest(`Get Entity by ID (${id})`, false, { error: error.message });
        return null;
    }
}

// Test getting facts with pagination
async function testGetFactsWithPagination() {
    console.log("Testing GET /api/facts with pagination");

    try {
        const response = await fetch(`${BASE_URL}/api/facts?page=1&limit=10`);
        const data = await response.json();

        logTest(
            "Get Facts with Pagination",
            response.status === 200 &&
            data.pagination &&
            data.pagination.page === 1 &&
            data.pagination.limit === 10,
            {
                status: response.status,
                count: data.data.length,
                pagination: data.pagination
            }
        );

        return data;
    } catch (error) {
        logTest("Get Facts with Pagination", false, { error: error.message });
        return null;
    }
}

// Test getting facts with sorting
async function testGetFactsWithSorting() {
    console.log("Testing GET /api/facts with sorting");

    try {
        const response = await fetch(`${BASE_URL}/api/facts?concept=ifrs_mx-cor_20160822_InterestRate&sort=year&order=desc&limit=5`);
        const data = await response.json();

        // Verify sorting by checking if years are in descending order
        let sortedCorrectly = true;
        for (let i = 1; i < data.data.length; i++) {
            if (data.data[i - 1].year < data.data[i].year) {
                sortedCorrectly = false;
                break;
            }
        }

        logTest(
            "Get Facts with Sorting",
            response.status === 200 && sortedCorrectly,
            {
                status: response.status,
                sort: data.sort,
                sampleYears: data.data.slice(0, 3).map((fact: any) => fact.year)
            }
        );

        return data;
    } catch (error) {
        logTest("Get Facts with Sorting", false, { error: error.message });
        return null;
    }
}

// Test getting facts with dimensional filtering
async function testGetFactsWithDimensions() {
    console.log("Testing GET /api/facts with dimensional filters");

    try {
        const response = await fetch(
            `${BASE_URL}/api/facts?entity=SOMA&dim_ifrs_mx-cor_20160822:TypesOfLiabilitiesAxis=ifrs_mx-cor_20160822:TotalBankingMember`
        );
        const data = await response.json();

        const hasDimension = data.data.length > 0 &&
            data.data.every((fact: any) =>
                fact.dimensions["ifrs_mx-cor_20160822:TypesOfLiabilitiesAxis"] ===
                "ifrs_mx-cor_20160822:TotalBankingMember"
            );

        logTest(
            "Get Facts with Dimensional Filtering",
            response.status === 200 && hasDimension,
            {
                status: response.status,
                count: data.data.length,
                sample: data.data.length > 0 ? data.data[0].dimensions : null
            }
        );

        return data;
    } catch (error) {
        logTest("Get Facts with Dimensional Filtering", false, { error: error.message });
        return null;
    }
}

// Test getting facts with cursor pagination
async function testGetFactsWithCursor() {
    console.log("Testing GET /api/facts/cursor");

    try {
        // First request without cursor
        const response1 = await fetch(`${BASE_URL}/api/facts/cursor?limit=5`);
        const data1 = await response1.json();

        if (!data1.pagination.nextCursor) {
            logTest("Get Facts with Cursor Pagination", false, {
                error: "No cursor returned in first request"
            });
            return null;
        }

        // Second request with cursor
        const response2 = await fetch(
            `${BASE_URL}/api/facts/cursor?limit=5&cursor=${data1.pagination.nextCursor}`
        );
        const data2 = await response2.json();

        // Check that we got different data sets
        const firstIds = data1.data.map((fact: any) => fact.factId);
        const secondIds = data2.data.map((fact: any) => fact.factId);
        const uniqueIds = new Set([...firstIds, ...secondIds]);

        logTest(
            "Get Facts with Cursor Pagination",
            response1.status === 200 && response2.status === 200 && uniqueIds.size === (firstIds.length + secondIds.length),
            {
                firstRequest: { status: response1.status, count: data1.data.length },
                secondRequest: { status: response2.status, count: data2.data.length },
                uniqueResults: uniqueIds.size === (firstIds.length + secondIds.length)
            }
        );

        return { first: data1, second: data2 };
    } catch (error) {
        logTest("Get Facts with Cursor Pagination", false, { error: error.message });
        return null;
    }
}

// Test getting concept by ID
async function testGetConceptById(conceptId: string) {
    console.log(`Testing GET /api/concepts/${conceptId}`);

    try {
        const response = await fetch(`${BASE_URL}/api/concepts/${conceptId}`);
        const data = await response.json();

        logTest(
            `Get Concept by ID (${conceptId})`,
            response.status === 200 && data.data !== null,
            { status: response.status, concept: data.data ? data.data.name : null }
        );

        return data;
    } catch (error) {
        logTest(`Get Concept by ID (${conceptId})`, false, { error: error.message });
        return null;
    }
}

// Test getting labels for a concept
async function testGetConceptLabels(conceptId: string) {
    console.log(`Testing GET /api/concepts/${conceptId}/labels`);

    try {
        const response = await fetch(`${BASE_URL}/api/concepts/${conceptId}/labels?lang=en`);
        const data = await response.json();

        logTest(
            `Get Concept Labels (${conceptId})`,
            response.status === 200 && Array.isArray(data.data),
            {
                status: response.status,
                count: data.data.length,
                sample: data.data.length > 0 ? data.data[0].lab : null
            }
        );

        return data;
    } catch (error) {
        logTest(`Get Concept Labels (${conceptId})`, false, { error: error.message });
        return null;
    }
}

// Test fuzzy search for concepts by label
async function testSearchConceptsByLabel() {
    console.log("Testing GET /api/concepts/search/byLabel");

    try {
        const searchText = "equity begin period";
        const response = await fetch(
            `${BASE_URL}/api/concepts/search/byLabel?text=${encodeURIComponent(searchText)}&lang=en&minSimilarity=0.6`
        );
        const data = await response.json();

        logTest(
            `Search Concepts by Label ("${searchText}")`,
            response.status === 200 && Array.isArray(data.data),
            {
                status: response.status,
                count: data.data.length,
                topMatches: data.data.slice(0, 3).map((match: any) => ({
                    label: match.label,
                    conceptId: match.conceptId,
                    similarity: match.similarity
                }))
            }
        );

        return data;
    } catch (error) {
        logTest("Search Concepts by Label", false, { error: error.message });
        return null;
    }
}

// Test getting financial metrics
async function testGetFinancialMetrics(entity: string) {
    console.log(`Testing GET /api/finance/metrics?entity=${entity}`);

    try {
        const response = await fetch(`${BASE_URL}/api/finance/metrics?entity=${entity}`);
        const data = await response.json();

        logTest(
            `Get Financial Metrics (${entity})`,
            response.status === 200 && Array.isArray(data.data),
            {
                status: response.status,
                count: data.data.length,
                metrics: data.data.map((m: any) => m.concept).slice(0, 3)
            }
        );

        return data;
    } catch (error) {
        logTest(`Get Financial Metrics (${entity})`, false, { error: error.message });
        return null;
    }
}

// Test comparing entities
async function testCompareEntities() {
    console.log("Testing GET /api/finance/compare");

    try {
        const entities = "FUNO,FSHOP";
        const metrics = "ifrs-full:Assets,ifrs-full:Revenue";

        const response = await fetch(
            `${BASE_URL}/api/finance/compare?entities=${entities}&metrics=${metrics}`
        );
        const data = await response.json();

        const hasAllEntities = entities.split(",").every(e => data.data[e]);

        logTest(
            "Compare Entities",
            response.status === 200 && hasAllEntities,
            { status: response.status, data: data.data }
        );

        return data;
    } catch (error) {
        logTest("Compare Entities", false, { error: error.message });
        return null;
    }
}

// Test getting financial statement
async function testGetFinancialStatement() {
    console.log("Testing GET /api/finance/statement");

    try {
        const entity = "FUNO";
        const statementType = "balanceSheet";

        const response = await fetch(
            `${BASE_URL}/api/finance/statement?entity=${entity}&type=${statementType}`
        );
        const data = await response.json();

        logTest(
            `Get Financial Statement (${entity}, ${statementType})`,
            response.status === 200 && Array.isArray(data.data),
            {
                status: response.status,
                count: data.data.length,
                statementType: data.statementType
            }
        );

        return data;
    } catch (error) {
        logTest(`Get Financial Statement`, false, { error: error.message });
        return null;
    }
}

// Test calculating financial ratios
async function testCalculateFinancialRatios() {
    console.log("Testing GET /api/finance/ratios");

    try {
        const entity = "FSHOP";

        const response = await fetch(`${BASE_URL}/api/finance/ratios?entity=${entity}`);
        const data = await response.json();

        logTest(
            `Calculate Financial Ratios (${entity})`,
            response.status === 200 && data.data !== null,
            {
                status: response.status,
                ratios: Object.keys(data.data)
            }
        );

        return data;
    } catch (error) {
        logTest(`Calculate Financial Ratios`, false, { error: error.message });
        return null;
    }
}

// Test getting trend analysis
async function testGetTrendAnalysis() {
    console.log("Testing GET /api/finance/trends");

    try {
        const entity = "SOMA";
        const metrics = "ifrs-full:Revenue,ifrs-full:ProfitLoss";

        const response = await fetch(
            `${BASE_URL}/api/finance/trends?entity=${entity}&metrics=${metrics}&periods=4`
        );
        const data = await response.json();

        logTest(
            `Get Trend Analysis (${entity})`,
            response.status === 200 && Array.isArray(data.data),
            {
                status: response.status,
                periods: data.data.length,
                metrics: data.metrics
            }
        );

        return data;
    } catch (error) {
        logTest(`Get Trend Analysis`, false, { error: error.message });
        return null;
    }
}

// Run all tests
async function runTests() {
    console.log("=== XBRL API TEST SUITE ===");
    console.log("Running tests against:", BASE_URL);
    console.log("=".repeat(50));

    try {
        // Entity tests
        const entities = await testGetEntities();

        let entityId = '';
        if (entities?.data && entities.data.length > 0) {
            entityId = entities.data[0].id;
            await testGetEntityById(entityId);
        }

        // Facts tests
        await testGetFactsWithPagination();
        await testGetFactsWithSorting();
        await testGetFactsWithDimensions();
        await testGetFactsWithCursor();

        // Concept tests
        const conceptId = "ifrs-full_CashAndCashEquivalents";
        await testGetConceptById(conceptId);
        await testGetConceptLabels(conceptId);
        await testSearchConceptsByLabel();

        // Finance tests
        if (entityId) {
            const entity = entityId.replace("scheme:", "");
            await testGetFinancialMetrics(entity);
        }

        await testCompareEntities();
        await testGetFinancialStatement();
        await testCalculateFinancialRatios();
        await testGetTrendAnalysis();

        console.log("=".repeat(50));
        console.log("All tests completed!");
    } catch (error) {
        console.error("Test execution failed:", error);
    }
}

// Run the tests
runTests();