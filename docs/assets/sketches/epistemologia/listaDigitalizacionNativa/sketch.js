main();
async function main() {
  const data = await d3.csv("./data.csv");
  makePanel(data);
}