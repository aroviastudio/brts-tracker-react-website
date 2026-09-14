const fetch = require('node-fetch');
async function test() {
  const coords = "72.8052,21.1442;72.8194,21.1558"; // Althan to Anuvrat
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  console.log("Fetching", url);
  const res = await fetch(url);
  const data = await res.json();
  console.log(data.code, data.routes[0].geometry.coordinates.length, "points");
}
test();
