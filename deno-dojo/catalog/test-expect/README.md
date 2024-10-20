---
title: Deno Test with Expect
date: 2024-10-20
description: Example of using Deno's built-in test runner with the `@std/expect` assertion library.
keywords: deno, testing, expect, assertions, bdd
---

This project demonstrates how to write and run tests in Deno using the built-in test runner and the `@std/expect` assertion library.  It uses a simple `add` function as an example.

## Setup

This project uses a `deno.json` file to manage dependencies and define tasks.  The `imports` section is crucial for specifying external modules, including the testing libraries.  It also uses aliasing for cleaner imports within the test files.

```json
{
  "tasks": {
    "dev": "deno run --watch main.ts",
    "dojo:test": "deno test"
  },
  "imports": {
    "@/": "./",
    "testlib": "./testlib.ts",
    "@std/assert": "jsr:@std/assert@1",
    "@std/expect": "jsr:@std/expect@^1.0.5",
    "@std/testing": "jsr:@std/testing@^1.0.3"
  }
}
```

A `testlib.ts` file re-exports commonly used testing functions from the standard library modules.  This simplifies imports in test files.

```typescript
// testlib.ts
export { fail } from "@std/assert";
export { describe, it, beforeEach, afterEach } from "@std/testing/bdd";
export { expect } from "@std/expect";
```

## Testing

The `foo_test.ts` file contains example tests for the `add` function defined in `main.ts` (not shown here, but assumed to exist and contain the `add` function).  The tests use the BDD style syntax provided by `@std/testing/bdd` and the `expect` assertion library for validating results.

```typescript
// foo_test.ts
import { describe, it , expect } from "testlib";
import { add } from "@/main.ts";

describe("add function", () => {
    it("adds two numbers correctly", () => {
      const result = add(2, 3);
      expect(result).toBe(5);
    });
  
    it("handles negative numbers", () => {
      const result = add(-2, -3);
      expect(result).toBe(-5);
    });
  });
```

## Running Tests

To run the tests, simply execute:

```bash
deno task test
```

This command utilizes the `test` task defined in the `deno.json` file, which runs the Deno test runner. The test runner will automatically discover and execute the test files (files ending with `_test.ts`).


This simple example provides a solid foundation for writing and running tests in your Deno projects using `@std/expect` and the built-in testing capabilities.  You can expand upon this by adding more complex tests and utilizing other features provided by the testing libraries.