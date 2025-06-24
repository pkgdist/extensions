#!/usr/bin/env bash
set -e
# Full CI Bump Process:
# i.e.- git-add, git-commit, git-tag, deno-fmt, deno-lint, deno-test, git-ammend, git-push, push-tags

# Usage: ./scripts/build_push.sh <story_number> "<commit_message>"
# Description: This script ensures each round of commits happens in order with tags on the final commit.
#
# The order:
# 1. Git add any new files in CWD .
# 2. Git commit any new work using $2 as commit message
# 3. Bump the build number and set the git tag.
# 4. Set the deno version information to reflect the new build number in deno.json
# 5. Git commit the new build number and version information.
# 6. Push the branch
# 7. Push the new tags

# we first run tests and checks to ensure the code is ready to bump:

make test
make check
make format
direnv deny .
make cleanup-logs

# we create the new version number and install it here:
make bump-major
    tmp=$(mktemp)
    version_tag=$(cat .semver.version.tag)
    echo "Installing latest version from git tag ($version_tag)..."
    jq ".version = \"$version_tag\"" deno.json > "$tmp" && mv "$tmp" deno.json
    deno task build
    head -n 10 deno.json

# origination commit for any changes to branch:
git add .
git commit -m "$2 -- automated"

# note: lefthook runs pre-commit hooks here and will normally always return changes to the branch
# so we need to re-commit any format or other changes it implements prior to the push.


# we are committing again here to add in the lefthook changes, and the .semver tag changes
# and we are testing no-append:
git add .
git commit -m "$2 -- automated"

# we are checking the final commit status here:
git status

# we recreate the tag to ensure it is on the final commit
git tag -d $version_tag
git tag -a $version_tag -m "$version_tag"

# we push normally here:
git push origin feature/story_$1
git push --force --tags


echo "Pushed Major Version: $version_tag"
