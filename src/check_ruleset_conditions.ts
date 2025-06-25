import { INSPECT_MAX_BYTES } from 'node:buffer'
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

const result2 = await $ruleset.inspectReviewAndCopilotEnforcement(
  token,
  repoData.owner,
  repoData.repository,
  repoData.branch,
)
// console.log(JSON.stringify(result2, null, 2))

const allConditions = await $ruleset.getRulesetConditionsList(repoData)

//console.log(allConditions)

// search for any parameters that match the ref_name.internal
const inspection_results = $ruleset.findParamPaths(
  { str: allConditions },
  'include',
)

// get the values of any ref_name.internal parameters that were found in the search
const analysis_results = $ruleset.findParamPaths(
  { str: inspection_results },
  'value',
)

// regex to match any of the primary default branch names
const regex = /main|master|default/

const hasMainBranch = analysis_results.some((result) =>
  Array.isArray(result.value) &&
  result.value.some((v: string) => regex.test(v))
)

// output the result as a string [has conditions on main branch?]
console.log(hasMainBranch ? 'true' : 'false') // true if any conditions.ref_name.internal matches the regex
