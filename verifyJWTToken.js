var axios = require('axios');
var express = require('express');
require('dotenv').config();

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
    } else {
      
      // Something happened in setting up the request that triggered an Error
      res.status(500).send(error);
    };
    throw error;
  }
}

module.exports = verifyToken;