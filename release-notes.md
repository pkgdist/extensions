# Extension System

## Generic Comparison & Reporting Functions

This system is a generic comparison and reporting module that plugs into external systems we manage.
It contains no private data nor proprietary information.  It is specifically for calling error display, report scoring, deep object
comparison, and other helper functions that are generic and multi-purpose.

### Features

1. colors - log colors
2. const - constants we often declare such as acquiring github cli token
3. token - gh cli token and envcrypt
4. error - generic errors
5. deepeq - deep object comparison
6. report - reporting mechanism
7. webhook - generic webhooks
8. types.d - types and interfaces

Notes:  This release makes the development experience a lot better moving back and forth between many repos and syncing changes where necessary, updating the template as needed.   It flows a lot better in general.  This is critical because I'm going to be adding a lot of Typescript reflection code for testing and comparing objects, and the config may need updated more frequently in the future so this makes the workflow a lot smoother.

## Platforms

- Linux
- Windows
- Darwin
- Linux
- Windows
- Darwin

## Architectures

- ARM64
- X86_64
- ARM64
- X86_64
