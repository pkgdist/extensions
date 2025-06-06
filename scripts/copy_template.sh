#!/usr/bin/env bash

# includes
. ./scripts/colors.sh

do_copy () {

    if [[ $PWD == "$HOMEDIR" ]]; then
        echo -e "${RED}Already in the $HOMEDIR directory.  Not performing refresh...${ENDCOLOR}"
    else

        echo -e "${BLUE}Removing the .devcontainer and scripts directories to refresh them ${ENDCOLOR}";

        # remove .devcontainer and scripts to refresh sync to latest version
        rm -rf ./.devcontainer
        rm -rf ./scripts
        # copy template files and clobber any existing template files
        cp -rf $HOMEDIR/scripts .
        cp -rf $HOMEDIR/.devcontainer .
        cp -f $HOMEDIR/.envrc .
        touch $HOMEDIR/.envcrypt
        cp -f $HOMEDIR/.gitattributes .
        cp -f $HOMEDIR/.gitignore .
        cp -f $HOMEDIR/.hogignore .
        cp -f $HOMEDIR/.prettierrc .
        cp -f $HOMEDIR/.editorconfig .
        cp -f $HOMEDIR/.prettierignore .
        cp -f $HOMEDIR/connect.yml .
        cp -f $HOMEDIR/.semver.* .

        cp -f $HOMEDIR/lefthook.yml .
        cp -f $HOMEDIR/LICENSE .
        cp -f $HOMEDIR/CONTRIBUTING.md .

        mkdir -p ./.github/workflows ./.github/actions

        cp -f $HOMEDIR/.github/copilot-instructions.md ./.github/
        cp -f $HOMEDIR/.github/CODEOWNERS ./.github/
        cp -f $HOMEDIR/.github/workflows/bump.yml ./.github/

        # Makefile and Deno.json overwrite options
        echo -e "${HIGHLIGHT}Makefile overwrite${ENDCOLOR} ${GRAY} (y/n)? ${ENDCOLOR}"
        read -p " " -n 1 -r && [[ $REPLY =~ ^[Yy]$ ]] && cp -f $HOMEDIR/Makefile .  || echo -e "${BLUE} Skipped Makefile ${ENDCOLOR}"
        echo -e "${HIGHLIGHT}deno.json overwrite${ENDCOLOR} ${GRAY} (y/n)? ${ENDCOLOR}"
        read -p " " -n 1 -r && [[ $REPLY =~ ^[Yy]$ ]] && cp -f $HOMEDIR/deno.json .  || echo -e "${BLUE} Skipped Deno.json ${ENDCOLOR}"

        # validate semver tags
        git tag -l | grep -q "v[0-9]*\.[0-9]*\.[0-9]*" && echo -e "${GREEN} Valid semver tags found ${ENDCOLOR}" || echo -e "${RED} No valid semver tags found ${ENDCOLOR}"
   fi
}

echo -e "${HIGHLIGHT}UPGRADE${ENDCOLOR} ${RED}THIS TEMPLATE NOW? ${ENDCOLOR} ${GRAY}[THIS WILL CLOBBER EXISTING FILES] ${ENDCOLOR}"
read -p " " -n 1 -r && [[ $REPLY =~ ^[Yy]$ ]] && do_copy
