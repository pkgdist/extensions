import { ExtensionSystemTypes as Type } from './types.d.ts'
import { logColor } from './declare_colors.ts'
import { logToDebug, logToReport } from './func_streams.ts'
import { logErrorWithType } from './func_error.ts'
import * as $os from 'node:os'
import * as $token from './func_token.ts'
import { exit } from 'node:process'


/**
 * @purpose: Fall back gracefully to GH-CLI token if PROD_TOKEN [env var | .envcrypt] is not set.
 */
const envProdToken: Type.AnonSecret = await $token.getToken()
const GITHUB_TOKEN: Type.AnonSecret = await (async () => {
  if (!envProdToken || envProdToken.length === 0) {
    const ghAuthToken = await $token.checkForCliToken()
    if (ghAuthToken) {
      const logMsg = 'PROD_TOKEN is set from GH CLI.'
      logErrorWithType(logMsg, { debug: true, msg: 'token missing.' }, 'gray',
        '            ╰───[INFO]')
      return ghAuthToken
    } else {
      const logMsg = 'PROD_TOKEN is not set.'
      const infoMsg = `Please set PROD_TOKEN [env variable] or login to the GH CLI.`
      logErrorWithType(logMsg, { debug: true, msg: 'token missing.' }, 'bgRed','  ╰───[ERROR]')
      logErrorWithType(infoMsg, { debug: true, msg: 'token missing.' }, 'gray','    ╰───[INFO]')
      exit(1)
    }
  } else {
    return envProdToken
  }
})();

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
  FIXTURES_PATH,
  CONFIG_PATH,
  CURRENT_DIR,
  DENO_PATH,
  GITHUB_HEADERS,
  GITHUB_TOKEN,
  logColor,
  logToDebug,
  logToReport,
  PER_PAGE
}
