import * as $token from './func_token.ts'
import { ExtensionSystemTypes as Type } from './types.d.ts'
import * as octo from 'npm:@octokit/core@7.0.2'
import { throttling } from 'npm:@octokit/plugin-throttling@^11.0.1'
import { retry } from 'npm:@octokit/plugin-retry@^8.0.1'
import { Octokit as OctokitRest } from 'npm:@octokit/rest@^22.0.0'
import { Octokit } from '@octokit/core'

/**
 * @function initOctokitWithThrottlingAndRetry
 * @description Initializes an Octokit instance with either Octokit.GraphQL, Octokit.Request, or Octokit.Rest
 * @param type The type of Octokit instance to initialize. Can be 'core' or 'rest'.
 *             'core' uses Octokit with throttling and retry plugins.
 *             'rest' uses Octokit.Rest with throttling and retry plugins.
 *             If an invalid type is provided, an error is logged and the process exits.
 * @returns {Promise<octo.Octokit>}
 */
export async function initOctokitWithThrottlingAndRetry(
  type: string = 'core',
): Promise<octo.Octokit | OctokitRest> {
  let OctokitVersion: typeof octo.Octokit | typeof OctokitRest
  if (type === 'core') {
    OctokitVersion = octo.Octokit.plugin(throttling, retry)
  } else if (type === 'rest') {
    OctokitVersion = OctokitRest.plugin(throttling, retry)
  } else {
    console.error(`Invalid Octokit type: ${type}. Must be 'core' or 'rest'.`)
    Deno.exit(1)
  }

  const retryCountEnv = Deno.env.get('OCTOKIT_RETRY_AMOUNT')
  const retryCount: number = retryCountEnv ? Number(retryCountEnv) : 5

  const retryAfterEnv = Deno.env.get('OCTOKIT_RETRY_AFTER_SECONDS')
  const retryAfter: number = retryAfterEnv ? Number(retryAfterEnv) : 30
  const token = await $token.getToken()

  if (!token) {
    console.error(
      'No GitHub token found. Please set the GITHUB_TOKEN environment variable.',
    )
    Deno.exit(1)
  }
  if (typeof token !== 'string') {
    console.error('Invalid token type. Expected a string.')
    Deno.exit(1)
  }

  const octokit = new OctokitVersion({
    auth: token,
    throttle: {
      onRateLimit: (retryAfter: number, options: any) => {
        console.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`,
        )
        if (options.request.retryCount < retryCount) {
          console.log(`Retrying after ${retryAfter} seconds!`)
          return true
        }
        console.error('Retry limit reached. Exiting.')
        return false
      },
      onSecondaryRateLimit: (
        retryAfter: number,
        options: any,
        octokit: any,
      ) => {
        console.warn(
          `Secondary quota detected for request ${options.method} ${options.url}`,
        )
      },
    },
    retry: {
      retries: retryCount,
      retryAfter: retryAfter,
      onRetry: (retryCount: number, error: any) => {
        console.log(
          `Retry attempt ${retryCount} due to error: ${error.message}`,
        )
        if (retryCount >= 5) {
          console.error('Max retry attempts reached. Exiting.')
          throw new Error('Max retry attempts reached.')
        }
      },
    },
  })

  return octokit
}
