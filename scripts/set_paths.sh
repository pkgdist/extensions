#!/usr/bin/env bash

   # includes
. ./scripts/colors.sh

do_paths () {
  chmod +x ./scripts/*.sh
  curl https://gist.githubusercontent.com/lynsei/9536bd35ec567b84e037c2674219dce1/raw/635d854c3504c19c075c02e77ace1e2615d21397/multi-paths.csv -o ./scripts/.targets.multi-copy.csv
}

do_paths

# setup TEMPLATE which triggers HOMEDIR in copy_template.sh script
. ./scripts/set_template.sh
