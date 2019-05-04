const joi = require('joi');

module.exports = joi.object().keys({
  name: joi.string().required(),
  email: joi
    .string()
    .email()
    .required(),
  password: joi.string().required()
});
