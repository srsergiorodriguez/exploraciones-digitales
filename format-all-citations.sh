chapters=("1_introduccion" "2_contexto" "3_metodos" "4_mapa" "5_1_tradicion" "5_2_relacionamiento")

cd content

for i in ${chapters[@]}
do
  echo "Formatting $i"
  sh format_citation.sh -t $i
  sleep 1
  sh format_citation.sh $i
  sleep 1
done

echo "Done"