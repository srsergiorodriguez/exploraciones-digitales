main();
async function main() {
  
  const data = await d3.csv("./data.csv");
  console.log(data);
  makePanel(data);
}