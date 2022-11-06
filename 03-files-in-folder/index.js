const path = require('path');
const fs = require('fs');
const readFolder = path.join(__dirname, 'secret-folder');

async function readFiles(tempPath) {
    const files = await fs.promises.readdir(tempPath, { withFileTypes: true });
        for (let file of files) {
            if(file.isFile()) {
                let nameFile = file.name;
                let nameExt = path.extname(file.name);
                const filePath = path.join(readFolder, nameFile);
                fs.stat(filePath, (err, statistic) => {
                    if(err) {
                        throw err;
                    } 
                    console.log(nameFile.slice(0, nameFile.length - nameExt.length) + " - " + nameExt.slice(1) + " - " + statistic.size);
                });
            }
        }
}

readFiles(readFolder);