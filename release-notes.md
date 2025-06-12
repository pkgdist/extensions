# Extensions

Release notes for the `@softdist/extension` system:  An abstract extension system for inspection of Github scopes.

* Package: [@softdist/extensions](https://jsr.io/@softdist/extensions)
* Repository: [@pkgdist/extensions](https://github.com/pkgdist/extensions)

## Version 0.2.2

[![JSR release (latest)](https://img.shields.io/badge/JSR-module-hotpink)](https://jsr.io/@softdist/extensions)
[![GitHub release (latest)](https://img.shields.io/badge/github-repo-8A2BE2)](https://github.com/pkgdist/extensions)

> [!IMPORTANT]
>
> PATCH UPDATE

Github Scopes Update. 

> Expect a lot more of these types of features for detecting
Github settings. 

This is the first in the group, and it deals with Github Repository Rulesets, Rules, and their parameters.

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

### Features

> [!TIP]
> Use a generic `import * as exts from 'jsr:@softdist/extensions@0.2.X'` and it
> will automatically retrieve all the modules we export below:

## Exported Modules

| Feature Name       | Purpose                                                                                   |
| :----------------- | :---------------------------------------------------------------------------------------- |
| `$colors`          | Automatic error logging and warn/notice stream logging with colors                        |
| `$const`           | Declared generic constants for local system paths and GITHUB API                          |
| `$compare`         | Comparison functions for deep YML objects.                                                |
| `$error`           | Generic error functions for including messages with specific colors                       |
| `$ruleset`         | Github Rulesets and Rule scopes for detecting branch protections                          |
| `$report`          | Reporting function for scoring tabulation in streams, and notification functions in teams |
| `$streams`         | Optic FileStream object for logging colored error messages to evaluated streams           |
| `$token`           | Token acquisition for GitHub CLI default, or .envcrypt files, or environment vars         |
| `$webhook`         | Webhook secret acquisition IFFE functions                                                 |

## Exported Variables

| Variable           | Description                                                                               |
| :----------------- | :---------------------------------------------------------------------------------------- |
| `generatedVersion` | Software Version Information                                                              |
| `Type`             | Types used throughout this software                                                       |

Each registry of rules will be published in the engine itself, not this module.\
The purpose of this module is to abstract any reporting or evaluation features
into re-usable interfaces so they may be called in dynamic code evaluations in
Deno without the necessity to write Typescript code to the user's computer.

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
