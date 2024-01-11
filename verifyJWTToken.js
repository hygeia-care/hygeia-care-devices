var axios = require('axios');
var express = require('express');

const apiEndpoint = process.env.USER_SERVICE_URL + 'users/check';
const authToken = process.env.USER_SERVICE_API_KEY;

async function verifyToken(token, res) {

  const requestBody = {
    token: token,
  };

  try {
    response = await axios.post(apiEndpoint, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
        'Authorization': 'Bearer ' + authToken
      },
    })
    return;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      res.status(401).json({ error: "Error with authentication: " + error.response.data.error });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).send({ error: "No response received from the authentication server." });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).send({ error: "Error occurred during the request setup for authorization." });
    };
    throw error;
  }
}

module.exports = verifyToken;