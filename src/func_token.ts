import { exists } from "jsr:@std/fs@1.0.18/exists";
import * as $error from "./func_error.ts";

/**
 * @function checkForCliToken
 * @description Fetches token from GH CLI
 * @returns string token value
 */
async function checkForCliToken(): Promise<string | null> {
  try {
    const checkMake = new Deno.Command(`gh`, {
      args: ["auth", "token"],
      stdin: "piped",
      stdout: "piped",
      stderr: "null",
    });
    const checkChild = checkMake.spawn();
    const { stdout } = await checkChild.output();
    return stdout ? new TextDecoder().decode(stdout).trim() : null;
  } catch {
    return null;
  }
}

/**
 * @function isMakeAvailable
 * @description Checks if the 'make' command is available on the system.
 * @returns success boolean indicating if 'make' is available.
 */
async function isMakeAvailable(): Promise<boolean> {
  try {
    const checkMake = new Deno.Command(`make`, {
      args: ["--version"],
      stdin: "null",
      stdout: "piped",
      stderr: "null",
    });
    const checkChild = checkMake.spawn();
    const { success } = await checkChild.status;
    return success;
  } catch {
    return false;
  }
}

/**
 * @function getTokenFromEnvcrypt
 * @description Checks for the existence of a .envcrypt file and retrieves the production token from it using the 'make echo-PROD_TOKEN' command.
 * @returns token text to be stored and exported as GH_CLI_TOKEN
 */
async function getTokenFromEnvcrypt(): Promise<string | null> {
  const envcrypt = await exists(".envcrypt", { isFile: true });
  if (!envcrypt) {
    // envcrypt not fouund
    $error.logErrorWithType(
      `'.envcrypt' file not found.`,
      "",
      "gray",
      `       ╰───[INFO]`,
    );
    return null;
  }
  // envcrypt found
  const envcrypt_exists = true;

  const process = new Deno.Command(`make`, {
    args: ["echo-PROD_TOKEN"],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });

  const child = process.spawn();
  const { stdout, stderr } = await child.output();
  const outputText: string = new TextDecoder().decode(stdout).trim();
  const errorText = new TextDecoder().decode(stderr).trim();

  $error.logErrorWithType(
    `.envcrypt was found, attempting to retrieve token: 'make echo-PROD_TOKEN' `,
    "",
    "gray",
    `          ╰───[CHECK] `,
  );

  await child.stdin.close();

  if (errorText) console.error("Error:", errorText);
  return outputText;
}

/**
 * @function getToken
 * @description Anonymous function to get the Github CLI Token from our encrypted .envcrypt file or Github Secret
 * @returns token text to be stored and exported as GH_CLI_TOKEN
 */
async function getToken(): Promise<string | undefined | null> {
  const is_ci: unknown = Deno.env.get("CI");
  const prod_token = Deno.env.get("PROD_TOKEN");

  // there was more complex error reporting here but since these are executed with each test it got annoying
  if (is_ci) {
    const ci_mode = true;
    return prod_token == undefined || prod_token == "" ? null : prod_token;
  } else {
    const ci_mode = false;
  }

  if (!prod_token || prod_token.length == 0) {
    try {
      if (!await isMakeAvailable()) {
        const make_unavailable = true;
        return null;
      }
      const make_unavailable = false;

      const token = await getTokenFromEnvcrypt();
      return token;
    } catch (error) {
      $error.logErrorWithType(
        `Error setting prod token | `,
        { message: error },
        "red",
        `      ╰───[WARN] `,
      );

      return null;
    }
  } else {
    const env_var_set = true;
    return prod_token;
  }
}

export { checkForCliToken, getToken, getTokenFromEnvcrypt, isMakeAvailable };
