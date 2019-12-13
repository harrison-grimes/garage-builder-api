// initialize environment values
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3007;
if(process.env.NODE_ENV === 'development'){
  require('dotenv').config();
}

// 3rd party dependencies
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// internal dependencies
const api = require('./routes');

// create express app
const app = express();

//DB config
const db = require(./db/keys).mongoURI;

//connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// express middleware
app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));

// create express API
app.use('/', api);

// start listening for requests
app.listen(PORT);
console.log(`listening on port: ${PORT}`);
