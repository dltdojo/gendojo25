import { parseArgs } from "@std/cli/parse-args";
import { updateFreshProject } from "./init.ts";

const flags = parseArgs(Deno.args, {
  boolean: ["help"],
  alias: {
    help: "h",
  },
});

updateFreshProject(Deno.cwd(), flags._ as string[]);