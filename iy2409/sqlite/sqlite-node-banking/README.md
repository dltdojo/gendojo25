---
title: Simple Banking Application with SQLite (Node.js and Bash)
date: 2023-10-27
description: This project demonstrates a simple banking application using SQLite as the database, implemented in both Node.js and Bash.
keywords: sqlite, nodejs, bash, banking, docker, docker compose
---

# Simple Banking Application with SQLite

This repository contains a simple banking application implemented in both Node.js and Bash, using SQLite as the database. It provides basic banking functionalities such as creating accounts, depositing and withdrawing funds, checking balances, transferring money between accounts, and viewing transaction history.

## Features

- **Account Management:** Create new bank accounts.
- **Transactions:** Deposit, withdraw, and transfer funds.
- **Balance Inquiry:** Check account balances.
- **Transaction History:** View a history of transactions for an account or all accounts.
- **Dual Implementation:** Choose between a Bash script or a Node.js application for the banking interface.
- **Dockerized:** The application can be easily run and deployed using Docker and Docker Compose.

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your system.

### Running the Application

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/sqlite-node-banking.git 
   ```

2. Navigate to the project directory:

   ```bash
   cd sqlite-node-banking
   ```

3. Build and run the Docker container:

   ```bash
   docker compose run --rm bank-app
   ```

This will start the application and present you with the main menu. You can then choose to run either the Bash or Node.js implementation of the banking system.


## Where does SQLite come from?

The SQLite database used in this project is handled differently depending on the implementation:

- **Bash Implementation (banking.sh):** The Bash script utilizes the `sqlite3` command-line tool, which is installed as part of the system's packages (using `apt-get install sqlite3` in the Dockerfile).  The script directly interacts with the SQLite database file (`bank-sh.db`) using this tool.
- **Node.js Implementation (banking.js):** The Node.js application uses the `node:sqlite` module, which provides a native JavaScript interface for interacting with SQLite databases. This module is included as part of the Node.js installation and does not require separate installation via `apt-get` within the Docker container.

## Code Structure

- **app.sh:** Main shell script that presents the menu to choose between Bash and Node.js implementations.
- **banking.js:** Node.js implementation of the banking system.
- **banking.sh:** Bash implementation of the banking system.
- **compose.yaml:** Docker Compose file for building and running the application.
- **Dockerfile:** Dockerfile for building the Node.js environment with SQLite.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.