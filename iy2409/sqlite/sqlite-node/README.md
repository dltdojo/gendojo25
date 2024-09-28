---
title: SQLite JSON Functions with Node.js
date: 2023-10-27
description: This example demonstrates how to use SQLite's JSON functions with Node.js and the experimental 'node:sqlite' module, showcasing json() and json_extract().
keywords: sqlite, nodejs, json, database, docker, compose, experimental, node:sqlite
---

# SQLite JSON Functions with Node.js

This project demonstrates how to use SQLite's JSON functions within a Node.js application using the experimental `node:sqlite` module. It covers basic SQL operations and focuses on the capabilities of SQLite's JSON extension, including functions like `json()`, `json_extract()`, and `json_object()`.

## Node.js SQLite: Experimental vs. Third-Party

Traditionally, interacting with SQLite from Node.js required using third-party libraries like `sqlite3`. However, Node.js is now offering experimental support for SQLite through the built-in `node:sqlite` module.

**Key Differences:**

- **`node:sqlite`:**
    - Native to Node.js, no external dependencies.
    - Currently experimental, API might change in the future.
    - Uses the `Database` class.
- **Third-Party Libraries (e.g., `sqlite3`):**
    - Stable and well-established.
    - Might require additional installation.
    - Often use different APIs, like callbacks or promises.

This example leverages the experimental `node:sqlite` module for its simplicity and integration with Node.js.

## JSON Functions in SQLite

SQLite's JSON extension provides powerful functions for working with JSON data directly within the database. This example highlights:

- **`json()`:**
    - Takes any value and converts it into a JSON string.
    - Used in the `jsonTest()` function to store JavaScript objects as JSON strings in the 'lorem' table.

- **`json_extract()`:**
    - Extracts a specific value from a JSON string using a JSON path expression.
    - Used in the `jsonQuery` to retrieve the value of the 'a' property from the JSON data in the 'info' column.

- **`json_object()`:** 
    - Although not demonstrated in this example, `json_object()` is a powerful function that allows you to construct JSON objects directly within SQLite.
    - Example: `SELECT json_object('name', 'John', 'age', 30);` would create a JSON object `{"name": "John", "age": 30}`.

## Running the Example

This project uses Docker Compose to simplify the setup and execution:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/sqlite-node.git
   cd sqlite-node
   ```

2. **Run the application using Docker Compose:**
   ```bash
   docker-compose run --rm box1
   ```

This command will build the Node.js environment, execute the `app.js` script, and display the results of the SQL and JSON tests in the console.

## Code Explanation

- **`app.js`:**
    - Initializes an in-memory SQLite database.
    - Defines `sqlTest()` to demonstrate basic SQL operations (create table, insert, select).
    - Defines `jsonTest()` to demonstrate JSON functions (insert JSON, extract values).

- **`compose.yaml`:**
    - Defines a Docker Compose service named `box1`.
    - Uses the `node:22.9` image.
    - Mounts the `app.js` file into the container.
    - Enables the experimental SQLite features using the `--experimental-sqlite` and `--no-warnings=ExperimentalWarning` flags.

This example provides a starting point for exploring SQLite's JSON capabilities within a Node.js application. You can adapt and expand upon it to suit your specific needs.