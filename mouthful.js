const phantom = require('phantom');
const https = require('https');
const fs = require('fs');
const async = require('async');
const request = require('request');
const httpGet = (url, callback) => {
  const options = {
    url :  url,
    json : true
  };
  request(options,
    function(err, res, body) {
      callback(err, body);
    }
  );
}
const mouthful = async (url, callback) => {
  const instance = await phantom.create();
  const page = await instance.createPage();
  let status = null;
  let urls = [];
  let stylesheet = '';
  await page.on('onResourceRequested', (requestData) => {
    if (requestData.url.indexOf('.css') !== -1) {
      urls.push(requestData.url);
    }
  });
  status = await page.open(url);
  await instance.exit();
  // TODO: Get inline tags, element style attributes?
  async.mapSeries(urls, httpGet, (err, res) => {
    if (err) {
      return console.log(err);
    } else {
      res.forEach((sheet) => {
        stylesheet += sheet;
      });
      callback(stylesheet);
    }
  });
}
module.exports = mouthful;
