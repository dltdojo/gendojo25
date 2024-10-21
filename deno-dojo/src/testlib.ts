import { serveDir } from "@std/http/file-server";
import * as path from "@std/path";
import { parse as junit2jsonParse } from "@kesin11/junit2json";

export { fail } from "@std/assert";
export { describe, it, beforeEach, afterEach } from "@std/testing/bdd";
export { expect } from "@std/expect";

/**
 * Creates a mock HTTP file server serving files from a specified directory.
 *
 * @param directoryName The name of the directory to serve files from.
 * @param port The port on which the server will listen (defaults to 8001).
 * @returns An object containing the running HTTP server instance.
 */
export const createMockFileServer = (directoryName: string, port: number = 8001) => {
    const absoluteDirectoryPath = path.join(Deno.cwd(), directoryName);
    const server = Deno.serve(
        { hostname: "localhost", port },
        (req) => {
            const pathname = new URL(req.url).pathname;
            // Only serve requests with paths starting with "/".  Ignore others.
            if (pathname.startsWith("/")) {
                return serveDir(req, {
                    fsRoot: absoluteDirectoryPath,
                });
            }
            return new Response();
        });
    return { server }
}

/**
 * Creates a temporary Deno project for testing purposes.
 *
 * @param projectName The name of the temporary project directory (defaults to "test-project").
 * @returns An object containing the paths to the temporary directory and the project directory.
 */
export const createTemporaryDenoProject = async (projectName = "test-project") => {
    const tempDirectoryPath = Deno.makeTempDirSync();
    const projectDirectoryPath = path.join(tempDirectoryPath, projectName);
    const command = new Deno.Command("deno", {
        args: ["init", projectDirectoryPath],
    });
    await command.output(); // Execute the deno init command

    return { tempDirectoryPath, projectDirectoryPath };
}

export const denoTaskDojoTest = async (projectDirectoryPath = "test-project") => {
    Deno.env.set("NO_COLOR", "true");
    Deno.chdir(projectDirectoryPath);
    const command = new Deno.Command("deno", {
        args: ["task", "dojo:test"],
    });
    await command.output();
    // create subprocess and collect output
    const { code, stdout, stderr } = await command.output();
    const stdoutTxt = new TextDecoder().decode(stdout)
    const junitReport = await junit2jsonParse(stdoutTxt)
    return { code, stdout: stdoutTxt, stderr: new TextDecoder().decode(stderr), junitReport };
}

/**
 * Sets the base URL in the catalog for a specific dojo.
 *
 * @param catalog The catalog object.
 * @param dojoName The name of the dojo.
 * @param port The port number for the base URL.
 */
export const setMockHttpBaseUrl = (catalog: any, dojoName: string, port: number = 8001) => {
    catalog[dojoName].baseUrl = `http://localhost:${port}/${dojoName}/`;
}