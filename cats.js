const fs = require('fs'),
  uuid = require('uuid');

module.exports = {
  list,
  grab,
  create,
  update,
  remove
};

async function list() {
  return await read();
}

async function grab(id) {
  const cats = await list();
  const idx = cats.findIndex(cat => cat.id === id);
  return cats[idx];
}

async function create(cat) {
  cat.id = uuid();
  const cats = await read();
  cats.push(cat);
  await write(cats);
  return cat;
}

async function update(id, catUpdate) {
  const cats = await read();
  const idx = cats.findIndex(cat => cat.id === id);
  cats[idx] = catUpdate;
  await write(cats);
  return catUpdate;
}

async function remove(id) {
  const cats = await read();
  const idx = cats.findIndex(cat => cat.id === id);
  const removedCat = cats[idx];
  cats.splice(idx, 1);
  await write(cats);
  return removedCat;
}

function read() {
  return new Promise((resolve, reject) => {
    fs.readFile('./cats.json', 'utf8', (err, data) => {
      resolve(JSON.parse(data));
    });
  });
}

function write(json) {
  return new Promise((resolve, reject) => {
    fs.writeFile('./cats.json', JSON.stringify(json), err => {
      resolve(json);
    });
  });
}
