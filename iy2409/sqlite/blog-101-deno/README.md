---
title: Deno Blog CLI Application with SQLite
date: 2024-07-24
description: A simple command-line interface (CLI) application built with Deno for managing blog posts, using SQLite for data persistence.
keywords: deno, cli, sqlite, blog, typescript, crud, docker
---

This project demonstrates a basic blog management application built with Deno, utilizing a SQLite database for persistent storage. The application provides a CLI for creating, reading, updating, and deleting blog posts.

## Features

* **CRUD operations:** Create, Read, Update, and Delete blog posts.
* **SQLite integration:** Uses SQLite for persistent data storage.
* **CLI interaction:** Provides a user-friendly command-line interface.
* **Dockerized environment:** Includes a Dockerfile and docker-compose.yaml for easy setup and deployment.
* **Unit tested:** Comprehensive unit tests using the standard testing module ensure code quality and reliability.
* **Type-safe code:** Written in TypeScript with Zod validation for enhanced type safety.


## Getting Started

### Prerequisites

* Docker: Install Docker Desktop or Docker Engine.
* Deno: Install Deno following the instructions on the official website.


### Running the application

#### Using Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/blog-101-deno.git  # Replace with your repository URL
   cd blog-101-deno
   ```
2. Run the application using docker-compose:
   ```bash
   docker compose run --rm app101
   ```
This will build the Docker image, mount the necessary volumes, and start the Deno application inside a container.

#### Using Deno directly

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/blog-101-deno.git  # Replace with your repository URL
   cd blog-101-deno
   ```
2. Install dependencies:
    ```bash
    deno install
    ```
3. Run the CLI application:
    ```bash
    deno task cli
    ```

### Running Tests

To run the unit tests, use the following command:

```bash
deno task test
```

## Code Overview

### `dao.ts`

This file contains the `BlogDAO` class, which handles database interactions. It uses the `@db/sqlite` module to connect to the SQLite database and provides methods for creating, reading, updating, and deleting blog posts.  Zod schemas ensure type safety for post objects.

### `index.ts`

This file contains the `BlogCLI` class, which provides the command-line interface for the application. It uses the `readline` module to interact with the user and the `BlogDAO` class to perform database operations.  It also handles graceful shutdown on `SIGINT` and `SIGTERM`.

### `compose.yaml`

This file defines the Docker environment for the application, including the build context, Dockerfile, working directory, user, command, and volume mounts.

### `Dockerfile`

This file defines how to build the Docker image for the application. It uses the `denoland/deno` base image and installs the necessary dependencies.

### `deno.json`

This file specifies the project's dependencies, import maps, and tasks for running the application, tests, and Docker.


## Further Development

This project can be extended in several ways, including:

* Implementing a web UI for managing blog posts.
* Adding more features to the CLI, such as searching and filtering posts.
* Integrating with other services, such as email notifications or social media sharing.
* Using a different database, such as PostgreSQL or MySQL.


This example demonstrates a basic implementation of a blog management application using Deno and SQLite. It provides a solid foundation for building more complex applications.