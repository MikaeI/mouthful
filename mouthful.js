const phantom = require('phantom');
const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
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
  let inline = '';
  let inlineCount = 0;
  await page.on('onResourceRequested', (requestData) => {
    if (requestData.headers[0].value.indexOf('text/css') !== -1) {
      urls.push(requestData.url);
    }
  });
  status = await page.open(url);
  content = await page.property('content');
  const $ = cheerio.load(content);
  $('style').each((i, el) => {
    inlineCount ++;
    inline += $(el).html();
  });
  await instance.exit();
  async.mapSeries(urls, httpGet, (err, res) => {
    if (err) {
      return console.log(err);
    } else {
      res.forEach((sheet) => {
        stylesheet += sheet;
      });
      stylesheet += inline;
      let _stylesheet = stylesheet.replace(/↵/g, '');
      callback(_stylesheet, urls, inlineCount);
    }
  });
}
module.exports = mouthful;
