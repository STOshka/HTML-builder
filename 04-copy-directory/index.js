const { rm } = require('fs');
const { mkdir, copyFile, readdir } = require('fs/promises');
const path = require('path');
const mainFolder = path.join(__dirname + '/files');
const newFolder = path.join(__dirname + '/files-copy');

rm(newFolder, { recursive: true, force: true }, async error => {
  if (error) {
    return console.error(error.message);
  }
  mkdir(newFolder, { recursive: true });
  const filesInFolder = await readdir(mainFolder, {withFileTypes: true});
  for (const file of filesInFolder) {
    const mainFile = path.join(mainFolder + '/' + file.name);
    const newFile = path.join(newFolder + '/' + file.name);
    copyFile(mainFile, newFile);
  }
});