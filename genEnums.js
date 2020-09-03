// This file generates enums from your .graphql files

const { resolve, join } = require('path');
const { readdir, readFile, writeFile } = require('fs').promises;

const directory = `${join(__dirname, '../src/schema/')}`;
const writeFilePath = './src/resolvers/enums.js';

console.log('Generating enums from directory: ', directory);

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

const getEnums = contents => {
  const matches = contents.matchAll(/enum[\w\s\n\{]*\}/g);
  let str = '';
  for (match of matches) {
    const matchEnum = match[0];
    const [full, name, fields] = matchEnum.match(/enum\s*(\w*)\s*\{([\w\n\s]*)\}/);

    // format objects
    str =
      str +
      '\n' +
      `export const ${name} = { 
            ${morphFields(fields)}
        }`;
  }
  return str;
};

const morphFields = fields => {
  const fieldMatches = fields.matchAll(/\s*([\w\d]*)\n/g);
  let str = '';
  for (field of fieldMatches) {
    str = `${str}${field[1]}: '${field[1].toUpperCase()}',\n`;
  }
  return str;
};

// RUN IT
(async () => {
  let count = 0;
  let types = ``;
  for await (const f of getFiles(directory)) {
    count++;
    await readFile(f, 'utf8').then(contents => {
      const enums = getEnums(contents);
      types = `${types}${enums}`;
    });
  }
  console.log(`Writing enums from ${count} files to `, writeFilePath);
  writeFile(writeFilePath, types, 'utf8');
})();
