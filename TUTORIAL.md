# Tutorial: Building a Financial Data Analysis System with XBRL, FerretDB, Deno, and Claude

# 1.1 Overview of the Project

This tutorial introduces a comprehensive system for financial data analysis that leverages several modern technologies to store, process, and analyze XBRL (eXtensible Business Reporting Language) financial data. The project integrates four key components: XBRL JSON data format, FerretDB for storage, Deno for API development, and Claude Desktop for advanced analysis and visualization.

## Project Purpose

The system we're building serves as a powerful tool for financial analysts, researchers, and business professionals who need to:

- Store structured financial data from multiple companies
- Query this data through a simple and flexible API
- Compare financial metrics across different entities
- Visualize trends and relationships within financial statements
- Generate insights through AI-assisted analysis

## System Architecture

Our architecture follows a modular approach:

1. **Data Layer**: FerretDB serves as our MongoDB-compatible database that stores XBRL JSON documents in a structured and queryable format.

2. **API Layer**: A lightweight Deno application provides REST endpoints for accessing and filtering the financial data. Deno's security-first approach and TypeScript support make it ideal for building maintainable APIs.

3. **Integration Layer**: The MCP (Message Communication Protocol) server acts as a bridge between our data API and the analysis tools, allowing secure and standardized communication.

4. **Analysis Layer**: Claude Desktop connects to our MCP server, enabling natural language queries against the financial data and producing visualizations and comparative analyses.

## Key Features

The completed system will enable:

- Importing and storing XBRL financial data from multiple sources
- Querying specific financial metrics with filters for time periods, companies, or industries
- Comparing key performance indicators across multiple entities
- Generating visualizations of financial trends
- Using natural language to explore complex financial relationships
- Exporting analysis results for reporting

In the following sections, we'll build this system step by step, starting with understanding XBRL data structure and setting up our database environment.

# 1.2 Understanding XBRL JSON Format

XBRL (eXtensible Business Reporting Language) is a global standard for digital business reporting, widely used for financial statements and regulatory filings. XBRL JSON is a JSON-based representation of XBRL data that offers improved readability and easier programmatic access compared to the original XML-based XBRL format.

## What is XBRL?

XBRL is an open international standard for digital business reporting, designed to improve the way financial data is communicated. It enables:

- Standardized representation of financial information
- Machine-readable data that preserves semantic meaning
- Automated validation and processing of financial reports
- Enhanced comparability across companies and time periods

## The Evolution from XBRL XML to XBRL JSON

Traditionally, XBRL used XML syntax, which could be verbose and complex to process. XBRL JSON emerged as an alternative representation that:

- Reduces file size and complexity
- Aligns with modern web development practices
- Makes integration with JavaScript/TypeScript applications easier
- Simplifies parsing and manipulation

## Key Components of XBRL JSON Structure

An XBRL JSON document typically consists of several key elements:

### 1. Document Information
This section contains metadata about the report, including:
- Entity information (company name, identifiers)
- Reporting period
- Document type
- Filing date

### 2. Facts
Facts are the actual data points in the report, each containing:
- Value (numeric or textual)
- Concept reference (what the fact represents)
- Context reference (time period and other dimensions)
- Unit reference (for numeric values)

### 3. Contexts
Contexts define the dimensional information for facts, including:
- Entity identifier
- Period (instant or duration)
- Scenario or segment information (additional dimensions)

### 4. Units
Units specify the measurement units for numeric facts, such as:
- Currencies (USD, EUR, etc.)
- Shares
- Pure numbers (ratios, percentages)

### 5. Concepts
Concepts define the meaning of facts through references to taxonomies, including:
- Standard financial statement line items
- Disclosures
- Company-specific extensions

## Sample XBRL JSON Structure

Here's a simplified example of how XBRL JSON represents financial data:

```json
{
  "documentInfo": {
    "documentType": "http://www.example.com/role/AnnualReport",
    "entityName": "ABC Corporation",
    "entityCIK": "0001234567",
    "periodEndDate": "2023-12-31"
  },
  "facts": {
    "us-gaap:Revenue": {
      "id": "fact1",
      "value": 1000000,
      "dimensions": {
        "concept": "us-gaap:Revenue",
        "entity": "CIK:0001234567",
        "period": "2023-01-01/2023-12-31",
        "unit": "iso4217:USD"
      }
    },
    "us-gaap:Assets": {
      "id": "fact2",
      "value": 5000000,
      "dimensions": {
        "concept": "us-gaap:Assets",
        "entity": "CIK:0001234567",
        "period": "2023-12-31",
        "unit": "iso4217:USD"
      }
    }
  }
}
```

## Advantages for Our Project

Using XBRL JSON in our project offers several benefits:

1. **Native Database Storage**: JSON documents map directly to FerretDB's document-oriented structure
2. **Simplified Querying**: We can leverage JSON path expressions for efficient filtering
3. **Reduced Processing Overhead**: No need for complex XML parsing
4. **Web-Friendly Format**: Easier to transmit between our API and clients
5. **Compatibility**: Works well with JavaScript/TypeScript in our Deno environment

## Challenges to Consider

Working with XBRL JSON also presents challenges that we'll address:

1. **Taxonomy Complexity**: XBRL relies on taxonomies that define concepts and relationships
2. **Data Normalization**: We may need to normalize data for efficient querying
3. **Dimensional Data**: Handling multi-dimensional contexts correctly
4. **Version Differences**: Different XBRL JSON specifications may have structural variations

In the next sections, we'll explore how to effectively store this data in FerretDB and build an API that makes it accessible for analysis.

# 1.3 Technologies Used

This tutorial leverages several modern technologies that work together to create a powerful financial data analysis system. Here's a brief overview of each component:

## FerretDB

FerretDB is an open-source MongoDB alternative that allows you to use MongoDB drivers and tools while storing data in PostgreSQL.

- **Key Features**: MongoDB API compatibility, SQL backend, open-source
- **Our Usage**: Storing and querying XBRL JSON documents
- **Learn More**: [FerretDB Official Website](https://www.ferretdb.io/)
- **Installation**: [FerretDB Documentation](https://docs.ferretdb.io/quickstart/)

## Deno

Deno is a secure JavaScript and TypeScript runtime built on V8, Rust, and Tokio, created by the original developer of Node.js.

- **Key Features**: Built-in TypeScript support, security-first design, standard library
- **Our Usage**: Building the API for accessing XBRL data
- **Learn More**: [Deno Official Website](https://deno.land/)
- **Installation**: [Deno Installation Guide](https://deno.land/#installation)

## MCP Server

MCP (Message Communication Protocol) Server is a lightweight communication layer that enables standardized message passing between services.

- **Key Features**: Secure communication, message routing, protocol standardization
- **Our Usage**: Connecting our Deno API with Claude Desktop
- **Learn More**: [MCP GitHub Repository](https://github.com/fschopp/mcp)

## Claude Desktop

Claude Desktop is an AI assistant application that provides a user-friendly interface for interacting with Claude's capabilities.

- **Key Features**: Natural language processing, data analysis, visualization capabilities
- **Our Usage**: Analyzing XBRL data and generating insights
- **Learn More**: [Anthropic's Claude](https://www.anthropic.com/claude)
- **Download**: Available through Anthropic's website

# 1.4 Prerequisites and Setup

Before beginning the tutorial, ensure you have the following prerequisites in place:

## System Requirements
- macOS with Apple Silicon (M1/M2/M3 chip)
- At least 8GB RAM
- 10GB free disk space
- Internet connection for downloading dependencies

## Required Software
- Docker Desktop for Apple Silicon (latest version)
- Git
- Claude Desktop application
- Text editor of your choice (VS Code recommended)

## Knowledge Prerequisites
- Basic understanding of:
  - JSON data structures
  - REST APIs
  - TypeScript/JavaScript
  - Docker and containerization
  - Financial reporting concepts (helpful but not required)

## Initial Setup Steps

1. **Clone the tutorial repository:**
   ```bash
   git clone https://github.com/example/xbrl-analysis-tutorial
   cd xbrl-analysis-tutorial
   ```

2. **Create environment configuration:**
   ```bash
   cp .env.example .env
   ```

3. **Download sample XBRL JSON files:**
   The `/data` directory contains sample files, or download from [SEC EDGAR](https://www.sec.gov/edgar).

4. **Start the development environment:**
   ```bash
   docker-compose up -d
   ```

We'll use this environment throughout the tutorial, accessing individual containers as needed for each component of the system.

# 2.1 Installing FerretDB

This section covers the installation and setup of FerretDB, our MongoDB-compatible database that will store the XBRL JSON data. We'll be using Docker containers on macOS with Apple Silicon.

## What is FerretDB?

FerretDB (formerly known as MangoDB) is an open-source MongoDB alternative that translates MongoDB wire protocol queries to SQL, allowing you to use MongoDB clients and tools while storing data in PostgreSQL. This gives us the best of both worlds:

- Document-oriented querying capabilities ideal for XBRL JSON data
- Reliable SQL-based storage backend with PostgreSQL
- Compatibility with existing MongoDB drivers and tools
- Open-source solution without licensing concerns

## Prerequisites

Before installing FerretDB, ensure you have:

- Docker Desktop for Mac (Apple Silicon version) installed and running
- Terminal access
- The tutorial repository cloned to your local machine

## Installation Steps

Since we're using Docker Compose, installing FerretDB is straightforward. All the configuration is already defined in the `docker-compose.yml` file we created earlier.

1. **Navigate to your project directory** in Terminal:
   ```bash
   cd xbrl-analysis-tutorial
   ```

2. **Start the FerretDB and PostgreSQL containers**:
   ```bash
   docker-compose up -d postgres ferretdb
   ```

3. **Verify the installation** by checking if the containers are running:
   ```bash
   docker-compose ps
   ```

   You should see output indicating that both the `xbrl-postgres` and `xbrl-ferretdb` containers are running.

4. **Test the connection** using the MongoDB shell container:
   ```bash
   docker run --rm -it --network mcpnet mongo mongosh mongodb://ferretdb:27017
   ```

   You should see a MongoDB shell prompt. Try some basic commands:
   ```javascript
   show dbs
   use postgres
   db.createCollection('test')
   db.test.insertOne({name: "FerretDB Test", success: true})
   db.test.find()
   ```

5. **Exit the MongoDB shell** when you're done testing:
   ```javascript
   exit
   ```

## What Happens During Installation

Our Docker Compose configuration:

1. Creates a PostgreSQL container optimized for document storage
2. Starts a FerretDB instance that connects to PostgreSQL
3. Sets up a Docker network allowing the containers to communicate
4. Configures persistent volume storage for your data

## Troubleshooting Common Issues

If you encounter issues during installation:

- **"Connection refused" errors**: Ensure Docker is running and ports 27017 and 5432 are available
- **"Authentication failed" errors**: Verify the username and password in your `.env` file
- **Apple Silicon compatibility issues**: Ensure you're using the `platform: linux/amd64` setting in docker-compose.yml

## Access via MongoDB Express (Optional)

The docker-compose file includes MongoDB Express, a web-based admin interface. To access it:

1. Start the MongoDB Express container:
   ```bash
   docker-compose up -d mongo-express
   ```

2. Navigate to `http://localhost:8081` in your browser

3. Log in with the credentials defined in your `.env` file

## Next Steps

With FerretDB successfully installed, we're ready to configure it specifically for our XBRL data needs in the next section.

Gracias por compartir este hallazgo importante. Es útil saber que FerretDB aún no soporta los validadores. Vamos a ajustar esa parte de la configuración para evitar ese problema:

# 2.2 Configuring FerretDB for Our Project

Now that we have FerretDB installed, we need to configure it specifically for storing and querying XBRL financial data. This section focuses on optimizing the database setup for our particular use case.

## Database Structure for XBRL Data

For our financial data analysis system, we'll create a dedicated database with collections designed to efficiently store different aspects of XBRL data:

```javascript
// Create database for our XBRL data
use xbrl_financial_data
```

We'll organize our data into these collections:

1. `facts` - The core financial data points from XBRL reports
2. `concepts` - Definitions of XBRL concepts/elements
3. `labels` - Human-readable labels for concepts in different languages
4. `reports` - Metadata about financial reports
5. `entities` - Information about the reporting entities (companies, REITs, etc.)

## Creating the Collections

Let's create these collections in our FerretDB instance:

```javascript
db.createCollection('facts')
db.createCollection('concepts')
db.createCollection('labels')
db.createCollection('reports')
db.createCollection('entities')
```

## Populating the Entities Collection

Let's add data for the entities (FIBRAs) that we'll be analyzing:

```javascript
db.entities.insertMany([
  {
    entityId: "FSHOP",
    ticker: "FSHOP",
    name: "Fibra Shop",
    exchange: "BMV",
    sector: "Real Estate",
    propertyType: "Retail",
    description: "Mexican REIT focused on shopping centers and commercial properties."
  },
  {
    entityId: "FUNO",
    ticker: "FUNO",
    name: "Fibra Uno",
    exchange: "BMV",
    sector: "Real Estate",
    propertyType: "Diversified",
    description: "Mexico's first and largest REIT with a diversified portfolio of properties."
  },
  {
    entityId: "SOMA",
    ticker: "SOMA",
    name: "Fibra SOMA",
    exchange: "BMV",
    sector: "Real Estate",
    propertyType: "Office/Mixed-Use",
    description: "REIT focused on office and mixed-use properties in Mexico."
  }
])
```

## Configuring Indexes

Proper indexing is crucial for query performance. Let's set up indexes for efficient querying of our XBRL data:

```javascript
// Index for facts collection - common query patterns
db.facts.createIndex({ "dimensions.entity": 1, "dimensions.period": 1 })
db.facts.createIndex({ "dimensions.concept": 1 })
db.facts.createIndex({ "reportId": 1 })
db.facts.createIndex({ "year": 1, "quarter": 1 })

// Index for concepts collection
db.concepts.createIndex({ "id": 1 }, { unique: true })
db.concepts.createIndex({ "name": 1 })

// Index for labels collection
db.labels.createIndex({ "conceptId": 1 })
db.labels.createIndex({ "lang": 1 })

// Index for reports collection
db.reports.createIndex({ "entity": 1 })
db.reports.createIndex({ "period": 1 })

// Index for entities collection
db.entities.createIndex({ "entityId": 1 }, { unique: true })
db.entities.createIndex({ "ticker": 1 })
db.entities.createIndex({ "sector": 1 })
db.entities.createIndex({ "propertyType": 1 })
```

## Data Validation Strategy

> **Note**: FerretDB currently doesn't support the MongoDB validator functionality. Instead, we'll implement validation at the application level in our Deno API.

Since we can't use MongoDB's built-in validation, we'll ensure data integrity through these approaches:

1. **Application-level validation**: Implement validation logic in our Deno API before inserting/updating documents
2. **Consistent schema**: Maintain a consistent document structure in our application code
3. **Type checking**: Use TypeScript interfaces to enforce data structure
4. **Data migration scripts**: Include validation in any data migration scripts

Here's an example of how we'll implement validation in our Deno API later:

```typescript
// Example of application-level validation we'll implement in the Deno API
interface FactDocument {
  value: string | number | null;
  dimensions: {
    concept: string;
    entity: string;
    period: string;
    [key: string]: unknown;
  };
  factId: string;
  reportId: string;
  year: string;
  quarter: string;
}

function validateFact(fact: unknown): fact is FactDocument {
  if (!fact || typeof fact !== 'object') return false;
  
  const f = fact as Partial<FactDocument>;
  
  if (!f.dimensions || typeof f.dimensions !== 'object') return false;
  if (!f.factId || typeof f.factId !== 'string') return false;
  if (!f.reportId || typeof f.reportId !== 'string') return false;
  
  const dims = f.dimensions as Record<string, unknown>;
  if (!dims.concept || !dims.entity) return false;
  
  return true;
}
```

## Testing the Configuration

To verify our configuration, let's insert a test document and query it:

```javascript
// Insert a sample fact
db.facts.insertOne({
  value: "100000",
  dimensions: {
    concept: "ifrs-full:Revenue",
    entity: "scheme:FUNO",
    period: "2024-01-01T00:00:00/2025-01-01T00:00:00"
  },
  factId: "test-fact-001",
  reportId: "funo_2024_4",
  year: "2024",
  quarter: "4"
})

// Query to verify
db.facts.findOne({ "factId": "test-fact-001" })

// Query to verify entities collection
db.entities.find({ "propertyType": "Retail" })
```

## Database Connection from Our Application

For our Deno API, we'll need to configure a connection to FerretDB. Here's a snippet we'll use later in our Deno application:

```typescript
// This will be used in our Deno API
const MONGO_URI = "mongodb://ferretdb:27017";
const DB_NAME = "xbrl_financial_data";

async function connectToDatabase() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  return client.db(DB_NAME);
}
```

## Performance Considerations

When working with XBRL data in FerretDB, keep these optimizations in mind:

1. **Document Size**: Keep large text fields (like notes) in separate collections if they grow too large
2. **Query Patterns**: Design your schema based on how you'll query the data
3. **Aggregation Pipeline**: Use MongoDB's aggregation framework for complex financial calculations
4. **Compound Indexes**: Create compound indexes for frequently used filter combinations
5. **Entity Relations**: Use the entities collection to enrich query results with metadata

## FerretDB Limitations to Consider

FerretDB is still under active development and may not support all MongoDB features. Keep these limitations in mind:

1. **No document validation**: Implement validation in your application code
2. **Limited aggregation pipeline support**: Check FerretDB documentation for supported operators
3. **Performance characteristics**: May differ from MongoDB for certain operations

With our FerretDB instance properly configured and the entities collection in place, we're now ready to create the database schema specifically designed for XBRL data in the next section.

I'll create the tutorial sections 2.3 and 2.4 in English, focusing on being concise while providing enough detail to follow along. These sections will cover creating the database schema and understanding the XBRL JSON structure.

# 2.3 Understanding XBRL JSON Structure

To effectively work with XBRL data in our system, we need to understand its structure in detail. Let's examine the specific structure of our XBRL JSON files.

## XBRL Facts Structure

The core of XBRL data consists of "facts" - individual data points reported by entities. Each fact in our JSON has this structure:

```json
{
  "value": "578863000",         // The actual value (string, even for numbers)
  "decimals": -3,               // Precision indicator for numeric values
  "dimensions": {               // Contextual information
    "concept": "ifrs-full:CashAndCashEquivalents",  // What is being measured
    "entity": "scheme:FSHOP",   // Who is reporting
    "period": "2025-01-01T00:00:00",  // When (point in time or period)
    "unit": "ISO4217:MXN"       // Unit of measure (Mexican Peso)
  },
  "factId": "Fb39029d1-164b-4110-fb5d-a9230145bd61",  // Unique identifier
  "reportId": "fshop_2024_4",   // Which report this belongs to
  "year": "2024",               // Fiscal year
  "quarter": "4"                // Fiscal quarter
}
```

## Key Dimensions in XBRL Data

XBRL facts are defined by four primary dimensions:

1. **Concept** - What financial concept is being reported (e.g., Assets, Revenue)
2. **Entity** - The reporting entity (e.g., FUNO, FSHOP, SOMA)
3. **Period** - The time dimension, which can be:
   - Instant: A point in time (like a balance sheet date)
   - Duration: A period (like an income statement period)
4. **Unit** - The measurement unit for numeric values

## Additional Dimensions

Some facts include additional dimensions that provide further context:

```json
"dimensions": {
  "concept": "ifrs-full:AmountRemovedFromReserveOfChangeInValueOfTimeValueOfOptions...",
  "entity": "scheme:SOMA",
  "period": "2023-01-01T00:00:00/2024-01-01T00:00:00",
  "ifrs-full:ComponentsOfEquityAxis": "ifrs-full:RetainedEarningsMember",
  "unit": "ISO4217:MXN"
}
```

The `ifrs-full:ComponentsOfEquityAxis` is an additional dimension that specifies which component of equity this fact relates to.

## XBRL Concept Structure

Each concept in XBRL has metadata that helps in understanding and processing the data:

```json
{
  "id": "ifrs-full:CashAndCashEquivalents",
  "name": "CashAndCashEquivalents",
  "ns": "http://xbrl.ifrs.org/taxonomy/2017-03-09/ifrs-full",
  "period": "instant",
  "bal": "debit",
  "type": "http://www.xbrl.org/2003/instance:monetaryItemType",
  "itemType": 1,
  "abstract": false,
  "nill": true
}
```

Key properties include:
- **id**: Fully qualified concept identifier
- **name**: Human-readable name
- **period**: Expected period type (instant or duration)
- **bal**: Balance type (debit or credit)
- **type**: Data type (monetary, string, etc.)
- **abstract**: Whether it's a calculation parent (not a data point)

## XBRL Labels

XBRL concepts also have labels in different languages:

```json
{
  "role": "http://www.xbrl.org/2003/role/label",
  "lang": "en",
  "lab": "Cash and cash equivalents",
  "conceptId": "ifrs-full:CashAndCashEquivalents"
}
```

These labels provide human-readable descriptions of concepts, making the data more accessible for analysis.

## Notes and Relationships

Our sample data also includes notes and hierarchical relationships:

```json
{
  "value": "No se determina utilidad diluida debido a que no hay parte minoritaria.",
  "dimensions": {
    "concept": "xbrl:note",
    "noteId": "f59002",
    "language": "es"
  }
}
```

Understanding these structures is crucial for correctly storing, querying, and analyzing the XBRL data in our system.

In the next section, we'll use this knowledge to develop a data loader script that transforms and imports XBRL data into our FerretDB.

I'll develop section 3 of the tutorial focused on loading XBRL data into FerretDB. I'll keep it concise yet complete enough to follow along.

# 3. Loading XBRL Data into FerretDB

Now that we understand the XBRL JSON structure and have set up our database schema, let's develop a process to load the XBRL data into FerretDB.

## 3.1 Obtaining Sample XBRL JSON Files

For this tutorial, we'll use the sample XBRL JSON files described in our documentation:

- `all_facts.json` - Contains the financial facts for three REITs (FUNO, FSHOP, and SOMA)
- `concepts_array.json` - Contains metadata about XBRL concepts
- `labels_array.json` - Contains human-readable labels for concepts

If you haven't already, place these files in a `data` directory within your project folder.

## 3.2 Creating a Data Loader Script with Deno

Let's create a Deno script to import our XBRL data. Create a file named `import_xbrl.ts` in a `scripts` directory:

```typescript
// scripts/import_xbrl.ts
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

// Configuration
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "xbrl_financial_data";
const DATA_DIR = "./data";

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
  
  console.log("Starting data import...");
  
  // Load and import data
  await importFacts(factsCollection);
  await importConcepts(conceptsCollection);
  await importLabels(labelsCollection);
  await extractEntities(factsCollection, entitiesCollection);
  
  console.log("Data import completed successfully");
} catch (error) {
  console.error("Error during import:", error);
} finally {
  await client.close();
  console.log("Database connection closed");
}

// Import facts from all_facts.json
async function importFacts(collection) {
  console.log("Importing facts...");
  
  const factData = JSON.parse(await Deno.readTextFile(`${DATA_DIR}/all_facts.json`));
  
  // Process data in batches to avoid memory issues
  const batchSize = 1000;
  for (let i = 0; i < factData.length; i += batchSize) {
    const batch = factData.slice(i, i + batchSize);
    await collection.insertMany(batch);
    console.log(`Imported ${i + batch.length} of ${factData.length} facts`);
  }
  
  console.log("Facts import completed");
}

// Import concepts from concepts_array.json
async function importConcepts(collection) {
  console.log("Importing concepts...");
  
  const conceptData = JSON.parse(await Deno.readTextFile(`${DATA_DIR}/concepts_array.json`));
  
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
  
  const labelData = JSON.parse(await Deno.readTextFile(`${DATA_DIR}/labels_array.json`));
  
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
        "dimensions.concept": { $in: [
          "ifrs-full:NameOfReportingEntityOrOtherMeansOfIdentification",
          "ifrs-full:DescriptionOfNatureOfFinancialStatements",
          "ifrs_mx-cor_20141205:TipoDeEmisora",
          "ifrs_mx-cor_20141205:Consolidado"
        ]}
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
```

## 3.3 Transforming and Normalizing XBRL Data

Let's enhance our script to include data transformation and normalization. Add these functions to `import_xbrl.ts`:

```typescript
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

// Update the importFacts function to use preprocessing
async function importFacts(collection) {
  console.log("Importing facts...");
  
  const factData = JSON.parse(await Deno.readTextFile(`${DATA_DIR}/all_facts.json`));
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
```

## 3.4 Batch Importing Data into FerretDB

Now, let's add a function to extract and create reports from our data:

```typescript
// Extract and create report records
async function createReports(factsCollection, reportsCollection) {
  console.log("Creating report records...");
  
  // Find unique reports by reportId
  const reports = await factsCollection.aggregate([
    { $match: { reportId: { $exists: true } } },
    { $group: { 
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
```

Update the main code to call this function:

```typescript
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
} catch (error) {
  console.error("Error during import:", error);
} finally {
  await client.close();
  console.log("Database connection closed");
}
```

## 3.5 Verifying Data Integrity

After importing, we should verify the data integrity. Add this function to check imported data:

```typescript
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
    { $lookup: {
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
```

Add the verification call to the main function:

```typescript
try {
  // ... existing code ...
  
  // After import, verify data
  await verifyDataIntegrity(db);
  
  console.log("Data import completed successfully");
} catch (error) {
  // ... existing code ...
}
```

## Running the Import Script

Execute the script using Deno:

```bash
deno run --allow-net --allow-read scripts/import_xbrl.ts
```

You should see output indicating the progress of the import and confirmation of the data integrity.

To run the script against the Docker container, modify the connection string:

```typescript
const MONGO_URI = "mongodb://ferretdb:ferretdb_password@ferretdb:27017/postgres";
```

And run with:

```bash
docker run --rm -it --network mcpnet -v $(pwd):/app -w /app denoland/deno:alpine run --allow-net --allow-read /app/scripts/import_xbrl.ts
```

This completes the data loading process. We now have our XBRL data properly imported, transformed, and verified in FerretDB, ready for building our API in the next section.

I'll update Section 4 of the tutorial to include the enhanced `getFacts` function that supports filtering by arbitrary dimensions. Here's the updated content:

# 4. Building the API with Deno

Now that we have our XBRL data loaded into FerretDB, let's create a REST API using Deno to access and query this data.

## 4.1 Setting Up a Deno Project

First, let's create a new directory structure for our API project:

```bash
mkdir -p api/src api/config api/routes
touch api/deps.ts
touch api/mod.ts
touch api/config/database.ts
```

Create a `deps.ts` file to centralize our dependencies:

```typescript
// api/deps.ts
export { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
export type { RouterContext } from "https://deno.land/x/oak@v12.6.1/mod.ts";
export { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
export { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
export { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
```

## 4.2 Creating Connection to FerretDB

Let's set up our database connection:

```typescript
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
```

Aquí está el punto 4.3 actualizado con los nuevos cambios:

## 4.3 Implementing Basic CRUD Operations

Now, let's implement our API routes with basic CRUD operations and support for dimensional filtering:

```typescript
// api/routes/facts.ts
import { RouterContext } from "../deps.ts";
import { connectToDatabase, getFactsCollection } from "../config/database.ts";

// Get facts with pagination and filtering, supporting dimensional filters
export async function getFacts(ctx: RouterContext<string>) {
  const db = await connectToDatabase();
  const factsCollection = getFactsCollection(db);
  
  // Get query parameters
  const url = new URL(ctx.request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "100");
  
  // Build query
  const query: any = {};
  
  // Process all query parameters
  for (const [key, value] of url.searchParams.entries()) {
    // Standard filters
    if (key === "page" || key === "limit") {
      continue; // Skip pagination params
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
      // Format: dim_[dimension_name]
      const dimensionName = key.substring(4); // Remove 'dim_' prefix
      query[`dimensions.${dimensionName}`] = value;
    }
  }
  
  // Execute query with pagination
  const skip = (page - 1) * limit;
  const facts = await factsCollection.find(query)
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
    }
  };
}

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
```

These implementations provide:

1. A flexible facts retrieval system with support for dynamic dimensional filtering using the `dim_` prefix
2. Detailed concept information retrieval by ID
3. Concept label retrieval with filtering by language and role
4. Fuzzy search capabilities for finding concepts by similar label text
5. Entity information retrieval

The API now supports complex queries necessary for XBRL data analysis, including specialized dimensional filters that are common in financial reporting taxonomies. The fuzzy search functionality is particularly useful for exploring the taxonomy when users don't know the exact concept identifiers.

## 4.4 Developing Filter Functions for XBRL Data

To make our API more useful for financial analysis, let's implement specialized filter functions that allow users to extract meaningful financial information from the XBRL data. These functions will simplify common analysis tasks and provide structured financial data.

```typescript
// api/routes/finance.ts
import { RouterContext } from "../deps.ts";
import { connectToDatabase, getFactsCollection, getConceptsCollection, getLabelsCollection } from "../config/database.ts";

// Get financial metrics for a specific entity
export async function getFinancialMetrics(ctx: RouterContext<string>) {
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
  
  // Define key financial metrics to retrieve
  const keyMetrics = [
    "ifrs-full:Revenue",
    "ifrs-full:ProfitLoss",
    "ifrs-full:Assets",
    "ifrs-full:Liabilities",
    "ifrs-full:Equity",
    "ifrs-full:CashAndCashEquivalents",
    "ifrs-full:OperatingCashFlow"
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
    if (key.startsWith("dim_")) {
      const dimensionName = key.substring(4);
      query[`dimensions.${dimensionName}`] = value;
    }
  }
  
  // Execute query
  const facts = await factsCollection.find(query).toArray();
  
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
    entity: entity
  };
}

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
        "ifrs-full:Assets",
        "ifrs-full:CurrentAssets",
        "ifrs-full:CashAndCashEquivalents",
        "ifrs-full:TradeAndOtherCurrentReceivables",
        "ifrs-full:Inventories",
        "ifrs-full:NoncurrentAssets",
        "ifrs-full:PropertyPlantAndEquipment",
        "ifrs-full:InvestmentProperty",
        "ifrs-full:Liabilities",
        "ifrs-full:CurrentLiabilities",
        "ifrs-full:TradeAndOtherCurrentPayables",
        "ifrs-full:NoncurrentLiabilities",
        "ifrs-full:NoncurrentBorrowings",
        "ifrs-full:Equity"
      ];
      break;
    case "incomeStatement":
      statementConcepts = [
        "ifrs-full:Revenue",
        "ifrs-full:CostOfSales",
        "ifrs-full:GrossProfit",
        "ifrs-full:OtherIncome",
        "ifrs-full:DistributionCosts",
        "ifrs-full:AdministrativeExpense",
        "ifrs-full:OtherExpense",
        "ifrs-full:ProfitLossFromOperatingActivities",
        "ifrs-full:FinanceIncome",
        "ifrs-full:FinanceCosts",
        "ifrs-full:ProfitLossBeforeTax",
        "ifrs-full:TaxExpense",
        "ifrs-full:ProfitLoss"
      ];
      break;
    case "cashFlow":
      statementConcepts = [
        "ifrs-full:CashFlowsFromUsedInOperatingActivities",
        "ifrs-full:ProfitLossAdjustedForNoncashItems",
        "ifrs-full:CashFlowsFromUsedInInvestingActivities",
        "ifrs-full:CashFlowsFromUsedInFinancingActivities",
        "ifrs-full:IncreaseDecreaseInCashAndCashEquivalents",
        "ifrs-full:CashAndCashEquivalentsAtBeginningOfPeriod",
        "ifrs-full:CashAndCashEquivalentsAtEndOfPeriod"
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
    "ifrs-full:Assets",
    "ifrs-full:CurrentAssets",
    "ifrs-full:Liabilities",
    "ifrs-full:CurrentLiabilities",
    "ifrs-full:Equity",
    "ifrs-full:Revenue",
    "ifrs-full:ProfitLoss",
    "ifrs-full:CashAndCashEquivalents"
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
  if (valueMap["ifrs-full:CurrentAssets"] && valueMap["ifrs-full:CurrentLiabilities"]) {
    ratios.currentRatio = {
      value: valueMap["ifrs-full:CurrentAssets"] / valueMap["ifrs-full:CurrentLiabilities"],
      formula: "Current Assets / Current Liabilities",
      components: {
        currentAssets: valueMap["ifrs-full:CurrentAssets"],
        currentLiabilities: valueMap["ifrs-full:CurrentLiabilities"]
      }
    };
  }
  
  // Debt to equity ratio
  if (valueMap["ifrs-full:Liabilities"] && valueMap["ifrs-full:Equity"]) {
    ratios.debtToEquityRatio = {
      value: valueMap["ifrs-full:Liabilities"] / valueMap["ifrs-full:Equity"],
      formula: "Total Liabilities / Total Equity",
      components: {
        liabilities: valueMap["ifrs-full:Liabilities"],
        equity: valueMap["ifrs-full:Equity"]
      }
    };
  }
  
  // Return on assets
  if (valueMap["ifrs-full:ProfitLoss"] && valueMap["ifrs-full:Assets"]) {
    ratios.returnOnAssets = {
      value: (valueMap["ifrs-full:ProfitLoss"] / valueMap["ifrs-full:Assets"]) * 100,
      formula: "(Net Income / Total Assets) * 100",
      components: {
        netIncome: valueMap["ifrs-full:ProfitLoss"],
        totalAssets: valueMap["ifrs-full:Assets"]
      }
    };
  }
  
  // Return on equity
  if (valueMap["ifrs-full:ProfitLoss"] && valueMap["ifrs-full:Equity"]) {
    ratios.returnOnEquity = {
      value: (valueMap["ifrs-full:ProfitLoss"] / valueMap["ifrs-full:Equity"]) * 100,
      formula: "(Net Income / Total Equity) * 100",
      components: {
        netIncome: valueMap["ifrs-full:ProfitLoss"],
        totalEquity: valueMap["ifrs-full:Equity"]
      }
    };
  }
  
  // Cash ratio
  if (valueMap["ifrs-full:CashAndCashEquivalents"] && valueMap["ifrs-full:CurrentLiabilities"]) {
    ratios.cashRatio = {
      value: valueMap["ifrs-full:CashAndCashEquivalents"] / valueMap["ifrs-full:CurrentLiabilities"],
      formula: "Cash and Cash Equivalents / Current Liabilities",
      components: {
        cashAndEquivalents: valueMap["ifrs-full:CashAndCashEquivalents"],
        currentLiabilities: valueMap["ifrs-full:CurrentLiabilities"]
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
    "ifrs-full:Revenue", 
    "ifrs-full:ProfitLoss"
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
    const previous = periods_data[i-1] as any;
    
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
```

Now, let's update our main application to include these new financial analysis routes:

```typescript
// In api/mod.ts, update the router configuration to include the new routes:

router
  // ...existing routes
  .get("/api/finance/metrics", getFinancialMetrics)
  .get("/api/finance/compare", compareEntities)
  .get("/api/finance/statement", getFinancialStatement)
  .get("/api/finance/ratios", calculateFinancialRatios)
  .get("/api/finance/trends", getTrendAnalysis);
```

These specialized functions provide powerful financial analysis capabilities:

1. **getFinancialMetrics**: Retrieves core financial metrics for a specific entity with dimensional filtering
2. **compareEntities**: Enables side-by-side comparison of metrics across multiple entities
3. **getFinancialStatement**: Returns structured financial statements (balance sheet, income statement, cash flow)
4. **calculateFinancialRatios**: Computes key financial ratios such as current ratio, debt-to-equity, ROA, and ROE
5. **getTrendAnalysis**: Provides time-series analysis of financial metrics with period-over-period growth rates

These endpoints allow users to perform sophisticated financial analysis through simple API calls. For example:

- Getting a balance sheet: `/api/finance/statement?entity=FUNO&type=balanceSheet&year=2024&quarter=4`
- Calculating financial ratios: `/api/finance/ratios?entity=FSHOP&year=2024&quarter=4`
- Comparing revenue across entities: `/api/finance/compare?entities=FUNO,FSHOP,SOMA&metrics=ifrs-full:Revenue&year=2024&quarter=4`
- Analyzing revenue trends: `/api/finance/trends?entity=SOMA&metrics=ifrs-full:Revenue,ifrs-full:ProfitLoss&periods=8`

The dimensional filtering capability is preserved in all these endpoints, allowing for fine-grained analysis of specific aspects of financial data.

## 4.5 Implementing Pagination and Sorting

To enhance the API's usability for handling large datasets, let's implement robust pagination and sorting capabilities. This will allow clients to efficiently navigate through XBRL data and organize it according to their analytical needs.

```typescript
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
```

Now, let's update our facts endpoint to use these middleware functions and implement a more sophisticated facts retrieval function:

```typescript
// api/routes/facts.ts - Update the getFacts function
import { RouterContext } from "../deps.ts";
import { connectToDatabase, getFactsCollection } from "../config/database.ts";
import { withPagination, withSorting } from "../middleware/pagination.ts";

// Enhanced getFacts function with pagination and sorting
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
```

Let's also implement a helper to make our financial metrics endpoints support pagination and sorting:

```typescript
// api/routes/finance.ts - Update getFinancialMetrics function
import { withPagination, withSorting } from "../middleware/pagination.ts";

// Enhanced getFinancialMetrics with pagination and sorting
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
    "ifrs-full:Revenue",
    "ifrs-full:ProfitLoss",
    "ifrs-full:Assets",
    "ifrs-full:Liabilities",
    "ifrs-full:Equity",
    "ifrs-full:CashAndCashEquivalents",
    "ifrs-full:OperatingCashFlow"
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
```

Let's also implement a utility function to handle cursor-based pagination for large datasets:

```typescript
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
```

Let's implement a specialized endpoint for large-scale fact retrieval using cursor pagination:

```typescript
// api/routes/facts.ts - Add a new function for cursor-based pagination
import { cursorPagination } from "../utils.ts";

// Get facts with cursor-based pagination
export async function getFactsWithCursor(ctx: RouterContext<string>) {
  const db = await connectToDatabase();
  const factsCollection = getFactsCollection(db);
  
  // Get query parameters
  const url = new URL(ctx.request.url);
  const entity = url.searchParams.get("entity");
  const concept = url.searchParams.get("concept");
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
```

Finally, let's update our router to include the cursor-based pagination endpoint:

```typescript
// api/mod.ts - Add the new route
router
  // ...existing routes
  .get("/api/facts", getFacts)
  .get("/api/facts/cursor", getFactsWithCursor)
  .get("/api/facts/:id", getFactById);
```

These enhancements provide several benefits:

1. **Flexible pagination**: Support for both offset-based and cursor-based pagination
2. **Customizable page sizes**: Users can specify how many items to retrieve per page
3. **Advanced sorting**: The ability to sort by any field in ascending or descending order
4. **Consistent interfaces**: Common pagination and sorting patterns across all endpoints
5. **Efficient navigation**: Cursor-based pagination for handling large datasets efficiently

Clients can now easily navigate through large volumes of XBRL data using queries like:

- Standard pagination: `/api/facts?entity=FUNO&page=2&limit=50&sort=year&order=desc`
- Cursor pagination: `/api/facts/cursor?entity=FUNO&limit=100&cursor=F3ddef06c-4e7d-42db-fb29-a8c7a8a58dfe&direction=next`

These pagination and sorting capabilities make the API more efficient and user-friendly for data exploration and analysis, especially when dealing with the large volumes of data common in financial reporting.

## 4.6 Testing the API Endpoints

To ensure our XBRL API functions correctly, let's create a systematic testing approach. We'll develop a comprehensive test script that verifies the functionality of all our endpoints and provides clear feedback on any issues.

```typescript
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
      data.pagination.limit === a10,
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
    const response = await fetch(`${BASE_URL}/api/facts?sort=year&order=desc&limit=5`);
    const data = await response.json();
    
    // Verify sorting by checking if years are in descending order
    let sortedCorrectly = true;
    for (let i = 1; i < data.data.length; i++) {
      if (data.data[i-1].year < data.data[i].year) {
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
    const searchText = "cash equivalent";
    const response = await fetch(
      `${BASE_URL}/api/concepts/search/byLabel?text=${encodeURIComponent(searchText)}&lang=en&minSimilarity=0.7`
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
    
    let entityId = null;
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
    const conceptId = "ifrs-full:CashAndCashEquivalents";
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
```

### Testing with Docker Compose

To test our API within the Docker Compose environment, we'll need to:

1. Start all required services
2. Run the API server
3. Execute our tests

Here's a script to automate this process:

```bash
#!/bin/bash
# test_api.sh

echo "=== XBRL API Docker Testing ==="

# 1. Ensure Docker Compose environment is running
echo "Starting Docker Compose services..."
docker-compose up -d postgres ferretdb

# 2. Wait for database to be ready
echo "Waiting for database to initialize..."
sleep 5

# 3. Start the API service
echo "Starting API service..."
docker-compose up -d deno-api

# 4. Wait for API to be ready
echo "Waiting for API service to start..."
sleep 3

# 5. Run tests
echo "Running API tests..."
docker-compose exec deno-api deno run --allow-net /app/test_api.ts

# 6. Provide option to stop services
read -p "Tests completed. Stop services? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  docker-compose stop deno-api
  echo "API service stopped."
fi

echo "Testing complete."
```

Make this script executable:

```bash
chmod +x test_api.sh
```

### Running the Tests

With this setup, you have two options to run tests:

1. **Using the script**:
   ```bash
   ./test_api.sh
   ```

2. **Manually**:
   ```bash
   # Start the environment
   docker-compose up -d
   
   # Run the tests
   docker-compose exec deno-api deno run --allow-net /app/test_api.ts
   ```

With this approach, we can reliably test our XBRL API within the Docker Compose environment, ensuring that all components work together correctly. The testing framework verifies the core functionality of our API, focusing on the most important endpoints for financial data analysis.

# 5. Setting Up the MCP Server

Now that we have our Deno API working, let's set up the MCP (Message Communication Protocol) Server to enable seamless integration between our API and Claude Desktop.

## 5.1 Understanding MCP Architecture

MCP (Message Communication Protocol) is a standardized way for AI assistants like Claude to communicate with external services. It enables Claude Desktop to query our XBRL data through a consistent interface.

The MCP architecture consists of:

1. **MCP Server**: A service that implements the MCP protocol and acts as a bridge between Claude and our API
2. **Tools**: Functions exposed by the MCP Server that Claude can call
3. **Transport**: The mechanism for message passing (in our case, standard I/O)
4. **Client**: The Claude Desktop application that consumes our MCP Server

This integration allows Claude to:
- Query our database through natural language
- Perform financial analysis on XBRL data
- Generate visualizations based on the retrieved data

## 5.2 Installing and Configuring the MCP Server

Let's create a directory structure for our MCP Server:

```bash
mkdir -p mcp-server/src
cd mcp-server
```

Create a `package.json` file:

```bash
npm init -y
```

Install the necessary dependencies:

```bash
npm install @modelcontextprotocol/sdk node-fetch
npm install --save-dev typescript @types/node
```

Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "outDir": "./build",
    "strict": true
  },
  "include": ["src/**/*"]
}
```

Add build scripts to `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node build/server.js"
  }
}
```

## 5.3 Connecting the Deno API to the MCP Server

The MCP Server code I've provided demonstrates how to connect to our Deno API. Let's examine the key components:

1. **API Connection**: The server uses `fetch` to communicate with our Deno API
2. **Tool Definitions**: Each API endpoint is exposed as an MCP Tool
3. **Request Handlers**: Functions that process requests from Claude and return responses

The connection between the MCP Server and our Deno API is established through the `API_BASE_URL` environment variable:

```javascript
const API_BASE_URL = process.env.API_BASE_URL || "http://host.docker.internal:8000";
```

This allows the MCP Server to communicate with our Deno API when running in Docker.

## 5.4 Defining MCP Endpoints

The MCP Server exposes our API endpoints as tools that Claude can use. For example, the `getFinancialStatement` endpoint is defined as:

```javascript
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
```

And the corresponding handler:

```javascript
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
```

The MCP Server maps Claude's requests to these handlers:

```javascript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        switch (request.params.name) {
            case "xbrl_getFinancialStatement": {
                const { entity, type, year, quarter } = request.params.arguments as {
                    entity: string;
                    type?: string;
                    year?: string;
                    quarter?: string;
                };
                return await handleGetFinancialStatement(entity, type, year, quarter);
            }
            // Other handlers...
        }
    } catch (error) {
        // Error handling...
    }
});
```

## 5.5 Security Considerations and Authentication

While our tutorial implementation is simple, in a production environment you should consider:

1. **Authentication**: Add an API key or other authentication method to secure the API
2. **Input Validation**: Validate all inputs to prevent injection attacks
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **HTTPS**: Use HTTPS for all communications

For our tutorial, we'll add basic input validation to our MCP Server handlers:

```javascript
function validateEntityId(id: string): boolean {
    return /^[A-Za-z0-9_\-:]+$/.test(id);
}

function validateYear(year: string): boolean {
    return /^\d{4}$/.test(year);
}

function validateQuarter(quarter: string): boolean {
    return /^[1-4]$/.test(quarter);
}
```

And use these in our handlers:

```javascript
async function handleGetFinancialStatement(entity: string, type?: string, year?: string, quarter?: string) {
    // Validate inputs
    if (!validateEntityId(entity)) {
        return {
            content: [{ type: "text", text: "Invalid entity ID format" }],
            isError: true
        };
    }
    
    if (year && !validateYear(year)) {
        return {
            content: [{ type: "text", text: "Invalid year format" }],
            isError: true
        };
    }
    
    if (quarter && !validateQuarter(quarter)) {
        return {
            content: [{ type: "text", text: "Invalid quarter format" }],
            isError: true
        };
    }
    
    // Rest of the handler...
}
```

## 5.6 Testing the MCP Server

Let's create a script to test our MCP Server directly:

```javascript
// test_mcp.js
const { spawn } = require('child_process');
const path = require('path');

// Test request to get financial statement
const testRequest = {
    id: "test-1",
    jsonrpc: "2.0",
    method: "callTool",
    params: {
        name: "xbrl_getFinancialStatement",
        arguments: {
            entity: "FUNO",
            type: "balanceSheet",
            year: "2024",
            quarter: "4"
        }
    }
};

// Spawn the MCP server process
const mcp = spawn('node', [path.join(__dirname, 'build', 'server.js')], {
    env: { ...process.env, API_BASE_URL: 'http://localhost:8000' }
});

// Send the test request
mcp.stdin.write(JSON.stringify(testRequest) + '\n');

// Log the response
mcp.stdout.on('data', (data) => {
    try {
        const response = JSON.parse(data.toString());
        console.log('MCP Response:');
        console.log(JSON.stringify(response, null, 2));
    } catch (error) {
        console.error('Error parsing response:', error);
        console.log('Raw response:', data.toString());
    }
    // Close the MCP server
    mcp.stdin.end();
});

mcp.stderr.on('data', (data) => {
    console.error('MCP Server error:', data.toString());
});

mcp.on('close', (code) => {
    console.log(`MCP Server exited with code ${code}`);
});
```

To run the test:

```bash
node test_mcp.js
```

### Building the Docker Image

Let's use the provided Dockerfile to build our MCP Server:

```bash
docker build -t mcp/xbrl-json .
```

### Configuring Claude Desktop

To use our MCP Server with Claude Desktop, we need to configure it using the provided `claude_desktop_config.json`:

1. Find your Claude Desktop configuration directory (usually in `~/.config/claude-desktop/` on macOS)
2. Copy the `claude_desktop_config.json` to this directory
3. Restart Claude Desktop

The configuration connects Claude Desktop to our MCP Server running in Docker:

```json
{
    "mcpServers": {
      "xbrl-json": {
        "command": "docker",
        "args": [
          "run",
          "-i",
          "--rm",
          "mcp/xbrl-json"
        ]
      }
    }
}
```

Now, Claude Desktop can access our XBRL data through the MCP Server, enabling us to perform advanced financial analysis and visualization in the next sections.

I'll create Section 6 of your tutorial about integrating the XBRL data system with Claude Desktop. Here's the content for Section 6:

# 6. Integrating with Claude Desktop

Now that we have our XBRL data API and MCP server running, we can connect Claude Desktop to leverage AI capabilities for analyzing our financial data.

## 6.1 Introduction to Claude Desktop

Claude Desktop is an application that provides a user-friendly interface for interacting with Claude, Anthropic's AI assistant. For our financial data analysis system, Claude Desktop serves as the front-end that allows users to:

- Query financial data using natural language
- Analyze XBRL reports through conversational interactions
- Generate visualizations based on financial metrics
- Compare companies and their financial performance
- Extract specific insights from complex financial data

The Claude Desktop application connects to our MCP server, which acts as a bridge to our XBRL data API, enabling Claude to access and analyze the financial data.

## 6.2 Setting Up Claude to Connect to the MCP Server

To connect Claude Desktop to our MCP server, we need to configure the application with the proper settings:

1. **Create a configuration file** for Claude Desktop:

```json
{
  "mcpServers": {
    "xbrl-json": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/xbrl-json"
      ]
    }
  }
}
```

2. **Save this configuration** as `claude_desktop_config.json` in the appropriate directory:
   - macOS: `~/Library/Application Support/Claude Desktop/config.json`

3. **Start the Docker container** for the MCP server if it's not already running:

```bash
docker-compose up -d mcp-server
```

4. **Launch Claude Desktop** and verify the connection:
   - Open Claude Desktop application
   - In a new conversation, test the connection with a simple query like "Can you list the available XBRL entities?"

## 6.3 Creating Basic Query Templates

To make effective use of Claude for financial analysis, it's helpful to establish some basic query templates. Here are examples that demonstrate how to interact with the XBRL data:

### Retrieving Entity Information

```
Could you list all available entities in the XBRL database and provide some basic information about them?
```

### Getting Financial Metrics

```
What were the key financial metrics for FUNO in Q4 2024? Please include revenue, profit, assets, and cash position.
```

### Comparing Entities

```
Compare the financial performance of FUNO and FSHOP for Q4 2024, focusing on their revenue, profit margin, and debt levels.
```

### Analyzing Trends

```
Show me the trend in SOMA's revenue over the last 4 quarters. Can you create a visualization for this data?
```

### Calculating Ratios

```
Calculate and explain the key financial ratios for FSHOP based on their most recent financial statements. Include liquidity, profitability, and solvency ratios.
```

These templates serve as starting points for more complex analyses and can be customized based on specific analytical needs.

## 6.4 Understanding Context and Prompting for Financial Data

When working with Claude and XBRL data, effective prompting is essential for accurate analysis. Here are some guidelines for creating effective prompts:

### Specify Data Requirements Clearly

Include specific parameters in your prompts:
- Entity name (FUNO, FSHOP, SOMA)
- Time period (year, quarter)
- Specific metrics or concepts
- Type of analysis (comparison, trend, ratios)

### Example Effective Prompts

**Clear and specific**:
```
Please retrieve the balance sheet for FUNO from Q4 2024 and calculate its current ratio and debt-to-equity ratio.
```

**For complex analysis**:
```
Analyze the profitability trends for FSHOP over the last 4 quarters. Calculate the quarter-over-quarter growth rate and visualize the results in a line chart. Also, identify any significant changes and possible reasons for them.
```

### Iterative Refinement

Financial analysis often requires an iterative approach:

1. Start with a broad query to understand available data
2. Follow up with more specific questions based on initial findings
3. Ask for clarifications or alternative perspectives on the data
4. Request visualizations to better understand trends or comparisons

By following these guidelines and using the query templates, you can effectively leverage Claude's capabilities to analyze XBRL financial data through a conversational interface.

With the integration complete, we've now established a comprehensive system that allows users to interact with complex financial data through natural language. In the next section, we'll explore more advanced queries and analytical techniques.

# 7. Creating Advanced Queries with Claude

Now that we have Claude Desktop connected to our XBRL data system, let's explore more sophisticated query techniques for financial analysis.

## 7.1 Designing Effective Prompts for Financial Analysis

Creating effective prompts is essential for leveraging Claude's capabilities to analyze financial data. Here are strategies for designing advanced prompts:

### Structured Analytical Frameworks

Frame your queries using established financial analysis frameworks:

```
Use the DuPont analysis framework to break down FUNO's Return on Equity for Q4 2024 into its component parts (profit margin, asset turnover, and financial leverage).
```

### Multi-step Analysis

Guide Claude through a sequential analysis process:

```
Let's analyze FSHOP's financial health. First, extract key metrics from their Q4 2024 statements. Then, calculate their liquidity, solvency, and profitability ratios. Finally, compare these to industry benchmarks and provide an assessment of their financial position.
```

### Contextual Background

Provide relevant context for more insightful analysis:

```
Considering that Mexican REITs (FIBRAs) typically focus on commercial real estate and were impacted by the post-pandemic return to offices in 2024, analyze SOMA's performance in Q4 2024 compared to Q4 2023. How has their occupancy rate and rental income changed?
```

## 7.2 Querying and Comparing Financial Data Across Companies

Advanced comparison techniques can provide valuable insights:

### Peer Analysis

```
Compare the asset quality and management efficiency of all three FIBRAs (FUNO, FSHOP, and SOMA) for Q4 2024. Create a table showing their total assets, asset turnover ratio, and return on assets. Which company is utilizing its assets most efficiently?
```

### Sector-specific Comparisons

```
For all three FIBRAs, extract their Net Operating Income (NOI) and calculate their NOI margins. Also compare their Funds From Operations (FFO) per share. Create a bar chart visualization to compare these metrics side by side.
```

### Competitive Position Analysis

```
Analyze the competitive position of FUNO compared to FSHOP and SOMA based on Q4 2024 data. Consider market share (based on total assets), profitability, and debt levels. What are FUNO's strengths and weaknesses compared to its competitors?
```

## 7.3 Extracting Specific Financial Metrics

Targeted extraction of financial data can answer specific business questions:

### Debt Profile Analysis

```
Extract all debt-related information for FSHOP from Q4 2024. Include short-term borrowings, long-term debt, interest expenses, and any debt covenants mentioned. Calculate their interest coverage ratio and debt service coverage ratio.
```

### Cash Flow Components

```
Break down SOMA's cash flow statement for Q4 2024 into its operating, investing, and financing components. What percentage of their cash flow comes from operations? Are they investing significantly in growth, and how are they financing it?
```

### Property Portfolio Analysis

```
Extract information about FUNO's property portfolio from their Q4 2024 report. What types of properties do they own, what is the geographic distribution, and what is the occupancy rate? Has there been any significant change in their portfolio composition?
```

## 7.4 Performing Trend Analysis Over Time

Temporal analysis provides insights into company trajectory:

### Year-Over-Year Comparisons

```
Compare FSHOP's Q4 2024 performance with Q4 2023. Focus on revenue, occupancy rates, NOI, and FFO. Calculate the year-over-year percentage changes and visualize these trends.
```

### Sequential Quarter Analysis

```
Analyze SOMA's quarterly performance throughout 2024 (Q1-Q4). Show the quarter-on-quarter growth rates for key metrics and identify any seasonal patterns or trends. Create a line chart showing the progression of their main revenue streams.
```

### Multi-year Performance Tracking

```
Retrieve annual data for FUNO from 2022-2024 and analyze their growth trajectory. Calculate compound annual growth rates (CAGR) for revenue, net income, and assets. Is the company consistently growing, plateauing, or declining?
```

## 7.5 Implementing Ratio Analysis

Financial ratios provide deeper insights into company performance:

### Comprehensive Ratio Dashboard

```
Create a comprehensive ratio analysis dashboard for FSHOP using Q4 2024 data. Include:
1. Liquidity ratios (current ratio, quick ratio)
2. Efficiency ratios (asset turnover, inventory turnover)
3. Profitability ratios (margin, ROA, ROE)
4. Solvency ratios (debt-to-equity, interest coverage)
5. REIT-specific metrics (FFO, AFFO, cap rate)
```

### Ratio Trend Analysis

```
Track how SOMA's key financial ratios have evolved over the last 4 quarters of 2024. Focus on profitability ratios (gross margin, operating margin, net margin) and return ratios (ROA, ROE). Visualize these trends and explain what they indicate about the company's operational efficiency.
```

### Industry-Specific Ratio Analysis

```
For all three FIBRAs, calculate the following REIT-specific metrics for Q4 2024:
1. Funds From Operations (FFO)
2. Adjusted Funds From Operations (AFFO)
3. Net Asset Value (NAV)
4. Cap Rate
5. Debt Service Coverage Ratio

Compare these values and explain what they tell us about each REIT's quality and financial stability.
```

These advanced query techniques demonstrate how Claude can perform sophisticated financial analysis using the XBRL data in our system. By combining natural language understanding with structured financial analysis frameworks, Claude can extract meaningful insights that would traditionally require specialized expertise and technical tools.

# Conclusion

Congratulations! You've successfully built a comprehensive financial data analysis system that leverages modern technologies to extract, store, analyze, and visualize XBRL financial data. This tutorial has taken you through the entire process, from understanding XBRL JSON structure to creating a powerful API with Deno, and finally integrating Claude Desktop to perform advanced financial analysis.

## What We've Accomplished

Throughout this tutorial, we've:

1. Set up a robust database system using FerretDB to store structured XBRL financial data
2. Built a flexible API with Deno that provides powerful querying capabilities
3. Created an MCP Server to facilitate communication between our API and Claude Desktop
4. Integrated Claude Desktop to enable natural language financial analysis
5. Developed advanced querying techniques for extracting financial insights

The system we've built enables financial analysts, researchers, and business professionals to interact with complex financial data through simple, conversational interfaces. By combining the structured nature of XBRL with the analytical capabilities of Claude, we've created a powerful tool for financial reporting and analysis.

## Next Steps

While this tutorial has covered significant ground, there are several ways you could extend this system:

- Expand the data coverage to include more companies and longer time periods
- Implement additional specialized financial analysis tools
- Add support for automatically importing new XBRL filings
- Enhance the visualization capabilities with more chart types and interactive elements
- Add user authentication and personalized dashboards

## Final Thoughts

Financial data analysis traditionally requires specialized knowledge and complex tools. By combining XBRL, FerretDB, Deno, and Claude Desktop, we've democratized access to financial insights, making them available through natural language interactions.

The techniques you've learned in this tutorial can be applied to other domains beyond financial reporting, wherever structured data needs to be analyzed through conversational interfaces.

We hope you find this system useful for your financial analysis needs and that the knowledge gained serves as a foundation for building even more sophisticated data analysis tools in the future.

Thank you for following this tutorial, and happy analyzing!