const { mkdir, readdir, copyFile, rm } = require('fs/promises');
const path = require('path');
const newDir = path.join(__dirname, 'files-copy/');
const copyDir = path.join(__dirname, 'files/');

const copyDirectory = async function (dirPath) {
  try {
    await rm(newDir, { recursive: true, force: true });
    await mkdir(newDir, { recursive: true });
    const files = await readdir(dirPath);
    for (const file of files) {
      copyFile(dirPath + file, newDir + file);
    }
  } catch (err) {
    console.error(err);
  }
};

copyDirectory(copyDir);
