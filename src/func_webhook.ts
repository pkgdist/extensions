import { RuleEngineTypes as Type } from './types.d.ts'
import { logColor } from './declare_colors.ts'

/**
 * @function fnHook
 * @description Anonymous function to get the webhook URL from our encrypted .envcrypt file or Github Secret
 * @returns outputText to be stored as TEAMS_WEB_HOOK
 */

export const TEAMS_WEB_HOOK: Type.AnonSecret = await (async () => {
    const is_ci: unknown = Deno.env.get('CI')
    if (is_ci) {
      return Deno.env.get('TEAMS_WEB_HOOK')
    } else return Deno.env.get('TEAMS_WEB_HOOK')
})()

await (async () => {
  const hook = TEAMS_WEB_HOOK
  if (!hook || hook.length === 0) {
    const logMsg = 'TEAMS_WEB_HOOK is not set.'
    const infoMsg = `
      Please set TEAMS_WEB_HOOK [env variable] or login to the GH CLI.
      Optionally, you can use Transcrypt with .envcrypt to store specific tokens.
    `
    logColor('bgRed', logMsg)
    logColor('gray', infoMsg)
    return ''
  } else {
    return hook
  }
})()
