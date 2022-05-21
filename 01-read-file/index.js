const fs = require('fs');
const path = require('node:path');

const stream = fs.createReadStream(
    path.join(__dirname + '/text.txt'), 'utf8'
);

stream.on('readable', () => {
    const data = stream.read();
    if (data != null) console.log(data);
})