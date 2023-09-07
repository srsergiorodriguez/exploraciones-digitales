echo "Formating: $1";

pandoc $1.md \
 --bibliography biblioteca.bib \
 --csl citation/chicago-fullnote-bibliography-with-ibid.csl \
 -M reference-section-title=Referencias \
 -f markdown+markdown_in_html_blocks-raw_html \
 -t markdown-citations-fenced_divs-native_divs-raw_html \
 -s --verbose --citeproc \
 --wrap=none \
 -o $1_citation.md

python3 format_citation_adjust.py $1_citation.md