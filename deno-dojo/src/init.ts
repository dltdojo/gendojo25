import * as path from "@std/path";
import { ensureDirSync } from "@std/fs/ensure-dir";
// Dojo catalog:  Maps dojo names to their base URL and file list.
import catalogJson from "./catalog.json" with { type: "json" };

interface DojoEntry {
  baseUrl: string;
  files: string[];
}

// Type the catalog using the DojoEntry interface
const DOJO_CATALOG: Record<string, DojoEntry> = catalogJson;

/**
 * Downloads a file from a given URL and saves it to the specified path.
 * Handles merging of `deno.json` files if both the source and destination are `deno.json` files.
 *
 * @param url The URL of the file to download.
 * @param outputPath The local path where the file should be saved.
 * @throws {Error} If the file download fails or the response status is not 200.
 */
async function downloadAndMergeFile(
  url: string | URL | Request,
  outputPath: string | URL,
) {
  const fileResponse = await fetch(url);

  if (fileResponse.status === 200 && fileResponse.body) {
    if (
      url.toString().endsWith("deno.json") &&
      outputPath.toString().endsWith("deno.json")
    ) {
      // Merge deno.json files
      const existingDenoJson = JSON.parse(Deno.readTextFileSync(outputPath));
      const remoteDenoJson = await fileResponse.json();

      const mergedDenoJson = mergeDenoJsonFiles(existingDenoJson, remoteDenoJson);

      Deno.writeTextFileSync(outputPath, JSON.stringify(mergedDenoJson, null, 2));
      // console.log(`Merged and wrote deno.json to: ${outputPath}`);
    } else {
      // Download and save other files
      const file = await Deno.open(outputPath, { write: true, create: true });
      await fileResponse.body.pipeTo(file.writable);
    }
  } else {
    throw new Error(`Failed to fetch ${url}: ${fileResponse.statusText}`);
  }
}

/**
 * Merges two deno.json objects, giving precedence to values in the `remote` object.
 * Special handling for merging `tasks` and `imports`.
 *
 * @param existing The existing deno.json object.
 * @param remote The remote deno.json object to merge.
 * @returns The merged deno.json object.
 */
export function mergeDenoJsonFiles(existing: any, remote: any): any {
  const merged = { ...existing, ...remote };

  // Merge tasks and imports objects instead of overwriting
  merged.tasks = { ...existing.tasks, ...remote.tasks };
  merged.imports = { ...existing.imports, ...remote.imports };

  return merged;
}



/**
 * Downloads the files for a specified dojo to the given output directory.
 *
 * @param dojoName The name of the dojo to download.
 * @param outputDir The local directory where the files should be saved.
 * @throws {Error} If the dojo is not found in the catalog.
 */
export async function downloadDojo(dojoName: string, outputDir: string, catalog: any = DOJO_CATALOG) {
  const dojo: DojoEntry = catalog[dojoName];

  if (!dojo) {
    throw new Error(`Dojo "${dojoName}" not found in the catalog.`);
  }

  ensureDirSync(outputDir);

  const downloadPromises = dojo.files.map(async (file) => {
    const outputFile = path.join(outputDir, file);
    const url = dojo.baseUrl + file;

    try {
      await downloadAndMergeFile(url, outputFile);
      // console.log(`Downloaded: ${url} to ${outputFile}`);
    } catch (error) {
      console.error(`Error downloading ${url}:`, error);
    }
  });

  await Promise.all(downloadPromises);
}


/**
 * Updates a project by downloading the specified dojo files.
 *
 * @param cwd The current working directory. Defaults to `Deno.cwd()`.
 * @param input An array containing the dojo name and the project directory.
 * @param flags Command-line flags.  Currently unused.
 */
export function updateProject(
  cwd = Deno.cwd(),
  input: string[],
  flags: {
    [x: string]: unknown;
    help: boolean;
    h: boolean;
    _: Array<string | number>;
  },
) {
  const dojoName = input[0];
  const projectDir = path.join(cwd, input[1]);
  downloadDojo(dojoName, projectDir);
}