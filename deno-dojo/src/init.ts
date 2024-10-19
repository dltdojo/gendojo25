import * as path from "@std/path";
import { ensureDirSync } from "@std/fs/ensure-dir";

async function downloadFile(
  url: string | URL | Request,
  outputPath: string | URL,
) {
  const fileResp = await fetch(url);
  if (fileResp.status == 200 && fileResp.body) {
    const file = await Deno.open(outputPath, { write: true, create: true });
    await fileResp.body.pipeTo(file.writable);
  } else{
    throw new Error(fileResp.statusText);
  }
}

const DojoTestExpect = {
  baseUrl : "https://raw.githubusercontent.com/dltdojo/gendojo25/main/deno-dojo/registry/test-expect/",
  files:  [
    "deno.json",
    "foo_test.ts",
    "testlib.ts"
  ]
}

async function downloadDojoFiles(outputDir: string) {
  ensureDirSync(outputDir); // Ensure the output directory exists

  const downloadPromises = DojoTestExpect.files.map(async (_file) => {
    const outputFile = path.join(outputDir, _file);
    const url = DojoTestExpect.baseUrl + _file;

    try {
      await downloadFile(url, outputFile);
      console.log(`Downloaded: ${url}`);
    } catch (error) {
      console.error(`Error downloading ${url}:`, error);
    }
  });

  await Promise.all(downloadPromises); // Wait for all downloads to complete
}

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
  downloadDojoFiles(projectDir)
}
