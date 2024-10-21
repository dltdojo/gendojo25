---
title: Deno Dojo CLI
date: 2024-10-20
description: A Deno CLI tool for scaffolding and updating Deno projects with predefined templates ("dojos").
keywords: deno, cli, scaffolding, templates, testing, dojo, todo
---

# Deno Dojo CLI

This CLI tool simplifies creating and updating Deno projects using predefined templates called "dojos". It leverages Deno's native modules and provides a convenient way to manage project dependencies and configurations.

## Features

* **Scaffolding:** Quickly set up new Deno projects with pre-configured files and dependencies.
* **Updating:** Easily update existing projects with new dojo versions, seamlessly merging `deno.json` files.
* **Template Management:** A catalog of dojos (templates) is maintained for easy access and updates.
* **Dependency Management:** Uses Deno's native import system for efficient dependency management.

## Usage

To update a project with a specific dojo (template), clone this repository and then use the `deno run` command directly with the `src/mod.ts` script or run the CLI from the jsr package registry using `jsr:@gendojo/deno-dojo`.

```bash
# deno init <project_directory>
deno run jsr:@gendojo/deno-dojo <dojo-name> <project_directory>
```

For example, to update the project "my-project" with the "test-expect" dojo:

```bash
# deno init my-project
deno run jsr:@gendojo/deno-dojo test-expect my-project
```

## Available Dojos (Templates)

* **`test-expect`**: A basic setup for testing with `@std/expect`. Includes example tests and helper functions.
* **`todo-090`**: This project demonstrates a simple to-do list application built using Deno and Deno KV. It showcases basic CRUD operations using a Data Access Object (DAO) pattern.
* **`todo-100`**: This project demonstrates a simple to-do list application built using Deno and SQLite. It showcases basic CRUD operations using a Data Access Object (DAO) pattern.
* **`blog-100`**: A simple command-line interface (CLI) blog application built with Deno, demonstrating persistent storage with SQLite.

The dojo catalog is located here:

- [https://jsr.io/@gendojo/deno-dojo/catalog](https://jsr.io/@gendojo/deno-dojo/0.0.3/catalog)
- [https://github.com/dltdojo/gendojo25/tree/main/deno-dojo/catalog](https://github.com/dltdojo/gendojo25/tree/main/deno-dojo/catalog)


## Development

This project is built using Deno and utilizes standard Deno modules for file system operations, CLI argument parsing, and HTTP requests.

The core logic for downloading and merging files is located in `src/init.ts`. The `DOJO_CATALOG` in `init.ts` defines the available dojos and their corresponding URLs.


Development is managed using a simple shell script:

```bash
./dev.sh <project_name> <command>
```

**Available Commands:**

* **`init-deno`**: Initializes a new Deno project in the specified directory.
    ```bash
    ./dev.sh my-deno-project init-deno
    ```
* **`clean`**: Cleans the specified project by removing `node_modules`, `deno.lock`, and running `deno cache --reload`. 
    ```bash
    ./dev.sh my-project clean
    ```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
