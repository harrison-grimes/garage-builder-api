const { Router } = require('express');
const jwt = require('express-jwt');

const car = require('../helpers/cars');
const validate = require('../middleware/validator');
const { CreateSchema, UpdateSchema } = require('../schemas/car');

const app = Router();
app.use(jwt({ secret: process.env.SECRET }));

app.get('/', async (req, res) => {
  try {
    const cars = await car.list();
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unknown Error' });
  }
});

app.post('/', validate(CreateSchema), async (req, res) => {
  try {
    const newcar = await car.create(req.body);
    res.json(newcar);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unknown Error' });
  }
});

app.get('/:id', async (req, res) => {
  try {
    const car = await car.grab(req.params.id);
    res.json(car);
  } catch (err) {
    console.error(err);
    if (err === 'DOES_NOT_EXIST') {
      return res.status(404).json({ message: 'car does not exist' });
    }
    res.status(500).json({ message: 'Unknown Error' });
  }
});

app.put('/:id', validate(UpdateSchema), async (req, res) => {
  try {
    const car = await car.grab(req.params.id);
    if (car.owner !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updatedcar = await car.update(req.params.id, req.body);
    res.json(updatedcar);
  } catch (err) {
    console.error(err);
    if (err === 'DOES_NOT_EXIST') {
      return res.status(404).json({ message: 'car does not exist' });
    }
    res.status(500).json({ message: 'Unknown Error' });
  }
});

app.delete('/:id', async (req, res) => {
  try {
    const removedcar = await car.remove(req.params.id);
    if (car.owner !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(removedcar);
  } catch (err) {
    console.error(err);
    if (err === 'DOES_NOT_EXIST') {
      return res.status(404).json({ message: 'car does not exist' });
    }
    res.status(500).json({ message: 'Unknown Error' });
  }
});

module.exports = app;