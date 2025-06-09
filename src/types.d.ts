export namespace ExtensionSystemTypes {
  export type Report = {
    id: string
    path: string
    type: string
    msg: string | boolean
    score: number
    notify: string | boolean
  }

  export type EvalDynamicTypeVars = Record<string, string>

  export type PathArray = string[] | undefined

  export type PathExists = string | undefined

  export type ExportString = string | undefined

  export type StringOrUrl = string | URL

  export type WriteString = string | URL

  export type ReadableString = string | ReadableStream<string>

  export type WritableString = string | WritableStream<string>

  export type NumberString = number | undefined

  export type Status = boolean | unknown

  export type AnonSecret = string | undefined | null
  export interface NotificationSuccessResponseInterface {
    teams1?: {
      notified: () => void
    }
  }

  export interface NotificationFailureResponseInterface {
    none?: {
      notified: () => void
    }
  }

  /**
   * @type GENERIC
   * @description This module contains generic types used throughout the application.
   */
  // log level generics
  export enum LevDev {
    Trace = 'Trace',
    Debug = 'Debug',
    Info = 'Info',
    Warn = 'Warn',
    Error = 'Error',
    Critical = 'Critical',
  }

  /**
   * Level extension Generic Type Record for LogLevel enumeration
   */
  export type Levels<T extends LevDev, K extends keyof typeof LevDev> = T

  /**
   * Log Level Generic Type Record for LogLevel Mapping
   */
  export type LogLev =
    | Levels<LevDev.Trace, 'Trace'>
    | Levels<LevDev.Debug, 'Debug'>
    | Levels<LevDev.Info, 'Info'>
    | Levels<LevDev.Warn, 'Warn'>
    | Levels<LevDev.Error, 'Error'>
    | Levels<LevDev.Critical, 'Critical'>

  /**
   * Log Level Generic Color Records for LogLevel Color extensions
   */
  export type Color =
    | 'red'
    | 'white'
    | 'cyan'
    | 'green'
    | 'blue'
    | 'yellow'
    | 'gray'
    | 'black'
    | 'purple'
    | 'pink'
    | 'magenta'
    | 'brightRed'
    | 'brightWhite'
    | 'brightCyan'
    | 'brightGreen'
    | 'brightBlue'
    | 'brightYellow'
    | 'brightGray'
    | 'brightBlack'
    | 'brightPurple'
    | 'brightPink'
    | 'bgYellow'
    | 'bgRed'
    | 'bgGreen'
    | 'bgBlue'
    | 'bgBrightYellow'
    | 'bgBrightRed'
    | 'bgBrightGreen'
    | 'bgBrightBlue'
    | 'gray'
    | 'black'
    | 'bgBlack'
    | 'bgWhite'
    | 'bgCyan'
    | 'bgGray'
    | 'rgb8'

  export interface ColoredString<T extends Color> {
    text: string
    color: T
  }

  /*
   * INTERFACES
   * @description This module contains interfaces used throughout the application.
   * @module types.d.ts
   * @description This module contains type definitions and interfaces used throughout the application.
   */

  export interface YamlFiles {
    paths: string
    topics: string
    regex: string
    downloads: string
  }

  export interface GithubHeaders {
    Accept: string
    Authorization: string
    'X-GitHub-Api-Version': string
  }
  // end namespace
}
