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
  export interface ReportEntryWithNone<T = unknown>
    extends GenericReportEntry<T> {
    customFields?: Record<string, unknown>
  }

  /**
   * @interface ReportEntryWithErrors
   * @description Represents a single report entry as the base type.  This can be extended to include custom fields in the report entries.
   */
  export interface ReportEntryWithErrors<T = unknown>
    extends GenericReportEntry<T> {
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
  export type ReportEntrySpecific<T = unknown> = GenericReportEntry<T>

  /**
   * @type ReportTypes
   * @description All current report types as keys with generic objects as values.  Will be associated to each report.
   */
  export interface ReportType<T> {
    notifications: Record<string, ReportEntrySpecific<T>[]>
    entries: Record<string, ReportEntrySpecific<T>[]>
  }

  export type PathValue = { path: string; value: unknown }

  /**
   * @typedef {Object} ReviewEnforcementSummary
   * @property {Object} branchProtection - Summary of branch protection rules.
   * @property {string} branchProtection.branch - The name of the branch.
   * @property {boolean} branchProtection.enabled - Whether branch protection is enabled.
   * @property {number} [branchProtection.requiredApprovals] - Number of required approvals for pull requests.
   * @property {boolean} [branchProtection.requireCodeOwnerReviews] - Whether code owner reviews are required.
   * @property {string[]} [branchProtection.copilotChecks] - List of Copilot checks configured for the branch.
   * @property {Array<Object>} rulesets - List of rulesets applied to the repository.
   */
  export interface ReviewEnforcementSummary {
    branchProtection: {
      branch: string
      enabled: boolean
      requiredApprovals?: number
      requireCodeOwnerReviews?: boolean
      copilotChecks?: string[]
    }
    rulesets: Array<{
      rulesetId: number
      name: string
      enforcement: string
      targets: string[]
      requiredApprovals?: number
      requireCodeOwnerReviews?: boolean
      copilotChecks?: string[]
      copilotScanDetected?: boolean
    }>
  }
  /**
   * @typedef {Object} BranchProtectionDetails
   * @property {Object} required_pull_request_reviews - Required pull request reviews
   * @property {number} required_pull_request_reviews.required_approving_review_count - Number of required approving reviews
   * @property {boolean} required_pull_request_reviews.dismiss_stale_reviews - Whether to dismiss stale reviews
   * @property {boolean} required_pull_request_reviews.require_code_owner_reviews - Whether to require code owner reviews
   * @property {Object|null} required_pull_request_reviews.dismissal_restrictions - Dismissal restrictions for reviews
   * @property {Object|null} required_pull_request_reviews.bypass_pull_request_allowances - Bypass allowances for pull request reviews
   * @property {boolean} required_pull_request_reviews.require_last_push_approval - Whether to require last push approval
   * @property {Object|null} required_status_checks - Required status checks
   * @property {boolean} required_status_checks.strict - Whether status checks are strict
   * @property {string[]} required_status_checks.contexts - List of required status check contexts
   * @property {Object} required_conversation_resolution - Required conversation resolution
   * @property {boolean} required_conversation_resolution.enabled - Whether conversation resolution is required
   * @property {Object} required_signatures - Required signatures
   * @property {boolean} required_signatures.enabled - Whether signatures are required
   * @property {Object} required_linear_history - Required linear history
   * @property {boolean} required_linear_history.enabled - Whether linear history is required
   * @property {Object} lock_branch - Lock branch settings
   * @property {boolean} lock_branch.enabled - Whether the branch is locked
   * @property {Object} enforce_admins - Admin enforcement settings
   * @property {boolean} enforce_admins.enabled - Whether admin enforcement is enabled
   * @property {Object|null} restrictions - Branch restrictions
   * @property {Object} allow_force_pushes - Allow force pushes settings
   * @property {boolean} allow_force_pushes.enabled - Whether force pushes are allowed
   * @property {Object} allow_deletions - Allow deletions settings
   * @property {boolean} allow_deletions.enabled - Whether deletions are allowed
   */
  export interface BranchProtectionDetails {
    required_pull_request_reviews: {
      required_approving_review_count: number
      dismiss_stale_reviews: boolean
      require_code_owner_reviews: boolean
      dismissal_restrictions: Record<string, unknown> | undefined
      bypass_pull_request_allowances: Record<string, unknown> | undefined
      require_last_push_approval: boolean
    } | undefined
    required_status_checks: {
      strict: boolean
      contexts: string[]
    }
    required_conversation_resolution: {
      enabled: boolean
    }
    required_signatures: {
      enabled: boolean
    }
    required_linear_history: {
      enabled: boolean
    }
    lock_branch: {
      enabled: boolean
    }
    enforce_admins: {
      enabled: boolean
    }
    restrictions: Record<string, unknown> | undefined
    allow_force_pushes: {
      enabled: boolean
    }
    allow_deletions: {
      enabled: boolean
    }
  }

  /**
   * Asserts that a parameter in a ruleset matches the expected value.
   * @param rulesetNumber The ruleset ID to check.
   * @param parameterPath Dot-separated path to the parameter (e.g., "rules.2.parameters.require_code_owner_review").
   * @param value The value to assert against.
   * @returns "true" if the value matches, "false" otherwise.
   */
  export interface RepoParams {
    token: string
    owner: string
    repository: string
    branch?: string
  }

  // version: ^0.2.9 types below:

  /**
   * @interface RulesetBypassActor
   * @description Represents an actor that can bypass a ruleset.
   */
  interface RulesetBypassActor {
    actor_id: number
    actor_type: string
    bypass_mode: string
  }

  /**
   * @interface RulesetConditionRefName
   * @description Represents Ruleset Condition Ref Name.
   */
  interface RulesetConditionRefName {
    include?: string[]
    exclude?: string[]
  }

  /**
   * @interface RulesetConditions
   * @description Represents RulesetConditions.
   */
  interface RulesetConditions {
    ref_name?: RulesetConditionRefName
    // Add other possible conditions here as needed
  }

  /**
   * @interface RulesetRule
   * @description Represents RulesetRule containing records.
   */
  interface RulesetRule {
    type: string
    parameters: Record<string, unknown>
  }
  /**
   * @interface RulesetLinks
   * @description Represents links associated with a ruleset.
   */
  interface RulesetLinks {
    self: { href: string }
    html: { href: string }
  }

  /**
   * @interface GithubRuleset
   * @description Represents a GitHub ruleset.
   */
  interface GithubRuleset {
    id: number
    name: string
    target?: string
    source_type?: string
    source: string
    enforcement: string
    bypass_actors: RulesetBypassActor[]
    conditions: RulesetConditions
    rules: RulesetRule[]
    node_id: string
    _links: RulesetLinks
    created_at: string
    updated_at: string
  }
  // end namespace
}
