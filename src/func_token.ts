import { exists } from 'jsr:@std/fs@1.0.18/exists'
import * as $error from './func_error.ts'

/**
 * @function checkForCliToken
 * @description Fetches token from GH CLI
 * @returns string token value or null if not found
 */
async function checkForCliToken(): Promise<string | null> {
  try {
    const checkMake = new Deno.Command(`gh`, {
      args: ['auth', 'token'],
      stdin: 'null',
      stdout: 'piped',
      stderr: 'null',
    })
    const checkChild = checkMake.spawn()
    const { stdout } = await checkChild.output()
    return stdout ? new TextDecoder().decode(stdout).trim() : null
  } catch {
    return null
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
      args: ['--version'],
      stdin: 'null',
      stdout: 'piped',
      stderr: 'null',
    })
    const checkChild = checkMake.spawn()
    const { success } = await checkChild.status
    return success
  } catch {
    return false
  }
}

/**
 * @function getTokenFromEnvcrypt
 * @description Checks for the existence of a .envcrypt file and retrieves the production token from it using the 'make echo-PROD_TOKEN' command.
 * @returns token text to be stored and exported as GH_CLI_TOKEN
 */
async function getTokenFromEnvcrypt(): Promise<string | null> {
  const envcrypt = await exists('.envcrypt', { isFile: true })
  if (!envcrypt) {
    $error.logErrorWithType(
      `'.envcrypt' file not found.`,
      '',
      'gray',
      `       ╰───[INFO]`,
    )
    return null
  }

  try {
    const process = new Deno.Command(`make`, {
      args: ['echo-PROD_TOKEN'],
      stdin: 'null',
      stdout: 'piped',
      stderr: 'piped',
    })

    const child = process.spawn()
    const { stdout, stderr } = await child.output()
    await child.stdin.close()
    const outputText: string = new TextDecoder().decode(stdout).trim()
    const errorText = new TextDecoder().decode(stderr).trim()

    if (errorText) {
      $error.logErrorWithType(
        `Error retrieving PROD_TOKEN from .envcrypt: ${errorText}`,
        '',
        'red',
        `          ╰───[WARN] `,
      )
      return null
    }
    return outputText.length > 0 ? outputText : null
  } catch (error) {
    $error.logErrorWithType(
      `Exception retrieving PROD_TOKEN from .envcrypt`,
      { message: error },
      'red',
      `          ╰───[WARN] `,
    )
    return null
  }
}

/**
 * @function getToken
 * @description Attempts to get the PROD_TOKEN from environment, .envcrypt, or GH CLI, in that order. Returns null if not found.
 * @returns token string or null if not found
 */
async function getToken(): Promise<string | null> {
  // 1. Try PROD_TOKEN env var
  const prod_token = Deno.env.get('PROD_TOKEN')
  if (prod_token && prod_token.length > 0) {
    return prod_token
  }

  // 2. Try .envcrypt via make
  if (await isMakeAvailable()) {
    const envcryptToken = await getTokenFromEnvcrypt()
    if (envcryptToken && envcryptToken.length > 0) {
      return envcryptToken
    }
  }

  // 3. Try GH CLI
  const cliToken = await checkForCliToken()
  if (cliToken && cliToken.length > 0) {
    return cliToken
  }

  // None found
  return null
}

export { checkForCliToken, getToken, getTokenFromEnvcrypt, isMakeAvailable }
