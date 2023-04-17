export const getData = async () => {
  const request = new Request("https://api.sampleapis.com/switch/games");

  const json = await request.loadJSON();

  console.log(json);
};

await getData();
