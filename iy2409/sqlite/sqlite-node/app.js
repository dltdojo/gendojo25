import { DatabaseSync } from 'node:sqlite';

// Initialize an in-memory SQLite database.
const database = new DatabaseSync(':memory:');

// Demonstrate basic SQL operations.
sqlTest();

// Demonstrate JSON handling within SQLite.
jsonTest();

/**
 * Demonstrates basic SQL operations: creating a table, inserting data, 
 * and querying the data.
 */
function sqlTest() {
  // Create a table named 'data' with an integer primary key and a text value.
  database.exec(`
    CREATE TABLE data (
      key INTEGER PRIMARY KEY,
      value TEXT
    ) STRICT
  `);

  // Prepare a statement for inserting data into the 'data' table.
  const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');

  // Insert two rows into the 'data' table.
  insert.run(1, 'hello');
  insert.run(2, 'world');

  // Prepare a statement for selecting all data from the 'data' table, 
  // ordered by the 'key' column.
  const query = database.prepare('SELECT * FROM data ORDER BY key');

  // Execute the query and log the results to the console.
  console.log('SQL Test Results:', query.all());
}

/**
 * Demonstrates storing and retrieving JSON data within SQLite.
 */
function jsonTest() {
  // Create a table named 'lorem' with a text column named 'info' to store JSON data.
  database.exec(`
    CREATE TABLE lorem (info TEXT)
  `);

  // Prepare a statement for inserting JSON data into the 'lorem' table.
  let stmt = database.prepare('INSERT INTO lorem VALUES(json(?))');

  // Insert 10 rows with JSON objects into the 'lorem' table.
  for (let i = 0; i < 10; i++) {
    stmt.run(JSON.stringify({ a: i }));
  }

  // Prepare a statement to select the row ID and extract the 'a' property 
  // from the JSON data in the 'info' column.
  const jsonQuery = database.prepare('SELECT rowid AS id, json_extract(info, \'$.a\') AS info FROM lorem');

  // Execute the query and log the results to the console.
  console.log('JSON Test Results:', jsonQuery.all());
}