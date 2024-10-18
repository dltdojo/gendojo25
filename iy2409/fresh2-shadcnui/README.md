---
title: @gendojo/fresh2-shadcnui
date: 2024-10-18
description: A Deno module for project initialization.
keywords: deno, fresh, shadcn/ui, initialization, cli
---

# @gendojo/fresh2-shadcnui

This Deno module provides a CLI tool to initialize projects.

## Usage

```bash
deno run --allow-read jsr:@gendojo/fresh2-shadcnui@0.1.0-alpha.1 --foo
```

## Options

- `--foo`: A boolean flag. Defaults to `null`.
- `--help`, `-h`: Show help information.

## API

The module exports a function `initProject` which can be used programmatically.

```typescript
import { initProject } from "./init.ts";

await initProject(Deno.cwd(), ["hello", "world"], { foo: true });
```

The `initProject` function takes the following arguments:

- `cwd`: The current working directory. Defaults to `Deno.cwd()`.
- `input`: An array of strings or numbers representing the inputs.
- `flags`: An object containing the flags.  Currently supports `foo` (boolean, defaults to `null`).


## Development

This project uses Deno.

```bash
deno task test # Run tests
deno task fmt  # Format code
deno task lint # Lint code
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

Licensed under the Apache-2.0 License.