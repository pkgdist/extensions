#!/usr/bin/env bash

# includes
. ./scripts/colors.sh

do_scan () {

    echo -e "Patching Deno Outdated Packages ... ${GREEN} [done] ${ENDCOLOR}"
    deno outdated --update --latest

    mkdir -p ./src/SAST
    pip3 install lizard --upgrade --target ./src/SAST

     echo -e "Lizard installation ... ${GREEN} [done] ${ENDCOLOR}"
        deno fmt --indent-width 2 --unstable-yaml --no-semicolons --single-quote --check 2>&1 | tee _.report.format.log
        echo -e "Detect Code Format Issues ... ${GREEN} [done] ${ENDCOLOR}"

        deno fmt --indent-width 2 --unstable-yaml --no-semicolons --single-quote 2>&1 | tee _.report.format.log
        echo -e "Format Code to our specification... ${GREEN} [done] ${ENDCOLOR}"

        echo -e "${GREEN} Setting up SAST Toolchain ... ${GREEN} [done] ${ENDCOLOR}."
        deno add npm:lefthook@^1.11.14 --dev
        deno run -A --allow-scripts=npm:lefthook@^1.11.14 npm:lefthook install
        echo -e "${BLUE} Setting up git commit hooks... ${GREEN} [done] ${ENDCOLOR}"

        transcrypt --display
        echo -e "${BLUE} Validating Transcrypt.. ${GREEN} [done] ${ENDCOLOR}"
}
read -p "Install/Upgrade Git Hooks & SAST Scanning? (y/n) " -n 1 -r && [[ $REPLY =~ ^[Yy]$ ]] && do_scan
