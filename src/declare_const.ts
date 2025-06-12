import { ExtensionSystemTypes as Type } from './types.d.ts'
import { logColor } from './declare_colors.ts'
import { logToDebug, logToReport } from './func_streams.ts'
import * as $error from './func_error.ts'
import * as $os from 'node:os'
import * as $token from './func_token.ts'
import { exit } from 'node:process'

/**
 * @purpose: Fall back gracefully to GH-CLI token if PROD_TOKEN [env var | .envcrypt] is not set.
 */
const GITHUB_TOKEN: Type.AnonSecret = await $token.getToken()

if (!GITHUB_TOKEN) {
  $error.logErrorWithType(
    `Please set PROD_TOKEN [env variable] or login to the GH CLI.`,
    '',
    'red',
    '        ╰─── ',
  )

  exit(1)
}

const FIXTURES_PATH: Type.ExportString = `${import.meta.dirname}/fixtures`

const GITHUB_HEADERS: Type.GithubHeaders = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  'X-GitHub-Api-Version': '2022-11-28',
}

const PER_PAGE: Type.NumberString = 1000

const CURRENT_DIR: Type.ExportString = Deno.cwd()

const CONFIG_PATH: Type.ExportString = `${$os.homedir()}/.config/.rules_engine`

const DENO_PATH: Type.StringOrUrl = `${$os.homedir()}/.deno/bin/deno`

export {
  CONFIG_PATH,
  CURRENT_DIR,
  DENO_PATH,
  FIXTURES_PATH,
  GITHUB_HEADERS,
  GITHUB_TOKEN,
  logColor,
  logToDebug,
  logToReport,
  PER_PAGE,
}
