import { GITHUB_TOKEN } from '../declare_const.ts'
import * as $ruleset from '../func_rules.ts'
import * as $token from '../func_token.ts'
import { assertEquals } from 'jsr:@std/assert@^0.224.0/assert-equals'

Deno.test({
  name: 'assertRulesetByIndexParameter - copilotCodeReviewEnabled is true',
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const repoData = {
      token: GITHUB_TOKEN as string,
      owner: Deno.env.get('PROD_OWNER')!,
      repository: Deno.env.get('PROD_REPO')!,
      branch: 'main',
    }
    const result = await $ruleset.assertRulesetByIndexParameter(
      0, // rulesetNumber
      'copilotCodeReviewEnabled', // ruleset JSON path
      true, // value to assert
      repoData,
    )
    console.log(result) // "true" or "false"
    assertEquals(result, 'true')
  },
})

Deno.test({
  name: 'assertRulesetByIndexParameter - requireStatusChecksToPass is true',
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const token = await $token.getToken()
    if (!token) {
      throw new Error(
        'No GitHub token found. Please set the PROD_TOKEN environment variable.',
      )
    }
    const repoData = {
      token: GITHUB_TOKEN as string,
      owner: Deno.env.get('PROD_OWNER')!,
      repository: Deno.env.get('PROD_REPO')!,
      branch: 'main',
    }
    const result = await $ruleset.assertRulesetByIndexParameter(
      0, // rulesetNumber
      'requireStatusChecksToPass', // ruleset JSON path
      true, // value to assert
      repoData,
    )
    console.log(result) // "true" or "false"
    assertEquals(result, 'true')
  },
})

Deno.test({
  name: 'assertRulesetByIndexParameter - requireBranchesUpToDate is true',
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const token = await $token.getToken()
    if (!token) {
      throw new Error(
        'No GitHub token found. Please set the PROD_TOKEN environment variable.',
      )
    }
    const repoData = {
      token: GITHUB_TOKEN as string,
      owner: Deno.env.get('PROD_OWNER')!,
      repository: Deno.env.get('PROD_REPO')!,
      branch: 'main',
    }
    const result = await $ruleset.assertRulesetByIndexParameter(
      0, // rulesetNumber
      'requireBranchesUpToDate', // ruleset JSON path
      true, // value to assert
      repoData,
    )
    console.log(result) // "true" or "false"
    assertEquals(result, 'true')
  },
})
