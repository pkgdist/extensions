export namespace ExtensionSystemTypes {

  /**
   * @type Original Report Type v0.2.1-0.2.4
   * @description This module contains generic types used throughout the application.
   */
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


  /*
   * GENERIC REPORT TYPES
   * @description This module contains interfaces used on reporting only
   */

  /**
   * @type GenericReportEntry
   * @description Represents a single report entry as the base type.  This can be extended to include custom fields in the report entries.
   */
  export interface GenericReportEntry<T = unknown> {
    score: number
    rule: string
    description: string
    repo: string
    path: string
    success: boolean
    extra?: T // Allows extension with custom fields
  }

  /**
   * @interface ReportEntryWithNone
   * @description Represents a single report entry extending the GenericReportEntry interface with no fields.
   */
  export interface ReportEntryWithNone<T = unknown> extends GenericReportEntry<T> {
    customFields?: Record<string, unknown>
  }

  /**
   * @interface ReportEntryWithErrors
   * @description Represents a single report entry as the base type.  This can be extended to include custom fields in the report entries.
   */
  export interface ReportEntryWithErrors<T = unknown> extends GenericReportEntry<T> {
    customFields?: Record<string, unknown>
    error?: Record<string, unknown>
  }

  /**
   * @interface ReportEntries
   * @description Represents a single report entry.
   */
  export type ReportEntries<T = unknown> = {
    repos: Record<string, T[]>
  }

  /**
   * @interface GenericReport
   * @description Represents a report function with unknown purpose:
   */
  export interface GenericReport<T> {
    id: string
    name: string
    description: string
    datestamp: Date
    purpose: unknown
    entries: ReportEntries<T>[]
  }

  /**
   * @type ReportEntry
   * @description Represents a GenericReportEntry with unknown purpose.
   */
  export type ReportEntrySpecific<T = unknown> = GenericReportEntry<T>;

  /**
   * @type ReportTypes
   * @description All current report types as keys with generic objects as values.  Will be associated to each report.
   */
  export interface ReportType<T> {
    notifications: Record<string, ReportEntrySpecific<T>[]>
    entries: Record<string, ReportEntrySpecific<T>[]>
  }

  // end namespace
}
