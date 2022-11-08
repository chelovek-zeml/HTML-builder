const fs = require('fs');
const path = require('path');
const { copyFile, readdir } = require('fs/promises');

const assets = path.join(__dirname, 'assets');
const components = path.join(__dirname, 'components');
const styles = path.join(__dirname, 'styles');
const template = path.join(__dirname, 'template.html');
const projectDist = path.join(__dirname, 'project-dist');
const projectDistHTML = path.join(projectDist, 'index.html');
const projectDistAssets = path.join(projectDist, 'assets');
let content = '';

fs.mkdir(projectDist, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});
fs.mkdir(path.join(projectDist, 'assets'), { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});

async function buildHTML() {
  let templateHTML = await fs.promises.readFile(template, 'utf-8', (err) => {
    if (err) {
      return console.error(err);
    }
  });
  let componentsHTML = await readdir(
    components,
    {
      withFileTypes: true,
    },
    (err) => {
      if (err) {
        return console.error(err);
      }
    }
  );

  for (let file of componentsHTML) {
    let data = '';
    let content;
    const files = await readdir(components, { withFileTypes: true });
    const streamRead = fs.createReadStream(template, 'utf-8');
    streamRead.on('data', (chunk) => {
      data = chunk;
    });
    streamRead.on('end', () => {
      data = data.split(/{{|}}/g);
      for (let file of files) {
        if (path.extname(file.name) === '.html') {
          const fileName = file.name.slice(
            0,
            file.name.length - path.extname(file.name).length
          );
          const filePath = path.join(components, file.name);
          const i = data.indexOf(fileName);

          if (i !== -1) {
            data[i] = '';
            content = fs.createReadStream(filePath, 'utf-8');
            content.on('data', (chunk) => {
              data[i] = chunk;
            });
          }
        }
      }
      content.on('end', () => {
        data = data.join('');
        const streamWrite = fs.createWriteStream(projectDistHTML);
        streamWrite.write(data);
      });
    });
  }
}
async function createBundleStyles() {
  const cssFiles = await readdir(styles, { withFileTypes: true }, (err) => {
    if (err) {
      throw err;
    }
  });
  for (let file of cssFiles) {
    const pathFileStyles = path.join(styles, file.name);

    if (path.extname(file.name) === '.css') {
      const tempContent = fs.createReadStream(
        path.join(pathFileStyles),
        'utf-8'
      );
      tempContent.on('data', (chunk) => {
        content = content + chunk;
        fs.writeFile(path.join(projectDist, 'bundle.css'), content, (err) => {
          if (err) {
            throw err;
          }
        });
      });
    }
  }
}

async function copyAssets(assets, projectDistAssets) {
  const files = await readdir(assets, { withFileTypes: true });
  for (let file of files) {
    if (file.isDirectory()) {
      fs.mkdir( 
        path.join(projectDistAssets, file.name),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );
      copyAssets(
        path.join(assets, file.name),
        path.join(projectDistAssets, file.name)
      );
      continue;
    }
    copyFile(
      path.join(assets, file.name),
      path.join(projectDistAssets, file.name)
    );
  }
}

buildHTML();
createBundleStyles();
copyAssets(assets, projectDistAssets);
