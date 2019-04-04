const phantom = require('phantom');
const https = require('https');
const fs = require('fs');
const mouthful = async (url) => {
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
          return stylesheet;
        }
      });
    }).on('error', (err) => {
      console.log('Error: ' + err.message);
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
module.exports = mouthful;
