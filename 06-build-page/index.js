const fs = require('fs');
const { readdir, mkdir, copyFile } = require('fs/promises');
const path = require('path');

const copyFiles = async (mainFolder, newFolder) => {
  mkdir(newFolder, { recursive: true });
  const filesInFolder = await readdir(mainFolder, {withFileTypes: true});
  for (const file of filesInFolder) {
    const mainFile = path.join(mainFolder + '/' + file.name);
    const newFile = path.join(newFolder + '/' + file.name);
    if (file.isFile()) {
      copyFile(mainFile, newFile); 
    } else {
      copyFiles(mainFile, newFile);
    }
  }
};

const createAssets = () => {
  const mainFolder = path.join(__dirname + '/assets');
  const newFolder = path.join(__dirname + '/project-dist/assets');
  copyFiles(mainFolder, newFolder);
};

const createCSSStyles = async () => {
  const streamWrite = fs.createWriteStream(
    path.join(__dirname + '/project-dist/style.css'), 'utf8'
  );
  const pathFolder = path.join(__dirname + '/styles');
  const filesInFolder = await readdir(pathFolder, {withFileTypes: true});
  for (const file of filesInFolder) {
    if (file.isFile()) {
      const ext = file.name.substring(file.name.length-4);
      if (ext == '.css') {
        const streamRead = fs.createReadStream(
          path.join(pathFolder + '/' + file.name), 'utf8'
        );
        streamRead.on('readable', () => {
          const data = streamRead.read();
          if (data != null) streamWrite.write(data);
        });
      }
    }   
  }
};

const createHTML = () => {
  fs.readFile(path.join(__dirname + '/template.html'), 'utf8', async (error, data) => {
    if (error) {
      return console.error(error.message);
    }
    while (data.indexOf('{{') > -1) {
      const template = data.substring(data.indexOf('{{') + 2, data.indexOf('}}'));
      let html = await fs.promises.readFile(
        path.join(__dirname + '/components/' + template + '.html'), 'utf8'
      );
      data = data.replace(`{{${template}}}`, html);
    }
    const streamWrite = fs.createWriteStream(
      path.join(__dirname + '/project-dist/index.html'), 'utf8'
    );
    streamWrite.write(data);
  });
};

function createPage() {
  const newFolder = path.join(__dirname + '/project-dist');
  fs.rm(newFolder, { recursive: true, force: true }, async error => {
    if (error) {
      return console.error(error.message);
    }
    mkdir(newFolder, { recursive: true });
    createAssets();
    createCSSStyles();
    createHTML();
  });
}

createPage();