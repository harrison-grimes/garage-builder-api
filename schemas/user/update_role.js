const joi = require('joi');

module.exports = joi.object().keys({
  role: joi
    .string()
    .required()
    .valid('admin', 'user')
});
