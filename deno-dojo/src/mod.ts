import { parseArgs } from "@std/cli/parse-args";
import { updateProject } from "./init.ts";

const flags = parseArgs(Deno.args, {
  boolean: ["help"],
  alias: {
    help: "h",
  },
});

updateProject(Deno.cwd(), flags._ as string[], flags);