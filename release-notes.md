# Extensions

[![JSR release (latest)](https://img.shields.io/badge/JSR-module-hotpink)](https://jsr.io/@softdist/extensions)
[![GitHub release (latest)](https://img.shields.io/badge/github-repo-8A2BE2)](https://github.com/pkgdist/extensions)

> Release notes for the `@softdist/extension` github scopes extensions:

_An abstract extension system for inspection of Github scopes and settings_

- Package: [@softdist/extensions](https://jsr.io/@softdist/extensions)
- Repository: [@pkgdist/extensions](https://github.com/pkgdist/extensions)

## ^0.3.4

- Reporting aggregation uses temporary files now for easier debugging
- To combine individual reports, a trigger must be called:  `await $reporting.Reporting.combineReports()`

## ^0.3.3

- Added a write lock queue for report class aggregate file saves to fix a bug
  where parallel write truncate the report unintentionally

## ^0.3.2

- Added Throttle and Retry Plugins to default Octokit.
- Added Octokit.graphql and OctokitRest object called as:

```typescript
const octokit = await $octokit.initOctokitWithThrottlingAndRetry('core')
// or REST
const octokit = await $octokit.initOctokitWithThrottlingAndRetry('rest')
```

- Added Legacy Branch Protections API:

| Name       | Description                                                  |
| :--------- | :----------------------------------------------------------- |
| func_rules | inspectDetailedBranchProtection function supports legacy API |

## Support for Branch Protections API

| **ID**                                      | **Description**                                                                                                                                                     | **Object**                                                    | **Logic**               |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------- |
| branch-require-pull-request-before-merging  | Branch requires all commits must be made to a non-protected branch and submitted via a pull request before they can be merged into a branch that matches this rule. | required_pull_request_reviews                                 | If object exists        |
| branch-require-pull-request-approvals       | Branch requires pull requests targeting a matching branch require a number of approvals and no changes requested before they can be merged.                         | required_pull_request_reviews.required_approving_review_count | If number > 0           |
| Branch-require-pull-request-approval-number | Branch requires pull requests have this number of unique approvers                                                                                                  | required_pull_request_reviews.required_approving_review_count | If number exists        |
| branch-dismiss-stale-reviews                | Branch requires PR checks will dismiss stale pull request approvals when new commits are pushed.                                                                    | required_pull_request_reviews.dismiss_stale_reviews           | If boolean true         |
| branch-require-code-owner-reviews           | Branch requires code owner reviews before merging.                                                                                                                  | required_pull_request_reviews.require_code_owner_reviews      | If boolean true         |
| branch-require-dismissal-restrictions       | Branch require certain users, teams, or apps can dismiss restrictions on pull requests                                                                              | required_pull_request_reviews.dismissal_restrictions          | If object exists        |
| branch-require-bypass-allowances            | Branch requires certain users, teams, or apps can bypass required pull requests                                                                                     | required_pull_request_reviews.bypass_pull_request_allowances  | If object exists        |
| branch-allow-force-pushes                   | Branch requires most recent reviewable push must be approved by someone other than the person who pushed it.                                                        | required_pull_request_reviews.require_last_push_approval      | If boolean is true      |
| branch-require-status-checks                | Branch requires status checks to pass before merging.                                                                                                               | required_status_checks                                        | If object exists        |
| branch-require-strict-status-checks         | Require branches to be up to date before merging.                                                                                                                   | required_status_checks.strict                                 | If boolean true         |
| branch-require-status-checks-contexts       | Branch requires items of the list for status checks exist                                                                                                           | required_status_checks.contexts                               | If array contains items |
| branch-require-conversation-resolution      | Require all conversations to be resolved before merging.                                                                                                            | required_conversation_resolution.enabled                      | If boolean true         |
| branch-require-signed-commits               | Branch requires signed commits on PR to main/master.                                                                                                                | required_signatures.enabled                                   | If boolean true         |
| branch-require-linear-history               | Branch requires PR will require linear commit history.                                                                                                              | required_linear_history.enabled                               | If boolean true         |
| branch-lock-branch                          | Branch requires the branch is read-only. Users cannot push to the branch.                                                                                           | lock_branch.enabled                                           | If boolean true         |
| branch-enforce-admins                       | Enforce branch protection for administrators.                                                                                                                       | enforce_admins.enabled                                        | If boolean true         |
| branch-restrict-push                        | Branch restricts who can push                                                                                                                                       | restrictions                                                  | If object exists        |
| branch-restrict-new                         | Branch restricts new branch creation                                                                                                                                | restrictions                                                  | If object exists        |
| branch-allow-force-pushes                   | Allow force pushes to matching branches.                                                                                                                            | allow_force_pushes.enabled                                    | If boolean is true      |
| branch-allow-deletions                      | Allow deletion of matching branches.                                                                                                                                | allow_deletions.enabled                                       | If boolean is true      |
| branch-lock-branch                          | Lock matching branches.                                                                                                                                             | lock_branch.enabled                                           | If boolean is true      |
| branch-copilot-code-review-enabled          | Require Copilot AI code review agent for PRs to main branch.                                                                                                        | NOT AVAILABLE IN API                                          |                         |
| branch-restrict-commit-metadata             | Restrict commit metadata (e.g., author, committer, dates).                                                                                                          | NOT AVAILABLE IN API                                          |                         |
| branch-require-codescanning-results         | Require code scanning results before merging.                                                                                                                       | NOT AVAILABLE IN API                                          |                         |
| branch-merge-queue                          | Branch Merge Queue settings                                                                                                                                         | NOT AVAILABLE IN API                                          |                         |
| branch-require-review-before-deployment     | Branch requires review before deploy                                                                                                                                | NOT AVAILABLE IN API                                          |                         |

## ^0.3.1

Additional comparison functions and permissions functions:

| Name              | Description                     |
| :---------------- | :------------------------------ |
| func_file         | file regex and other features   |
| func_permissions  | functions for permissions scans |
| check_permissions | update of rules functions       |

## ^0.3.0

| Name                     | Description                          |
| :----------------------- | :----------------------------------- |
| check_ruleset_bypass     | example of bypass list retrieval     |
| check_ruleset_conditions | example of conditions list retrieval |
| func_rules               | update of rules functions            |

## ^0.2.9

### Key Information:

- Implemented `customFields` for report types from dynamic object for use in
  rules reporting in pass/fail report scenarios
- Implemented `custom exceptions` for report types
- Implemented `dynamic repository + owner` object for executeCode() in
  `customFields` by default
- Implemented `createReport` function with `hooks` which are now dynamic
  functions executed at runtime in `reportExecution`
- Implemented `createReportEntry` function accepting `CustomWith*` generic types
  for handling exceptions as part of the rules engine reporting feature.
- Implemented `report.addEntry` and `Reporting` object using observer pattern to
  accept new entries and merge them into the JSON aggregation object.

#### Example: custom fields

In the below example we use
`exts.$reporting.createReportEntry<exts.Type.ReportEntryWithNone<ReportRecord>>`

That is the `reportEntry type`and its interface allows:

- `exts.Type.ReportEntryWithNone<ReportRecord>`
- `exts.Type.ReportEntryWithErrors<ReportRecord>`

This flexibility allows any developer to create custom fields and even custom
object types for the aggregate reporting capabilities:

1. Custom Object Types i.e.- `type ReportRecord = Record<string, unknown>` for
   `customFields` automatically uses your type in the Report class.
2. Use `exts.$reporting.createReport` to create a new report object for each
   test on each repository
3. Use `exts.$reporting.notifyTeamsHook`to create teams notifications as a hook
4. Use `anyFunction` as a hook in `exts.$reporting.createReport`
5. Customize the report entry easily using a dynamic report:

```typescript
// passing test dynamic-report:
import * as exts from 'jsr:@softdist/extensions@0.2.9'
const report = await exts.$reporting.createReport(
  [async (entry) => {
    await exts.$reporting.notifyTeamsHook(
      `Rule: ${entry.rule} | Repo: ${entry.repo} | Status: ${
        entry.success ? 'PASS' : 'FAIL'
      }`,
    )
  }],
  'report_aggregate.json',
)
type ReportRecord = Record<string, unknown>

await report.addEntry(
  'aggregate_report',
  exts.$reporting.createReportEntry<
    exts.Type.ReportEntryWithNone<ReportRecord>
  >({
    data: '',
    success: true,
    customFields: {},
  }),
)
```

## Ruleset Information

We added `$ruleset.getRulesetBypassList()` as a method for pulling all bypass
actors for all rulesets. This is a requirement as we finish the complete
Ruleset, Rule, and Branch Protection/ Bypass framework.

We also added a bunch of 0.2.9 types:

- `GithubRuleset` and associated interfaces
- `RulesetBypassActor` for bypassActor interface
- `RulesetConditionRefName` for rulesetConditions interface

## ^0.2.8

This release impacts primarily our build system and handling of error messages
using custom types such as:

- `ReviewEnforcementSummary` - now relocated into `types.d.ts`
- `ReportEntryWithErrors` - a with errors type for error exceptions handlers
- `ReportEntryWithNone` - a custom field type for default behaviors of custom
  field records

### Updates Impact

> [!IMPORTANT]
>
> PATCH UPDATE

No breaking changes to be introduced in this release. This release impacts the

following:

| Feature Name | Purpose                                                                                      |
| :----------- | :------------------------------------------------------------------------------------------- |
| `$error`     | Updated Generic error functions for including messages with specific colors                  |
| `$ruleset`   | Updated rule functions in Github Rulesets and Rule scopes for detecting branch protections   |
| `$reporting` | Updated v0.2.8 Reporting object and the concept of hooks and custom entry types/ exceptions. |
| `Type`       | Updated System interfaces and types with generic types for Reports                           |

## Change Log

- Version `0.2.8` implement exception handlers and reporting hooks along with
  improvenents to bump* scripts and .envrc, and also changes to `install-tools`
  makefile process for `lefthook` pre-commit checks. This is a mandatory upgrade
  as we move to a CI based build process with attestations.
- Version `0.2.7` addresses the lack of a function for finding paths and values:
  `findParamPaths`
- It also addresses the need for a set of generic-type data objects for json
  based on:

```bash
repos: { 
  repo: [
    { 
      entry1: unknown, 
      entry2: unknown 
      entry3: unknown
    }
  ] 
}
```

The reporting object can now be extended by using custom exceptions or other
object types, and by simply passing any functions as hooks to the `createReport`
function.

## ^0.2.6

Passing custom objects to the `createReport` function is now trivial.

#### Extending createReportEntry\<custom\>

You can easily use the generic reporting object by instantiating it with a
custom type.

The example below illustrates how custom `Exception` error reporting objects are
passed to the Reporting class:

```typescript
// a custom error exception called Exception:
export type Exception = Error | string | Record<string, unknown>
// a custom HookExample function call to illustrate passing as a hook:
export async function HookExample(entry: string = '') {
  console.log(entry)
}

export const report = await createReport(
  [
    async (entry) => {
      await HookExample( // pass function as hook
        `Test Function`,
      )
    },
  ],
  'report_aggregate.json', // specify report JSON file
)
// add an entry to the 'example_report' with error type <Exception> for <ReportEntryWithErrors>
await report.addEntry(
  'example_report',
  createReportEntry<ReportEntryWithErrors<Exception>>({
    score: 3,
    rule: 'example_rule',
    description: 'This is an example rule',
    repo: 'test_repo',
    path: '',
    success: true,
    error: { error: 'test error' },
  }),
)
```

## ^0.2.5

> Expect a lot more of these types of features for detecting Github settings.

This is the first in the group, and it deals with Github Repository Rulesets,
Rules, and their parameters.

- **Ruleset checks**
  - Tests for Rulesets
- Documentation improvements
  - Improved Release Notes and Readme
  - Added Licensing Notes
- Token complexity reduction
  - Token graceful fallback improvements
  - Dependency reduction
- Housekeeping
  - Updated scripts
  - Updated Makefile
  - Bumped version
- Ruleset features
  - Branch Protection for status checks to pass
  - Branch Protection for up-to-date requirement
  - Copilot Code Review enabled
  - Any other rule can be determined by using a `JSON_PATH`

### Examples

| TITLE                      | JSON_PATH                                                  | DESCRIPTION                                                  |
| :------------------------- | :--------------------------------------------------------- | :----------------------------------------------------------- |
| require-status-checks-pass | `rulesets.0.requireStatusChecksToPass`                     | Require all status checks to pass                            |
| require-branch-up-to-date  | `rulesets.0.requireBranchesUpToDate`                       | Require that the PR is up to date with any changes at origin |
| require-copilot-review     | `rulesets.0.copilotCodeReviewEnabled`                      | Require copilot code review on PR                            |
| require-params-code-review | `rules.2.parameters.automatic_copilot_code_review_enabled` | Require PR code review in rule parameters                    |

## Generic Comparison & Reporting Functions

This system is a generic comparison and reporting module that plugs into
external systems we manage. It contains no private data nor proprietary
information. It is specifically for calling error display, report scoring, deep
object comparison, and other helper functions that are generic and
multi-purpose.

### ^0.2.0

> [!TIP]
> Use a generic `import * as exts from 'jsr:@softdist/extensions@0.2.X'` and it
> will automatically retrieve all the modules we export below:

_Baselines were created for the following:_

- Reporting
- Comparison
- Scoring

## Platforms

- Linux
- Windows
- Darwin

## Architectures

- ARM64
- X86_64

## About FileStream

> [!IMPORTANT]
> **Note:** This code relies on MIT licensed objects from `jsr:@onjara/optic`.

FileStreams 2.0.3 currently has a bug that disallows the use of FileStream
objects from import statements, as there is no `mod.ts` file
[here](https://github.com/onjara/optic/tree/master/streams/fileStream). Once
this bug is fixed we will remove the inclusion of optic code directly in our
package. (it's a stop gap measure)

&nbsp;

# LICENSE

This code uses the [MIT License](LICENSE) for OSS.

> © Lynsei Asynynivynya 2025.
