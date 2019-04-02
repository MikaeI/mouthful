const phantom = require('phantom');
const https = require('https');
const fs = require('fs');
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
          fs.writeFile(path, stylesheet, function(err) {
          // fs.writeFile('../../' + path, stylesheet, function(err) {
            if (err) {
              return console.log(err);
            }
            console.log('The file was saved!');
          });
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
  status = await page.open(url);
  await instance.exit();
  download(0);
}
// Usage
mouthful('https://www.altibox.no', 'public/altibox.css');
