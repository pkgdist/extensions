import * as $ruleset from './func_rules.ts'
import * as $token from './func_token.ts'
import { ExtensionSystemTypes as Type } from './types.d.ts'

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

const allBypassActors = await $ruleset.getRulesetBypassList( repoData )

  console.log(allBypassActors)

  const inspection_results = $ruleset.findParamPaths(
    { str: allBypassActors },
    'actor_id',
  )

  const analysis_results = $ruleset.findParamPaths(
    { str: inspection_results },
    'value',
  )

  if (
    analysis_results.length > 0 &&
    analysis_results.some(
      (item: Type.PathValue) =>
        typeof item.value === 'number' && item.value > 0,
    )
  ) {
    // at least one ruleset value for check_response_timeout_minutes was >= 1
    console.log('true')
  } else {
    console.log('false')
  }
