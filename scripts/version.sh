   #!/usr/bin/env bash

    tmp=$(mktemp)
    version=$(git tag -l | tail -n 1)
    echo "Installing latest version from git tag ($version)..."
    jq ".version = \"$version\"" deno.json > "$tmp" && mv "$tmp" deno.json
    deno task build