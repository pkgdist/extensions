# Extension System

[![JSR release (latest)](https://img.shields.io/badge/JSR-module-hotpink)](https://jsr.io/@softdist/extensions)
[![GitHub release (latest)](https://img.shields.io/badge/github-repo-8A2BE2)](https://github.com/pkgdist/extensions)


> [!IMPORTANT]
>
> VERSION UPDATE 0.2.1

Github Scopes Update.  Expect a lot more of these types of features for detecting Github settings.
This is the first in the group, and it deals with Github Repository Rulesets, Rules, and their parameters.

- Ruleset checks
- Branch Protection for status checks to pass
- Branch Protection for up-to-date requirement
- Copilot Code Review enabled
- Any other rule can be determined by using a `JSON_PATH`
  
### Examples

| TITLE | JSON_PATH | DESCRIPTION |
| :---- | :---- | :---- |
| require-status-checks-pass | `rulesets.0.requireStatusChecksToPass` | Require all status checks to pass |
| require-branch-up-to-date | `rulesets.0.requireBranchesUpToDate` | Require that the PR is up to date with any changes at origin |
| require-copilot-review | `rulesets.0.copilotCodeReviewEnabled` | Require copilot code review on PR |
| require-params-code-review | `rules.2.parameters.automatic_copilot_code_review_enabled` | Require PR code review in rule parameters |

## Generic Comparison & Reporting Functions

This system is a generic comparison and reporting module that plugs into
external systems we manage. It contains no private data nor proprietary
information. It is specifically for calling error display, report scoring, deep
object comparison, and other helper functions that are generic and
multi-purpose.

### Features

> [!TIP]
> Use a generic `import * as exts from 'jsr:@softdist/extensions@0.2.X'` and it will automatically retrieve all the modules we export below:

1. `$colors` - log colors
2. `$const` - constants we often declare such as acquiring github cli token
3. `$token` - gh cli token and envcrypt
4. `$error` - generic errors
5. `$deep` - deep object comparison
6. `$report` - reporting mechanism
7. `$ruleset` - github ruleset inspection mechanisms
8. `$streams` - static FileStream objects for async and callback logging
9. `$webhook` - generic webhooks
10. `Type` - exported types used throughout these features
11. `generatedVersion` - automatic git tag version embedded in this release

Each registry of rules will be published in the engine itself, not this module.  
The purpose of this module is to abstract any reporting or evaluation features into 
re-usable interfaces so they may be called in dynamic code evaluations in Deno 
without the necessity to write Typescript code to the user's computer.

## Platforms

- Linux
- Windows
- Darwin

## Architectures

- ARM64
- X86_64
