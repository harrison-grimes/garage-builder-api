const joi = require('joi');

module.exports = schema => {
  return (req, res, next) => {
    joi.validate(req.body, schema, (err, val) => {
      if (err) {
        console.log('err:', err);
        res.status(422).json({
          message: err.details.map(error => error.message).join('; '),
          body: req.body
        });
      } else {
        req.body = val;
        next();
      }
    });
  };
};
