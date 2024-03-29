const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const filePath = path.join(__dirname, 'text.txt');

fs.writeFile(filePath, '', (err) => {
  if (err) throw err;
});

const rl = readline.createInterface({ input, output });

rl.write('Hello, please enter your text\n');

rl.on('line', (input) => {
  if (input.toString() === 'exit') {
    rl.close();
  } else {
    fs.appendFile(filePath, `${input}\n`, (err) => {
      if (err) throw err;
    });
  }
});
process.on('exit', () => rl.write('Good luck in learning Node.js!\n'));
