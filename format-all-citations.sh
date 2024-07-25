chapters=("1_introduccion-draft" "2_contexto-draft" "3_metodos-draft" "4_mapa-draft" "5_tradicion-draft" "6_relacionamiento-draft" "7_comunidad-draft" "8_infraestructura-draft" "9_periplo-draft" "10_reflexiones-draft")

cd content

rm 13_referencias.md

for i in ${chapters[@]}
do
  echo "---------$i---------"
  sh format_citation.sh -t $i
  sleep 1
  sh format_citation.sh $i
  sleep 1
done

# python3 format_references.py

cd ..

echo "Done"

magicbook build --config=./magicbook_citation.json

