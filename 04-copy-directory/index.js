const fs = require('fs');
const path = require('path');
const pathOrigin = path.join(__dirname, 'files');
const pathResult = path.join(__dirname, 'files-copy');


fs.mkdir(pathResult, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});

fs.readdir(pathOrigin, (err, filesArray) => {
    if (err) {
        return console.error(err);
    }
    for(let file of filesArray) {
        fs.copyFile(path.join(pathOrigin, file), path.join(pathResult, file), (err) => {
            if(err) {
                return console.error(err);
            }
        });
    }
});
