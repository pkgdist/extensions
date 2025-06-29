import { assert, assertEquals } from 'jsr:@std/assert@1.0.13'
import { Reporting } from '../class_reporting.ts'

// Mock notifyTeams to avoid real network calls
const mockNotifyTeams = async (_entry: unknown) => {
  return
}

// Helper to remove test files after each test
async function cleanup(file: string) {
  try {
    await Deno.remove(file)
  } catch {
    // ignore if file does not exist
  }
}

Deno.test('Reporting: creates and saves aggregate report with correct structure', async () => {
  const testFile = 'test_report_aggregate.json'
  await cleanup(testFile)

  const reporting = new Reporting(testFile)

  // Register mock hook
  reporting.registerHook(mockNotifyTeams)

  // Add entries for two repos
  await reporting.addEntry('name', {
    score: 1,
    rule: 'require-connect-yml',
    description: 'desc1',
    repo: 'repo1',
    path: '/repo1',
    success: true,
  })
  await reporting.addEntry('name', {
    score: 0,
    rule: 'require-connect-yml',
    description: 'desc2',
    repo: 'repo2',
    path: '/repo2',
    success: false,
  })

  // Read and check file structure
  const data = await Deno.readTextFile(testFile)
  const json = JSON.parse(data)

  assert('repos' in json, "Aggregate report should have 'repos' key")
  assertEquals(Object.keys(json.repos).length, 2)
  assertEquals(json.repos.repo1[0].score, 1)
  assertEquals(json.repos.repo2[0].success, false)

  await cleanup(testFile)
})

Deno.test('Reporting: load() restores previous aggregate state', async () => {
  const testFile = 'test_report_aggregate.json'
  await cleanup(testFile)

  // Write a fake report file
  const fake = {
    repos: {
      repoA: [
        {
          score: 2,
          rule: 'test-rule',
          description: 'desc',
          repo: 'repoA',
          path: '/repoA',
          success: true,
        },
      ],
    },
  }
  await Deno.writeTextFile(testFile, JSON.stringify(fake))

  const reporting = new Reporting(testFile)
  await reporting.load()

  // Add another entry to the same repo
  await reporting.addEntry('name', {
    score: 3,
    rule: 'test-rule-2',
    description: 'desc2',
    repo: 'repoA',
    path: '/repoA',
    success: false,
  })

  const data = await Deno.readTextFile(testFile)
  const json = JSON.parse(data)

  assertEquals(json.repos.repoA.length, 2)
  assertEquals(json.repos.repoA[1].score, 3)

  await cleanup(testFile)
})

Deno.test('Reporting: hooks are called for each entry', async () => {
  const testFile = 'test_report_aggregate.json'
  await cleanup(testFile)

  let called = false
  const hook = async (_entry: any) => {
    called = true
  }

  const reporting = new Reporting(testFile)
  reporting.registerHook(hook)

  await reporting.addEntry('name', {
    score: 1,
    rule: 'hook-test',
    description: 'desc',
    repo: 'repoX',
    path: '/repoX',
    success: true,
  })

  assert(called, 'Hook should have been called')

  await cleanup(testFile)
})
