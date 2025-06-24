import { ExtensionSystemTypes as Type } from './types.d.ts'
import { logToDebug } from './func_streams.ts'
import { ALL_COLORS, logColor } from './declare_colors.ts'

/**
 * @purpose: provides tabstop strings for indentation in the code
 */
const tabstop = {
  t1: '  ',
  t2: '    ',
  t3: '      ',
  t4: '        ',
  t5: '          ',
  t6: '            ',
  t7: '              ',
  t8: '                ',
  t9: '                  ',
  t10: '                    ',
}

/**
 * @function logErrorWithType
 * @description Synchronus error function: Logs a message using the logToDebug stream and displays a logColor message to the console associated by a prefix.
 * @param message [string] The human readable messsage to log
 * @param error [object] The error object thrown during file write operation
 * @param color [string] The color to use for logging the warning message
 * @returns void none
 */
function logErrorWithType(
  message: Type.WriteString,
  error: unknown,
  color: Type.Color,
  prefix: Type.ExportString = '[WARN]',
): void {
  let errorMessage: string
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else {
    errorMessage = JSON.stringify(error)
  }
  const msg = `${prefix} ${message} ${errorMessage}`

  // log error to debug stream
  logToDebug.warn(msg)

  const safeColor = ALL_COLORS.has(color as any) ? color : 'gray'
  logColor(safeColor as Parameters<typeof logColor>[0], msg)
}

export { logErrorWithType, tabstop }
