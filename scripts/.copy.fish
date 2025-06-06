function .copy.back -d "Multi-copy a file to template paths" -a source
  # Multi-copy to locations listed in .targets.multi-copy.csv
    source $PWD/scripts/.log.fish
    # set the possible colors that alternate under the file copy list
    set -a possible_colors blue
    set -a possible_colors cyan
    set -a possible_colors blue
    set -a possible_colors cyan

    set indx 1
    while read line
      cp -rf $PWD/$source $line/$source
      .log -c $possible_colors[$indx] -k Notice: -k "File Source:" -k "Target:" -v "Copied" -v $source -v $line/$source
      set indx (math $indx + 1)
    end < $PWD/scripts/.targets.multi-copy.csv
end
