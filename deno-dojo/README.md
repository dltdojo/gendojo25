---
title: Deno Dojo CLI
date: 2024-10-19
description: A Deno CLI tool for easily scaffolding and updating Deno projects with predefined templates ("dojos").
keywords: deno, cli, scaffolding, templates, testing, dojo
---

# Deno Dojo CLI

This CLI tool simplifies the process of creating and updating Deno projects using predefined templates, referred to as "dojos".  It leverages the power of Deno's native modules and provides a convenient way to manage project dependencies and configurations.

## Features

* **Scaffolding:** Quickly set up new Deno projects with pre-configured files and dependencies.
* **Updating:**  Easily update existing projects with new dojo versions, seamlessly merging `deno.json` files.
* **Template Management:** A catalog of dojos (templates) is maintained, allowing easy access and updates.
* **Dependency Management:** Uses Deno's native import system to handle dependencies efficiently.

## Usage

The CLI is invoked using a simple shell script.

```bash
./cli.sh <project_name> <command>
```

Available Commands:

* **`init-deno`**: Initializes a new Deno project in the specified directory.
    ```bash
    ./cli.sh my-deno-project init-deno
    ```
* **`start`**: Starts the Fresh 2 development server. (Not implemented in the provided code.)
    ```bash
    ./cli.sh my-project start
    ```
* **`clean`**: Cleans the specified project by removing `node_modules`, `deno.lock`, and running `deno clean`.
    ```bash
    ./cli.sh my-project clean
    ```

**Updating Project with a Dojo:**

To update a project with a specific dojo (template), use the `deno run` command directly with the `src/mod.ts` script.

```bash
deno run -A jsr:@gendojo/deno-dojo <dojo-name> <project_directory>
```

For example, to update the project "my-project" with the "test-expect" dojo:

```bash
deno run -A jsr:@gendojo/deno-dojo test-expect my-project
```

## Dojos (Templates)

Currently available dojos:

* **`test-expect`**: Provides a basic setup for testing with `@std/expect`. Includes example tests and helper functions.

## Development

This project is built using Deno and utilizes standard Deno modules for file system operations, CLI argument parsing, and HTTP requests.

The core logic for downloading and merging files is located in `src/init.ts`. The `DOJO_CATALOG` in `init.ts` defines the available dojos and their corresponding URLs.


## Contributing

Contributions are welcome!  Please feel free to submit issues and pull requests.