// make_version.ts
/**
 * This script generates a version.ts file based on the version specified in the deno.json file.
 *  1. It reads the version from deno.json and writes it to src/version.ts.
 *  2. The generated version.ts file exports a constant named generatedVersion.
 *  3. The version used in deno.json is created by .envrc after executing `direnv allow`.
 *  4. The .envrc file pulls the latest version from (git tag -l | tail -n 1)
 *  5. Versions are created by running:  "make bump-patch" or "make bump-minor" or "make bump-major"
 *  6. Versions must be pushed with "git push --tags"
 *  7. The version.ts file is auto-generated, so it should not be edited manually.
 */
const configRaw = await Deno.readTextFile("./deno.json");
const config = JSON.parse(configRaw);
const version = config.version ?? "v0.0.0"; // Default fallback if not found

const versionFileContent = `
    // This file is auto-generated. Do not edit.
    export const generatedVersion = "${version}";
    `;

await Deno.writeTextFile("./src/version.ts", versionFileContent);
console.log(`Version file generated with version: ${version}`);
