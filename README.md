<!-- markdownlint-disable MD041 -->
<!-- markdownlint-disable MD012 -->

# Extensions

[![Docker Image Version (tag latest semver)](https://img.shields.io/badge/CI%20build%20passing-green)](https://hub.docker.com/r/lynsei/devcontainer.deno)
[![GitHub release (latest SemVer)](https://img.shields.io/badge/github-repo-8A2BE2)](https://github.com/orchestras/deno)

This is a reporting & scoring extensions toolkit that comes compiled as a JSR
package for use on our Rules Engine software. The Rules Engine simply runs
pass/fail tests on a variety of dynamic code executions. The code executions
utilize dynamic reporting functions, thus the need for a re-usable package that
provides them.

## Reporting methods

This repo houses extensions for external reporting functions that occur as async
calls through dynamic deno code evaluations. The purpose here is to abstract the
reporting methods into a re-usable package which can be used for any dynamic
code evals.

### What is this?

> [!IMPORTANT]
>
> This is a GENERIC library with no proprietary information inside it. It can be
> re-used for any purpose and is open source.

This is a library for reporting and scoring tools. They can be used for any
purpose as a standard library that gets included. The goal is to provide a
variety of reporting and scoring functions that occur and can be modified
outside the rules engine itself.

## Repo Features

| Feature Name       | Purpose                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| $report            | Reporting function for scoring tabulation in streams, and notification functions in teams           |
| $const             | Declared generic constants for local system paths and GITHUB API                                    |
| $deep              | DeepEq Comparison functions for objects.  These are used for YML object comparisons                 |
| $error             | Generic error functions for including messages with specific colors                                 |
| $streams           | Optic FileStream object for logging colored error messages to evaluated streams                     |
| $token             | Token acquisition for GitHub CLI default, or .envcrypt files, or environment vars                   |
| $webhook           | Webhook secret acquisition IFFE functions                                                           |
| generatedVersion   | Software Version Information                                                                        |
| Type               | Types used throughout this software                                                                 |

&nbsp;

# LICENSE

MIT License. © Lynsei Asynynivynya 2025. 

> [!IMPORTANT]
> Credits Below:

Portions of this software are used from:

> @onjara/optic portions are used due to a bug with mod.ts file not being available in FileStreams 2.0.3
