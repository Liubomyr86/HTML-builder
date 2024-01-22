const { readdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');

const style = path.join(__dirname, 'styles/');
const dist = path.join(__dirname, 'project-dist/');

const mergeStyles = async function (dirPath) {
  try {
    const bundle = fs.createWriteStream(path.join(dist, 'bundle.css'));
    const files = await readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      const extension = path.extname(file.name);
      if (file.isFile() && extension === '.css') {
        const stream = fs.createReadStream(
          path.join(dirPath, file.name),
          'utf-8',
        );
        stream.on('data', (partData) => bundle.write(partData));
      }
    }
  } catch (err) {
    console.error(err);
  }
};

mergeStyles(style);
