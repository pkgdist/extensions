#!/usr/bin/env bash

# includes
. ./scripts/colors.sh

current_path=$(dirname $PWD)

delim="/"

do_mck () {
	echo "TEMPLATE=${current_path}/b2b-connect-devops-cli-template-nodets" >> .envcrypt
}

do_orch () {
  path_parts=$(join_by "$delim" "${path_orchestras[@]}")
	echo "TEMPLATE=${HOME}/${path_parts}" >> .envcrypt
}


file_output=$(sed '/^TEMPLATE.*/d' $PWD/.envcrypt)
echo "$file_output" > $PWD/.envcrypt && echo -e "Patching encrypted file: [${GREEN}OK${ENDCOLOR}]"

if [[ ! -z $1 ]]; then
    if [[ $1 == "mck" ]]; then
      do_mck
      echo -e "Set Template to: ${GREEN}[mck]${ENDCOLOR}"
    elif [[ $1 == "orch" ]]; then
      do_orch
      echo -e "Set Template to: ${GREEN}[orch]${ENDCOLOR}"
    else
      echo -e "${RED}Invalid argument. Use 'mck' or 'orch'.${ENDCOLOR}"
    fi
  else
    # template-nodets exists in parent directory so use it
    if [[ -d "$current_path/b2b-connect-devops-cli-template-nodets" ]]; then
        do_mck
        echo -e "Template File Revisions [mck]: [${GREEN}OK${ENDCOLOR}]"
      else
        do_orch
        echo -e "Template File Revisions [orch]: [${GREEN}OK${ENDCOLOR}]"
    fi

fi

