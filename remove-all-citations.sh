chapters=("1_introduccion-draft" "2_contexto-draft" "3_metodos-draft" "4_mapa-draft" "5_tradicion-draft" "6_relacionamiento-draft" "7_comunidad-draft" "8_infraestructura-draft" "9_periplo-draft" "10_reflexiones-draft")

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
