# Orchestras Makefile v1.3:  DO NOT EDIT
# This Makefile is auto-generated and upgraded from a template
$(shell touch .envcrypt)
ifeq ($(origin CODESPACES),undefined)
  include .envcrypt
  $(eval export $(shell sed -ne 's/ *#.*$$//; /./ s/=.*$$// p' .envcrypt))
endif

# Print env var names and values
print-%: ##  Print env var names and values
	@echo $* = $($*)
echo-%: ##  Print any environment variable
	@echo $($*)

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## Print all commands and help info
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

cleanup-logs: ## Cleanup old log files
	rm -f ./debug.log*
	rm -f ./report.log*
	rm -f ./test.log*

test:  ## Run Deno Unit and Integration Tests
	deno test --allow-all --coverage=coverage --trace-leaks

run:  ## Run the program with no log-level set
	deno run --allow-all ./src/mod.ts

trace:  ## Run Program in Debug Mode
	deno run --allow-all --log-level trace ./src/mod.ts

debug:  ## Run Program in Debug Mode
	deno run --allow-all --no-check --log-level debug ./src/mod.ts

check: ## Run deno check
	deno check ./src/mod.ts

format:  ## Format the code using deno fmt
	deno fmt --check --indent-width 2 --unstable-yaml --no-semicolons --single-quote
	deno fmt --indent-width 2 --unstable-yaml --no-semicolons --single-quote 2>&1 | tee _.report.lizard.log

compile-darwin:  ## Compile for Darwin x86 and ARM64
	mkdir -p ./bin/aarch64-apple-darwin ./bin/x86_64-apple-darwin
	deno compile --include ./src/fixtures --allow-all --no-check --target aarch64-apple-darwin --output ./bin/aarch64-apple-darwin/$(PROGRAM) ./src/mod.ts
	deno compile --include ./src/fixtures --allow-all --no-check --target x86_64-apple-darwin --output ./bin/x86_64-apple-darwin/$(PROGRAM) ./src/mod.ts

compile-linux:  ## Compile Linux x86 and ARM64
	mkdir -p ./bin/aarch64-unknown-linux-gnu ./bin/x86_64-unknown-linux-gnu
	deno compile --include ./src/fixtures --allow-all --no-check --target aarch64-unknown-linux-gnu --output ./bin/aarch64-unknown-linux-gnu/$(PROGRAM) ./src/mod.ts
	deno compile --include ./src/fixtures --allow-all --no-check --target x86_64-unknown-linux-gnu --output ./bin/x86_64-unknown-linux-gnu/$(PROGRAM) ./src/mod.ts

compile-windows:  ## Compile Windows x86 and ARM64
	mkdir -p ./bin/aarch64-pc-windows-msvc ./bin/x86_64-pc-windows-msvc
	deno compile --include ./src/fixtures --allow-all --no-check --target aarch64-pc-windows-msvc --output ./bin/aarch64-pc-windows-msvc/$(PROGRAM).exe ./src/mod.ts
	deno compile --include ./src/fixtures --allow-all --no-check --target x86_64-pc-windows-msvc --output ./bin/x86_64-pc-windows-msvc/$(PROGRAM).exe ./src/mod.ts

install-binary:  ## Install the local binary to ~/.local/bin
	cp ./bin/aarch64-apple-darwin/$(PROGRAM) ~/.local/bin/$(PROGRAM)
	chmod +x ~/.local/bin/$(PROGRAM)

install-tools: ## Install SAST Toolchain
	chmod +x ./scripts/*
	./scripts/scan.sh

upgrade: ## Pull fresh files from the template repo
		@echo "Upgrading from template: $(TEMPLATE)"
		chmod +x ./scripts/*
		./scripts/copy_template.sh

set-version:  ## Set version in deno.json and version.ts from latest git tag
	./scripts/version.sh

install: ## Install all required SAST tools, hooks, and repository tags, multi-copies, and tags then test & run the code
	make actions
	chmod +x ./scripts/*
	make setup-fish
	make setup-brew
	make install-tools
	make tag
	make check
	make bump-build
	make set-version
	make set-paths

set-paths:  ## Copy the default template paths for Orchestras into this project
	chmod +x ./scripts/*
	./scripts/set_paths.sh

setup-fish: ## Setup Fish shell functions for working with templates
	chmod +x ./scripts/*
	./scripts/setup_fish.sh

setup-brew:  ## Install Project Brew Dependencies
	chmod +x ./scripts/*
	./scripts/setup_brew.sh

actions:  ## List Github Actions
	find . -path '*/.github/workflows/*' -type f -name '*.yml' -print0 \
		  | xargs -0 grep --no-filename "uses:" \
		  | sed 's/\- uses:/uses:/g' \
		  | tr '"' ' ' \
		  | awk '{print $2}' \
		  | sed 's/\r//g' \
		  | sort \
		  | uniq --count \
		  | sort --numeric-sort

devcontainer:  ## Make devcontainers, matrix-docker buildx bake build
	./scripts/docker_build.sh

client: ## Initialize and run thin client
	./scripts/bin.sh

tag:  ## Get the latest git tag
	git describe --tags `git rev-list --tags --max-count=1`

push-tags:
	git push origin --tags

bump-major:  ## Bump the major version tag
	./scripts/bump_major.sh

bump-minor:  ## Bump the minor version tag
	./scripts/bump_minor.sh

bump-patch:  ## Bump the patch version tag
	./scripts/bump_patch.sh

bump-build:  ## Bump the build version to a random build number
	./scripts/bump_build.sh

build-release:  ## Run release build
	./scripts/build_release.sh

ci-bump:  ## Build number (bump) releases:  Full CI Add-Commit-Tag-Push Process                                i.e.- '$make ci-bump int="109" msg="feature/story_109: Msg"'
	./scripts/ci_bump.sh $(int) "$(msg)"

ci-patch:  ## Patch releases: Full CI Add-Commit-Tag-Push Process
	./scripts/ci_patch.sh $(int) "$(msg)"

ci-minor:  ## Minor releases: Full CI Process Add-Commit-Tag-Push Process
	./scripts/ci_minor.sh $(int) "$(msg)"

ci-major:  ## Major releases: Full CI Process Add-Commit-Tag-Push Process
	./scripts/ci_minor.sh $(int) "$(msg)"
