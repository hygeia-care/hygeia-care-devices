var axios = require('axios');

// Define the async function
async function verifyToken(token) {
  console.log("TODO: implement token verification");
  return;
//   const response = await axios.post('https://healthcare.googleapis.com/v1/projects/formidable-era-410617/locations/europe-west4/services/nlp:analyzeEntities', {
//     documentContent: result[0].comment
// }, {
//     headers: {
//         'Authorization': `Bearer ${authToken}`,
//         'Content-Type': 'application/json'
//     }
// });
  // // Async code here, e.g., fetching data from a URL
  // const response = await fetch(url);
  // const data = await response.json();
  // return data;
}

module.exports = verifyToken;