import * as $branch from './func_branch.ts'
import * as $token from './func_token.ts'
import * as $reporting from './class_reporting.ts'
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

const branch = await $branch.inspectDetailedBranchProtection(
  token,
  repoData.owner,
  repoData.repository,
  repoData.branch,
)

const branch_results = $branch.findParamPaths(
  { str: branch },
  'required_approving_review_count',
)
console.table(branch_results)
console.log(
  Array.isArray(branch_results) && branch_results.length > 0 ? 'true' : 'false',
)

const branch_results2 = $branch.findParamPaths(
  { str: branch },
  'required_pull_request_reviews',
)

console.log(
  Array.isArray(branch_results2) && branch_results2.length > 0
    ? 'true'
    : 'false',
)
