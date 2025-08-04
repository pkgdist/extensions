#!/usr/bin/env -S deno run --allow-read

/**
 * @file .lefthook.commit.ts
 * @description This script validates commit messages based on a specific format.
 * @author Lynsei Hogan
 * @usage  deno run -A ./src/.lefthook.commit.ts "feature/story_89: This is cool!"
 * @returns true if commit is invalid, otherwise false
 */
const VALID_TYPES = [
  'feature',
  'task',
  'bug',
  'patch',
  'spike',
  'docs',
  'fmt',
  'enhancement',
  'series',
  'epic',
  'story',
  'issue',
]

const COMMIT_MSG_FILE = Deno.args[0] || '.git/COMMIT_EDITMSG'

const message = Deno.args[0]
  ? Deno.args[0].trim()
  : Deno.readTextFileSync(COMMIT_MSG_FILE).trim()

const regex = /^([a-z]+)\/(\d+):\s.+$/
const match = message.match(regex)

let err = 'false' // Declare err outside the blocks
if (match) {
  const [_, type] = match
  if (!VALID_TYPES.includes(type)) {
    err = 'true'
  }
} else {
  err = 'true'
}

// All validations passed
console.log(err)
Deno.exit(0)
