// api/routes/finance.ts
import { RouterContext } from "../deps.ts";
import { connectToDatabase, getFactsCollection, getConceptsCollection, getLabelsCollection } from "../config/database.ts";
import { withPagination, withSorting } from "../middleware/pagination.ts";

// Get financial metrics for a specific entity
export const getFinancialMetrics = withPagination(withSorting(async (ctx: RouterContext<string>) => {
    const db = await connectToDatabase();
    const factsCollection = getFactsCollection(db);
    const labelsCollection = getLabelsCollection(db);

    // Get query parameters
    const url = new URL(ctx.request.url);
    const entity = url.searchParams.get("entity");
    const year = url.searchParams.get("year");
    const quarter = url.searchParams.get("quarter");

    if (!entity) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Entity parameter is required" };
        return;
    }

    // Get pagination and sorting from context state
    const { page, limit, skip } = ctx.state.pagination;
    const { field, direction } = ctx.state.sort;

    // Define key financial metrics to retrieve
    const keyMetrics = [
        "ifrs-full_Revenue",
        "ifrs-full_ProfitLoss",
        "ifrs-full_Assets",
        "ifrs-full_Liabilities",
        "ifrs-full_Equity",
        "ifrs-full_CashAndCashEquivalents",
        "ifrs-full_OperatingCashFlow"
    ];

    // Build query
    const query: any = {
        "dimensions.entity": { $regex: entity, $options: "i" },
        "dimensions.concept": { $in: keyMetrics }
    };

    if (year) {
        query.year = year;
    }

    if (quarter) {
        query.quarter = quarter;
    }

    // Process additional dimensional filters
    for (const [key, value] of url.searchParams.entries()) {
        if (["page", "limit", "sort", "order", "entity", "year", "quarter"].includes(key)) {
            continue;
        } else if (key.startsWith("dim_")) {
            const dimensionName = key.substring(4);
            query[`dimensions.${dimensionName}`] = value;
        }
    }

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

    // Get labels for concepts
    const conceptIds = [...new Set(facts.map(fact => fact.dimensions.concept))];
    const labels = await labelsCollection.find({
        conceptId: { $in: conceptIds },
        lang: "en"
    }).toArray();

    // Create a map of concept IDs to labels
    const labelMap = labels.reduce((map, label) => {
        map[label.conceptId] = label.lab;
        return map;
    }, {});

    // Structure the response
    const metrics = facts.map(fact => ({
        concept: fact.dimensions.concept,
        label: labelMap[fact.dimensions.concept] || fact.dimensions.concept,
        value: fact.numericValue || fact.value,
        period: fact.dimensions.period,
        unit: fact.dimensions.unit,
        year: fact.year,
        quarter: fact.quarter
    }));

    ctx.response.body = {
        data: metrics,
        entity: entity,
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

// Compare metrics across entities
export async function compareEntities(ctx: RouterContext<string>) {
    const db = await connectToDatabase();
    const factsCollection = getFactsCollection(db);

    // Get query parameters
    const url = new URL(ctx.request.url);
    const entities = url.searchParams.get("entities")?.split(",") || [];
    const metrics = url.searchParams.get("metrics")?.split(",") || [];
    const year = url.searchParams.get("year");
    const quarter = url.searchParams.get("quarter");

    if (entities.length === 0) {
        ctx.response.status = 400;
        ctx.response.body = { error: "At least one entity is required" };
        return;
    }

    if (metrics.length === 0) {
        ctx.response.status = 400;
        ctx.response.body = { error: "At least one metric is required" };
        return;
    }

    // Build query
    const query: any = {
        "dimensions.entity": { $in: entities.map(e => `scheme:${e}`) },
        "dimensions.concept": { $in: metrics }
    };

    if (year) {
        query.year = year;
    }

    if (quarter) {
        query.quarter = quarter;
    }

    // Process additional dimensional filters
    for (const [key, value] of url.searchParams.entries()) {
        if (key.startsWith("dim_")) {
            const dimensionName = key.substring(4);
            query[`dimensions.${dimensionName}`] = value;
        }
    }

    // Execute query
    const facts = await factsCollection.find(query).toArray();

    // Structure the response by entity
    const comparisonData: any = {};

    for (const entity of entities) {
        comparisonData[entity] = {};

        // Filter facts for this entity
        const entityFacts = facts.filter(f => f.dimensions.entity === `scheme:${entity}`);

        // Group by metric
        for (const metric of metrics) {
            const metricFacts = entityFacts.filter(f => f.dimensions.concept === metric);
            if (metricFacts.length > 0) {
                comparisonData[entity][metric] = metricFacts.map(fact => ({
                    value: fact.numericValue || fact.value,
                    period: fact.dimensions.period,
                    unit: fact.dimensions.unit,
                    year: fact.year,
                    quarter: fact.quarter
                }));
            }
        }
    }

    ctx.response.body = {
        data: comparisonData,
        metrics: metrics,
        entities: entities
    };
}

// Get financial statement structure
export async function getFinancialStatement(ctx: RouterContext<string>) {
    const db = await connectToDatabase();
    const factsCollection = getFactsCollection(db);
    const labelsCollection = getLabelsCollection(db);

    // Get query parameters
    const url = new URL(ctx.request.url);
    const entity = url.searchParams.get("entity");
    const statementType = url.searchParams.get("type") || "balanceSheet";
    const year = url.searchParams.get("year");
    const quarter = url.searchParams.get("quarter");
    const language = url.searchParams.get("lang") || "en";

    if (!entity) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Entity parameter is required" };
        return;
    }

    // Define concepts based on statement type
    let statementConcepts: string[] = [];

    switch (statementType) {
        case "balanceSheet":
            statementConcepts = [
                "ifrs-full_Assets",
                "ifrs-full_CurrentAssets",
                "ifrs-full_CashAndCashEquivalents",
                "ifrs-full_TradeAndOtherCurrentReceivables",
                "ifrs-full_Inventories",
                "ifrs-full_NoncurrentAssets",
                "ifrs-full_PropertyPlantAndEquipment",
                "ifrs-full_InvestmentProperty",
                "ifrs-full_Liabilities",
                "ifrs-full_CurrentLiabilities",
                "ifrs-full_TradeAndOtherCurrentPayables",
                "ifrs-full_NoncurrentLiabilities",
                "ifrs-full_NoncurrentBorrowings",
                "ifrs-full_Equity"
            ];
            break;
        case "incomeStatement":
            statementConcepts = [
                "ifrs-full_Revenue",
                "ifrs-full_CostOfSales",
                "ifrs-full_GrossProfit",
                "ifrs-full_OtherIncome",
                "ifrs-full_DistributionCosts",
                "ifrs-full_AdministrativeExpense",
                "ifrs-full_OtherExpense",
                "ifrs-full_ProfitLossFromOperatingActivities",
                "ifrs-full_FinanceIncome",
                "ifrs-full_FinanceCosts",
                "ifrs-full_ProfitLossBeforeTax",
                "ifrs-full_TaxExpense",
                "ifrs-full_ProfitLoss"
            ];
            break;
        case "cashFlow":
            statementConcepts = [
                "ifrs-full_CashFlowsFromUsedInOperatingActivities",
                "ifrs-full_ProfitLossAdjustedForNoncashItems",
                "ifrs-full_CashFlowsFromUsedInInvestingActivities",
                "ifrs-full_CashFlowsFromUsedInFinancingActivities",
                "ifrs-full_IncreaseDecreaseInCashAndCashEquivalents",
                "ifrs-full_CashAndCashEquivalentsAtBeginningOfPeriod",
                "ifrs-full_CashAndCashEquivalentsAtEndOfPeriod"
            ];
            break;
        default:
            ctx.response.status = 400;
            ctx.response.body = { error: "Invalid statement type. Use 'balanceSheet', 'incomeStatement', or 'cashFlow'" };
            return;
    }

    // Build query
    const query: any = {
        "dimensions.entity": { $regex: entity, $options: "i" },
        "dimensions.concept": { $in: statementConcepts }
    };

    if (year) {
        query.year = year;
    }

    if (quarter) {
        query.quarter = quarter;
    }

    // Execute query
    const facts = await factsCollection.find(query).toArray();

    // Get labels for concepts
    const labels = await labelsCollection.find({
        conceptId: { $in: statementConcepts },
        lang: language
    }).toArray();

    // Create a map of concept IDs to labels
    const labelMap = labels.reduce((map, label) => {
        map[label.conceptId] = label.lab;
        return map;
    }, {});

    // Organize facts by concept
    const statementItems = statementConcepts.map(concept => {
        const conceptFacts = facts.filter(f => f.dimensions.concept === concept);

        if (conceptFacts.length === 0) {
            return {
                concept: concept,
                label: labelMap[concept] || concept,
                present: false
            };
        }

        // Use the most relevant fact (assuming the first one for simplicity)
        const fact = conceptFacts[0];

        return {
            concept: concept,
            label: labelMap[concept] || concept,
            value: fact.numericValue || fact.value,
            period: fact.dimensions.period,
            unit: fact.dimensions.unit,
            year: fact.year,
            quarter: fact.quarter,
            present: true
        };
    });

    ctx.response.body = {
        data: statementItems,
        entity: entity,
        statementType: statementType,
        year: year,
        quarter: quarter
    };
}

// Calculate financial ratios
export async function calculateFinancialRatios(ctx: RouterContext<string>) {
    const db = await connectToDatabase();
    const factsCollection = getFactsCollection(db);

    // Get query parameters
    const url = new URL(ctx.request.url);
    const entity = url.searchParams.get("entity");
    const year = url.searchParams.get("year");
    const quarter = url.searchParams.get("quarter");

    if (!entity) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Entity parameter is required" };
        return;
    }

    // Define required metrics for ratio calculations
    const requiredConcepts = [
        "ifrs-full_Assets",
        "ifrs-full_CurrentAssets",
        "ifrs-full_Liabilities",
        "ifrs-full_CurrentLiabilities",
        "ifrs-full_Equity",
        "ifrs-full_Revenue",
        "ifrs-full_ProfitLoss",
        "ifrs-full_CashAndCashEquivalents"
    ];

    // Build query
    const query: any = {
        "dimensions.entity": { $regex: entity, $options: "i" },
        "dimensions.concept": { $in: requiredConcepts }
    };

    if (year) {
        query.year = year;
    }

    if (quarter) {
        query.quarter = quarter;
    }

    // Execute query
    const facts = await factsCollection.find(query).toArray();

    // Create a map of concepts to values
    const valueMap: any = {};

    requiredConcepts.forEach(concept => {
        const conceptFacts = facts.filter(f => f.dimensions.concept === concept);
        if (conceptFacts.length > 0) {
            // Use the first fact value for simplicity
            valueMap[concept] = parseFloat(conceptFacts[0].value);
        }
    });

    // Calculate ratios
    const ratios: any = {};

    // Current ratio
    if (valueMap["ifrs-full_CurrentAssets"] && valueMap["ifrs-full_CurrentLiabilities"]) {
        ratios.currentRatio = {
            value: valueMap["ifrs-full_CurrentAssets"] / valueMap["ifrs-full_CurrentLiabilities"],
            formula: "Current Assets / Current Liabilities",
            components: {
                currentAssets: valueMap["ifrs-full_CurrentAssets"],
                currentLiabilities: valueMap["ifrs-full_CurrentLiabilities"]
            }
        };
    }

    // Debt to equity ratio
    if (valueMap["ifrs-full_Liabilities"] && valueMap["ifrs-full_Equity"]) {
        ratios.debtToEquityRatio = {
            value: valueMap["ifrs-full_Liabilities"] / valueMap["ifrs-full_Equity"],
            formula: "Total Liabilities / Total Equity",
            components: {
                liabilities: valueMap["ifrs-full_Liabilities"],
                equity: valueMap["ifrs-full_Equity"]
            }
        };
    }

    // Return on assets
    if (valueMap["ifrs-full_ProfitLoss"] && valueMap["ifrs-full_Assets"]) {
        ratios.returnOnAssets = {
            value: (valueMap["ifrs-full_ProfitLoss"] / valueMap["ifrs-full_Assets"]) * 100,
            formula: "(Net Income / Total Assets) * 100",
            components: {
                netIncome: valueMap["ifrs-full_ProfitLoss"],
                totalAssets: valueMap["ifrs-full_Assets"]
            }
        };
    }

    // Return on equity
    if (valueMap["ifrs-full_ProfitLoss"] && valueMap["ifrs-full_Equity"]) {
        ratios.returnOnEquity = {
            value: (valueMap["ifrs-full_ProfitLoss"] / valueMap["ifrs-full_Equity"]) * 100,
            formula: "(Net Income / Total Equity) * 100",
            components: {
                netIncome: valueMap["ifrs-full_ProfitLoss"],
                totalEquity: valueMap["ifrs-full_Equity"]
            }
        };
    }

    // Cash ratio
    if (valueMap["ifrs-full_CashAndCashEquivalents"] && valueMap["ifrs-full_CurrentLiabilities"]) {
        ratios.cashRatio = {
            value: valueMap["ifrs-full_CashAndCashEquivalents"] / valueMap["ifrs-full_CurrentLiabilities"],
            formula: "Cash and Cash Equivalents / Current Liabilities",
            components: {
                cashAndEquivalents: valueMap["ifrs-full_CashAndCashEquivalents"],
                currentLiabilities: valueMap["ifrs-full_CurrentLiabilities"]
            }
        };
    }

    ctx.response.body = {
        data: ratios,
        entity: entity,
        year: year,
        quarter: quarter,
        availableMetrics: Object.keys(valueMap)
    };
}

// Get trend analysis for metrics over time
export async function getTrendAnalysis(ctx: RouterContext<string>) {
    const db = await connectToDatabase();
    const factsCollection = getFactsCollection(db);
    const labelsCollection = getLabelsCollection(db);

    // Get query parameters
    const url = new URL(ctx.request.url);
    const entity = url.searchParams.get("entity");
    const metrics = url.searchParams.get("metrics")?.split(",") || [
        "ifrs-full_Revenue",
        "ifrs-full_ProfitLoss"
    ];
    const periods = parseInt(url.searchParams.get("periods") || "4");

    if (!entity) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Entity parameter is required" };
        return;
    }

    // Build query
    const query: any = {
        "dimensions.entity": { $regex: entity, $options: "i" },
        "dimensions.concept": { $in: metrics }
    };

    // Execute query
    const facts = await factsCollection.find(query).toArray();

    // Get labels for concepts
    const labels = await labelsCollection.find({
        conceptId: { $in: metrics },
        lang: "en"
    }).toArray();

    // Create a map of concept IDs to labels
    const labelMap = labels.reduce((map, label) => {
        map[label.conceptId] = label.lab;
        return map;
    }, {});

    // Organize data by period and metric
    const periodMap: any = {};

    facts.forEach(fact => {
        const period = `${fact.year}-Q${fact.quarter}`;
        const concept = fact.dimensions.concept;

        if (!periodMap[period]) {
            periodMap[period] = {
                period: period,
                year: fact.year,
                quarter: fact.quarter
            };
        }

        periodMap[period][concept] = fact.numericValue || parseFloat(fact.value);
        periodMap[period][`${concept}_label`] = labelMap[concept] || concept;
    });

    // Convert to array and sort by year and quarter
    let periods_data = Object.values(periodMap);
    periods_data.sort((a: any, b: any) => {
        if (a.year !== b.year) {
            return a.year - b.year;
        }
        return a.quarter - b.quarter;
    });

    // Limit to the requested number of periods (most recent)
    if (periods_data.length > periods) {
        periods_data = periods_data.slice(periods_data.length - periods);
    }

    // Calculate period-over-period growth rates
    for (let i = 1; i < periods_data.length; i++) {
        const current = periods_data[i] as any;
        const previous = periods_data[i - 1] as any;

        metrics.forEach(metric => {
            if (current[metric] && previous[metric]) {
                const growth = ((current[metric] - previous[metric]) / previous[metric]) * 100;
                current[`${metric}_growth`] = growth;
            }
        });
    }

    ctx.response.body = {
        data: periods_data,
        entity: entity,
        metrics: metrics,
        labels: metrics.map(m => labelMap[m] || m)
    };
}