import {
  every,
  FileStream,
  JsonFormatter,
  Level,
  levelToName,
  Logger,
  nameToLevel,
  of,
  PropertyRedaction,
  streamInit,
} from './func_streams.ts'
import * as colors from 'jsr:@std/fmt@1.0.8/colors'

const ALL_COLORS: Set<keyof typeof colors> = new Set(
  Object.keys(colors) as Array<keyof typeof colors>,
)

/**
 * @function logColor [anonymous]
 * @description An elegant way to define log colors as a type and reflect them into a function for displaying colorful messages.
 * @param color [string] The color to use for logging.
 * @param item [string] The message to log.
 * @returns void
 */
const logColor = (color: keyof typeof colors, item: string): void => {
  const safeColor = ALL_COLORS.has(color) ? color : 'gray'
  const colorFn = colors[safeColor as keyof typeof colors]
  if (typeof colorFn === 'function') {
    console.log(
      (colorFn as (text: string) => string)(item ? `\n${item}` : '\n'),
    )
  } else {
    console.error(`Invalid color function: ${color}`)
  }
}

export {
  ALL_COLORS,
  every,
  FileStream,
  JsonFormatter,
  Level,
  levelToName,
  logColor,
  Logger,
  nameToLevel,
  of,
  PropertyRedaction,
  streamInit,
}
