const fs = require('fs'),
  path = require('path'),
  uuid = require('uuid');

const CAR_DB_PATH = path.join(__dirname, '../db/cars.json');

module.exports = {
  list,
  grab,
  create,
  update,
  remove,
  listCarsByOwner
};

async function list() {
  return await read();
}

async function grab(id) {
  const cars = await list();
  const idx = cars.findIndex(car => car.id === id);
  if (idx === -1) {
    throw 'DOES_NOT_EXIST';
  }
  return cars[idx];
}

async function create(car) {
  car.id = uuid();
  const cars = await read();
  cars.push(car);
  await write(cars);
  return car;
}

async function update(id, carUpdate) {
  const cars = await read();
  const idx = cars.findIndex(car => car.id === id);
  if (idx === -1) {
    throw 'DOES_NOT_EXIST';
  }
  const updatedCar = { ...carUpdate, id };
  cars[idx] = updatedCar;
  await write(cars);
  return updatedCar;
}

async function remove(id) {
  const cars = await read();
  const idx = cars.findIndex(car => car.id === id);
  if (idx === -1) {
    throw 'DOES_NOT_EXIST';
  }
  const removedCar = cars[idx];
  cars.splice(idx, 1);
  await write(cars);
  return removedCar;
}
async function listCarsByOwner(id) {
  const cars = await read();
  return cars.filter(car => car.owner === id);
}

function read() {
  return new Promise((resolve, reject) => {
    fs.readFile(CAR_DB_PATH, 'utf8', (err, data) => {
      resolve(JSON.parse(data));
    });
  });
}

function write(json) {
  return new Promise((resolve, reject) => {
    fs.writeFile(CAR_DB_PATH, JSON.stringify(json), err => {
      resolve(json);
    });
  });
}