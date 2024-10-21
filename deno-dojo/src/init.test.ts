import { describe, it, expect, beforeEach, afterEach, createMockFileServer, createTemporaryDenoProject, setMockHttpBaseUrl, denoTaskDojoTest } from "testlib";
import * as path from "@std/path";
import { existsSync } from "@std/fs";
import catalogJson from "./catalog.json" with { type: "json" };
import { downloadDojo, mergeDenoJsonFiles } from "./init.ts";

// Helper function to perform the common test assertions
async function assertDojoTestResults(projectDirectoryPath: string) {
    const { stdout, stderr, junitReport } = await denoTaskDojoTest(projectDirectoryPath);
    expect(stdout).toContain("testsuites");
    expect(junitReport?.failures).toEqual(0);
    expect(junitReport?.errors).toEqual(0);
    return {stdout, stderr, junitReport}
}


describe("downloadDojo function", () => {

    let tempDirectoryPath: string;
    let projectDirectoryPath: string;
    let server: Deno.HttpServer;
    let testWd: string;


    beforeEach(async () => {
        testWd = Deno.cwd();
        const mockHttpPort = 8002;
        // Dynamically set the base URL for all dojos in the catalog
        for (const dojoName in catalogJson) {
            setMockHttpBaseUrl(catalogJson, dojoName, mockHttpPort);
        }
        // Create a temporary Deno project for testing
        ({ tempDirectoryPath, projectDirectoryPath } = await createTemporaryDenoProject("foo101"));

        // Start a mock file server
        ({ server } = createMockFileServer("catalog", mockHttpPort));
    });

    afterEach(async () => {
        // NOTE: change dir back to the testing dir before remove temp project dir.
        Deno.chdir(testWd);
        // Remove the temporary directory after each test
        Deno.removeSync(tempDirectoryPath, { recursive: true });
        // Shut down the mock file server
        await server.shutdown();
    });

    it("should download the expected files for a valid dojo", async () => {
        await downloadDojo("test-expect", projectDirectoryPath, catalogJson);

        const expectedFiles = [
            "deno.json",
            "foo_test.ts",
            "testlib.ts",
        ];

        expectedFiles.forEach((file) => {
            const filePath = path.join(projectDirectoryPath, file);
            expect(existsSync(filePath)).toBe(true);
        });
    });

    it("should throw an error when given an invalid dojo name", async () => {
        await expect(downloadDojo("invalid-dojo", projectDirectoryPath, catalogJson)).rejects.toThrow(
            'Dojo "invalid-dojo" not found in the catalog.',
        );
    });

    it("should download the correct files for the blog-100 dojo and pass tests", async () => {
        await downloadDojo("blog-100", projectDirectoryPath, catalogJson);

        const expectedFiles = [
            "deno.json",
            "testlib.ts",
            "blog-dao.test.ts",
            "blog-dao.ts",
        ];

        expectedFiles.forEach((file) => {
            const filePath = path.join(projectDirectoryPath, file);
            expect(existsSync(filePath), `${filePath} not exist.`).toBe(true);
        });

        await assertDojoTestResults(projectDirectoryPath);
    });

    it("should download the todo-090 dojo and successfully execute deno task test with JUnit report", async () => {
        await downloadDojo("todo-090", projectDirectoryPath, catalogJson);
        await assertDojoTestResults(projectDirectoryPath);
    });


    it("should download the blog-100 dojo and successfully execute deno task test with JUnit report", async () => {
        await downloadDojo("blog-100", projectDirectoryPath, catalogJson);
        await assertDojoTestResults(projectDirectoryPath);
    });

    it("should download the test-expect dojo, execute deno task test, and output the correct JUnit report and stderr message", async () => {
        await downloadDojo("test-expect", projectDirectoryPath, catalogJson);
        const { stderr} =  await assertDojoTestResults(projectDirectoryPath);
        expect(stderr).toContain("Task dojo:test deno test --reporter=junit");
    });
});


describe("mergeDenoJsonFiles function", () => {
    it("should correctly merge two deno.json files with overlapping and unique keys", () => {
        const existingDenoJson = {
            "tasks": {
                "test": "deno test",
            },
            "imports": {
                "std/": "https://deno.land/std@0.200.0/",
            }
        };

        const remoteDenoJson = {
            "tasks": {
                "fmt": "deno fmt",
            },
            "imports": {
                "oak": "https://deno.land/x/oak@v12.6.1/mod.ts",
            }
        };

        const merged = mergeDenoJsonFiles(existingDenoJson, remoteDenoJson);

        expect(merged).toEqual({
            "tasks": {
                "test": "deno test",
                "fmt": "deno fmt",
            },
            "imports": {
                "std/": "https://deno.land/std@0.200.0/",
                "oak": "https://deno.land/x/oak@v12.6.1/mod.ts",
            },
        });
    });

    it("should handle merging when one of the deno.json files has missing properties", () => {
        const existingDenoJson = {
            "tasks": {
                "test": "deno test",
            },
        };

        const remoteDenoJson = {
            "imports": {
                "oak": "https://deno.land/x/oak@v12.6.1/mod.ts",
            },
        };

        const merged = mergeDenoJsonFiles(existingDenoJson, remoteDenoJson);

        expect(merged).toEqual({
            "tasks": {
                "test": "deno test",
            },
            "imports": {
                "oak": "https://deno.land/x/oak@v12.6.1/mod.ts",
            },
        });
    });
});