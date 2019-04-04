#!/usr/bin/env node
const phantom = require('phantom');
const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
const args = process.argv.slice(2);
let mouthful = async (url, path) => {
  const instance = await phantom.create();
  const page = await instance.createPage();
  const download = (index) => {
    https.get(urls[index], (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        stylesheet += data;
        if (urls[index + 1]) {
          download(index + 1);
        } else {
          stylesheet += inline;
          let _stylesheet = stylesheet.replace(/\n/g, '');
          fs.writeFile(path, _stylesheet, function(err) {
            if (err) {
              console.log('Error: ' + err);
              process.exit(1);
            }
            console.log('The file was saved!');
            process.exit(0);
          });
        }
      });
    }).on('error', (err) => {
      console.log('Error: ' + err.message);
      process.exit(1);
    });
  }
  let urls = [];
  let stylesheet = '';
  let inline = '';
  let status = null;
  let content = null;
  await page.on('onResourceRequested', (requestData) => {
    if (requestData.headers[0].value.indexOf('text/css') !== -1) {
      urls.push(requestData.url);
    }
  });
  status = await page.open(url);
  content = await page.property('content');
  const $ = cheerio.load(content);
  $('style').each((i, el) => {
    inline += $(el).html();
  });
  await instance.exit();
  download(0);
}
if (args[0] && args[1]) {
  mouthful(args[0], args[1]);
} else {
  console.log('Error: Argument error');
  process.exit(1);
}
