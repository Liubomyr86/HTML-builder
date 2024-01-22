const { mkdir, readdir, copyFile, rm } = require('fs/promises');
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'project-dist/');
const style = path.join(__dirname, 'styles/');
const components = path.join(__dirname, 'components/');

async function createAssets(dirName) {
  const assets = path.join(__dirname, dirName);
  const files = await readdir(assets, { withFileTypes: true });

  for (const file of files) {
    await mkdir(path.resolve(dist + dirName), { recursive: true });
    if (file.isDirectory()) {
      createAssets(dirName + file.name);
    } else {
      copyFile(
        path.resolve(`${__dirname}/${dirName}/${file.name}`),
        path.resolve(dist, dirName, file.name),
      );
    }
  }
}

async function mergeStyles(dirPath) {
  try {
    const bundle = fs.createWriteStream(path.join(dist, 'style.css'));
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
}

async function createHtml(dirPath) {
  const files = await readdir(dirPath, { withFileTypes: true });

  fs.readFile(
    path.join(__dirname, 'template.html'),
    'utf8',
    (err, templatedData) => {
      if (err) throw err;

      for (const file of files) {
        const extension = path.extname(file.name);
        const fileName = file.name.split('.')[0];

        if (file.isFile() && extension === '.html') {
          fs.readFile(path.join(dirPath, file.name), 'utf8', (err, data) => {
            if (err) throw err;
            templatedData = templatedData.replace(`{{${fileName}}}`, data);
            fs.writeFile(
              path.join(dist, 'index.html'),
              templatedData,
              (err) => {
                if (err) throw err;
              },
            );
          });
        }
      }
    },
  );
}

const buildPage = async function (dirPath) {
  try {
    await rm(dirPath, { recursive: true, force: true });
    await mkdir(dirPath, { recursive: true });
    createAssets('assets/');
    mergeStyles(style);
    createHtml(components);
  } catch (err) {
    console.error(err);
  }
};

buildPage(dist);
