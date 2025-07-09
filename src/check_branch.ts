import { log } from 'node:console'
import * as $ruleset from './func_rules.ts'
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

const branch = await $ruleset.inspectDetailedBranchProtection(
  token,
  repoData.owner,
  repoData.repository,
  repoData.branch,
)
console.log(branch)

const branch_results = $ruleset.findParamPaths(
  { str: branch },
  'required_pull_request_reviews',
)

console.log(
  Array.isArray(branch_results) && branch_results.length > 0 ? 'true' : 'false',
)

// mock the reporting for fun
  const report = await $reporting.createReport([], 'report_aggregate.json')
  type ReportRecord = Record<string, unknown>
  await report.addEntry(
    'aggregate_report',
    $reporting.createReportEntry<Type.ReportEntryWithNone<ReportRecord>>({
      score: 2,
      rule: 'branch-require-pull-request-before-merging',
      description: 'Branch Protections requires all commits must be made to a non-protected branch and submitted via a pull request before they can be merged into the [main|master|default] branch',
      repo: 'test',
      path: 'test',
      success: true,
      customFields: {
        notify: 'teams1',
        owner: 'dynamic.owner'
      }
    })
  )


/* NOSONAR_START

// this code shows a manual API process for branch protection
// we used this for debug but I want to keep it for reference
try {
  const branch_result = await octokit.request(
    'GET /repos/{owner}/{repo}/branches/{branch}/protection',
    {
      owner: repoData.owner,
      repo: repoData.repository,
      branch: repoData.branch,
    }
  )


  const rulesets = await octokit.request(
    'GET /repos/{owner}/{repo}/rulesets',
    {
      owner: repoData.owner,
      repo: repoData.repository,
      branch: repoData.branch,
    }
  )

  console.log(JSON.stringify(rulesets, null, 2))



} catch (error) {
  console.error('Error fetching branch protection:', error)
}



NOSONAR_END */
