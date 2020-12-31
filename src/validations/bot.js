const { Joi, validate } = require('express-validation');

const create = {
    body: Joi.object({
      name: Joi.string().email().trim().lowercase().required(),
    //   userId: Jo
    }),
  };

  module.exports = {
    createValidate: validate(create, { keyByField: true }),
  };