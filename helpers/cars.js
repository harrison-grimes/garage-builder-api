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