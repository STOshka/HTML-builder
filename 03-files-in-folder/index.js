const { readdir,stat } = require('fs/promises');
const path = require('path');
const pathFolder = path.join(__dirname + '/secret-folder');

const readFiles = async () => {
  try {
    const filesInFolder = await readdir(pathFolder, {withFileTypes: true});
    for (const file of filesInFolder)
      if (file.isFile()) {
        const pathFile = path.join(pathFolder + '/' + file.name);
        const { name, ext }  = path.parse(pathFile);
        const statFile = await stat(pathFile);
        const sizeFile = Math.floor(statFile.size / 1024 * 100) / 100;
        console.log(`${name} - ${ext.substring(1)} - ${sizeFile} kb`);
      }
  } catch (err) {
    console.error(err);
  }
};

readFiles();