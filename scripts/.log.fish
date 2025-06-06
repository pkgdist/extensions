function .log --description 'Logs: Pretty Print'

  # force true color support
  set -g fish_term24bit 1

          function .usage -d "Usage"
          set -l usage_str "\

                  Logging: Pretty Print Colors
                           True color logs in your terminal, made easier by Lyns.

                          Note: This function accepts -k/-v Key Value pair or a variadic argument for key/value.

                          @flags:     -c/--color            Color of Text
                                      -b/--background       Background Color
                                      -d/--dim              Dimming
                                      -i/--italics          Italics
                                      -o/--bold             Bold
                                      -u/--underline        Underline
                                      -r/--reverse          Reverse

                          @values:    -v/--value
                                      -k/--key

                          @required:  -c/--color
                                      -v/--value

                          "

                  echo $usage_str
          end

  # setup options
  set -l keys (fish_opt -s k -l key --multiple-vals)
  set -l vals (fish_opt -s v -l value --multiple-vals)
  # setup variadic arguments
  argparse $keys $vals 'c/color=' 'b/background=' 'd/dim' 'i/italics' 'o/bold' 'u/underline' 'r/reverse' -- $argv
  set_color --background blue yellow;
  set_color normal;


  # required:   check color not exists
  if test -z "$_flag_c"
          set_color --background black red;  echo "-c/color required!";
          set_color -b black --dim --reverse grey;  .usage
          return;
  end

  # required:   check value or multiple values not exist
  if test -z "$_flag_v"
          set_color --background black red;  echo "-v/--value required!";
          set_color --underline --dim --background normal grey;  .usage
          return;
  end
  set_color normal;


  # optional:


          # dim
          if set -q _flag_d
                  set -a flags "-d"
          end

          # italics
          if set -q _flag_i
                  set -a flags "-i"
          end

          # bold
          if set -q _flag_o
                  set -a flags "-o"
          end

          # underline
          if set -q _flag_u
                  set -a flags "-u"
          end

          # reverse
          if set -q _flag_r
                  set -a flags "-r"
          end

  # if values are set, output them with keys
  if set -q _flag_v

          # value count
          set -l val_count (count $_flag_v)
          set -l key_count (count $_flag_k)
          if test [[ $val_count > 1 ]]
                  if test [[ $val_count == $key_count ]]
                          set -l counts_match true
                  else
                          set -l counts_match false
                  end
          else
                  set -l no_counts true
          end
          # default count starting point
          set -l i "1"
          set flag_str (string collect -- $flags)

          # combine flag_str and background/color
          if set -q _flag_b
                  set set_str "--background" "$_flag_b" "$flag_str" "$_flag_c"
          else
                  set set_str "$flag_str" "$_flag_c"
          end

          # standard set_val is all flags and the color:
          set -l set_val (string collect -- $set_str)
          set -l all_params "$set_val"


          # if keys are set output them alongside values
          if set -q _flag_k
               # only one value
               if test -n "$no_counts"
                  eval "set_color $all_params"
                  echo "$_flag_k:   $_flag_v"

               end

               if test -n $counts_match

               for k in $_flag_k

                  eval "set_color $all_params"
                  echo "$k: $_flag_v[$i]"
                  set i (math $i + 1)
               end
               end
          else
          # NO KEYS, VALS ONLY

               for v in $_flag_v

                  eval "set_color $all_params"
                  echo $_flag_v[$i]
                  set i (math $i +1)
               end

          end

  end


  #echo "Remaining arguments: $argv"


  end
