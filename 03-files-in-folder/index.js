const { readdir, stat } = require('fs/promises');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder/');
const stdout = process.stdout;

const getFilesInformation = async function (dirPath) {
  try {
    const files = await readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const fileName = file.name.split('.')[0];
        const extension = path.extname(file.name).split('.')[1];
        const size = (await stat(dirPath + file.name)).size;
        stdout.write(
          `${fileName} - ${extension} - ${(size / 1024).toFixed(3)}kb\n`,
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
};

getFilesInformation(dirPath);
