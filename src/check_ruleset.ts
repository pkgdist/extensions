import * as $ruleset from './func_rules.ts'
import * as $token from './func_token.ts'

const token = await $token.getToken()
if (!token) {
  console.error(
    'No GitHub token found. Please set the GITHUB_TOKEN environment variable.',
  )
  Deno.exit(1)
}

const repoData = {
  token: token,
  owner: Deno.env.get('PROD_OWNER')!,
  repository: Deno.env.get('PROD_REPO')!,
  branch: 'main',
}

/*
copilotCodeReviewEnabled:
rulesets.0.copilotCodeReviewEnabled

requireStatusChecksToPass:
rulesets.0.requireStatusChecksToPass

requireBranchesUpToDate:
rulesets.0.requireBranchesUpToDate

If you have multiple rulesets, change the 0 to the appropriate index.

requireBranchesUpToDate
rulesetMeta
*/

const result2 = await $ruleset.inspectReviewAndCopilotEnforcement(
  token,
  repoData.owner,
  repoData.repository,
  repoData.branch,
)
console.log(JSON.stringify(result2, null, 2))

const result = await $ruleset.assertRulesetByIndexParameter(
  0, // rulesetNumber
  'requireBranchesUpToDate', // ruleset JSON path
  true, // value to assert
  repoData,
)
console.log(result) // "true" or "false"

const rs_results = $ruleset.findParamPaths(
  { str: result2 },
  'check_response_timeout_minutes',
)
console.log(rs_results)

// if rs_results > 0

if (rs_results.length > 0) {
  console.table(rs_results)
  console.log(rs_results[0].value)
  console.log('At least one rule parameter was returned')
}
