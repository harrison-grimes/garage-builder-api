const joi = require('joi');

module.exports = joi.object().keys({
  manufacturer: joi.string().required(),
  name: joi.string().required(),
  url: joi.string().uri().required(),
  country: joi.string().optional().valid('Germany','Japan','France','United States','South Korea')
});