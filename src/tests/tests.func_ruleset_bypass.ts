import * as $ruleset from '../func_rules.ts'
import * as $token from '../func_token.ts'
import { assert } from 'jsr:@std/assert@^0.224.0/assert'

function requireEnvVars(...vars: string[]) {
  for (const v of vars) {
    if (!Deno.env.get(v)) {
      console.warn(`Skipping tests: ${v} is not set.`)
      Deno.exit(0)
    }
  }
}

requireEnvVars('PROD_OWNER', 'PROD_REPO')

Deno.test({
  name: 'getRulesetBypassActors returns bypass actors if any exist',
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
      token,
      owner: Deno.env.get('PROD_OWNER')!,
      repository: Deno.env.get('PROD_REPO')!,
      branch: 'main',
    }
    const bypassActors = await $ruleset.getRulesetBypassList(repoData)
    // If there are any bypass actors, the array should not be empty
    if (bypassActors && bypassActors.length > 0) {
      assert(Array.isArray(bypassActors), 'bypassActors should be an array')
      for (const actor of bypassActors) {
        assert('actor_id' in actor, 'actor_id should exist in bypass actor')
        assert('actor_type' in actor, 'actor_type should exist in bypass actor')
        assert(
          'bypass_mode' in actor,
          'bypass_mode should exist in bypass actor',
        )
      }
    } else {
      // If no bypass actors, test passes as long as result is an array
      assert(Array.isArray(bypassActors), 'bypassActors should be an array')
    }
  },
})
