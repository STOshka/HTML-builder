const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');
  
const mergeStyles = async () => {
  const streamWrite = fs.createWriteStream(
    path.join(__dirname + '/project-dist/bundle.css'), 'utf8'
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

mergeStyles();