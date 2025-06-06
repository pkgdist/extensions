#!/usr/bin/env bash

# includes
. ./scripts/colors.sh

do_setup_fish () {
  if [[ `which fish` ]]
    then
    echo -e "fish shell... ${GREEN} [OK] ${ENDCOLOR}"
  else
    brew reinstall fish
  fi

  # check config directory exists as a variable
  # this is the most effective way to determine if the user is using fish shell currently
  if test -e $__fish_config_dir; then

    echo -e "detecting fish shell usage... ${GREEN} [OK] ${ENDCOLOR}"
    # source the functions for re-use on other systems:
    fish -c "source ./scripts/.log.fish && funcsave .log"
    fish -c "source ./scripts/.copy.fish && funcsave .copy.back"
    echo -e "sourcing fish libraries... ${GREEN} [OK] ${ENDCOLOR}"
  else
    echo -e "${RED} [ERROR] YOU ARE NOT USING FISH CURRENTLY! ${ENDCOLOR}"
    echo "Please type 'fish -i', then type 'make setup-fish'"
  fi
}

read -p "Install/Upgrade Fish Shell so you can use template functions? (y/n) " -n 1 -r && [[ $REPLY =~ ^[Yy]$ ]] && do_setup_fish
