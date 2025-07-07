// deno-lint-ignore-file no-explicit-any
import * as octo from 'npm:@octokit/core@7.0.2'
import { ExtensionSystemTypes as Type } from './types.d.ts'
import * as $octokit from './func_octokit.ts'

/**
 * @function getBranchProtection
 * @description Fetches branch protection rules for a given repository and branch.
 * @param octokit [octo.Octokit] The Octokit instance for making API requests so we do not duplicate the object when calling this as a sub-function.
 * @param owner [string] The owner of the repository.
 * @param repo [string] The name of the repository.
 * @param branch [string] The name of the branch to check.
 * @returns {Promise<ReviewEnforcementSummary["branchProtection"]>} A promise that resolves to the branch protection summary.
 */
export async function getBranchProtection(
  octokit: octo.Octokit,
  owner: string,
  repo: string,
  branch: string,
): Promise<Type.ReviewEnforcementSummary['branchProtection']> {

  const branchProtection: Type.ReviewEnforcementSummary['branchProtection'] = {
    branch,
    enabled: false,
  }

  try {
    const { data } = await octokit.request(
      'GET /repos/{owner}/{repo}/branches/{branch}/protection',
      { owner, repo, branch },
    )

    branchProtection.enabled = true

    if (data.required_pull_request_reviews) {
      branchProtection.requiredApprovals =
        data.required_pull_request_reviews.required_approving_review_count
      branchProtection.requireCodeOwnerReviews =
        data.required_pull_request_reviews.require_code_owner_reviews
    }

    const statusChecks = data.required_status_checks?.contexts ?? []
    branchProtection.copilotChecks = statusChecks.filter((c) =>
      c.toLowerCase().includes('copilot')
    )
  } catch (err) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'status' in err &&
      typeof (err as { status?: unknown })['status'] === 'number' &&
      (err as { status: number }).status !== 404
    ) {
      throw new Error(
        `Failed to fetch branch protection: ${
          (err as { message?: string }).message ?? String(err)
        }`,
      )
    }
    // If 404, branch protection is not enabled — already handled above.
  }

  return branchProtection
}

/**
 * @function processRule
 * @description Processes a single rule object to extract relevant information and update the state.
 * @param rule [any] The rule object to process.
 * @param state [object] The state object to update with extracted information.
 * @returns void
 */
export function processRule(
  rule: any,
  state: {
    requiredApprovals?: number
    requireCodeOwnerReviews?: boolean
    copilotChecks: string[]
    copilotScanDetected: boolean
    copilotCodeReviewEnabled: boolean
    requireStatusChecksToPass: boolean
    requireBranchesUpToDate: boolean
  },
) {
  if (rule.type === 'pull_request') {
    state.requiredApprovals =
      rule.parameters?.required_approving_review_count ??
        state.requiredApprovals
    state.requireCodeOwnerReviews =
      rule.parameters?.require_code_owner_review ??
        state.requireCodeOwnerReviews

    if (rule.parameters?.automatic_copilot_code_review_enabled === true) {
      state.copilotCodeReviewEnabled = true
    }
  }

  if (rule.type === 'required_status_checks') {
    state.requireStatusChecksToPass =
      Array.isArray(rule.parameters?.required_status_checks) &&
      rule.parameters.required_status_checks.length > 0

    state.requireBranchesUpToDate = !!rule.parameters
      ?.strict_required_status_checks_policy

    const checkNames = rule.parameters?.required_status_checks
      ?.map((c: any) => c.context) ?? []
    const copilotLikeChecks = checkNames.filter((name: string) =>
      typeof name === 'string' && name.toLowerCase().includes('copilot')
    )

    state.copilotChecks.push(...copilotLikeChecks)

    if (
      copilotLikeChecks.some((name: string) =>
        typeof name === 'string' &&
        (name.toLowerCase().includes('security') ||
          name.toLowerCase().includes('scan'))
      )
    ) {
      state.copilotScanDetected = true
    }
  }
}

/**
 * @function processRuleset Process a ruleset object to extract relevant information and ensure consistent data types.
 * @description Processes a ruleset object to extract relevant information and ensure consistent data types.
 * @param ruleset [any] The ruleset object to process.
 * @returns {ReviewEnforcementSummary["rulesets"][number] & { rules: any[]; copilotCodeReviewEnabled?: boolean; requireStatusChecksToPass?: boolean; requireBranchesUpToDate?: boolean }}
 */
export function processRuleset(
  ruleset: any,
): Type.ReviewEnforcementSummary['rulesets'][number] & {
  rules: any[]
  copilotCodeReviewEnabled?: boolean
  requireStatusChecksToPass?: boolean
  requireBranchesUpToDate?: boolean
} {
  const {
    id = 0,
    name = '',
    enforcement = '',
    targets = [],
    rules = [],
  } = ruleset ?? {}

  // ensure rules is always an array
  const safeRules = Array.isArray(rules) ? rules : []

  // ensure targets is always an array of strings
  let safeTargets: string[]
  if (Array.isArray(targets)) {
    safeTargets = targets
  } else if (typeof targets === 'string') {
    safeTargets = [targets]
  } else {
    safeTargets = []
  }

  const state = {
    requiredApprovals: undefined as number | undefined,
    requireCodeOwnerReviews: undefined as boolean | undefined,
    copilotChecks: [] as string[],
    copilotScanDetected: false,
    copilotCodeReviewEnabled: false,
    requireStatusChecksToPass: false,
    requireBranchesUpToDate: false,
  }

  for (const rule of safeRules) {
    processRule(rule, state)
  }

  return {
    rulesetId: id,
    name,
    enforcement,
    targets: safeTargets,
    requiredApprovals: state.requiredApprovals,
    requireCodeOwnerReviews: state.requireCodeOwnerReviews,
    copilotChecks: state.copilotChecks,
    copilotScanDetected: state.copilotScanDetected,
    rules: safeRules, // include all rules in the output
    copilotCodeReviewEnabled: state.copilotCodeReviewEnabled,
    requireStatusChecksToPass: state.requireStatusChecksToPass,
    requireBranchesUpToDate: state.requireBranchesUpToDate,
  }
}

/**
 * @function inspectReviewAndCopilotEnforcement
 * @description Inspects the review and Copilot enforcement settings for a given repository and branch.
 * @param token [string] The GitHub personal access token.
 * @param owner [string] The owner of the repository.
 * @param repo [string] The name of the repository.
 */
export async function inspectReviewAndCopilotEnforcement(
  token: string,
  owner: string,
  repo: string,
  branch: string = 'main',
): Promise<Type.ReviewEnforcementSummary> {

  const octokit = await $octokit.initOctokitWithThrottlingAndRetry()

  const summary: Type.ReviewEnforcementSummary = {
    branchProtection: await getBranchProtection(octokit, owner, repo, branch), // sub function passing instance
    rulesets: [],
  }

  // rulesets
  const { data: rulesets } = await octokit.request(
    'GET /repos/{owner}/{repo}/rulesets',
    { owner, repo },
  )

  for (const rulesetMeta of (Array.isArray(rulesets) ? rulesets : [])) {
    // ruleset details
    const { data: ruleset } = await octokit.request(
      'GET /repos/{owner}/{repo}/rulesets/{ruleset_id}',
      { owner, repo, ruleset_id: rulesetMeta.id },
    )
    // Check if ruleset applies to main, default, or master branch
    const includes = ruleset?.conditions?.ref_name?.include ?? []
    const matchesMain =
      includes.some((pattern: string) =>
        pattern === '~DEFAULT_BRANCH' ||
        pattern === 'refs/heads/main' ||
        pattern === 'refs/heads/master' ||
        pattern === 'refs/heads/default'
      )
    if (matchesMain) {
      summary.rulesets.push(processRuleset(ruleset))
    }
  }

  return summary
}

/**
 * @function getByPath
 * @description Retrieves a value from an object by a dot-separated path.
 * @param obj The object to search.
 * @param path The dot-separated path to the value (e.g., "rules.2.parameters.require_code_owner_review").
 * @returns The value at the specified path, or undefined if not found.
 */
export function getByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => {
    // Handle array indices like rules.2.parameters
    if (acc && typeof key === 'string' && /^\d+$/.test(key)) {
      return acc[Number(key)]
    }
    return acc ? acc[key] : undefined
  }, obj)
}

/**
 * @function findParamPaths
 * @description Finds all paths in an object that match a specific key and returns their values.
 * @param obj The object to search.
 */
export function findParamPaths(
  obj: Record<string, unknown>,
  key: string,
  basePath = '',
): Type.PathValue[] {
  const results: Type.PathValue[] = []

  function search(current: any, path: string) {
    if (typeof current !== 'object' || current === null) return
    for (const [k, v] of Object.entries(current)) {
      const newPath = path ? `${path}.${k}` : k
      if (k === key) {
        results.push({ path: newPath, value: v })
      }
      if (typeof v === 'object' && v !== null) {
        search(v, newPath)
      }
    }
  }

  search(obj, basePath)
  return results
}

/**
 * @function inspectDetailedBranchProtection
 * @description Inspects the full branch protection object and returns a detailed summary.
 * @param token [string] The GitHub personal access token.
 * @param owner [string] The owner of the repository.
 * @param repo [string] The name of the repository.
 * @param branch [string] The branch to inspect (default: "main").
 * @returns {Promise<Type.BranchProtectionDetails>} A detailed branch protection object.
 */
export async function inspectDetailedBranchProtection(
  token: string,
  owner: string,
  repo: string,
  branch: string = 'main',
): Promise<Type.BranchProtectionDetails> {
  const octokit = await $octokit.initOctokitWithThrottlingAndRetry()

  const branchProtection: Type.BranchProtectionDetails = {
    required_pull_request_reviews: {
      required_approving_review_count: 0,
      dismiss_stale_reviews: false,
      require_code_owner_reviews: false,
      dismissal_restrictions: undefined,
      bypass_pull_request_allowances: undefined,
      require_last_push_approval: false,
    },
    required_status_checks: {
      strict: false,
      contexts: [],
    },
    required_conversation_resolution: { enabled: false },
    required_signatures: { enabled: false },
    required_linear_history: { enabled: false },
    lock_branch: { enabled: false },
    enforce_admins: { enabled: false },
    restrictions: { },
    allow_force_pushes: { enabled: false },
    allow_deletions: { enabled: false },
  }

  try {
    const { data } = await octokit.request(
      'GET /repos/{owner}/{repo}/branches/{branch}/protection',
      { owner, repo, branch },
    )

    // Pull Request Reviews
    if (data.required_pull_request_reviews) {
      const rpr = data.required_pull_request_reviews
      if (rpr !== undefined && branchProtection.required_pull_request_reviews !== undefined) {
        Object.assign(
          branchProtection.required_pull_request_reviews,
          {
            required_approving_review_count: rpr.required_approving_review_count ?? 0,
            dismiss_stale_reviews: rpr.dismiss_stale_reviews ?? false,
            require_code_owner_reviews: rpr.require_code_owner_reviews ?? false,
            dismissal_restrictions: rpr.dismissal_restrictions ?? undefined,
            bypass_pull_request_allowances: rpr.bypass_pull_request_allowances ?? undefined,
            require_last_push_approval: rpr.require_last_push_approval ?? false,
          }
        )
      }
    }

    // Status Checks
    if (data.required_status_checks) {
      Object.assign(branchProtection.required_status_checks, {
        strict: data.required_status_checks.strict ?? false,
        contexts: data.required_status_checks.contexts ?? [],
      })
    }

    // Simple booleans
    branchProtection.required_conversation_resolution.enabled =
      data.required_conversation_resolution?.enabled ?? false
    branchProtection.required_signatures.enabled =
      data.required_signatures?.enabled ?? false
    branchProtection.required_linear_history.enabled =
      data.required_linear_history?.enabled ?? false
    branchProtection.lock_branch.enabled =
      data.lock_branch?.enabled ?? false
    branchProtection.enforce_admins.enabled =
      data.enforce_admins?.enabled ?? false
    branchProtection.restrictions = data.restrictions
    branchProtection.allow_force_pushes.enabled =
      data.allow_force_pushes?.enabled ?? false
    branchProtection.allow_deletions.enabled =
      data.allow_deletions?.enabled ?? false

  } catch (err) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'status' in err &&
      typeof (err as { status?: unknown })['status'] === 'number' &&
      (err as { status: number }).status !== 404
    ) {
      throw new Error(
        `Failed to fetch branch protection: ${
          (err as { message?: string }).message ?? String(err)
        }`,
      )
    }
    // If 404, branch protection is not enabled — already handled above.
  }

  return branchProtection
}

/**
 * @function assertRulesetParameter
 * @description Asserts that a parameter in a ruleset (by ID) matches the expected value.
 * @param rulesetNumber The ID of the ruleset to check.
 * @param parameterPath Dot-separated path to the parameter (e.g., "rules.2.parameters.require_code_owner_review").
 * @param value The value to assert against.
 * @param repo The repository parameters.
 * @returns "true" if the value matches, "false" otherwise.
 */
export async function assertRulesetParameter(
  rulesetNumber: number,
  parameterPath: string,
  value: unknown,
  repo: Type.RepoParams = { token: '', owner: '', repository: '', branch: '' },
): Promise<string> {
  const { token, owner, repository, branch } = repo
  const result = await inspectReviewAndCopilotEnforcement(
    token,
    owner,
    repository,
    branch,
  )
  const ruleset = result.rulesets.find((r) => r.rulesetId === rulesetNumber)
  if (!ruleset) return 'false'

  const actual = getByPath(ruleset, parameterPath)
  return (actual === value) ? 'true' : 'false'
}

/**
 * @function assertRulesByIndexParameter Asserts that a parameter in a ruleset (by index) matches the expected value.
 * @param rulesetIndex The index of the ruleset in the rulesets array (0-based).
 * @param parameterPath Dot-separated path to the parameter (e.g., "rules.2.parameters.require_code_owner_review").
 * @param value The value to assert against.
 * @param repo The repository parameters.
 * @returns "true" if the value matches, "false" otherwise.
 */
export async function assertRulesetByIndexParameter(
  rulesetIndex: number,
  parameterPath: string,
  value: unknown,
  repo: Type.RepoParams = { token: '', owner: '', repository: '', branch: '' },
): Promise<string> {
  const { token, owner, repository, branch } = repo
  const result = await inspectReviewAndCopilotEnforcement(
    token,
    owner,
    repository,
    branch,
  )
  const ruleset = result.rulesets[rulesetIndex]
  if (!ruleset) return 'false'

  const actual = getByPath(ruleset, parameterPath)
  return (actual === value) ? 'true' : 'false'
}

/**
 * @function getRulesetBypassList - Get Bypass Actors for Rulesets
 * @param repoData The repository parameters including token, owner, repository, and branch.
 * @returns allBypassActors An array of bypass actors with actor_id, actor_type, and bypass_mode.
 */
export async function getRulesetBypassList(
  repoData: Type.RepoParams = {
    token: '',
    owner: '',
    repository: '',
    branch: '',
  },
): Promise<Type.RulesetBypassActor[]> {
  const octokit = await $octokit.initOctokitWithThrottlingAndRetry()

  // Get all rulesets
  const { data: rulesets } = await octokit.request(
    'GET /repos/{owner}/{repo}/rulesets',
    { owner: repoData.owner, repo: repoData.repository },
  )

  const allBypassActors: Type.RulesetBypassActor[] = []

  for (const rulesetMeta of Array.isArray(rulesets) ? rulesets : []) {
    // Fetch detailed ruleset (which includes bypass_actors)
    const { data: ruleset } = await octokit.request(
      'GET /repos/{owner}/{repo}/rulesets/{ruleset_id}',
      {
        owner: repoData.owner as string,
        repo: repoData.repository as string,
        ruleset_id: rulesetMeta.id,
      },
    )
    // If bypass_actors exist, add only those with valid actor_id (number) to the array
    if (Array.isArray(ruleset.bypass_actors)) {
      allBypassActors.push(
        ...ruleset.bypass_actors
          .filter((actor) =>
            typeof actor.actor_id === 'number' && actor.actor_id !== null &&
            actor.actor_id !== undefined
          )
          .map((actor) => ({
            actor_id: actor.actor_id as number,
            actor_type: actor.actor_type,
            bypass_mode: actor.bypass_mode ?? '',
          } as Type.RulesetBypassActor)),
      )
    }
  }

  return allBypassActors
}

/**
 * @function getRulesetConditionsList
 * @param repoData The repository parameters including token, owner, repository, and branch.
 * @returns conditions An array of condition objects with include and exclude rules.
 */
export async function getRulesetConditionsList(
  repoData: Type.RepoParams = {
    token: '',
    owner: '',
    repository: '',
    branch: '',
  },
): Promise<Type.RulesetConditions[]> {
  const octokit = await $octokit.initOctokitWithThrottlingAndRetry()

  // Get all rulesets
  const { data: rulesets } = await octokit.request(
    'GET /repos/{owner}/{repo}/rulesets',
    { owner: repoData.owner, repo: repoData.repository },
  )

  const conditions: Type.RulesetConditions[] = []

  for (const rulesetMeta of Array.isArray(rulesets) ? rulesets : []) {
    // Fetch detailed ruleset
    const { data: ruleset } = await octokit.request(
      'GET /repos/{owner}/{repo}/rulesets/{ruleset_id}',
      {
        owner: repoData.owner as string,
        repo: repoData.repository as string,
        ruleset_id: rulesetMeta.id,
      },
    )
    // check primarily for 'ref_name.include[]' Arrray conditions
    // this function does not determine if the ruleset conditions apply to a branch of not
    // it only returns the *any* conditions existing in the rulesets
    if (
      typeof ruleset.conditions === 'object' &&
      ruleset.conditions !== null &&
      typeof ruleset.conditions.ref_name === 'object' &&
      ruleset.conditions.ref_name !== null &&
      Array.isArray(ruleset.conditions.ref_name.include)
    ) {
      conditions.push({
        include: ruleset.conditions.ref_name.include as Array<string>,
        exclude: Array.isArray(ruleset.conditions.ref_name.exclude)
          ? (ruleset.conditions.ref_name.exclude as Array<string>)
          : [],
      } as Type.RulesetConditions)
    }
  }

  return conditions
}
