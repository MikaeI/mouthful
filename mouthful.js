#!/usr/bin/env node
const phantom = require('phantom');
const https = require('https');
const fs = require('fs');
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
          if (path) {
            fs.writeFile(path, stylesheet, function(err) {
              if (err) {
                console.log('Error: ' + err);
                process.exit(1);
              }
              console.log('The file was saved!');
              process.exit(0);
            });
          } else {
            return stylesheet;
          }
        }
      });
    }).on('error', (err) => {
      console.log('Error: ' + err.message);
      process.exit(1);
    });
  }
  let urls = [];
  let stylesheet = '';
  let status = null;
  await page.on('onResourceRequested', (requestData) => {
    if (requestData.url.indexOf('css') !== -1) {
      urls.push(requestData.url);
    }
  });
  // TODO: Get inline tags, element style attributes?
  status = await page.open(url);
  await instance.exit();
  download(0);
}
if (args[0] && args[1]) {
  mouthful(args[0], args[1]);
} else if (args[0]) {
  mouthful(args[0]);
} else {
  console.log('Error: Argument error');
  process.exit(1);
}
