'use strict';

require("appdynamics").profile({
  controllerHostName: 'bghtechpartner.saas.appdynamics.com',
  controllerPort: '443', 
  controllerSslEnabled: true, 
  accountName: 'bghtechpartner', 
  accountAccessKey: 'y5y444drzq67', 
  applicationName: 'k8sNodeJS', 
  tierName: 'serviciodelclima', 
  nodeName: 'node-1'
 });

var r2 = require('r2');
const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const getWeather = async url => {
  try {
      console.log("Requesting");
      const resp = await r2(url).json;
      const weather = resp.weather[0].description;
      return `Weather on ${city}: ${weather}`;
  } catch (error) {
      console.log(`Error ${error}`);
      return error;
  }
};
// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world\n');
});

// Returns weather
app.get('/clima', async (req, res) => {

  const dotenv = require('dotenv');
  dotenv.config();
  console.log("Var: " + process.env.API_KEY);
  let API_KEY = process.env.API_KEY;
  let city = "Mountain View";
  let country_code = "US";
  let url = 'https://api.openweathermap.org/data/2.5/weather?q=' +
            city + ',' + country_code + '&appid=' + API_KEY;
  
  
  let response = "";
  try {
    console.log(`Requesting: ${city} + ${country_code}`);
    const resp = await r2(url).json;
    const weather = resp.weather[0].description;
    response = `Weather on ${city}: ${weather}`;
    res.writeHead(200, {'Content-type': 'application/json'});
  } catch (error) {
    console.log(`Error ${error}`);
    response = `Error consultando el clima`;
    res.writeHead(500, {'Content-type': 'application/json'});
  }
  res.end(response);

});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);