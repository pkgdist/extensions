import * as $ruleset from '../func_rules.ts'
import * as $token from '../func_token.ts'
import { assertEquals } from 'jsr:@std/assert@^0.224.0/assert-equals'

Deno.test({
  name: 'assertRulesetByIndexParameter - copilotCodeReviewEnabled is true',
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const token = await $token.getToken()
    if (!token) {
      throw new Error(
        'No GitHub token found. Please set the GITHUB_TOKEN environment variable.',
      )
    }
    const repoData = {
      token,
      owner: Deno.env.get('PROD_OWNER')!,
      repository: Deno.env.get('PROD_REPO')!,
      branch: 'main',
    }
    const rulesetIndex = 0
    const parameterPath = 'copilotCodeReviewEnabled'
    const value = true

    const result = await $ruleset.assertRulesetByIndexParameter(
      rulesetIndex,
      parameterPath,
      value,
      repoData,
    )
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
        'No GitHub token found. Please set the GITHUB_TOKEN environment variable.',
      )
    }
    const repoData = {
      token,
      owner: Deno.env.get('PROD_OWNER')!,
      repository: Deno.env.get('PROD_REPO')!,
      branch: 'main',
    }
    const rulesetIndex = 0
    const parameterPath = 'requireStatusChecksToPass'
    const value = true

    const result = await $ruleset.assertRulesetByIndexParameter(
      rulesetIndex,
      parameterPath,
      value,
      repoData,
    )
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
        'No GitHub token found. Please set the GITHUB_TOKEN environment variable.',
      )
    }
    const repoData = {
      token,
      owner: Deno.env.get('PROD_OWNER')!,
      repository: Deno.env.get('PROD_REPO')!,
      branch: 'main',
    }
    const rulesetIndex = 0
    const parameterPath = 'requireBranchesUpToDate'
    const value = true

    const result = await $ruleset.assertRulesetByIndexParameter(
      rulesetIndex,
      parameterPath,
      value,
      repoData,
    )
    assertEquals(result, 'true')
  },
})
