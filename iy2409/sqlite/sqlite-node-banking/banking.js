import { DatabaseSync } from 'node:sqlite';
import * as readline from 'node:readline/promises';

// Database setup
const DB_FILE = 'bank-js.db';
const database = new DatabaseSync(DB_FILE);

// Initialize database tables if they don't exist
function initializeDatabase() {
  database.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT NOT NULL, 
      balance REAL DEFAULT 0.0
    );
  `);
  database.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      source_id INTEGER, 
      dest_id INTEGER, 
      amount REAL, 
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Function to create a new account
async function createAccount(rl) {
  const name = await rl.question('Enter account name: ');
  database.prepare('INSERT INTO accounts (name) VALUES (:name)').run({ name });
  console.log('Account created for', name);
}

/**
 * Deposits money into a specified account.
 * @param {readline.Interface} rl - Readline interface for user input
 */
async function deposit(rl) {
  // Prompt user for account ID and deposit amount
  const id = await rl.question('Enter account ID: ');
  const amount = await rl.question('Enter amount to deposit: ');

  // 
  // Execute a transaction to update the account balance and record the deposit
  // Note: Using database.exec() to run multiple SQL statements in one call
  // This approach is used because database.prepare().run() would only execute the first statement
  // SQLite's preparation process is designed to work on a statement-by-statement basis. It parses the SQL, 
  // optimizes the query plan, and gets it ready for execution. It doesn't inherently handle batches 
  // of unrelated SQL statements in a single preparation call.
  // 
  // Is there a way to prepare multiple statements into one statement object ?
  // https://github.com/WiseLibs/better-sqlite3/issues/320
  // 
  database.exec(`
    BEGIN TRANSACTION;
    -- Increase the account balance
    UPDATE accounts SET balance = balance + ${amount} WHERE id = ${id};
    -- Record the transaction (source_id 0 represents a deposit)
    INSERT INTO transactions (source_id, dest_id, amount) VALUES (0, ${id}, ${amount});
    COMMIT;
  `);

  console.log('Deposit successful.');
}

// Function to withdraw money
async function withdraw(rl) {
  const id = await rl.question('Enter account ID: ');
  const amount = await rl.question('Enter amount to withdraw: ');

  database.exec(`
    BEGIN TRANSACTION;
    UPDATE accounts SET balance = balance - ${amount} WHERE id = ${id};
    INSERT INTO transactions (source_id, dest_id, amount) VALUES (${id}, 0, ${amount}); 
    COMMIT;
  `);

  console.log('Withdrawal successful.');
}

// Function to check balance
async function checkBalance(rl) {
  const id = await rl.question('Enter account ID: ');
  const row = database.prepare('SELECT balance FROM accounts WHERE id = ?').get(id); // Assign the result to 'row'
  console.log('Account balance:', row.balance);
}

// Function to transfer money
async function transfer(rl) {
  const sourceId = await rl.question('Enter source account ID: ');
  const destId = await rl.question('Enter destination account ID: ');
  const amount = await rl.question('Enter amount to transfer: ');

  const sourceBalance = database.prepare('SELECT balance FROM accounts WHERE id = ?').get(sourceId).balance;

  if (sourceBalance >= amount) {
    database.exec(`
      BEGIN TRANSACTION;
      UPDATE accounts SET balance = balance - ${amount} WHERE id = ${sourceId};
      UPDATE accounts SET balance = balance + ${amount} WHERE id = ${destId};
      INSERT INTO transactions (source_id, dest_id, amount) VALUES (${sourceId}, ${destId}, ${amount});
      COMMIT;
    `);
    console.log('Transfer successful.');
  } else {
    console.log('Insufficient funds in source account.');
  }
}

// Function to print all tables (for debugging)
function printTables() {
  console.log('Accounts Table:');
  const accountsQuery = database.prepare('SELECT * FROM accounts');
  console.table(accountsQuery.all());

  console.log('\nTransactions Table:');
  const transactionsQuery = database.prepare('SELECT * FROM transactions');
  console.table(transactionsQuery.all());
}

// Function to view transaction history
async function viewTransactionHistory(rl) {
  const id = await rl.question('Enter account ID (or leave blank for all): ');
  if (id) {
    console.log(`Transaction History (Account ${id}):`);
    // Use parameterized queries to prevent SQL injection
    const query = database.prepare(
      'SELECT * FROM transactions WHERE source_id = ? OR dest_id = ?'
    );
    console.table(query.all(id, id));
  } else {
    console.log('Transaction History (All Accounts):');
    const query = database.prepare('SELECT * FROM transactions');
    console.table(query.all());
  }
}

// Main menu loop
async function mainMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(`
  Banking System Menu:

  1. Create Account
  2. Deposit
  3. Withdraw
  4. Check Balance
  5. Transfer
  6. Print Tables (Debug)
  7. View Transaction History
  8. Exit
  `);

  const choice = await rl.question('Enter your choice: ');
  switch (choice) {
    case '1':
      await createAccount(rl);
      break;
    case '2':
      await deposit(rl);
      break;
    case '3':
      await withdraw(rl);
      break;
    case '4':
      await checkBalance(rl);
      break;
    case '5':
      await transfer(rl);
      break;
    case '6':
      printTables();
      break;
    case '7':
      await viewTransactionHistory(rl);
      break;
    case '8':
      rl.close();
      process.exit(0);
    default:
      console.log('Invalid choice. Please try again.');
  }

  // Re-display the menu after each operation
  rl.close();
  mainMenu();
}

// Initialize the database and start the application
initializeDatabase();
mainMenu();