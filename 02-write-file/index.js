const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

const stream = fs.createWriteStream(
  path.join(__dirname + '/text.txt'), 'utf8'
);

stdout.write('Приветствую. Вводи текст:\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exitProject();
  } else {
    stream.write(data);
  }
});

process.on ('SIGINT', () => {
  exitProject();
});

const exitProject = () => {
  stdout.write('На это всё. До свидания.');
  exit();
};