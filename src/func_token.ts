import { exists } from 'jsr:@std/fs@1.0.18/exists'

/**
 * @function checkForCliToken
 * @description Fetches token from GH CLI
 * @returns string token value or null if not found
 */
async function checkForCliToken(): Promise<string | null> {
  let proc: Deno.ChildProcess | undefined
  try {
    const checkMake = new Deno.Command(`gh`, {
      args: ['auth', 'token'],
      stdin: 'piped',
      stdout: 'piped',
      stderr: 'piped',
    })
    proc = checkMake.spawn()
    const { stdout } = await proc.output()
    const message = stdout ? new TextDecoder().decode(stdout).trim() : null
    return message
  } catch {
    // no error handling since we gracefully fallback on null
    return null
  } finally {
    if (proc) {
      await proc.stdin.close()
    }
  }
}

/**
 * @function isMakeAvailable
 * @description Checks if the 'make' command is available on the system.
 * @returns success boolean indicating if 'make' is available.
 */
async function isMakeAvailable(): Promise<boolean | null> {
  let proc: Deno.ChildProcess | undefined
  try {
    const checkMake = new Deno.Command(`make`, {
      args: ['--version'],
      stdin: 'piped',
      stdout: 'piped',
      stderr: 'piped',
    })
    proc = checkMake.spawn()
    const { success } = await proc.status
    return success
  } catch {
    // no error handling since we gracefully fallback on null
    return null
  } finally {
    if (proc) {
      await proc.stdin.close()
    }
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
    return null
  }

  let proc: Deno.ChildProcess | undefined
  try {
    const checkMake = new Deno.Command(`make`, {
      args: ['echo-PROD_TOKEN'],
      stdin: 'piped',
      stdout: 'piped',
      stderr: 'piped',
    })
    proc = checkMake.spawn()
    const { stdout, stderr } = await proc.output()
    const message = stdout ? new TextDecoder().decode(stdout).trim() : null
    const errorText = stderr ? new TextDecoder().decode(stderr).trim() : null
    if (errorText) {
      return null
    }
    if (message === null) {
      return null
    } else {
      return message.length > 0 ? message : null
    }
  } catch {
    // no error handling since we gracefully fallback on null
    return null
  } finally {
    if (proc) {
      await proc.stdin.close()
    }
  }
}

/**
 * @function getToken
 * @description Attempts to get the PROD_TOKEN from environment, .envcrypt, or GH CLI, in that order. Returns null if not found.
 * @returns token string or null if not found
 */
async function getToken(): Promise<string | null> {
  const prod_token = Deno.env.get('PROD_TOKEN')
  if (prod_token && prod_token.length > 0) {
    return prod_token
  }

  const cliToken = await checkForCliToken()
  if (cliToken && cliToken.length > 0) {
    return cliToken
  }

  // last resort is to check for make then run make echo-PROD_TOKEN to retrieve from .envcrypt
  if (await isMakeAvailable()) {
    const envcryptToken = await getTokenFromEnvcrypt()
    if (envcryptToken && envcryptToken.length > 0) {
      return envcryptToken
    }
  }

  // None found
  return null
}

export { checkForCliToken, getToken, getTokenFromEnvcrypt, isMakeAvailable }
