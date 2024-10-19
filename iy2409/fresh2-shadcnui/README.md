---
title: @gendojo/fresh2-shadcnui
date: 2024-10-18
description: A Deno module for initializing and updating Fresh projects with Shadcn/UI components.
keywords: deno, fresh, shadcn/ui, initialization, cli
---

# @gendojo/fresh2-shadcnui

This Deno module provides a CLI tool to initialize and update Fresh projects with pre-configured Shadcn/UI components and a Tailwind CSS setup.

## Usage

### Initialization

To initialize a new Fresh project with Tailwind CSS and VSCode settings, use the following command (replace `your_project_name` with the desired name):

```bash
deno run -Ar jsr:@fresh/init@2.0.0-alpha.22 your_project_name --force --tailwind --vscode
```

### Updating with Shadcn/UI & Tailwind Configuration

After initializing, use this module to add Shadcn/UI components, Tailwind configurations, and utility functions:

```bash
deno run -A jsr:@gendojo/fresh2-shadcnui your_project_name
```
This command will:

- Download specific Shadcn/UI components (Button, Input, Checkbox, Label, Select, Dropdown Menu) and place them in `islands/ui`.
- Update or create necessary files like `deno.json`, `tailwind.config.ts`, `postcss.config.js`, `eslint.config.mjs`, `lib/utils.ts`, `islands/Counter.tsx`, and `static/styles.css` with pre-configured content.

### Using the CLI (cli.sh)

The provided `cli.sh` script simplifies project management:

```bash
./cli.sh <project_name> <command>
```

Available commands:

- `init`: Initializes a new Fresh project (same as the first step above).
- `update`: Updates the project with Shadcn/UI and configuration (same as the second step above).
- `start`: Starts the Fresh development server (`deno task dev`).
- `clean`: Cleans the project by removing `node_modules`, `deno.lock`, and running `deno clean`.

## Docker

A `Dockerfile` is provided for containerized development.

```bash
docker build -t my-fresh-app .
docker run --rm -it -p 8000:8000 my-fresh-app
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

Licensed under the Apache-2.0 License.