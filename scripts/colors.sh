#!/usr/bin/env bash

RED="\e[31m"
GREEN="\e[32m"
BLUE="\e[34m"
HIGHLIGHT="\e[43m"
YELLOW="\e[33m"
GRAY="\e[37m"
WHITE="\e[97m"
CYAN="\e[36m"
MAGENTA="\e[35m"
BOLD="\e[1m"
UNDERLINE="\e[4m"
FATAL="\e[41m"
ENDCOLOR="\e[0m"

join_by() {
  local IFS="$1"
  shift
  echo "$*"
}

# common paths
path_orchestras=("Documents" "gh" "orchestras" "deno")
HOMEDIR=$( make echo-TEMPLATE )
if [[ -z $HOMEDIR ]]
  then
    HOMEDIR=$( make echo-TEMPLATE )
else
    echo -e "${BLUE}Template Path is:${ENDCOLOR} ${GREEN}${HOMEDIR}${ENDCOLOR}"
fi
