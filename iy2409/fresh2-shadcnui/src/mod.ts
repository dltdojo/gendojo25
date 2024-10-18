import { parseArgs } from "@std/cli/parse-args";
import { initProject } from "./init.ts";

const flags = parseArgs(Deno.args, {
  boolean: ["foo", "help"],
  default: {
    foo: null,
  },
  alias: {
    help: "h",
  },
});

await initProject(Deno.cwd(), flags._, flags);