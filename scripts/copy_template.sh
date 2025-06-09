#!/usr/bin/env bash

# includes
. ./scripts/colors.sh

do_copy () {

    if [[ $PWD == "$HOMEDIR" ]]; then
        echo -e "\n\n${RED}Already in the $HOMEDIR directory.  Not performing refresh...${ENDCOLOR}"
    else

        echo -e "\n\n${BLUE}Removing the .devcontainer and scripts directories to refresh them ${ENDCOLOR}";

        # remove .devcontainer and scripts to refresh sync to latest version
        rm -rf ./.devcontainer
        rm -rf ./scripts
        rm -f ./LICENSE.md

        # copy template files and clobber any existing template files
        cp -rf $HOMEDIR/scripts .
        cp -rf $HOMEDIR/.devcontainer .
        cp -f $HOMEDIR/.dvmrc .
        cp -f $HOMEDIR/.gitignore .
        cp -f $HOMEDIR/.dockerignore .
        cp -f $HOMEDIR/.envrc .
        cp -f $HOMEDIR/.gitattributes .
        cp -f $HOMEDIR/.gitignore .
        cp -f $HOMEDIR/.hogignore .
        cp -f $HOMEDIR/.editorconfig .
        cp -f $HOMEDIR/connect.yml .
        cp -f $HOMEDIR/.semver.author.gpg.tag ./.semver.author.gpg.tag
        cp -f $HOMEDIR/Makefile .
        cp -f $HOMEDIR/Dockerfile.package ./Dockerfile.package
        cp -f $HOMEDIR/docker-bake.hcl ./docker-bake.hcl

        # YML and MD files
        cp -f $HOMEDIR/lefthook.yml .
        cp -f $HOMEDIR/LICENSE .
        cp -f $HOMEDIR/CONTRIBUTING.md .

        # Copy these files over top of any existing ones since they are the same in every repo
        cp -f $HOMEDIR/src/.lefthook.* ./src/
        cp -f $HOMEDIR/src/build_npm.ts ./src/
        cp -f $HOMEDIR/src/make_version.ts ./src/
        cp -f $HOMEDIR/src/version.ts ./src/
        mkdir -p ./src/examples

        # Copy ALL src code but do not clobber most files, use as examples instead
        cp -f $HOMEDIR/src/*.ts ./src/examples/
        rm -rf ./src/examples/.lefthook.*
        rm -rf ./src/examples/build_npm.ts
        rm -rf ./src/examples/make_version.ts
        rm -rf ./src/examples/version.ts

        # GH Actions
        mkdir -p ./.github/workflows ./.github/actions
        cp -f $HOMEDIR/.github/copilot-instructions.md ./.github/
        cp -f $HOMEDIR/.github/CODEOWNERS ./.github/
        cp -rf $HOMEDIR/.github/workflows/* ./.github/workflows/

        # NO OVERRIDE [EXAMPLES]]
        cp -f $HOMEDIR/README.md ./README.md.examp
        cp -f $HOMEDIR/release-notes.md ./release-notes.md.examp
        cp -f $HOMEDIR/.envcrypt ./.envcrypt.examp
        cp -f $HOMEDIR/deno.json ./deno.json.examp
        cp -f $HOMEDIR/deno.lock ./deno.lock.examp

        # validate semver tags
        git tag -l | grep -q "v[0-9]*\.[0-9]*\.[0-9]*" && echo -e "\n\n${GREEN} Valid semver tags found ${ENDCOLOR}" || echo -e "${RED} No valid semver tags found ${ENDCOLOR}"
   fi
}

echo -e "${BLUE}UPGRADE${ENDCOLOR} ${RED}THIS TEMPLATE NOW? ${ENDCOLOR} ${GRAY}[THIS WILL CLOBBER EXISTING FILES] ${ENDCOLOR}"
read -p " " -n 1 -r && [[ $REPLY =~ ^[Yy]$ ]] && do_copy
