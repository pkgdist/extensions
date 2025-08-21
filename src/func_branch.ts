// deno-lint-ignore-file no-explicit-any
import * as octo from 'npm:@octokit/core@7.0.2'
import { ExtensionSystemTypes as Type } from './types.d.ts'
import * as $octokit from './func_octokit.ts'

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
    restrictions: {},
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
      if (
        rpr !== undefined &&
        branchProtection.required_pull_request_reviews !== undefined
      ) {
        Object.assign(
          branchProtection.required_pull_request_reviews,
          {
            required_approving_review_count:
              rpr.required_approving_review_count ?? 0,
            dismiss_stale_reviews: rpr.dismiss_stale_reviews ?? false,
            require_code_owner_reviews: rpr.require_code_owner_reviews ?? false,
            dismissal_restrictions: rpr.dismissal_restrictions ?? undefined,
            bypass_pull_request_allowances:
              rpr.bypass_pull_request_allowances ?? undefined,
            require_last_push_approval: rpr.require_last_push_approval ?? false,
          },
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
    branchProtection.lock_branch.enabled = data.lock_branch?.enabled ?? false
    branchProtection.enforce_admins.enabled = data.enforce_admins?.enabled ??
      false
    branchProtection.restrictions = data.restrictions
    branchProtection.allow_force_pushes.enabled =
      data.allow_force_pushes?.enabled ?? false
    branchProtection.allow_deletions.enabled = data.allow_deletions?.enabled ??
      false
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
