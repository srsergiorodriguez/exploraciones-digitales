chapters=("1_introduccion-draft" "2_contexto-draft" "3_metodos-draft" "4_mapa-draft" "5_1_tradicion-draft" "5_2_relacionamiento-draft" "5_3_comunidad-draft" "5_4_infraestructura-draft" "6_reflexiones-draft" "7_conclusiones-draft")

cd content

for i in ${chapters[@]}
do
  echo "Removing citation files from $i"
  filename=${i//"-draft"/""}
  rm $filename.md
  rm ${filename}_nott.md
done

cd ..

echo "Done"
