#!/usr/bin/env bash

# includes
. ./scripts/colors.sh

do_scan () {
    echo -e "Checking Brew Packages ... ${GREEN} [done] ${ENDCOLOR}"
    echo -e "Patching Deno Outdated Packages ... ${GREEN} [done] ${ENDCOLOR}"

        deno outdated --update --latest

    mkdir -p ./src/SAST
    pip3 install lizard --upgrade --target ./src/SAST

     echo -e "Lizard installation ... ${GREEN} [done] ${ENDCOLOR}"
        deno fmt --check && echo -e "Code Format check ... ${GREEN} [done] ${ENDCOLOR}"
        deno fmt && echo -e "Formatting code to quality standards ... ${GREEN} [done] ${ENDCOLOR}"
        echo -e "${GREEN} Setting up SAST Toolchain ... done. ${ENDCOLOR}"
        deno add npm:testcontainers --dev
        deno add npm:lefthook --dev
        deno run -A --allow-scripts=npm:lefthook@1.11.8 npm:lefthook install
        echo -e "${BLUE} Setting up git commit hooks... done. ${ENDCOLOR}"
        transcrypt --display
        echo -e "${BLUE} Validating transcrypt... done. ${ENDCOLOR}"
}
read -p "Install/Upgrade Git Hooks & SAST Scanning? (y/n) " -n 1 -r && [[ $REPLY =~ ^[Yy]$ ]] && do_scan
