YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RESET='\033[0m' 
maketooltips=false

while getopts ":t" flag; do
  case $flag in
    t)
    maketooltips=true
    ;;
    ?)
    echo "Invalid flag $flag"
    exit 1
    ;;
  esac
done

# Shift the command line arguments to process positional arguments
shift $((OPTIND - 1))

filename=${1//"-draft"/""}

echo "${YELLOW}Formating: $filename / tooltips?: $maketooltips${RESET}"

tooltipsfilename='_nott'
if [ $maketooltips == true ]
then
  tooltipsfilename=''
fi

pandoc $1.md \
 --bibliography biblioteca.bib \
 --csl citation/chicago-fullnote-bibliography-with-ibid-es.csl \
 -M reference-section-title=Referencias \
 -f markdown+markdown_in_html_blocks-raw_html \
 -t markdown-citations-fenced_divs-raw_html \
 -s --verbose --citeproc \
 --wrap=preserve \
 -o $filename$tooltipsfilename.md

#  pandoc $1.md \
#   --bibliography biblioteca.bib \
#   --csl citation/chicago-fullnote-bibliography-with-ibid-es.csl \
#   -M reference-section-title=Referencias \
#   -f markdown+markdown_in_html_blocks-raw_html \
#   -t markdown-citations-fenced_divs-native_divs-raw_html \
#   -s --verbose --citeproc \
#   --wrap=preserve \
#   -o $1_citation.md

if [ $maketooltips == true ]
then
  python3 format_citation_adjust.py -t -f $filename$tooltipsfilename.md
else
  python3 format_citation_adjust.py -f $filename$tooltipsfilename.md
fi