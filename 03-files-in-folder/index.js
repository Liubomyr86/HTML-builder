const { readdir, stat } = require('fs/promises');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder/');
const stdout = process.stdout;

const getFilesInformation = async function (dirPath) {
  try {
    const files = await readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const { name, ext } = path.parse(`${dirPath}${file.name}`);
        const extension = ext.slice(1);
        const size = (await stat(dirPath + file.name)).size;
        stdout.write(
          `${name} - ${extension} - ${(size / 1000).toFixed(3)}kb\n`,
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
};

getFilesInformation(dirPath);
