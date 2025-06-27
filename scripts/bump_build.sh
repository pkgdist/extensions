#!/usr/bin/env bash
[[ "$PWD" =~ pkgd|softd|lots ]] && PREFIX='' && echo ' - Automatically use JSR versioning'
[[ "$PWD" =~ mck ]] && PREFIX='v' && echo ' - Automatically use Semantic Versioning.'
source .envrc

# Get the last tag
tag=$(git tag -l | tail -n 1)
if [ -z "$tag" ]; then
  tag="0.0.0"
fi
echo "Last Tag: $tag"

# Generate build tag
newtag=$PREFIX$(./scripts/semver.sh bump build $(shuf -i 10000-99999 -n 1) $(git tag -l | tail -n 1))
build=$(echo "$newtag" | cut -d'+' -f 2)

echo "Build number: $build"
echo "New Tag: $newtag"

# Generate commit tag
commit=$(git log | head -n 3)

msg=$(echo -e "Build No: $build \nLast Commit: $commit")
echo "$msg" > .semver.commit.tag
echo "$newtag" > .semver.build.tag

git tag -a $(cat .semver.build.tag) -m $(cat .semver.build.tag)
cat .semver.build.tag
cat .semver.commit.tag
