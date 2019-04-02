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
          fs.writeFile(path, stylesheet, function(err) {
          // fs.writeFile('../../' + path, stylesheet, function(err) {
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
if (process.argv.slice(2)[0] && process.argv.slice(2)[1]) {
  mouthful(process.argv.slice(2)[0], process.argv.slice(2)[1]);
} else {
  console.log('Error: Argument error');
  process.exit(1);
}
