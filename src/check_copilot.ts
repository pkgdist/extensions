import {
  assertRulesetByIndexParameter,
  assertRulesetParameter,
  inspectReviewAndCopilotEnforcement,
} from './func_rules.ts'

// const result = await inspectReviewAndCopilotEnforcement(token, owner, repo, branch)
// console.log(JSON.stringify(result, null, 2))

const repoData = {
  token: Deno.env.get('PROD_TOKEN')!,
  owner: Deno.env.get('PROD_OWNER')!,
  repository: Deno.env.get('PROD_REPO')!,
  branch: 'main',
}

// -------- by number
// const rulesetNumber = 5982553;
// const parameterPath = "rules.2.parameters.automatic_copilot_code_review_enabled";
// const value = true;

// const result = await assertRulesetParameter(rulesetNumber, parameterPath, value, repoData);
// console.log(result); // "true" or "false"

// -------- by id

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

const rulesetNumber = 0
const parameterPath = 'rules.2.parameters.automatic_copilot_code_review_enabled'
const value = true

const result = await assertRulesetByIndexParameter(
  rulesetNumber,
  parameterPath,
  value,
  repoData,
)
console.log(result) // "true" or "false"
