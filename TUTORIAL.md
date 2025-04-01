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
